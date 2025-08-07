"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertUtils } from "@/components/utils/alert.utils";
import { getPaymentBadge, getStatusBadge } from "@/components/utils/badge.utils";
import { formatDate, formatRupiah } from "@/components/utils/format.utils";
import useMediaQuery from "@/components/utils/media.query.utils";
import getPaginationRange from "@/components/utils/pagination.utils";
import { cn } from "@/lib/utils";
import orderService from "@/services/order.service";
import { Orders } from "@/types/order";
import { format, subDays } from "date-fns";
import Cookies from "js-cookie";
import { Calendar as CalendarIcon, ChevronDown, Edit, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { PacmanLoader } from "react-spinners";
import { statusOptionsDropdown } from "@/components/utils/badge.utils";


const OrderTotalPage = () => {
  const { state } = useSidebar();
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [tempDate, setTempDate] = useState<DateRange | undefined>(date);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const handleApplyCalendar = () => {
    setDate(tempDate);
    setIsOpenCalendar(false);
  };

  const handleCancelCalendar = () => {
    setTempDate(date);
    setIsOpenCalendar(false);
  };

  const handleOpenChangeCalendar = (open: boolean) => {
    if (open) {
      setTempDate(date);
    }
    setIsOpenCalendar(open);
  };

  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = isMobile ? 7 : 10;
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!date?.from || !date?.to || !accessToken) {
        return;
      }

      try {
        setLoading(true);
        const formattedStartDate = format(date.from, "yyyy-MM-dd");
        const formattedEndDate = format(date.to, "yyyy-MM-dd");

        const response = await orderService.getOrders(accessToken, formattedStartDate, formattedEndDate);
        const sortedResponse = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setTotalOrders(sortedResponse.length);
        setOrders(sortedResponse);
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [date, accessToken]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === "ALL") {
        return true;
      }

      if(statusFilter === "exbatal"){
        return order.status !== "batal" && order.status !== "kesalahan"
      }

      return order.status === statusFilter;
    })
    .filter(
      (o) =>
        o.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.laundry_partner.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const paginationRange = getPaginationRange(totalPages, currentPage, isMobile ? 0 : 1);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
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
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle>History Order</CardTitle>
              <CardDescription>Total Order: {totalOrders}</CardDescription>
            </div>
          </div>
          <div className="flex items-start justify-start w-full sm:w-full lg:w-auto md:justify-between md:items-end lg:justify-end  flex-col md:flex-row flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Cari order..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-full dark:focus:ring-white/70" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-between">
                  <span>Status: {statusOptionsDropdown.find((opt) => opt.value === statusFilter)?.label}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter berdasarkan status</DropdownMenuLabel>
                {statusOptionsDropdown.map((option) => (
                  <DropdownMenuItem key={option.value} onSelect={() => setStatusFilter(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className={cn("grid gap-2")}>
              <Popover open={isOpenCalendar} onOpenChange={handleOpenChangeCalendar}>
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
                  <Calendar initialFocus mode="range" defaultMonth={tempDate?.from} selected={tempDate} onSelect={setTempDate} numberOfMonths={2} />
                  <div className="flex justify-end gap-2 p-3 border-t">
                    <Button variant="ghost" size="sm" onClick={handleCancelCalendar}>
                      Batal
                    </Button>
                    <Button size="sm" onClick={handleApplyCalendar}>
                      Terapkan
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID & Customer</TableHead>
                <TableHead>Laundry & Paket</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Status Bayar</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Harga Markup</TableHead>
                <TableHead>Kupon</TableHead>
                <TableHead>Tanggal Jemput</TableHead>
                <TableHead>Dipesan Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentOrders?.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">
                    {order.customer?.name}
                    <div className="text-[12px] text-gray-500 font-bold font-sans">{order.id}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {order.laundry_partner.name}
                    <div className="text-[12px] text-gray-500 font-bold font-sans">{order.package.name}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentBadge(order.status_payment)}</TableCell>
                  <TableCell>{formatRupiah(order.price)}</TableCell>
                  <TableCell>{formatRupiah(order.price_after)}</TableCell>
                  <TableCell className="text-[12px]">{order.coupon_code}</TableCell>
                  <TableCell>{order.pickup_date}</TableCell>
                  <TableCell>{format(new Date(order.created_at), "dd MMM yyyy, HH:mm")}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <Link
                          href={{
                            pathname: `/dashboard/order/history/${order.id}`,
                          }}
                          passHref
                        >
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            See Detail
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-4 md:hidden py-2 ">
          {currentOrders?.map((order) => (
            <Card key={order.id} className="gap-1 rounded-xl shadow-sm dark:border-gray-700 bg-white dark:bg-black transition">
              <CardHeader className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-md font-semibold text-gray-800 dark:text-white truncate">{order.customer.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">{order.id}</CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                      <Link
                        href={{
                          pathname: `/dashboard/order/history/${order.id}`,
                        }}
                        passHref
                      >
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          See Detail
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="px-4 pt-1 pb-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-col text-xs space-y-1">
                  <span className="font-semibold">{order.laundry_partner.name}</span>
                  <span className="text-muted-foreground">{order.package.name}</span>
                  <span className="text-muted-foreground">Pickup: {order.pickup_date}</span>
                </div>
              </CardContent>
              <CardFooter className="px-4 pb-3 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
                <span className="font-bold text-lg">{formatRupiah(order.price)}</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>

      {totalPages > 1 && (
        <CardFooter className="border-t pt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {paginationRange?.map((page, index) => {
                if (page === "...") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </div>
  );
};

export default OrderTotalPage;
