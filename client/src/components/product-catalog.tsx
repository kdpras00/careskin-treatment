import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

interface ProductCatalogProps {
  personalizedProducts?: any[];
}

const categories = [
  { id: "all", name: "Semua Produk" },
  { id: "cleanser", name: "Pembersih" },
  { id: "serum", name: "Serum" },
  { id: "moisturizer", name: "Pelembab" },
  { id: "sunscreen", name: "Sunscreen" },
];

const categoryColors = {
  cleanser: "bg-primary/10 text-primary",
  serum: "bg-secondary/10 text-secondary",
  moisturizer: "bg-purple-100 text-purple-600",
  sunscreen: "bg-accent/10 text-accent",
};

export default function ProductCatalog({ personalizedProducts }: ProductCatalogProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["api", "products"],
  });

  let products = data || [];

  // If we have personalized products, merge them with the API products
  // or use them as fallback if API fails
  if (personalizedProducts?.length) {
    if (products.length === 0) {
      products = personalizedProducts;
    } else {
      // Replace any existing products with the personalized versions
      const personalizedIds = personalizedProducts.map(p => p.id);
      products = [
        ...personalizedProducts,
        ...products.filter(p => !personalizedIds.includes(p.id))
      ];
    }
  }

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter((product) => product.category === activeCategory);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating / 10);
    const hasHalfStar = rating % 10 >= 5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-accent fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-accent fill-current opacity-50" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <section id="produk" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Katalog Produk CareSkin</h2>
          <p className="text-lg text-gray-600">Produk skincare berkualitas dengan formulasi dokter berpengalaman</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`px-5 py-2 rounded-full text-sm transition-all duration-300 ${activeCategory === category.id
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product: Product) => {
              // Check if this is a personalized recommendation
              const isPersonalized = personalizedProducts?.some(p => p.id === product.id);

              return (
                <Card
                  key={product.id}
                  className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full ${isPersonalized ? 'border-2 border-secondary/20' : ''}`}
                >
                  <div className="w-full h-48 overflow-hidden bg-gray-100 relative">
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {isPersonalized && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Direkomendasikan
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs px-2 py-1 ${categoryColors[product.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-600"}`}>
                        {categories.find(c => c.id === product.category)?.name || product.category}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="flex mr-1">
                          {renderStars(product.rating || 48)}
                        </div>
                        <span>{((product.rating || 48) / 10).toFixed(1)}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-gray-600 text-xs mb-3 line-clamp-2 flex-grow">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <div className="text-xs text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">{product.size}</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-xs px-2 py-1 h-8"
                        onClick={() => {
                          // Add to cart logic here
                          console.log("Added to cart:", product.id);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Tambah
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada produk ditemukan untuk kategori ini.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button variant="outline" className="px-6 py-2">
            Lihat Semua Produk <ShoppingCart className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
