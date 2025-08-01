"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

import { MoreHorizontal, PlusCircle, Trash2, Edit, Search, ArrowLeft } from "lucide-react";
import { PacmanLoader } from "react-spinners";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertUtils } from "@/components/utils/alert.utils";
import packageService from "@/services/package.service";
import getPaginationRange from "@/components/utils/pagination.utils";
import { Input } from "@/components/ui/input";
import useMediaQuery from "@/components/utils/media.query.utils";
import { Package } from "@/types/package";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PackagesPage = () => {
  const params = useParams();
  const idLaundry = params.id as string; 

  const [packages, setPackages] = useState<Package[]>([]);
  const [laundryName, setLaundryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const itemsPerPage = isMobile ? 4 : 7;
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    if (!idLaundry) return;

    const fetchPackages = async () => {
      try {
        setLoading(true);
        if (accessToken) {
          const response = await packageService.getPackageByLaundry(idLaundry, accessToken);
          setLaundryName(response.name)
          setPackages(response.packages);
        }
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [idLaundry]); 

  const handleDelete = async (id: string) => {
    if (!accessToken) {
      AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
      return;
    }

    try{
      setLoading(true);
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin menghapus paket ini?")

      if(isConfirmed){
        await packageService.deletePackage(idLaundry, id, accessToken)
        AlertUtils.showSuccess("Paket berhasil dihapus.");
        setPackages(prev => prev.filter(p => p.id !== id));
      }
    }catch(error){
      AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
    }finally{
      setLoading(false)
    }
  }

  const formatRupiah = (price: string) => {
    const number = parseFloat(price);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const filteredPackage = packages.filter(p =>
    p.name?.toLowerCase().includes((searchQuery ?? '').toLowerCase())
  )

  const totalPages = Math.ceil(filteredPackage.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPackages = filteredPackage.slice(indexOfFirstItem, indexOfLastItem);

  const paginationRange = getPaginationRange(totalPages, currentPage, isMobile ? 0 : 1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
      return (
        <div className="w-[100dvw] md:w-[80dvw] h-[100dvh] md:h-[80dvh] flex items-center justify-center">
          <PacmanLoader color="#64b5f6" size={40} />
        </div>
      );
    }

  return (
    <div className="p-1 w-full h-full flex flex-col flex-grow md:p-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-4">
            <Link href={`/dashboard/laundry`} passHref>
              <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <div>
              <CardTitle>Daftar Paket {laundryName}</CardTitle>
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari paket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full dark:focus:ring-white/70"
              />
            </div>
            <Link href={`/dashboard/laundry/packages/create/${idLaundry}`} passHref>
              <Button className="shrink-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Paket
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
                <TableHead className="w-[200px]">Nama Paket</TableHead>
                <TableHead className="w-[300px]">Deskripsi</TableHead>
                <TableHead>Fitur</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPackages?.map((pkg) => (
                <TableRow key={pkg.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{pkg.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{pkg.description}</TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{pkg.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatRupiah(pkg.price_text)}</TableCell>
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
                        <Link href={{ pathname: `/dashboard/laundry/packages/edit/${idLaundry}`, query: { type: pkg.id } }} passHref>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <button onClick={() => handleDelete(pkg.id)} className="w-full">
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
          {currentPackages?.map((pkg) => (
            <Card key={pkg.id} className="gap-1 rounded-xl shadow-sm dark:border-gray-700 bg-white dark:bg-black transition">
              <CardHeader className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-md font-semibold text-gray-800 dark:text-white truncate">{pkg.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {pkg.description}
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
                      <Link href={{ pathname: `/dashboard/laundry/packages/edit/${idLaundry}`, query: { type: pkg.id } }} passHref>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <button onClick={() => handleDelete(pkg.id)} className="w-full">
                          <DropdownMenuItem className="w-full text-red-500 hover:text-red-500">
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              <p className="text-red-500">Hapus</p>
                          </DropdownMenuItem>
                      </button>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="px-4 pt-1 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {pkg.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="px-4 pt-3 flex justify-end items-center">
                 <p className="text-md font-bold text-gray-800 dark:text-white/90">{formatRupiah(pkg.price_text)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

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
      </CardContent>
    </div>
  );
}

export default PackagesPage;
