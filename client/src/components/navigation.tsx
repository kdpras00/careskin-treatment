import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Download } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-1' : 'bg-transparent py-3'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className={`text-2xl font-bold ${scrolled ? 'text-primary' : 'text-primary'}`}>CareSkin</h1>
              <span className="text-xs text-gray-500">Treatment</span>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <button
                onClick={() => scrollToSection("analisis")}
                className="text-gray-700 hover:text-primary px-2 py-1 text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                Analisis Kulit
              </button>
              <button
                onClick={() => scrollToSection("produk")}
                className="text-gray-700 hover:text-primary px-2 py-1 text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                Produk
              </button>
              <button
                onClick={() => scrollToSection("testimoni")}
                className="text-gray-700 hover:text-primary px-2 py-1 text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                Testimoni
              </button>
              <button
                onClick={() => scrollToSection("konsultasi")}
                className="text-gray-700 hover:text-primary px-2 py-1 text-sm font-medium transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300"
              >
                Konsultasi
              </button>
            </div>
          </div>

          <div className="hidden md:flex items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10">
              <Download className="w-4 h-4" />
              <span>Download App</span>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className={`text-gray-700 hover:text-primary`}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <div className="px-4 py-3 space-y-2">
          <button
            onClick={() => scrollToSection("analisis")}
            className="block w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary border-l-2 border-transparent hover:border-primary transition-colors"
          >
            Analisis Kulit
          </button>
          <button
            onClick={() => scrollToSection("produk")}
            className="block w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary border-l-2 border-transparent hover:border-primary transition-colors"
          >
            Produk
          </button>
          <button
            onClick={() => scrollToSection("testimoni")}
            className="block w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary border-l-2 border-transparent hover:border-primary transition-colors"
          >
            Testimoni
          </button>
          <button
            onClick={() => scrollToSection("konsultasi")}
            className="block w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:text-primary border-l-2 border-transparent hover:border-primary transition-colors"
          >
            Konsultasi
          </button>
          <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 mt-2 text-primary border-primary hover:bg-primary/10">
            <Download className="w-4 h-4" />
            <span>Download App</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
