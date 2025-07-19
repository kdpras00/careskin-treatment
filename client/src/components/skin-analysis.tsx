import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, CloudUpload, Sun, User, Eye, CheckCircle, ArrowRight, Video } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import * as faceapi from "face-api.js";

interface SkinAnalysisProps {
  onComplete: () => void;
}

export default function SkinAnalysis({ onComplete }: SkinAnalysisProps) {
  const [step, setStep] = useState<"upload" | "camera" | "progress" | "results">("upload");
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
            formData.append("skinType", "Combination");
            formData.append("hydration", "65");
            formData.append("elasticity", "78");
            formData.append("concerns", JSON.stringify(["Pori-pori besar", "Komedo", "Garis halus"]));

            setStep("progress");

            // Stop camera stream
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop());
            }

            // Simulate analysis delay
            setTimeout(() => {
              analysisMutation.mutate(formData);
            }, 3000);
          });
      }
    }
  };

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
                        <div className={`w-3 h-3 rounded-full mr-3 ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}></div>
                        <span className="text-gray-700">{concern}</span>
                      </div>
                      <span className={`text-sm font-medium ${index === 0 ? 'text-red-600' : index === 1 ? 'text-yellow-600' : 'text-orange-600'
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
