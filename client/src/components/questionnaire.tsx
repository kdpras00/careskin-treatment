import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuestionnaireProps {
  onComplete: () => void;
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
];

export default function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/questionnaire", data);
      return response.json();
    },
    onSuccess: () => {
      onComplete();
    },
  });

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
                  className={`p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 ${
                    answers[currentQ.type] === option.value
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

          {currentQ.type !== "age" && currentQ.type !== "sensitivity" && (
            <div className="grid gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.type, option.value)}
                  className={`flex items-center p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 ${
                    answers[currentQ.type] === option.value
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

          {currentQ.type === "sensitivity" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.type, option.value)}
                  className={`p-4 border-2 rounded-xl transition-all duration-300 hover:border-primary hover:bg-primary/5 text-center ${
                    answers[currentQ.type] === option.value
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
