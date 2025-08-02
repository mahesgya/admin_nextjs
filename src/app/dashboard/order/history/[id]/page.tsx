"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, User, Store, Truck, MapPin, Calendar, Package as PackageIcon, FileText, DollarSign, Weight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getStatusBadge, getPaymentBadge } from "@/components/utils/badge.utils";
import { Orders } from "@/types/order";
import { AlertUtils } from "@/components/utils/alert.utils";
import { formatRupiah, formatDate } from "@/components/utils/format.utils";
import { PacmanLoader } from "react-spinners";
import { statusOptions, paymentOptions } from "@/components/utils/badge.utils";
import Cookies from "js-cookie";
import driverService from "@/services/driver.service";
import orderService from "@/services/order.service";
import { DriverData } from "@/types/driver";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const OrderDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Orders | null>(null);
  const accessToken: string | undefined = Cookies.get("accessToken");

  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [isDriverLoading, setIsDriverLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Pick<Orders, "status" | "weight" | "price" | "status_payment">>>({});

  useEffect(() => {
    const dataString = searchParams.get("data");
    if (dataString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataString));
        setOrder(parsedData);
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Gagal Memuat Data Order.");
        router.back();
      }
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchDrivers = async () => {
      if (!accessToken) return;
      setIsDriverLoading(true);
      try {
        const response = await driverService.getDrivers(accessToken);
        if (response) {
          setDrivers(response);
        }
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.");
      } finally {
        setIsDriverLoading(false);
      }
    };
    fetchDrivers();
  }, [accessToken]);

  const handleOpenEditDialog = () => {
    if (!order) return;
    setEditedData({
      status: order.status,
      price: order.price,
      weight: order.weight,
      status_payment: order.status_payment,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: name === "price" || name === "weight" ? Number(value) : value }));
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateOrder = async () => {
    if (!order || !accessToken) return;
    setIsUpdating(true);
    try {
      setIsEditDialogOpen(false);
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin mengubah data order?");
      if (isConfirmed) {
        await orderService.updateOrder(order.id, editedData, accessToken);
        setOrder((prev) => (prev ? ({ ...prev, ...editedData } as Orders) : null));
        AlertUtils.showSuccess("Order berhasil diperbarui!");
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal memperbarui order.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!order || !selectedDriverId || !accessToken) return;
    setIsAssigning(true);
    try {
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin memberikan order ini kepada driver?");
      if (isConfirmed) {
        const response = await driverService.assignDriver(order.id, selectedDriverId, accessToken);
        console.log(response)
        const assignedDriver = drivers.find((d) => d.id === selectedDriverId);
        if (assignedDriver) {
          setOrder((prev) => (prev ? { ...prev, driver: assignedDriver } : null));
        }
        AlertUtils.showSuccess("Driver berhasil ditugaskan!");
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal menugaskan driver.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveDriver = async () => {
    if (!order || !accessToken) return;
    setIsAssigning(true);
    try {
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin menghapus driver di order ini?");
      if (isConfirmed) {
        await driverService.removeAssignDriver(order.id, accessToken);
        const defaultDriver: DriverData = {
          id: "",
          name: "Belum Ditugaskan",
          email: "",
          telephone: "",
          address: "",
          city: "",
          created_at: "",
          updated_at: "",
        };
        setOrder((prev) => (prev ? { ...prev, driver: defaultDriver } : null));
        setSelectedDriverId("");
        AlertUtils.showSuccess("Tugas driver berhasil dihapus!");
      }
    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal menghapus tugas driver.");
    } finally {
      setIsAssigning(false);
    }
  };

  if (!order) {
    return (
      <div className="w-[100dvw] md:w-[80dvw] h-[100dvh] md:h-[80dvh]  flex items-center justify-center">
          <PacmanLoader color="#64b5f6" size={40} />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 w-full flex-grow">
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle>Detail Order</CardTitle>
                  <CardDescription className="font-mono text-xs pt-1">{order.id}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleOpenEditDialog}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.status_payment)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Tanggal Order</p>
                    <p className="font-medium">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Jadwal Penjemputan</p>
                    <p className="font-medium">{order.pickup_date || "-"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PackageIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Paket Dipilih</p>
                    <p className="font-medium">{order.package.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Weight className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Berat</p>
                    <p className="font-medium">{order.weight} Kg</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Total Harga</p>
                    <p className="font-semibold text-lg text-emerald-600 dark:text-emerald-400">{formatRupiah(order.price)}</p>
                  </div>
                </div>
              </div>
              {order.note && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Catatan dari Customer</p>
                      <p className="font-medium italic">{order.note}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="w-6 h-6 text-muted-foreground" />
              <CardTitle>Info Customer</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-semibold">{order.customer.name}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              <p className="text-muted-foreground">{order.customer.telephone}</p>
              <Separator className="my-2" />
              <p className="text-muted-foreground">{order.customer.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Store className="w-6 h-6 text-muted-foreground" />
              <CardTitle>Info Laundry</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-semibold">{order.laundry_partner.name}</p>
              <p className="text-muted-foreground">{order.laundry_partner.telephone}</p>
              <Separator className="my-2" />
              <p className="text-muted-foreground">{order.laundry_partner.address}</p>
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <a href={order.laundry_partner.maps_pinpoint} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4" /> Lihat Peta Laundry
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Truck className="w-6 h-6 text-muted-foreground" />
              <CardTitle>Info Driver</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              {isDriverLoading ? (
                <p className="text-muted-foreground">Memuat driver...</p>
              ) : (
                <>
                  <p className="font-semibold">{order.driver?.name || "Belum Ditugaskan"}</p>
                  <p className="text-muted-foreground">{order.driver?.telephone || ""}</p>
                  <Separator />
                  {!order.driver?.id && (
                    <>
                      <Label htmlFor="driver-select">Tugaskan Driver</Label>
                      <Select value={selectedDriverId} onValueChange={setSelectedDriverId} disabled={isAssigning}>
                        <SelectTrigger id="driver-select">
                          <SelectValue placeholder="Pilih driver..." />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  <div className="flex gap-2 mt-2">
                    {!order.driver?.id && (
                      <Button size="sm" className="flex-1" onClick={handleAssignDriver} disabled={isAssigning || !selectedDriverId || selectedDriverId === order.driver?.id}>
                        {isAssigning ? "Menyimpan..." : "Simpan"}
                      </Button>
                    )}

                    {order.driver?.id && (
                      <Button variant="destructive" size="sm" className="flex-1" onClick={handleRemoveDriver} disabled={isAssigning}>
                        {isAssigning ? "Menghapus..." : "Hapus Tugas"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Ubah detail order di bawah ini. Klik simpan jika sudah selesai.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select name="status" value={editedData.status} onValueChange={(value) => handleEditSelectChange("status", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status_payment" className="text-right">
                Pembayaran
              </Label>
              <Select name="status_payment" value={editedData.status_payment} onValueChange={(value) => handleEditSelectChange("status_payment", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Berat (Kg)
              </Label>
              <Input id="weight" name="weight" type="number" value={editedData.weight} onChange={handleEditInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Harga (Rp)
              </Label>
              <Input id="price" name="price" type="number" value={editedData.price} onChange={handleEditInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button type="submit" onClick={handleUpdateOrder} disabled={isUpdating}>
              {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetailPage;
