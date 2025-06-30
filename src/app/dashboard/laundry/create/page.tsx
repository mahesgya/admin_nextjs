"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import Cookies from "js-cookie";
import laundryService from "@/services/laundry.service";

const CreateLaundry = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    confirm_password: "",
    telephone: "",
    address: "",
    city: "",
    area: "",
    latitude: "",
    longitude: "",
    maps_pinpoint: "",
  });

  const accessToken = Cookies.get("accessToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await laundryService.postLaundry(formData, accessToken);
    setFormData({
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
  };

  return (
    <div className="w-full flex flex-col flex-grow">
      <Card className="w-full flex flex-grow">
        <CardHeader>
          <CardTitle>Tambah Laundry Baru</CardTitle>
          <CardDescription>Isi data di bawah ini untuk mendaftarkan mitra laundry baru.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nama Laundry</Label>
                <Input id="name" placeholder="Contoh: Fresh & Clean" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contoh@laundry.com" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="telephone">Nomor Telepon</Label>
                  <Input id="telephone" placeholder="08xxxxxxxxxx" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="maps">Link Google Maps</Label>
                  <Input id="maps" placeholder="https://maps.app.goo.gl/..." />
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" placeholder="Jl. Pahlawan No. 123" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="city">Kota</Label>
                  <Input id="city" placeholder="Jakarta Selatan" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" placeholder="Kemang" />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/laundries" passHref>
            <Button variant="outline">Batal</Button>
          </Link>
          <Button>Simpan</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateLaundry
