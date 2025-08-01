"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import packageService from "@/services/package.service"; 
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"; 
import { useState } from "react";
import { AlertUtils } from "@/components/utils/alert.utils";
import { useSidebar } from "@/components/ui/sidebar";

const CreatePackagePage = () => {
  const { state } = useSidebar();
  const router = useRouter();
  const params = useParams(); 
  const laundryId = params.id as string; 

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: "",
    price_text: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = Cookies.get("accessToken");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) {
          AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
          setIsSubmitting(false);
          return;
      }
      if (!laundryId) {
          AlertUtils.showError("ID Laundry tidak ditemukan. Silakan kembali dan coba lagi.");
          setIsSubmitting(false);
          return;
      }

      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin untuk menambah paket baru?");

      if(isConfirmed){
        await packageService.postPackage(formData, laundryId, accessToken);
        AlertUtils.showSuccess("Data paket baru berhasil ditambahkan.");
        router.push(`/dashboard/laundry/packages/${laundryId}`);
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`transition-all duration-300 ease-in-out flex flex-col flex-grow p-2 md:p-4 ${
        state === "expanded"
          ? "w-[100dvw] md:w-[90dvw] lg:w-[80dvw]"
          : "w-[100dvw] md:w-[115dvw] lg:w-[95dvw]"
      }`}
    >
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tambah Paket Baru</CardTitle>
            <CardDescription>Isi data di bawah ini untuk mendaftarkan paket baru untuk laundry ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama Paket</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Paket Express" required className="dark:focus:ring-white/70" />
              </div>
               <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Deskripsi Paket</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Jelaskan tentang keunggulan paket ini" className="dark:focus:ring-white/70"/>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="features">Fitur-fitur</Label>
                <Textarea id="features" name="features" value={formData.features} onChange={handleChange} placeholder="Contoh: Cuci bersih, Setrika, 1 Hari Selesai" required className="dark:focus:ring-white/70" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="price_text">Harga (per Kg/pcs)</Label>
                <Input id="price_text" name="price_text" type="number" value={formData.price_text} onChange={handleChange} placeholder="Contoh: 8000" required className="dark:focus:ring-white/70"/>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/laundry/packages/${laundryId}`} passHref>
              <Button variant="outline" type="button">Batal</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Paket"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreatePackagePage;
