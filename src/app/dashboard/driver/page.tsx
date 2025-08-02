"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

import { MoreHorizontal, PlusCircle, Trash2, Edit, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PacmanLoader } from "react-spinners";
import { AlertUtils } from "@/components/utils/alert.utils";
import driverService from "@/services/driver.service"; // USE DRIVER SERVICE
import useMediaQuery from "@/components/utils/media.query.utils";
import getPaginationRange from "@/components/utils/pagination.utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSidebar } from "@/components/ui/sidebar";
import { DriverData } from "@/types/driver";
import { formatDate } from "@/components/utils/format.utils";

const DriversPage = () => {
  const { state } = useSidebar()
  const [drivers, setDrivers] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = isMobile ? 8 : 10;
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        if (accessToken) {
          const response = await driverService.getDrivers(accessToken);
          const sortedData = response.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setDrivers(sortedData);
        }
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!accessToken) {
      AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }

    try{
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin menghapus driver ini?");

      if(isConfirmed){
        await driverService.deleteDriver(id, accessToken);
        AlertUtils.showSuccess("Driver berhasil dihapus.");
        setDrivers(prev => prev.filter(d => d.id !== id));
      }
    }catch(error){
      AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.");
    }
  };
  
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Daftar Driver</CardTitle>
              <CardDescription>Kelola semua driver yang terdaftar di platform.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
                <Input type="search" placeholder="Cari driver..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-full dark:focus:ring-white/70" />
              </div>
              <Link href="/dashboard/driver/create" passHref>
                <Button className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Driver
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-grow">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Nama Driver</TableHead>
                  <TableHead>Info Kontak</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead className="text-right w-[80px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDrivers?.map((driver) => (
                  <TableRow key={driver.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{driver.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">{driver.email}</span>
                        <span className="text-xs text-muted-foreground">{driver.telephone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>{driver.address}</TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{driver.address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{driver.city}</TableCell>
                    <TableCell>{formatDate(driver.created_at)}</TableCell>
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
                                    pathname: `/dashboard/driver/edit/${driver.id}`,
                                    query: { data: JSON.stringify(driver) }
                                }} 
                                passHref
                            >
                                <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                            </Link>
                          <button onClick={() => handleDelete(driver.id)} className="w-full">
                            <DropdownMenuItem className="w-full text-red-500 hover:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <p className="text-red-500">Hapus</p>
                            </DropdownMenuItem>
                          </button>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 md:hidden py-2 ">
            {currentDrivers?.map((driver) => (
              <Card key={driver.id} className="rounded-xl shadow-sm dark:border-gray-700 bg-white dark:bg-black transition">
                <CardHeader className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-md font-semibold text-gray-800 dark:text-white truncate">{driver.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {driver.email} &bull; {driver.telephone}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <span className="sr-only">Buka menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-50">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <Link 
                              href={{
                                  pathname: `/dashboard/driver/edit/${driver.id}`,
                                  query: { data: JSON.stringify(driver) }
                              }} 
                              passHref
                          >
                              <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                              </DropdownMenuItem>
                          </Link>
                        <button onClick={() => handleDelete(driver.id)} className="w-full">
                            <DropdownMenuItem className="w-full text-red-500 hover:text-red-500">
                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                <p className="text-red-500">Hapus</p>
                            </DropdownMenuItem>
                        </button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pt-1 pb-3 text-sm text-gray-700 dark:text-gray-300">
                  <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{driver.address}</p>
                </CardContent>
                <CardFooter className="px-4 pt-0 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{driver.city}</span>
                  <span className="text-xs text-muted-foreground">Bergabung: {formatDate(driver.created_at)}</span>
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

export default DriversPage;
