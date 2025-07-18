import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

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

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter((product: Product) => product.category === activeCategory);

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
    <section id="produk" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Katalog Produk CareSkin</h2>
          <p className="text-xl text-gray-600">Produk skincare berkualitas dengan formulasi dokter berpengalaman</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: Product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={categoryColors[product.category as keyof typeof categoryColors] || "bg-gray-100 text-gray-600"}>
                      {categories.find(c => c.id === product.category)?.name || product.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="flex mr-1">
                        {renderStars(product.rating || 48)}
                      </div>
                      <span>{((product.rating || 48) / 10).toFixed(1)}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <div className="text-xs text-gray-500">{product.size}</div>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white"
                      onClick={() => {
                        // Add to cart logic here
                        console.log("Added to cart:", product.id);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Tidak ada produk ditemukan untuk kategori ini.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" className="px-8 py-3">
            Lihat Semua Produk <ShoppingCart className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
