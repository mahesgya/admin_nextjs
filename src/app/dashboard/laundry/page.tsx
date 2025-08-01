"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

import { MoreHorizontal, PlusCircle, Trash2, Edit, Eye, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PacmanLoader } from "react-spinners";
import { LaundryData } from "@/types/laundry";

import { AlertUtils } from "@/components/utils/alert.utils";
import laundryService from "@/services/laundry.service";

const Laundry = () => {
  const [laundries, setLaundries] = useState<LaundryData[]>([])  ;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accessToken: string | undefined = Cookies.get("accessToken");

  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        setLoading(true);
        if (accessToken) {
          const response = await laundryService.getLaundries(accessToken);
          setLaundries(response);
        }
      } catch (error) {
        AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
      } finally {
        setLoading(false);
      }
    };

    fetchLaundries();
  }, []);

  const filteredLaundries = laundries.filter(laundry => 
    laundry.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!accessToken) {
      AlertUtils.showError("Sesi Anda telah berakhir. Silakan login kembali.");
      return
    }

    try{
      setLoading(true)
      const isConfirmed = await AlertUtils.showConfirmation("Apakah anda yakin ingin menghapus laundry ini?")

      if(isConfirmed){
        await laundryService.deleteLaundry(id, accessToken)
        AlertUtils.showSuccess("Laundry berhasil dihapus.")
        window.location.reload()
      }else{
        return
      }
    }catch(error){
      AlertUtils.showError(error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.")
    }finally{
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-[100dvw] md:w-[80dvw] h-[100dvh] md:h-[80dvh]  flex items-center justify-center">
        <PacmanLoader color="#64b5f6" size={40} />
      </div>
    );
  }

  return (
    <div className="p-1 w-full h-full flex flex-col flex-grow md:p-4">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Daftar Mitra Laundry</CardTitle>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground " />
              <Input type="search" placeholder="Cari laundry..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-full dark:focus:ring-white/70" />
            </div>
            <Link href="/dashboard/laundry/create" passHref>
              <Button className="w-full md:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Laundry
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
                <TableHead className="w-[200px]">Nama Laundry</TableHead>
                <TableHead className="w-[80px]">Info Kontak</TableHead>
                <TableHead className="w-[80px]">Lokasi</TableHead>
                <TableHead className="w-[300px]">Deskripsi</TableHead>
                <TableHead className="text-center w-[80px]">Maps</TableHead>
                <TableHead className="text-right w-[80px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLaundries?.map((laundry) => (
                <TableRow key={laundry.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{laundry.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{laundry.email}</span>
                      <span className="text-xs text-muted-foreground">{laundry.telephone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">{laundry.city}</span>
                      <span className="text-xs text-muted-foreground">{laundry.area}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>{laundry.description}</TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{laundry.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button asChild variant="outline" size="icon" className="h-8 w-8">
                      <a href={laundry.maps_pinpoint} target="_blank" rel="noopener noreferrer">
                        <MapPin className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
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
                        <Link href={`/dashboard/laundry/services/${laundry.id}`} passHref>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Layanan
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href={`/dashboard/laundry/edit/${laundry.id}`} passHref>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <button onClick={() => handleDelete(laundry.id)} className="w-full">
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

        <div className="grid gap-4 md:hidden px-4 py-2 ">
          {filteredLaundries?.map((laundry) => (
            <Card key={laundry.id} className="rounded-xl shadow-sm dark:border-gray-700 bg-white dark:bg-black transition">
              <CardHeader className="px-4 py-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-md font-semibold text-gray-800 dark:text-white truncate">{laundry.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {laundry.email} &bull; {laundry.telephone}
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
                      <Link href={`/dashboard/services/${laundry.id}`} passHref>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Layanan
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                     <Link href={`/dashboard/laundry/edit/${laundry.id}`} passHref>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <button onClick={() => handleDelete(laundry.id)} className="w-full">
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
                <p className="mb-2 text-xs">{laundry.address}</p>
                <p className="line-clamp-3 text-xs text-gray-600 dark:text-gray-400">{laundry.description}</p>
              </CardContent>

              <CardFooter className="px-4 pt-0 flex justify-between items-center">
                <div className="flex gap-2 flex-wrap text-xs">
                  <Badge variant="outline" className="rounded-md px-2 py-1">
                    {laundry.city}
                  </Badge>
                  <Badge variant="outline" className="rounded-md px-2 py-1">
                    {laundry.area}
                  </Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="text-xs px-2 py-1 h-8">
                  <a href={laundry.maps_pinpoint} target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-1 h-4 w-4" />
                    Peta
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </CardContent>
    </div>
  );
}

export default Laundry
