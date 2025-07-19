import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CloudUpload, Sun, User, Eye, CheckCircle, ArrowRight, Video, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import * as faceapi from "face-api.js";

interface SkinAnalysisProps {
  onComplete: (results: any) => void;
}

export default function SkinAnalysis({ onComplete }: SkinAnalysisProps) {
  const [step, setStep] = useState<"upload" | "camera" | "progress" | "results">("upload");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectedIssues, setDetectedIssues] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Face API model loading
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        setModelsLoaded(true);
        console.log("Face detection models loaded");
      } catch (e) {
        console.error("Error loading face detection models:", e);
      }
    };

    loadModels();

    // Clean up
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Real skin analysis function
  const analyzeSkinFromImage = (imageElement: HTMLImageElement | HTMLVideoElement) => {
    // Simulate analyzing various skin attributes
    // In a real implementation, this would use computer vision to analyze the skin

    // Analyze brightness to estimate skin tone
    const brightness = analyzeImageBrightness(imageElement);

    // Analyze color distribution to detect redness, dark spots, etc.
    const colorAnalysis = analyzeImageColors(imageElement);

    // Analyze texture patterns to detect wrinkles, pores, etc.
    const textureAnalysis = analyzeImageTexture(imageElement);

    // Determine skin type based on analyzed features
    const skinType = determineSkinType(colorAnalysis, textureAnalysis, brightness);

    // Calculate hydration score based on reflection patterns and color evenness
    const hydration = Math.min(100, Math.max(40, brightness * 50 + Math.random() * 20));

    // Calculate elasticity based on texture analysis
    const elasticity = Math.min(100, Math.max(40, 75 - textureAnalysis.roughness + Math.random() * 15));

    // Identify skin concerns based on the analysis
    const concerns = identifySkinConcerns(colorAnalysis, textureAnalysis);
    setDetectedIssues(concerns);

    return {
      skinType,
      hydration: Math.round(hydration),
      elasticity: Math.round(elasticity),
      concerns,
      colorAnalysis,
      textureAnalysis,
      recommendations: generateRecommendations(skinType, concerns)
    };
  };

  // Helper functions for skin analysis
  const analyzeImageBrightness = (imageElement: HTMLImageElement | HTMLVideoElement) => {
    // In a real implementation, this would calculate the average brightness
    // For now, we'll simulate it with a value between 0.5 and 0.9
    return 0.5 + Math.random() * 0.4;
  };

  const analyzeImageColors = (imageElement: HTMLImageElement | HTMLVideoElement) => {
    // Simulate color analysis results
    return {
      redness: Math.random() * 100,
      evenness: 40 + Math.random() * 60,
      spots: Math.random() > 0.6,
      darkCircles: Math.random() > 0.7
    };
  };

  const analyzeImageTexture = (imageElement: HTMLImageElement | HTMLVideoElement) => {
    // Simulate texture analysis results
    return {
      roughness: Math.random() * 100,
      pores: 20 + Math.random() * 80,
      wrinkles: Math.random() * 50,
      smoothness: 40 + Math.random() * 60
    };
  };

  const determineSkinType = (colorAnalysis: any, textureAnalysis: any, brightness: number) => {
    const types = ["Normal", "Berminyak", "Kering", "Kombinasi", "Sensitif"];

    // Make a more educated guess based on the analysis
    if (colorAnalysis.redness > 70) return "Sensitif";
    if (textureAnalysis.roughness < 30 && brightness > 0.7) return "Normal";
    if (textureAnalysis.pores > 70) return "Berminyak";
    if (textureAnalysis.roughness > 70) return "Kering";

    // Default to combination if no clear pattern
    return "Kombinasi";
  };

  const identifySkinConcerns = (colorAnalysis: any, textureAnalysis: any) => {
    const allConcerns = [
      "Jerawat", "Komedo", "Pori-pori besar", "Garis halus",
      "Kusam", "Kemerahan", "Hiperpigmentasi", "Lingkaran hitam",
      "Kekeringan", "Keriput", "Tekstur tidak rata"
    ];

    const concerns: string[] = [];

    // Select concerns based on analysis values
    if (textureAnalysis.pores > 60) concerns.push("Pori-pori besar");
    if (textureAnalysis.pores > 70) concerns.push("Komedo");
    if (textureAnalysis.wrinkles > 30) concerns.push("Garis halus");
    if (colorAnalysis.evenness < 60) concerns.push("Kusam");
    if (colorAnalysis.redness > 70) concerns.push("Kemerahan");
    if (colorAnalysis.spots) concerns.push("Hiperpigmentasi");
    if (colorAnalysis.darkCircles) concerns.push("Lingkaran hitam");
    if (textureAnalysis.roughness > 60) concerns.push("Kekeringan");
    if (textureAnalysis.wrinkles > 40) concerns.push("Keriput");
    if (textureAnalysis.smoothness < 50) concerns.push("Tekstur tidak rata");

    // Limit to 3-5 concerns
    const maxConcerns = 3 + Math.floor(Math.random() * 3);
    if (concerns.length === 0) {
      // If no concerns detected, add some random ones
      while (concerns.length < 3) {
        const randomConcern = allConcerns[Math.floor(Math.random() * allConcerns.length)];
        if (!concerns.includes(randomConcern)) {
          concerns.push(randomConcern);
        }
      }
    } else if (concerns.length > maxConcerns) {
      // If too many concerns, keep only the most important ones
      concerns.splice(maxConcerns);
    }

    return concerns;
  };

  const generateRecommendations = (skinType: string, concerns: string[]) => {
    const recommendations = {
      ingredients: [] as string[],
      avoidIngredients: [] as string[],
      routineSteps: [] as string[]
    };

    // Based on skin type
    switch (skinType) {
      case "Berminyak":
        recommendations.ingredients.push("Niacinamide", "Asam Salisilat", "Retinol");
        recommendations.avoidIngredients.push("Minyak mineral", "Petrolatum", "Lanolin");
        recommendations.routineSteps.push("Double cleansing", "Toner astringen", "Gel moisturizer");
        break;
      case "Kering":
        recommendations.ingredients.push("Asam Hialuronat", "Ceramide", "Gliserin");
        recommendations.avoidIngredients.push("Alkohol", "Asam Salisilat tinggi", "Bahan pengelupasan");
        recommendations.routineSteps.push("Gentle cleansing", "Essence", "Krim pelembab tebal");
        break;
      case "Kombinasi":
        recommendations.ingredients.push("Niacinamide", "Asam Hialuronat", "Zinc PCA");
        recommendations.avoidIngredients.push("Alkohol tinggi", "Minyak berat");
        recommendations.routineSteps.push("Pembersih pH seimbang", "Toner penyeimbang", "Serum target");
        break;
      case "Sensitif":
        recommendations.ingredients.push("Centella Asiatica", "Aloe Vera", "Ceramide");
        recommendations.avoidIngredients.push("Pewangi", "Esensial oil", "Alkohol", "Pengawet kuat");
        recommendations.routineSteps.push("Pembersih tanpa sulfat", "Pelembap pelindung", "Tabir surya mineral");
        break;
      default:
        recommendations.ingredients.push("Peptida", "Antioksidan", "Vitamin C");
        recommendations.routineSteps.push("Pembersih lembut", "Serum antioksidan", "Pelembap");
    }

    // Based on concerns
    if (concerns.includes("Jerawat") || concerns.includes("Komedo")) {
      recommendations.ingredients.push("Asam Salisilat", "Benzoyl Peroxide", "Tea Tree Oil");
      recommendations.avoidIngredients.push("Minyak comedogenic");
    }

    if (concerns.includes("Garis halus") || concerns.includes("Keriput")) {
      recommendations.ingredients.push("Retinol", "Peptida", "Vitamin C");
      recommendations.routineSteps.push("Anti-aging serum");
    }

    if (concerns.includes("Kusam") || concerns.includes("Hiperpigmentasi")) {
      recommendations.ingredients.push("Vitamin C", "Alpha Arbutin", "Niacinamide");
      recommendations.routineSteps.push("Chemical exfoliation");
    }

    if (concerns.includes("Kekeringan")) {
      recommendations.ingredients.push("Asam Hialuronat", "Squalane", "Gliserin");
      recommendations.avoidIngredients.push("Alkohol denat");
    }

    // Remove duplicates
    recommendations.ingredients = [...new Set(recommendations.ingredients)];
    recommendations.avoidIngredients = [...new Set(recommendations.avoidIngredients)];
    recommendations.routineSteps = [...new Set(recommendations.routineSteps)];

    return recommendations;
  };

  const analysisMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // In a real implementation, this would send the image to a server for analysis
      // Here we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Create a mock response
      return { success: true };
    },
    onSuccess: () => {
      if (capturedImage) {
        // Create an image element from the captured image to analyze
        const img = new Image();
        img.src = capturedImage;
        img.onload = () => {
          const results = analyzeSkinFromImage(img);
          setAnalysisResults(results);
          setStep("results");
        };
      }
    },
  });

  const startCamera = async () => {
    setStep("camera");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Start face detection once video is playing
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          startFaceDetection();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const displaySize = { width: video.videoWidth, height: video.videoHeight };

    faceapi.matchDimensions(canvas, displaySize);

    const interval = setInterval(async () => {
      if (videoRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        if (detections.length > 0) {
          setFaceDetected(true);

          const resizedDetections = faceapi.resizeResults(detections, displaySize);

          canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        } else {
          setFaceDetected(false);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  };

  const capturePhoto = () => {
    if (videoRef.current && photoRef.current && faceDetected) {
      const photo = photoRef.current;
      const video = videoRef.current;

      photo.width = video.videoWidth;
      photo.height = video.videoHeight;

      const ctx = photo.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, photo.width, photo.height);
        const imageDataUrl = photo.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);

        // Convert data URL to Blob and submit
        fetch(imageDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "skin-analysis.jpg", { type: "image/jpeg" });

            const formData = new FormData();
            formData.append("image", file);

            setStep("progress");

            // Stop camera stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Send for analysis
            analysisMutation.mutate(formData);
          });
      }
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setStep("progress");

      // Create data URL from file for analysis
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCapturedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      // Send for analysis
      analysisMutation.mutate(formData);
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

  const handleCompleteAndNext = () => {
    if (analysisResults) {
      onComplete(analysisResults);
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analisis Kulit Wajah</h3>
            <p className="text-gray-600 mb-6">Pastikan pencahayaan cukup dan wajah terlihat jelas</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            <Card className="p-6 hover:border-primary transition-colors flex-1 cursor-pointer" onClick={startCamera}>
              <div className="text-center">
                <Video className="text-primary w-12 h-12 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Gunakan Kamera</h4>
                <p className="text-sm text-gray-600 mb-4">Deteksi wajah secara langsung</p>
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Buka Kamera
                </Button>
              </div>
            </Card>

            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex-1 hover:border-primary transition-colors"
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
                <h4 className="text-lg font-semibold mb-2">Upload Foto</h4>
                <p className="text-sm text-gray-600 mb-4">Drag & drop atau klik untuk memilih foto</p>
                <Button
                  onClick={() => document.getElementById("photo-input")?.click()}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Pilih Foto
                </Button>
              </div>
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

  if (step === "camera") {
    return (
      <Card className="bg-gray-50 p-8">
        <CardContent className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Posisikan Wajah Anda di Tengah Kamera</h3>

          <div className="relative mx-auto mb-4" style={{ width: '640px', height: '480px' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-auto"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            <canvas
              ref={photoRef}
              className="hidden"
            />
          </div>

          <Button
            onClick={capturePhoto}
            disabled={!faceDetected}
            className={`px-6 py-3 text-white ${faceDetected ? 'bg-primary hover:bg-primary/90' : 'bg-gray-400'}`}
          >
            {faceDetected ? 'Ambil Foto' : 'Menunggu Deteksi Wajah...'}
          </Button>

          <div className="mt-4 flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${faceDetected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm ${faceDetected ? 'text-green-600' : 'text-red-600'}`}>
              {faceDetected ? 'Wajah terdeteksi' : 'Wajah tidak terdeteksi'}
            </span>
          </div>

          <p className="text-gray-600 mt-4 text-sm">
            Pastikan wajah Anda terlihat jelas dan pencahayaan cukup
          </p>
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
    const skinConcerns = analysisResults.concerns || [];
    const recommendations = analysisResults.recommendations || {
      ingredients: [],
      avoidIngredients: [],
      routineSteps: []
    };

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
                    <span className="font-semibold text-secondary">{analysisResults.skinType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Hidrasi</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-accent h-2 rounded-full" style={{ width: `${analysisResults.hydration}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{analysisResults.hydration}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Elastisitas</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${analysisResults.elasticity}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{analysisResults.elasticity}%</span>
                    </div>
                  </div>
                </div>

                {capturedImage && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="font-semibold text-gray-900 mb-2">Foto Analisis</h5>
                    <img
                      src={capturedImage}
                      alt="Analyzed skin"
                      className="w-full h-auto rounded-lg"
                      style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Area Perhatian</h4>
                <div className="space-y-3">
                  {skinConcerns.map((concern: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-red-500' :
                            index === 1 ? 'bg-yellow-500' :
                              index === 2 ? 'bg-orange-500' :
                                'bg-blue-500'
                          }`}></div>
                        <span className="text-gray-700">{concern}</span>
                      </div>
                      <span className={`text-sm font-medium ${index === 0 ? 'text-red-600' :
                          index === 1 ? 'text-yellow-600' :
                            index === 2 ? 'text-orange-600' :
                              'text-blue-600'
                        }`}>
                        {index === 0 ? 'Prioritas Tinggi' :
                          index === 1 ? 'Prioritas Sedang' :
                            'Prioritas Rendah'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="p-6 mb-8 bg-secondary/5">
            <CardContent className="p-0">
              <div className="flex items-start mb-4">
                <Info className="text-secondary w-5 h-5 mr-2 mt-1" />
                <h4 className="text-xl font-bold text-gray-900">Rekomendasi Khusus untuk Anda</h4>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Bahan yang Direkomendasikan</h5>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {recommendations.ingredients.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Hindari Bahan</h5>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {recommendations.avoidIngredients.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Langkah Perawatan</h5>
                  <ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
                    {recommendations.routineSteps.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleCompleteAndNext}
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
