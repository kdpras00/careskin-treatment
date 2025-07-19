import Navigation from "@/components/navigation";
import SkinAnalysis from "@/components/skin-analysis";
import Questionnaire from "@/components/questionnaire";
import ProductCatalog from "@/components/product-catalog";
import Testimonials from "@/components/testimonials";
import ConsultationBooking from "@/components/consultation-booking";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Shield, CheckCircle, Star, ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Store analysis and questionnaire results
  const [skinAnalysisResults, setSkinAnalysisResults] = useState<any>(null);
  const [questionnaireResults, setQuestionnaireResults] = useState<any>(null);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<any>(null);

  const startAnalysis = () => {
    setShowAnalysis(true);
    document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" });
  };

  const onAnalysisComplete = (results: any) => {
    // Store skin analysis results
    setSkinAnalysisResults(results);
    setShowQuestionnaire(true);
    document.getElementById("questionnaire")?.scrollIntoView({ behavior: "smooth" });
  };

  const onQuestionnaireComplete = (results: any) => {
    // Store questionnaire results
    setQuestionnaireResults(results);
    setPersonalizedRecommendations(results);
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
            <Questionnaire
              onComplete={onQuestionnaireComplete}
              skinAnalysisResults={skinAnalysisResults}
            />
          </div>
        </section>
      )}

      {/* Recommendations Section */}
      {showRecommendations && personalizedRecommendations && (
        <section id="recommendations" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Rekomendasi Produk Untuk Anda</h2>
              <p className="text-xl text-gray-600">
                Berdasarkan {skinAnalysisResults ? 'analisis AI dan ' : ''} kuesioner,
                berikut produk yang cocok untuk kulit {personalizedRecommendations.skinType || 'Anda'}
              </p>
            </div>

            {/* Personalized Summary */}
            <Card className="p-6 mb-8 border-2 border-primary/20">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ringkasan Profil Kulit Anda</h3>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Jenis Kulit</h4>
                    <p className="text-lg text-primary font-medium">{personalizedRecommendations.skinType}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Masalah Utama</h4>
                    <p className="text-lg text-primary font-medium">
                      {personalizedRecommendations.primaryConcern === 'acne' && 'Jerawat'}
                      {personalizedRecommendations.primaryConcern === 'aging' && 'Anti Aging'}
                      {personalizedRecommendations.primaryConcern === 'dullness' && 'Kulit Kusam'}
                      {personalizedRecommendations.primaryConcern === 'pigmentation' && 'Pigmentasi'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Tingkat Sensitivitas</h4>
                    <p className="text-lg text-primary font-medium">
                      {personalizedRecommendations.sensitivity === 'low' && 'Tidak Sensitif'}
                      {personalizedRecommendations.sensitivity === 'medium' && 'Agak Sensitif'}
                      {personalizedRecommendations.sensitivity === 'high' && 'Sangat Sensitif'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      {(personalizedRecommendations.morningRoutine || ["Gentle Cleanser", "Vitamin C Serum", "Moisturizer", "SPF 30+ Sunscreen"]).map((step: string, index: number) => (
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
                      {(personalizedRecommendations.nightRoutine || ["Makeup Remover", "Deep Cleanser", "Niacinamide Serum", "Night Moisturizer"]).map((step: string, index: number) => (
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

            {/* Product Recommendations */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Produk Yang Direkomendasikan</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(personalizedRecommendations.recommendedProducts || []).map((product: any, index: number) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border-2 border-secondary/20">
                    <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Direkomendasikan
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded">
                          {product.category === 'cleanser' && 'Pembersih'}
                          {product.category === 'serum' && 'Serum'}
                          {product.category === 'moisturizer' && 'Pelembab'}
                          {product.category === 'sunscreen' && 'Sunscreen'}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 text-accent fill-current mr-1" />
                          <span>{(product.rating / 10).toFixed(1)}</span>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-gray-600 text-xs mb-3 flex-grow">{product.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="text-base font-bold text-primary">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                        </div>
                        <Button
                          size="sm"
                          className="bg-secondary hover:bg-secondary/90 text-white text-xs h-8"
                        >
                          Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg">
                <ArrowRight className="w-5 h-5 mr-2" />
                Beli Paket Lengkap - Rp 450.000
              </Button>
              <p className="text-sm text-gray-500 mt-2">Hemat Rp 125.000 dari harga satuan</p>
            </div>

            {/* Book Consultation */}
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">Ingin konsultasi langsung dengan ahli kami?</p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("konsultasi")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              >
                Jadwalkan Konsultasi <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Product Catalog */}
      <ProductCatalog personalizedProducts={personalizedRecommendations?.recommendedProducts} />

      {/* Testimonials */}
      <Testimonials />

      {/* Consultation Booking */}
      <ConsultationBooking />

      {/* Footer */}
      <Footer />
    </div>
  );
}
