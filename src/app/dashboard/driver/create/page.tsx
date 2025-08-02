"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import driverService from "@/services/driver.service"; // USE DRIVER SERVICE
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import { AlertUtils } from "@/components/utils/alert.utils";
import { useSidebar } from "@/components/ui/sidebar";

const CreateDriverPage = () => {
  const { state } = useSidebar();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
    confirm_password: "",
    telephone: "",
    address: "",
    city: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken = Cookies.get("accessToken");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirm_password) {
      AlertUtils.showError("Password dan konfirmasi password tidak cocok!");
      setIsSubmitting(false);
      return;
    }

    try {
      if (!accessToken) {
          AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
          setIsSubmitting(false);
          return;
      }

      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin untuk menambah driver baru?");

      if(isConfirmed){
        await driverService.postDriver(formData, accessToken);
        AlertUtils.showSuccess("Data driver baru berhasil ditambahkan.");
        router.push("/dashboard/driver");
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
            <CardTitle>Tambah Driver Baru</CardTitle>
            <CardDescription>Isi data di bawah ini untuk mendaftarkan driver baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama Driver</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Contoh: John Doe" required className="dark:focus:ring-white/70" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="contoh@driver.com" required className="dark:focus:ring-white/70"/>
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
                  <Label htmlFor="city">Kota</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Bogor" required className="dark:focus:ring-white/70"/>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Jl. Cempaka Putih No. 1" required className="dark:focus:ring-white/70"/>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/driver" passHref>
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

export default CreateDriverPage;
