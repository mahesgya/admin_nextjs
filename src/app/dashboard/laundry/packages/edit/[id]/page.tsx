"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertUtils } from "@/components/utils/alert.utils";
import packageService from "@/services/package.service";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

const FormSkeleton = () => (
  <div className="grid w-full items-center gap-6 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex flex-col space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);

const EditPackagePage = () => {
  const { state } = useSidebar()
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const laundryId = params.id as string;
  const packageId = searchParams.get('type') as string;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    features: "",
    price_text: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    if (!laundryId || !packageId) return;

    const fetchPackageData = async () => {
      try {
        if (!accessToken) {
          AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
          setIsLoading(false);
          return;
        }

        const response = await packageService.getPackageById(laundryId, packageId, accessToken);
        setFormData({
          name: response?.name,
          description: response?.description,
          features: response?.features,
          price_text: response?.price_text,
        });
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Gagal Mendapatkan Data Paket.");
        router.push(`/dashboard/laundry/packages/${laundryId}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [laundryId, packageId, accessToken, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin untuk mengubah data paket ini?");
      if (isConfirmed) {
        await packageService.putPackage( formData, laundryId, packageId, accessToken);
        AlertUtils.showSuccess("Data paket berhasil diperbarui.");
        router.push(`/dashboard/laundry/packages/${laundryId}`);
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal Memperbarui Data Paket.");
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
            <CardTitle>Edit Data Paket</CardTitle>
            <CardDescription>Perbarui informasi paket di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <FormSkeleton />
            ) : (
              <div className="grid w-full items-center gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nama Paket</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Deskripsi Paket</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="features">Fitur-fitur (pisahkan dengan koma)</Label>
                  <Textarea id="features" name="features" value={formData.features} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price_text">Harga</Label>
                  <Input id="price_text" name="price_text" type="number" value={formData.price_text} onChange={handleChange} required className="dark:focus:ring-white/70" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/dashboard/laundry/packages/${laundryId}`} passHref>
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

export default EditPackagePage;
