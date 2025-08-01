"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import laundryService from "@/services/laundry.service";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const FormSkeleton = () => (
  <div className="grid w-full items-center gap-6 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex flex-col space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);


const EditLaundryPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; 

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    telephone: "",
    address: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
    maps_pinpoint: "",
  });

  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [email, setEmail] = useState("");
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    if (!id) return; 

    const fetchLaundryData = async () => {
      try {
        if (!accessToken) {
          throw new Error("Access Token tidak ditemukan.");
        }
        
        const response = await laundryService.getLaundryById(id, accessToken);
        setEmail(response?.email)
        setFormData({
          name: response?.name,
          description: response?.description,
          telephone: response?.telephone,
          address: response?.address,
          city: response?.city,
          area: response?.area,
          latitude: String(response?.latitude), 
          longitude: String(response?.longitude),
          maps_pinpoint: response?.maps_pinpoint,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Gagal Mendapatkan Data Laundry.";
        Swal.fire("Error", errorMessage, "error");
        router.push("/dashboard/laundry"); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaundryData();
  }, [id, accessToken, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!accessToken) {
        throw new Error("Sesi Anda telah berakhir. Silakan login kembali.");
      }

      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
      };

      await laundryService.putLaundry(payload, id, accessToken);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data laundry berhasil diperbarui.",
        showConfirmButton: true,
      }).then(() => {
        router.push("/dashboard/laundry");
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.";
      Swal.fire("Gagal", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="w-[100dvw] md:w-[80dvw] flex flex-col flex-grow p-4 md:p-6">
      <form onSubmit={handleSubmit} className="w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Data Laundry</CardTitle>
            <CardDescription>Perbarui informasi laundry di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nama Laundry</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <p className="dark:focus:ring-white/70">{email}</p>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="dark:focus:ring-white/70" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="telephone">Nomor Telepon</Label>
                    <Input id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required className="dark:focus:ring-white/70" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="maps_pinpoint">Link Google Maps</Label>
                    <Input id="maps_pinpoint" name="maps_pinpoint" value={formData.maps_pinpoint} onChange={handleChange} className="dark:focus:ring-white/70" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="address">Alamat Lengkap</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} required className="dark:focus:ring-white/70" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="area">Area</Label>
                    <Input id="area" name="area" value={formData.area} onChange={handleChange} required className="dark:focus:ring-white/70" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" type="text" value={formData.latitude} onChange={handleChange} className="dark:focus:ring-white/70" />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" type="text" value={formData.longitude} onChange={handleChange} className="dark:focus:ring-white/70" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/dashboard/laundry" passHref>
              <Button variant="outline" type="button">Batal</Button>
            </Link>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditLaundryPage;
