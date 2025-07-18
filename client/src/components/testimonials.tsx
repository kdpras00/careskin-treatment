import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 text-accent fill-current" />
    ));
  };

  return (
    <section id="testimoni" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Transformasi Nyata Pelanggan</h2>
          <p className="text-xl text-gray-600">Lihat hasil menakjubkan dari penggunaan produk CareSkin Treatment</p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-gray-50 p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: Testimonial) => (
              <Card key={testimonial.id} className="bg-gray-50 p-6 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Sebelum</div>
                      <img 
                        src={testimonial.beforeImageUrl || "https://images.unsplash.com/photo-1594824142533-dac7fd72e8b6?w=200&h=200&fit=crop"} 
                        alt="Before treatment"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-2">Setelah {testimonial.treatmentDuration}</div>
                      <img 
                        src={testimonial.afterImageUrl || "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop"} 
                        alt="After treatment"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.review}"</p>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">
                      {testimonial.age} tahun, {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            onClick={() => document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Mulai Transformasi Anda
          </Button>
        </div>
      </div>
    </section>
  );
}
