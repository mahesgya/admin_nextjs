"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertUtils } from "@/components/utils/alert.utils";
import driverService from "@/services/driver.service";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const EditDriverPage = () => {
  const { state } = useSidebar()
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as string; 
  const driverDataString = searchParams.get('data');

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
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    if (driverDataString) {
      try {
        const driver = JSON.parse(driverDataString);
        setFormData({
          name: driver.name || "",
          email: driver.email || "",
          telephone: driver.telephone || "",
          address: driver.address || "",
          city: driver.city || "",
          password: "", 
          confirm_password: "",
        });
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Gagal Memuat Data Driver.");
        router.push("/dashboard/driver");
      }
    } else {
      AlertUtils.showError("Data driver tidak ditemukan. Silakan kembali.");
      router.push("/dashboard/driver");
    }
  }, [driverDataString, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirm_password) {
      AlertUtils.showError("Password dan konfirmasi password tidak cocok!");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!accessToken) {
        AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        name: formData.name,
        telephone: formData.telephone,
        address: formData.address,
        city: formData.city,
      };

      if (formData.password) {
        payload.password = formData.password;
        payload.confirm_password = formData.confirm_password;
      }

      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin untuk mengubah data driver?");
      if(isConfirmed){
        await driverService.putDriver(payload, id, accessToken);
        AlertUtils.showSuccess("Data driver berhasil diperbarui.");
        router.push("/dashboard/driver");
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal memperbarui data driver.");
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
              <CardTitle>Edit Data Driver</CardTitle>
              <CardDescription>Perbarui informasi driver di bawah ini. Biarkan password kosong jika tidak ingin mengubahnya.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nama Driver</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <p className="dark:focus:ring-white/70" >{formData.email}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password Baru (Opsional)</Label>
                    <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Isi untuk mengubah" className="dark:focus:ring-white/70" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                    <Input id="confirm_password" name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} placeholder="Ulangi password baru" className="dark:focus:ring-white/70" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="telephone">Nomor Telepon</Label>
                        <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required className="dark:focus:ring-white/70" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="city">Kota</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="dark:focus:ring-white/70" />
                    </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/dashboard/driver" passHref>
                <Button variant="outline" type="button">Batal</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
  );
};

export default EditDriverPage;
