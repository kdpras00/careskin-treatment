import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Testimonial } from "@shared/schema";

// Placeholder images that are guaranteed to work
const PLACEHOLDER_IMAGES = {
  before: [
    "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/3764168/pexels-photo-3764168.jpeg?auto=compress&cs=tinysrgb&w=200"
  ],
  after: [
    "https://images.pexels.com/photos/3762811/pexels-photo-3762811.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/3764574/pexels-photo-3764574.jpeg?auto=compress&cs=tinysrgb&w=200",
    "https://images.pexels.com/photos/2709388/pexels-photo-2709388.jpeg?auto=compress&cs=tinysrgb&w=200"
  ]
};

export default function Testimonials() {
  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ["api", "testimonials"],
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className="w-4 h-4 text-accent fill-current" />
    ));
  };

  return (
    <section id="testimoni" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Transformasi Nyata Pelanggan</h2>
          <p className="text-lg text-gray-600">Lihat hasil menakjubkan dari penggunaan produk CareSkin Treatment</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <Card key={testimonial.id} className="bg-gray-50 p-4 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Sebelum</div>
                      <img
                        src={PLACEHOLDER_IMAGES.before[index % 3]}
                        alt="Before treatment"
                        className="w-full h-32 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Setelah {testimonial.treatmentDuration}</div>
                      <img
                        src={PLACEHOLDER_IMAGES.after[index % 3]}
                        alt="After treatment"
                        className="w-full h-32 object-cover rounded-lg"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      {renderStars(testimonial.rating || 5)}
                    </div>
                    <p className="text-gray-700 mb-3 italic text-sm">"{testimonial.review}"</p>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">
                      {testimonial.age} tahun, {testimonial.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Button
            onClick={() => document.getElementById("analisis")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base font-semibold shadow-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Mulai Transformasi Anda
          </Button>
        </div>
      </div>
    </section>
  );
}
