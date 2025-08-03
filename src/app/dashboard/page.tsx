"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Cookies from "js-cookie";
import { ArrowUpRight, CalendarIcon, DollarSign, FileDown, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { AlertUtils } from "@/components/utils/alert.utils";
import { getStatusBadge } from "@/components/utils/badge.utils";
import { formatRupiah } from "@/components/utils/format.utils";
import { cn } from "@/lib/utils";
import laundryService from "@/services/laundry.service";
import orderService from "@/services/order.service";
import { Orders } from "@/types/order";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { PacmanLoader } from "react-spinners";

export default function DashboardPage() {
  const { state } = useSidebar();
  const [recentOrders, setRecentOrders] = useState<Orders[]>([]);
  const [stats, setStats] = useState({
    totalPriceAfter: 0,
    totalPriceBefore: 0,
    totalOrders: 0,
    totalLaundries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!date?.from || !date?.to || !accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true); 
      try {
        const formattedStartDate = format(date.from, "yyyy-MM-dd");
        const formattedEndDate = format(date.to, "yyyy-MM-dd");

        const [ordersResponse, laundriesResponse] = await Promise.all([orderService.getOrders(accessToken, formattedStartDate, formattedEndDate), laundryService.getLaundries(accessToken)]);

        const sortedOrders = ordersResponse.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const totalPriceAfter = sortedOrders.reduce((acc, order) => acc + parseFloat(order.price_after || '0'), 0);
        const totalPriceBefore = sortedOrders.reduce((acc, order) => acc + parseFloat(order.price || '0'), 0);

        setRecentOrders(sortedOrders.slice(0, 5));
        setStats({
          totalPriceAfter: totalPriceAfter,
          totalPriceBefore: totalPriceBefore,
          totalOrders: sortedOrders.length,
          totalLaundries: laundriesResponse.length,
        });
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Gagal mendapatkan data order.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [date, accessToken]);

const handleExport = async () => {
    if (!accessToken) {
      AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }
    
    setIsExporting(true);
    try {
      const formattedStartDate = date?.from ? format(date.from, "yyyy-MM-dd") : undefined;
      const formattedEndDate = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

      const response = await orderService.exportExcel(accessToken, formattedStartDate, formattedEndDate);

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const randomSuffix = Math.floor(Math.random() * 1e6); // 6-digit random number
      const fileName = `Laporan_Order_[${formattedStartDate} sampai ${formattedEndDate}]_diunduh_pada_${format(new Date(), "yyyy-MM-dd")}_${randomSuffix}.xlsx`;
      link.setAttribute('download', fileName);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      AlertUtils.showSuccess("File Excel sedang diunduh.");

    } catch (error) {
      AlertUtils.showError(error instanceof Error ? error.message : "Gagal mengekspor data.");
    } finally {
      setIsExporting(false);
    }
  };


  if (loading) {
    return (
      <div className="w-[100dvw] md:w-[80dvw] h-[100dvh] md:h-[80dvh]  flex items-center justify-center">
        <PacmanLoader color="#64b5f6" size={40} />
      </div>
    );
  }

  return (
    <div className={`transition-all duration-300 ease-in-out flex flex-col flex-grow p-2 md:p-4 ${state === "expanded" ? "w-[100dvw] md:w-[90dvw] lg:w-[80dvw]" : "w-[100dvw] md:w-[115dvw] lg:w-[95dvw]"}`}>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex flex-wrap items-center w-full justify-between gap-4">
          <h1 className="text-lg font-semibold md:text-2xl">Selamat Datang, Admin Akucuciin!</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            {/* Export Button */}
            <Button onClick={handleExport} disabled={isExporting}>
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? "Mengekspor..." : "Export Excel"}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Price After</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(stats.totalPriceAfter.toString())}</div>
              <p className="text-xs text-muted-foreground">Berdasarkan rentang tanggal yang dipilih</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Price Before</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(stats.totalPriceBefore.toString())}</div>
              <p className="text-xs text-muted-foreground">Berdasarkan rentang tanggal yang dipilih</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Order</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Jumlah order dalam rentang tanggal</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Order Terbaru</CardTitle>
                <CardDescription>Ini adalah 5 order terakhir dalam rentang tanggal yang dipilih.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/order/history">
                  Lihat Semua
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Laundry</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">{order.customer.email}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{order.laundry_partner.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">{formatRupiah(order.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
