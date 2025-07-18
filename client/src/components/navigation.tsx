import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">CareSkin</h1>
              <span className="text-xs text-gray-500">Treatment</span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button 
                onClick={() => scrollToSection("analisis")}
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Analisis Kulit
              </button>
              <button 
                onClick={() => scrollToSection("produk")}
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Produk
              </button>
              <button 
                onClick={() => scrollToSection("testimoni")}
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Testimoni
              </button>
              <button 
                onClick={() => scrollToSection("konsultasi")}
                className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
              >
                Konsultasi
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              <span>Download App</span>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection("analisis")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
            >
              Analisis Kulit
            </button>
            <button 
              onClick={() => scrollToSection("produk")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
            >
              Produk
            </button>
            <button 
              onClick={() => scrollToSection("testimoni")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
            >
              Testimoni
            </button>
            <button 
              onClick={() => scrollToSection("konsultasi")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:text-primary"
            >
              Konsultasi
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
