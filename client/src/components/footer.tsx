import { Phone, Mail, MapPin, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <h3 className="text-2xl font-bold text-primary">CareSkin</h3>
              <span className="text-sm text-gray-400 ml-2">Treatment</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Platform skincare dengan teknologi AI yang memberikan solusi perawatan kulit personal untuk setiap individu.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("analisis")}
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  Analisis Kulit AI
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("produk")}
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  Produk Skincare
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("konsultasi")}
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  Konsultasi Dokter
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("testimoni")}
                  className="text-gray-300 hover:text-primary transition-colors duration-300"
                >
                  Testimoni
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+62 821-1234-5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@careskin.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CareSkin Treatment. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
