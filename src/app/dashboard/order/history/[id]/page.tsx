"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, User, Store, Truck, MapPin, Calendar, Package as PackageIcon, FileText, DollarSign, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getStatusBadge, getPaymentBadge } from "@/components/utils/badge.utils";
import { Orders } from "@/types/order";
import { AlertUtils } from "@/components/utils/alert.utils";
import { formatRupiah, formatDate } from "@/components/utils/format.utils";

const OrderDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Orders>();

  useEffect(() => {
    const dataString = searchParams.get('data');
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
  
  if (!order) {
    return (
      <div className="w-full h-[80dvh] flex items-center justify-center">
        <p>Memuat data order...</p>
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
              <Separator className="my-2"/>
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
              <Separator className="my-2"/>
              <p className="text-muted-foreground">{order.laundry_partner.address}</p>
              <Button asChild variant="outline" size="sm" className="w-full mt-2">
                <a href={order.laundry_partner.maps_pinpoint} target="_blank" rel="noopener noreferrer">
                  <MapPin className="mr-2 h-4 w-4"/> Lihat Peta Laundry
                </a>
              </Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Truck className="w-6 h-6 text-muted-foreground" />
              <CardTitle>Info Driver</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-semibold">{order.driver.name || "Belum Ditugaskan"}</p>
              <p className="text-muted-foreground">{order.driver.telephone || ""}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
