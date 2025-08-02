"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

import { ArrowLeft, Trash2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PacmanLoader } from "react-spinners";
import { AlertUtils } from "@/components/utils/alert.utils";
import photoService from "@/services/photo.service";
import { PhotoData } from "@/types/photo";
import { useSidebar } from "@/components/ui/sidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LaundryPhotosPage = () => {
  const { state } = useSidebar();
  const params = useParams();
  const idLaundry = params.id as string;

  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accessToken: string | undefined = Cookies.get("accessToken");

  const fetchPhotos = async () => {
    if (!idLaundry || !accessToken) return;
    try {
      const response = await photoService.getPhotos(idLaundry);
      setPhotos(response);
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal memuat foto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [idLaundry]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !accessToken) return;

    const isConfirmed = await AlertUtils.showConfirmation("Apakah Anda yakin ingin mengunggah gambar ini?");
    if (!isConfirmed) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      await photoService.postPhoto(formData, idLaundry, accessToken);
      AlertUtils.showSuccess("Foto berhasil diunggah.");
      await fetchPhotos();
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal mengunggah foto.");
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!accessToken) {
      AlertUtils.showError("Sesi Anda telah berakhir.");
      return;
    }

    const isConfirmed = await AlertUtils.showConfirmation("Anda yakin ingin menghapus foto ini secara permanen?");
    if (isConfirmed) {
      try {
        await photoService.deletePhoto(photoId, idLaundry, accessToken);
        AlertUtils.showSuccess("Foto berhasil dihapus.");
        setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== photoId));
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Gagal menghapus foto.");
      }
    }
  };

  if (loading) {
      return (
        <div className="w-[100dvw] md:w-[80dvw] h-[100dvh] md:h-[80dvh] flex items-center justify-center">
          <PacmanLoader color="#64b5f6" size={40} />
        </div>
      );
  }
  
  return (
    <div className={`transition-all duration-300 ease-in-out flex flex-col flex-grow p-2 md:p-4 ${
        state === "expanded"
          ? "w-[100dvw] md:w-[90dvw] lg:w-[80dvw]"
          : "w-[100dvw] md:w-[115dvw] lg:w-[95dvw]"
      }`}
    >
      <Card className="flex flex-col flex-grow">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/laundry`} passHref>
                <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Kembali</span>
                </Button>
              </Link>
              <div>
                <CardTitle>Galeri Foto Laundry</CardTitle>
                <CardDescription>Kelola foto yang ditampilkan untuk laundry ini.</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-6">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
            />
            <div
              onClick={handleFileSelect}
              className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold">Klik untuk mengunggah foto</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, atau JPEG (Maks. 5MB)</p>
              {isUploading && <p className="mt-2 text-sm text-sky-500">Mengunggah...</p>}
            </div>
          </div>

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-lg shadow-md">
                  <img
                    src={`${API_URL}/static/${photo.filepath}`}
                    alt="Foto Laundry"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus Foto</span>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Belum ada foto yang diunggah untuk laundry ini.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LaundryPhotosPage;
