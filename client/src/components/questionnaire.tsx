import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuestionnaireProps {
  onComplete: (results: any) => void;
  skinAnalysisResults?: any;
}

const questions = [
  {
    id: 1,
    title: "Berapa usia Anda?",
    type: "age",
    options: [
      { value: "16-20", label: "16-20", subtitle: "Remaja" },
      { value: "21-30", label: "21-30", subtitle: "Dewasa Muda" },
      { value: "31-40", label: "31-40", subtitle: "Dewasa" },
      { value: "40+", label: "40+", subtitle: "Matang" },
    ],
  },
  {
    id: 2,
    title: "Apa masalah kulit utama Anda?",
    type: "primaryConcern",
    options: [
      { value: "acne", label: "Jerawat", subtitle: "Jerawat aktif dan bekas jerawat", icon: "🔴" },
      { value: "aging", label: "Anti Aging", subtitle: "Garis halus dan kerutan", icon: "🕐" },
      { value: "dullness", label: "Kulit Kusam", subtitle: "Kulit tidak bercahaya", icon: "☀️" },
      { value: "pigmentation", label: "Pigmentasi", subtitle: "Flek hitam dan noda", icon: "🎨" },
    ],
  },
  {
    id: 3,
    title: "Bagaimana rutinitas skincare Anda saat ini?",
    type: "currentRoutine",
    options: [
      { value: "basic", label: "Dasar (Cuci muka & pelembab)", subtitle: "2-3 produk", icon: "🌱" },
      { value: "moderate", label: "Sedang (Cleanser, toner, serum, moisturizer)", subtitle: "4-6 produk", icon: "🍃" },
      { value: "advanced", label: "Lengkap (Multi-step dengan treatment)", subtitle: "7+ produk", icon: "⭐" },
      { value: "none", label: "Belum ada rutinas", subtitle: "Jarang menggunakan produk perawatan", icon: "❌" },
    ],
  },
  {
    id: 4,
    title: "Seberapa sensitif kulit Anda?",
    type: "sensitivity",
    options: [
      { value: "low", label: "Tidak Sensitif", subtitle: "Jarang iritasi", icon: "🛡️" },
      { value: "medium", label: "Agak Sensitif", subtitle: "Kadang iritasi", icon: "⚠️" },
      { value: "high", label: "Sangat Sensitif", subtitle: "Mudah iritasi", icon: "❗" },
    ],
  },
  {
    id: 5,
    title: "Preferensi tekstur produk Anda?",
    type: "texture",
    options: [
      { value: "light", label: "Ringan", subtitle: "Cepat meresap", icon: "💧" },
      { value: "medium", label: "Sedang", subtitle: "Balance antara ringan dan kaya", icon: "🌊" },
      { value: "rich", label: "Kaya", subtitle: "Tekstur lebih tebal", icon: "🧴" },
    ],
  },
];

