"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import laundryService from "@/services/laundry.service";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import { AlertUtils } from "@/components/utils/alert.utils";

const CreateLaundryPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    password: "", 
    confirm_password: "",
    telephone: "",
    address: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
    maps_pinpoint: "",
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

    if (formData.password !== formData.confirm_password) {
      AlertUtils.showError("Password dan konfirmasi password tidak cocok!")
      setIsSubmitting(false);
      return;
    }

    try {
      if (!accessToken) {
          AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
          return
      }

      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
      };

      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin untuk menambah laundry baru?");

      if(isConfirmed){
        await laundryService.postLaundry(payload, accessToken);
        AlertUtils.showSuccess("Data laundry baru berhasil ditambahkan")
        router.push("/dashboard/laundry");
      }else{
        return
      }
     
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[100dvw] md:w-[80dvw] flex flex-col flex-grow p-4 md:p-6">
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Tambah Laundry Baru</CardTitle>
            <CardDescription>Isi data di bawah ini untuk mendaftarkan mitra laundry baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama Laundry</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: Fresh & Clean" required className="dark:focus:ring-white/70" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contoh@laundry.com" required className="dark:focus:ring-white/70"/>
              </div>
               <div className="flex flex-col space-y-1.5">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Jelaskan tentang laundry" className="dark:focus:ring-white/70"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Buat password" required className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="confirm_password">Konfirmasi Password</Label>
                  <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} placeholder="Ulangi password" required className="dark:focus:ring-white/70"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="telephone">Nomor Telepon</Label>
                  <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="628xxxxxxxxxx" required className="dark:focus:ring-white/70"/>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="maps_pinpoint">Link Google Maps</Label>
                  <Input id="maps_pinpoint" name="maps_pinpoint" value={formData.maps_pinpoint} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." className="dark:focus:ring-white/70"/>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Dramaga Cantik No. 123" required className="dark:focus:ring-white/70"/>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">Kota</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Bogor" required className="dark:focus:ring-white/70"/>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" name="area" value={formData.area} onChange={handleChange} placeholder="Dramaga" required className="dark:focus:ring-white/70" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" type="text" value={formData.latitude} onChange={handleChange} placeholder="-6.2088" className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" type="text" value={formData.longitude} onChange={handleChange} placeholder="106.8456" className="dark:focus:ring-white/70"/>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/laundry" passHref>
              <Button variant="outline" type="button">Batal</Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default CreateLaundryPage;
