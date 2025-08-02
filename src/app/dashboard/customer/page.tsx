"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import { Search } from "lucide-react";
import { PacmanLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertUtils } from "@/components/utils/alert.utils";
import customerService from "@/services/customer.service"; 
import getPaginationRange from "@/components/utils/pagination.utils";
import { Input } from "@/components/ui/input";
import useMediaQuery from "@/components/utils/media.query.utils";
import { CustomerData } from "@/types/customer";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate } from "@/components/utils/format.utils";

const CustomersPage = () => {
  const { state } = useSidebar()
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = isMobile ? 8 : 12;
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        if (accessToken) {
          const response = await customerService.getCustomers(accessToken);
          const sortedResponse = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          setCustomers(sortedResponse);
        }
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []); 

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes((searchQuery ?? '').toLowerCase()) ||
    c.email?.toLowerCase().includes((searchQuery ?? '').toLowerCase()) ||
    c.id?.toLowerCase().includes((searchQuery ?? '').toLowerCase()) 
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

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
     <div className={`transition-all duration-300 ease-in-out flex flex-col flex-grow p-2 md:p-4 ${
        state === "expanded"
          ? "w-[100dvw] md:w-[90dvw] lg:w-[80dvw]"
          : "w-[100dvw] md:w-[115dvw] lg:w-[95dvw]"
      }`}
    >
            <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <div className="flex items-center gap-4">
                    <div>
                        <CardTitle>Daftar Customer</CardTitle>
                        <CardDescription className="hidden md:block">Lihat semua customer yang terdaftar di platform.</CardDescription>
                    </div>
                </div>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-full dark:focus:ring-white/70"
                    />
                    </div>
                </div>
                </div>
            </CardHeader>

            <CardContent className="flex-grow">
                <div className="hidden md:block">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[250px]">Nama Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Kode Referral</TableHead>
                        <TableHead>Tanggal Bergabung</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {currentCustomers?.map((customer) => (
                        <TableRow key={customer.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.telephone || "-"}</TableCell>
                        <TableCell className="max-w-[280px] truncate text-sm text-muted-foreground">
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>{customer.address}</TooltipTrigger>
                                <TooltipContent>
                                <p className="max-w-xs">{customer.address}</p>
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>
                            <Badge variant={customer.referral_code ? "default" : "outline"}>
                                {customer.referral_code || "Tidak Ada"}
                            </Badge>
                        </TableCell>
                        <TableCell>{formatDate(customer.created_at)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>

                <div className="grid gap-4 md:hidden py-2 ">
                {currentCustomers?.map((customer) => (
                    <Card key={customer.id} className="gap-1 rounded-xl shadow-sm dark:border-gray-700 bg-white dark:bg-black transition">
                    <CardHeader className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <CardTitle className="text-md font-semibold text-gray-800 dark:text-white truncate">{customer.name}</CardTitle>
                            <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {customer.email}
                            </CardDescription>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 pt-1 pb-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex flex-col text-xs space-y-1">
                            <span className="text-muted-foreground">Telepon: {customer.telephone || "-"}</span>
                            <span className="text-muted-foreground">Alamat: {customer.address || "-"}</span>
                            <span className="text-muted-foreground">Bergabung: {formatDate(customer.created_at)}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="px-4 pb-3">
                        <Badge variant={customer.referral_code ? "default" : "outline"}>
                            Referral: {customer.referral_code || "Tidak Ada"}
                        </Badge>
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
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                    </PaginationItem>
                    {paginationRange?.map((page, index) => {
                    if (page === '...') {
                        return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
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
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            </CardFooter>
            )}
    </div>
  );
}

export default CustomersPage;
