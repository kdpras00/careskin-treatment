import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSkinAnalysisSchema, insertQuestionnaireSchema, insertConsultationSchema } from "@shared/schema";
import multer from "multer";
import path from "path";

const upload = multer({ dest: "uploads/" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create skin analysis
  app.post("/api/skin-analysis", upload.single("image"), async (req, res) => {
    try {
      const analysisData = {
        imagePath: req.file?.path,
        skinType: req.body.skinType || "Combination",
        hydration: parseInt(req.body.hydration) || 65,
        elasticity: parseInt(req.body.elasticity) || 78,
        concerns: req.body.concerns ? JSON.parse(req.body.concerns) : ["Pori-pori besar", "Komedo", "Garis halus"],
        analysisData: req.body.analysisData ? JSON.parse(req.body.analysisData) : null,
        userId: req.body.userId ? parseInt(req.body.userId) : null,
      };

      const validatedData = insertSkinAnalysisSchema.parse(analysisData);
      const analysis = await storage.createSkinAnalysis(validatedData);
      res.json(analysis);
    } catch (error) {
      res.status(400).json({ error: "Invalid analysis data" });
    }
  });

  // Create questionnaire
  app.post("/api/questionnaire", async (req, res) => {
    try {
      const questionnaireData = {
        userId: req.body.userId ? parseInt(req.body.userId) : null,
        age: req.body.age,
        primaryConcern: req.body.primaryConcern,
        currentRoutine: req.body.currentRoutine,
        sensitivity: req.body.sensitivity,
        lifestyle: req.body.lifestyle,
        answers: req.body.answers,
      };

      const validatedData = insertQuestionnaireSchema.parse(questionnaireData);
      const questionnaire = await storage.createQuestionnaire(validatedData);
      res.json(questionnaire);
    } catch (error) {
      res.status(400).json({ error: "Invalid questionnaire data" });
    }
  });

  // Get recommendations based on questionnaire
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { questionnaire, analysis } = req.body;
      
      // Get all products
      const allProducts = await storage.getAllProducts();
      
      // Simple recommendation logic based on skin type and concerns
      const recommendations = allProducts.filter(product => {
        const matchesSkinType = product.skinTypes?.includes("all") || 
                               product.skinTypes?.includes(analysis?.skinType?.toLowerCase());
        const matchesConcerns = product.concerns?.some(concern => 
          questionnaire.primaryConcern?.includes(concern) || 
          analysis?.concerns?.includes(concern)
        );
        return matchesSkinType || matchesConcerns;
      }).slice(0, 6);

      // Generate personalized routine
      const morningRoutine = [
        "Gentle Cleanser",
        "Vitamin C Serum",
        "Moisturizer",
        "SPF 30+ Sunscreen"
      ];

      const eveningRoutine = [
        "Makeup Remover",
        "Deep Cleanser",
        "Niacinamide Serum",
        "Night Moisturizer"
      ];

      res.json({
        recommendations,
        morningRoutine,
        eveningRoutine,
        skinType: analysis?.skinType || "Combination"
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Create consultation
  app.post("/api/consultation", async (req, res) => {
    try {
      const consultationData = {
        userId: req.body.userId ? parseInt(req.body.userId) : null,
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        mainConcern: req.body.mainConcern,
        consultationTime: req.body.consultationTime,
        notes: req.body.notes,
      };

      const validatedData = insertConsultationSchema.parse(consultationData);
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      res.status(400).json({ error: "Invalid consultation data" });
    }
  });

  // Get testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getActiveTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
