import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Pill, TrendingUp, Calendar, Phone, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const consultationSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap harus diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor WhatsApp harus diisi"),
  mainConcern: z.string().min(1, "Pilih keluhan utama"),
  consultationTime: z.string().min(1, "Pilih waktu konsultasi"),
});

type ConsultationFormData = z.infer<typeof consultationSchema>;

export default function ConsultationBooking() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationSchema),
  });

  const consultationMutation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const response = await apiRequest("POST", "/api/consultation", data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Konsultasi berhasil dipesan!",
        description: "Tim kami akan menghubungi Anda dalam 1x24 jam.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal memesan konsultasi",
        description: "Silakan coba lagi nanti.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ConsultationFormData) => {
    consultationMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <section id="konsultasi" className="py-20 bg-gradient-to-br from-secondary/10 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Konsultasi Berhasil Dipesan!</h3>
              <p className="text-gray-600 mb-6">
                Terima kasih telah mempercayai CareSkin. Tim dokter kami akan menghubungi Anda melalui WhatsApp dalam 1x24 jam.
              </p>
              <div className="bg-primary/5 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  Pastikan WhatsApp Anda aktif dan siap menerima panggilan dari tim CareSkin
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="px-6 py-2"
              >
                Kembali ke Beranda
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="konsultasi" className="py-20 bg-gradient-to-br from-secondary/10 to-primary/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Konsultasi Dengan Dokter Ahli</h2>
          <p className="text-xl text-gray-600">Dapatkan konsultasi personal dengan dokter kulit berpengalaman</p>
        </div>

        <Card className="shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Kenapa Perlu Konsultasi?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <UserCheck className="text-secondary w-6 h-6 mr-3 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Diagnosis Akurat</div>
                    <div className="text-gray-600 text-sm">Analisis mendalam kondisi kulit Anda</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Pill className="text-secondary w-6 h-6 mr-3 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Treatment Personal</div>
                    <div className="text-gray-600 text-sm">Solusi khusus sesuai kondisi kulit</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="text-secondary w-6 h-6 mr-3 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Monitoring Progress</div>
                    <div className="text-gray-600 text-sm">Pantau perkembangan secara berkala</div>
                  </div>
                </div>
              </div>
              
              <Card className="mt-8 p-4 bg-primary/5">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Rp 50.000</div>
                  <div className="text-sm text-gray-600">Konsultasi 30 menit</div>
                  <div className="text-xs text-gray-500 mt-1">*Gratis jika beli paket treatment</div>
                </div>
              </Card>
            </div>

            <div className="md:w-1/2 p-8 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Book Konsultasi</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    {...register("fullName")}
                    className="mt-1"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@email.com"
                    {...register("email")}
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    WhatsApp
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    {...register("phone")}
                    className="mt-1"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="mainConcern" className="text-sm font-medium text-gray-700">
                    Keluhan Utama
                  </Label>
                  <Select onValueChange={(value) => setValue("mainConcern", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih keluhan utama" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acne">Jerawat</SelectItem>
                      <SelectItem value="aging">Penuaan Dini</SelectItem>
                      <SelectItem value="pigmentation">Noda Hitam</SelectItem>
                      <SelectItem value="dullness">Kulit Kusam</SelectItem>
                      <SelectItem value="sensitivity">Kulit Sensitif</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.mainConcern && (
                    <p className="text-red-600 text-sm mt-1">{errors.mainConcern.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="consultationTime" className="text-sm font-medium text-gray-700">
                    Waktu Konsultasi
                  </Label>
                  <Select onValueChange={(value) => setValue("consultationTime", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Pilih waktu yang tersedia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Pagi (09:00 - 12:00)</SelectItem>
                      <SelectItem value="afternoon">Siang (13:00 - 17:00)</SelectItem>
                      <SelectItem value="evening">Malam (19:00 - 21:00)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.consultationTime && (
                    <p className="text-red-600 text-sm mt-1">{errors.consultationTime.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 font-semibold"
                  disabled={consultationMutation.isPending}
                >
                  {consultationMutation.isPending ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <Calendar className="w-5 h-5 mr-2" />
                  )}
                  Book Konsultasi Sekarang
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
