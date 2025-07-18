import Navigation from "@/components/navigation";
import SkinAnalysis from "@/components/skin-analysis";
import Questionnaire from "@/components/questionnaire";
import ProductCatalog from "@/components/product-catalog";
import Testimonials from "@/components/testimonials";
import ConsultationBooking from "@/components/consultation-booking";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Shield, CheckCircle, Star, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const startAnalysis = () => {
    setShowAnalysis(true);
    document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" });
  };

  const onAnalysisComplete = () => {
    setShowQuestionnaire(true);
    document.getElementById("questionnaire")?.scrollIntoView({ behavior: "smooth" });
  };

  const onQuestionnaireComplete = () => {
    setShowRecommendations(true);
    document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Analisis Kulit <span className="text-primary">AI</span> untuk Skincare Personal
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Dapatkan analisis kulit mendalam dengan teknologi AI dan rekomendasi produk yang dipersonalisasi khusus untuk kondisi kulitmu
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={startAnalysis}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Mulai Analisis Gratis
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById("produk")?.scrollIntoView({ behavior: "smooth" })}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:border-primary hover:text-primary"
                >
                  Lihat Produk
                </Button>
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-primary mr-2" />
                  Analisis dalam 60 detik
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-primary mr-2" />
                  100% Aman & Private
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&h=600&fit=crop" 
                alt="Woman using phone for skin analysis" 
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <Card className="absolute -bottom-6 -left-6 p-6 shadow-lg">
                <CardContent className="p-0 text-center">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-gray-600">Akurasi Analisis</div>
                </CardContent>
              </Card>
              <Card className="absolute -top-6 -right-6 p-4 shadow-lg">
                <CardContent className="p-0 flex items-center text-secondary">
                  <Sparkles className="w-6 h-6 mr-3" />
                  <div>
                    <div className="font-semibold">AI Powered</div>
                    <div className="text-sm text-gray-600">Technology</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Skin Analysis Section */}
      <section id="analisis" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Analisis Kulit Dengan AI</h2>
            <p className="text-xl text-gray-600">Upload foto wajahmu dan dapatkan analisis mendalam tentang kondisi kulitmu</p>
          </div>
          
          {showAnalysis && (
            <SkinAnalysis onComplete={onAnalysisComplete} />
          )}
        </div>
      </section>

      {/* Questionnaire Section */}
      {showQuestionnaire && (
        <section id="questionnaire" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Questionnaire onComplete={onQuestionnaireComplete} />
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {showRecommendations && (
        <section id="recommendations" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Rekomendasi Produk Untuk Anda</h2>
              <p className="text-xl text-gray-600">Berdasarkan analisis AI dan kuesioner, berikut produk yang cocok untuk kulit Anda</p>
            </div>
            
            {/* Personalized Routine */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Rutinitas Personal Anda</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">☀️</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Rutinitas Pagi</h4>
                    </div>
                    <div className="space-y-3">
                      {["Gentle Cleanser", "Vitamin C Serum", "Moisturizer", "SPF 30+ Sunscreen"].map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm">🌙</span>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">Rutinitas Malam</h4>
                    </div>
                    <div className="space-y-3">
                      {["Makeup Remover", "Deep Cleanser", "Niacinamide Serum", "Night Moisturizer"].map((step, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Beli Paket Lengkap - Rp 450.000
              </Button>
              <p className="text-sm text-gray-500 mt-2">Hemat Rp 125.000 dari harga satuan</p>
            </div>
          </div>
        </section>
      )}

      {/* Product Catalog */}
      <ProductCatalog />

      {/* Testimonials */}
      <Testimonials />

      {/* Consultation Booking */}
      <ConsultationBooking />

      {/* Footer */}
      <Footer />
    </div>
  );
}