export default function Questionnaire({ onComplete, skinAnalysisResults }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedResults, setGeneratedResults] = useState<any>(null);

  // Prefill primaryConcern if we have skin analysis results
  useState(() => {
    if (skinAnalysisResults?.concerns?.length > 0) {
      const concern = skinAnalysisResults.concerns[0];
      let primaryConcern = "";

      if (concern.includes("Jerawat") || concern.includes("Komedo")) {
        primaryConcern = "acne";
      } else if (concern.includes("Garis halus") || concern.includes("Keriput")) {
        primaryConcern = "aging";
      } else if (concern.includes("Kusam")) {
        primaryConcern = "dullness";
      } else if (concern.includes("Hiperpigmentasi") || concern.includes("Flek")) {
        primaryConcern = "pigmentation";
      }

      if (primaryConcern) {
        setAnswers(prev => ({ ...prev, primaryConcern }));
      }
    }
  }, [skinAnalysisResults]);

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      // In a real implementation, this would call an API
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate personalized recommendations based on questionnaire and skin analysis
      const combinedResults = generatePersonalizedRecommendations(data);
      setGeneratedResults(combinedResults);

      return { success: true };
    },
    onSuccess: () => {
      if (generatedResults) {
        onComplete(generatedResults);
      }
    },
  });

  const generatePersonalizedRecommendations = (questionnaireData: any) => {
    // Combine skin analysis results with questionnaire answers
    const combinedData = {
      ...questionnaireData,
      skinAnalysis: skinAnalysisResults || {},
    };

    // In a real implementation, this would be a more sophisticated algorithm
    // For now, we'll generate some personalized recommendations based on the data

    const age = combinedData.age;
    const primaryConcern = combinedData.primaryConcern;
    const routine = combinedData.currentRoutine;
    const sensitivity = combinedData.sensitivity;
    const texture = combinedData.texture || "medium";
    const skinType = skinAnalysisResults?.skinType || "Normal";

    // Generate product recommendations
    const recommendedProducts = [];

    // Cleanser recommendation
    let cleanser = {
      id: "c1",
      name: "Basic Gentle Cleanser",
      category: "cleanser",
      price: 120000,
      rating: 47,
      imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
      description: "Pembersih wajah lembut untuk semua jenis kulit"
    };

    if (skinType === "Berminyak") {
      cleanser = {
        id: "c2",
        name: "Oil Control Foam Cleanser",
        category: "cleanser",
        price: 150000,
        rating: 46,
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        description: "Pembersih wajah untuk kulit berminyak, mengontrol sebum"
      };
    } else if (skinType === "Kering") {
      cleanser = {
        id: "c3",
        name: "Hydrating Cream Cleanser",
        category: "cleanser",
        price: 165000,
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        description: "Pembersih wajah krim lembut untuk kulit kering dan sensitif"
      };
    } else if (skinType === "Kombinasi") {
      cleanser = {
        id: "c4",
        name: "Balance pH Cleanser",
        category: "cleanser",
        price: 145000,
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop",
        description: "Pembersih wajah dengan pH seimbang untuk kulit kombinasi"
      };
    }
    recommendedProducts.push(cleanser);

    // Serum recommendation
    let serum = {
      id: "s1",
      name: "Hydrating Serum",
      category: "serum",
      price: 220000,
      rating: 48,
      imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
      description: "Serum pelembab dengan asam hialuronat untuk hidrasi optimal"
    };

    if (primaryConcern === "acne") {
      serum = {
        id: "s2",
        name: "Clarifying Treatment Serum",
        category: "serum",
        price: 250000,
        rating: 46,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
        description: "Serum dengan niacinamide dan salicylic acid untuk kulit berjerawat"
      };
    } else if (primaryConcern === "aging") {
      serum = {
        id: "s3",
        name: "Advanced Anti-Aging Serum",
        category: "serum",
        price: 350000,
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
        description: "Serum dengan retinol dan peptida untuk mengurangi tanda penuaan"
      };
    } else if (primaryConcern === "dullness") {
      serum = {
        id: "s4",
        name: "Brightening Vitamin C Serum",
        category: "serum",
        price: 280000,
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
        description: "Serum vitamin C untuk mencerahkan kulit kusam"
      };
    } else if (primaryConcern === "pigmentation") {
      serum = {
        id: "s5",
        name: "Spot Correcting Serum",
        category: "serum",
        price: 290000,
        rating: 45,
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop",
        description: "Serum dengan alpha arbutin dan tranexamic acid untuk menyamarkan hiperpigmentasi"
      };
    }
    recommendedProducts.push(serum);

    // Moisturizer recommendation
    let moisturizer = {
      id: "m1",
      name: "Basic Moisturizer",
      category: "moisturizer",
      price: 180000,
      rating: 47,
      imageUrl: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&h=300&fit=crop",
      description: "Pelembab sehari-hari untuk semua jenis kulit"
    };

    if (skinType === "Berminyak" || texture === "light") {
      moisturizer = {
        id: "m2",
        name: "Oil-Free Gel Moisturizer",
        category: "moisturizer",
        price: 195000,
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&h=300&fit=crop",
        description: "Pelembab gel ringan bebas minyak untuk kulit berminyak"
      };
    } else if (skinType === "Kering" || texture === "rich") {
      moisturizer = {
        id: "m3",
        name: "Rich Cream Moisturizer",
        category: "moisturizer",
        price: 210000,
        rating: 49,
        imageUrl: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&h=300&fit=crop",
        description: "Krim pelembab kaya untuk kulit kering dan dehidrasi"
      };
    } else if (skinType === "Kombinasi" || texture === "medium") {
      moisturizer = {
        id: "m4",
        name: "Balanced Moisturizing Lotion",
        category: "moisturizer",
        price: 185000,
        rating: 46,
        imageUrl: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&h=300&fit=crop",
        description: "Losion pelembab seimbang untuk kulit kombinasi"
      };
    }
    recommendedProducts.push(moisturizer);

    // Sunscreen recommendation
    let sunscreen = {
      id: "ss1",
      name: "Daily Protection Sunscreen SPF 30",
      category: "sunscreen",
      price: 160000,
      rating: 45,
      imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45c3?w=400&h=300&fit=crop",
      description: "Tabir surya harian dengan SPF 30 untuk perlindungan sehari-hari"
    };

    if (sensitivity === "high") {
      sunscreen = {
        id: "ss2",
        name: "Sensitive Skin Mineral Sunscreen SPF 50",
        category: "sunscreen",
        price: 185000,
        rating: 47,
        imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45c3?w=400&h=300&fit=crop",
        description: "Tabir surya mineral dengan zinc oxide untuk kulit sensitif"
      };
    } else if (primaryConcern === "pigmentation") {
      sunscreen = {
        id: "ss3",
        name: "Brightening Sunscreen SPF 50+",
        category: "sunscreen",
        price: 195000,
        rating: 48,
        imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45c3?w=400&h=300&fit=crop",
        description: "Tabir surya dengan niacinamide untuk mencerahkan kulit"
      };
    }
    recommendedProducts.push(sunscreen);

    // Morning routine
    const morningRoutine = ["Gentle Cleanser", "Toner", "Serum", "Moisturizer", "Sunscreen"];

    // Night routine
    const nightRoutine = ["Makeup Remover", "Cleanser", "Treatment", "Serum", "Night Cream"];

    if (routine === "basic") {
      // Simplify routines for beginners
      morningRoutine.splice(1, 2); // Remove toner and serum
      nightRoutine.splice(2, 1); // Remove treatment
    } else if (routine === "advanced") {
      // Add more steps for advanced users
      morningRoutine.splice(2, 0, "Essence");
      nightRoutine.splice(3, 0, "Eye Cream");
    }

    return {
      recommendedProducts,
      morningRoutine,
      nightRoutine,
      skinType,
      primaryConcern,
      sensitivity,
      questionnaire: combinedData
    };
  };

  const handleAnswer = (questionType: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionType]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuestionnaire = () => {
    const questionnaireData = {
      age: answers.age,
      primaryConcern: answers.primaryConcern,
      currentRoutine: answers.currentRoutine,
      sensitivity: answers.sensitivity,
      texture: answers.texture,
      answers: answers,
    };

    submitMutation.mutate(questionnaireData);
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQ.type];

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Kuesioner Skincare Personal</h2>
        <p className="text-xl text-gray-600">Bantu kami memberikan rekomendasi yang lebih akurat</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{currentQuestion + 1} dari {questions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Container */}
      <Card className="p-8 shadow-lg">
        <CardContent className="p-0">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{currentQ.title}</h3>

          {currentQ.type === "age" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.type, option.value)}
                  className={`p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 ${answers[currentQ.type] === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                    }`}
                >
                  <div className="text-lg font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.subtitle}</div>
                </button>
              ))}
            </div>
          )}

          {(currentQ.type === "texture" || currentQ.type === "sensitivity") && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.type, option.value)}
                  className={`p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 text-center ${answers[currentQ.type] === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                    }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.subtitle}</div>
                </button>
              ))}
            </div>
          )}

          {currentQ.type !== "age" && currentQ.type !== "sensitivity" && currentQ.type !== "texture" && (
            <div className="grid gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.type, option.value)}
                  className={`flex items-center p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 ${answers[currentQ.type] === option.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                    }`}
                >
                  <span className="text-lg mr-4">{option.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={currentQuestion === 0 ? "invisible" : ""}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sebelumnya
            </Button>

            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Selanjutnya
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={submitQuestionnaire}
                disabled={!isAnswered || submitMutation.isPending}
                className="bg-secondary hover:bg-secondary/90 text-white"
              >
                {submitMutation.isPending ? (
                  <div className="loading-spinner mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Lihat Rekomendasi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
