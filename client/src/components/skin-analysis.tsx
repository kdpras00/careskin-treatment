import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CloudUpload, Sun, User, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SkinAnalysisProps {
  onComplete: () => void;
}

export default function SkinAnalysis({ onComplete }: SkinAnalysisProps) {
  const [step, setStep] = useState<"upload" | "progress" | "results">("upload");
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const analysisMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/skin-analysis", formData);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      setStep("results");
    },
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStep("progress");
      
      const formData = new FormData();
      formData.append("image", file);
      formData.append("skinType", "Combination");
      formData.append("hydration", "65");
      formData.append("elasticity", "78");
      formData.append("concerns", JSON.stringify(["Pori-pori besar", "Komedo", "Garis halus"]));
      
      // Simulate analysis delay
      setTimeout(() => {
        analysisMutation.mutate(formData);
      }, 3000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } } as any;
      handlePhotoUpload(event);
    }
  };

  if (step === "upload") {
    return (
      <Card className="bg-gray-50 p-8">
        <CardContent className="text-center">
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Camera className="text-primary w-16 h-16" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Foto Wajah</h3>
            <p className="text-gray-600 mb-6">Pastikan pencahayaan cukup dan wajah terlihat jelas</p>
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 mb-6 hover:border-primary transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              id="photo-input" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload}
            />
            <div className="text-center">
              <CloudUpload className="text-gray-400 w-12 h-12 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag & drop foto atau klik untuk upload</p>
              <Button 
                onClick={() => document.getElementById("photo-input")?.click()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Pilih Foto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <Sun className="w-4 h-4 text-accent mr-2" />
              Pencahayaan yang baik
            </div>
            <div className="flex items-center justify-center">
              <User className="w-4 h-4 text-accent mr-2" />
              Wajah menghadap kamera
            </div>
            <div className="flex items-center justify-center">
              <Eye className="w-4 h-4 text-accent mr-2" />
              Tanpa makeup tebal
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === "progress") {
    return (
      <Card className="bg-gray-50 p-8">
        <CardContent className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <div className="loading-spinner w-12 h-12"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Menganalisis Kulit Anda...</h3>
            <p className="text-gray-600 mb-6">AI sedang menganalisis kondisi kulit Anda</p>
          </div>
          
          <Card className="p-6">
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full mr-3"></div>
                <span className="text-gray-700">Mendeteksi jenis kulit...</span>
                <CheckCircle className="w-4 h-4 text-primary ml-auto" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary rounded-full mr-3"></div>
                <span className="text-gray-700">Menganalisis masalah kulit...</span>
                <div className="loading-spinner ml-auto"></div>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-4 h-4 bg-gray-300 rounded-full mr-3"></div>
                <span className="text-gray-500">Membuat rekomendasi...</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    );
  }

  if (step === "results" && analysisResults) {
    return (
      <Card className="bg-gray-50 p-8">
        <CardContent>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-white w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analisis Selesai!</h3>
            <p className="text-gray-600">Berikut hasil analisis kulit Anda</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Kondisi Kulit</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Jenis Kulit</span>
                    <span className="font-semibold text-secondary">{analysisResults.skinType || "Kombinasi"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Hidrasi</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: `${analysisResults.hydration || 65}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{analysisResults.hydration || 65}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Elastisitas</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${analysisResults.elasticity || 78}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{analysisResults.elasticity || 78}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Area Perhatian</h4>
                <div className="space-y-3">
                  {(analysisResults.concerns || ["Pori-pori besar", "Komedo", "Garis halus"]).map((concern: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-orange-500'
                        }`}></div>
                        <span className="text-gray-700">{concern}</span>
                      </div>
                      <span className={`text-sm font-medium ${
                        index === 0 ? 'text-red-600' : index === 1 ? 'text-yellow-600' : 'text-orange-600'
                      }`}>
                        {index === 0 ? 'Zona T' : index === 1 ? 'Hidung' : 'Mata'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button 
              onClick={onComplete}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg"
            >
              Lanjut Kuesioner <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
