import { users, skinAnalysis, questionnaires, products, consultations, testimonials, type User, type SkinAnalysis, type Questionnaire, type Product, type Consultation, type Testimonial, type InsertUser, type InsertSkinAnalysis, type InsertQuestionnaire, type InsertProduct, type InsertConsultation, type InsertTestimonial } from "@shared/schema";

export interface IStorage {
  // Users
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Skin Analysis
  createSkinAnalysis(analysis: InsertSkinAnalysis): Promise<SkinAnalysis>;
  getSkinAnalysisByUserId(userId: number): Promise<SkinAnalysis[]>;
  
  // Questionnaires
  createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire>;
  getQuestionnaireByUserId(userId: number): Promise<Questionnaire | undefined>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Consultations
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getAllConsultations(): Promise<Consultation[]>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private skinAnalyses: Map<number, SkinAnalysis> = new Map();
  private questionnaires: Map<number, Questionnaire> = new Map();
  private products: Map<number, Product> = new Map();
  private consultations: Map<number, Consultation> = new Map();
  private testimonials: Map<number, Testimonial> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample products
    const sampleProducts: Product[] = [
      {
        id: 1,
        name: "CareSkin Gentle Cleanser",
        category: "cleanser",
        description: "Pembersih wajah lembut untuk kulit kombinasi yang mengangkat kotoran tanpa membuat kering",
        price: 125000,
        originalPrice: 155000,
        size: "150ml",
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
        ingredients: ["Ceramide", "Niacinamide", "Hyaluronic Acid"],
        skinTypes: ["combination", "sensitive"],
        concerns: ["acne", "dullness"],
        isActive: true,
      },
      {
        id: 2,
        name: "CareSkin Vitamin C Serum",
        category: "serum",
        description: "Serum vitamin C 20% untuk mencerahkan kulit dan melawan radikal bebas",
        price: 185000,
        originalPrice: 225000,
        size: "30ml",
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop",
        ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid"],
        skinTypes: ["all"],
        concerns: ["dullness", "pigmentation"],
        isActive: true,
      },
      {
        id: 3,
        name: "CareSkin Hydrating Moisturizer",
        category: "moisturizer",
        description: "Pelembab dengan hyaluronic acid untuk hidrasi optimal 24 jam",
        price: 165000,
        originalPrice: 195000,
        size: "50ml",
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
        ingredients: ["Hyaluronic Acid", "Ceramide", "Peptides"],
        skinTypes: ["dry", "normal", "combination"],
        concerns: ["dryness", "aging"],
        isActive: true,
      },
      {
        id: 4,
        name: "CareSkin Foam Cleanser",
        category: "cleanser",
        description: "Pembersih busa lembut dengan formula pH balanced untuk semua jenis kulit",
        price: 95000,
        originalPrice: 115000,
        size: "150ml",
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        ingredients: ["Salicylic Acid", "Tea Tree Oil", "Aloe Vera"],
        skinTypes: ["oily", "combination"],
        concerns: ["acne", "large-pores"],
        isActive: true,
      },
      {
        id: 5,
        name: "CareSkin Niacinamide 10%",
        category: "serum",
        description: "Serum niacinamide untuk mengecilkan pori dan kontrol sebum",
        price: 145000,
        originalPrice: 175000,
        size: "30ml",
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop",
        ingredients: ["Niacinamide", "Zinc", "Hyaluronic Acid"],
        skinTypes: ["oily", "combination"],
        concerns: ["large-pores", "acne"],
        isActive: true,
      },
      {
        id: 6,
        name: "CareSkin Night Cream",
        category: "moisturizer",
        description: "Krim malam dengan retinol dan peptide untuk regenerasi kulit",
        price: 195000,
        originalPrice: 235000,
        size: "50ml",
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=300&fit=crop",
        ingredients: ["Retinol", "Peptides", "Ceramide"],
        skinTypes: ["all"],
        concerns: ["aging", "fine-lines"],
        isActive: true,
      },
      {
        id: 7,
        name: "CareSkin Sunscreen SPF 50",
        category: "sunscreen",
        description: "Sunscreen broad spectrum dengan tekstur ringan non-greasy",
        price: 125000,
        originalPrice: 155000,
        size: "60ml",
        rating: 48,
        imageUrl: "https://pixabay.com/get/g849d211ea91c27b069fee8b2982e9e271b2a54ba6d49ecbc0993c155bfa335d4a91f4db043960f1bea53caabc3b2b4faaaf4d2b46bdd2cd5796cbec3cccb573e_1280.jpg",
        ingredients: ["Zinc Oxide", "Titanium Dioxide", "Niacinamide"],
        skinTypes: ["all"],
        concerns: ["sun-protection", "aging"],
        isActive: true,
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });

    // Initialize sample testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: 1,
        name: "Sarah Wijaya",
        age: 24,
        location: "Jakarta",
        beforeImageUrl: "https://images.unsplash.com/photo-1594824142533-dac7fd72e8b6?w=200&h=200&fit=crop",
        afterImageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop",
        review: "Alhamdulillah jerawat saya sudah hilang dan kulit jadi lebih cerah. Produk CareSkin benar-benar ampuh!",
        rating: 5,
        treatmentDuration: "3 bulan",
        isActive: true,
      },
      {
        id: 2,
        name: "Budi Santoso",
        age: 29,
        location: "Bandung",
        beforeImageUrl: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?w=200&h=200&fit=crop",
        afterImageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
        review: "Sebagai pria yang jarang merawat kulit, CareSkin mudah digunakan dan hasilnya sangat terlihat.",
        rating: 5,
        treatmentDuration: "2 bulan",
        isActive: true,
      },
      {
        id: 3,
        name: "Rina Marliana",
        age: 31,
        location: "Surabaya",
        beforeImageUrl: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop",
        afterImageUrl: "https://images.unsplash.com/photo-1594824142533-dac7fd72e8b6?w=200&h=200&fit=crop",
        review: "Flek hitam di wajah saya berkurang drastis. Sekarang PD lagi untuk selfie tanpa filter!",
        rating: 5,
        treatmentDuration: "4 bulan",
        isActive: true,
      },
    ];

    sampleTestimonials.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });

    this.currentId = 8;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentId++;
    const newUser: User = { ...user, id, createdAt: new Date() };
    this.users.set(id, newUser);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createSkinAnalysis(analysis: InsertSkinAnalysis): Promise<SkinAnalysis> {
    const id = this.currentId++;
    const newAnalysis: SkinAnalysis = { ...analysis, id, createdAt: new Date() };
    this.skinAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getSkinAnalysisByUserId(userId: number): Promise<SkinAnalysis[]> {
    return Array.from(this.skinAnalyses.values()).filter(analysis => analysis.userId === userId);
  }

  async createQuestionnaire(questionnaire: InsertQuestionnaire): Promise<Questionnaire> {
    const id = this.currentId++;
    const newQuestionnaire: Questionnaire = { ...questionnaire, id, createdAt: new Date() };
    this.questionnaires.set(id, newQuestionnaire);
    return newQuestionnaire;
  }

  async getQuestionnaireByUserId(userId: number): Promise<Questionnaire | undefined> {
    return Array.from(this.questionnaires.values()).find(q => q.userId === userId);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive && p.category === category);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const id = this.currentId++;
    const newConsultation: Consultation = { ...consultation, id, createdAt: new Date() };
    this.consultations.set(id, newConsultation);
    return newConsultation;
  }

  async getAllConsultations(): Promise<Consultation[]> {
    return Array.from(this.consultations.values());
  }

  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(t => t.isActive);
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
}

export const storage = new MemStorage();
