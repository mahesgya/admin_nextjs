"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import authService from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PacmanLoader } from "react-spinners";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      await authService.loginAdmin(email, password);
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Login",
        text: error instanceof Error ? error.message : "Terjadi kesalahan, silahkan coba lagi.",
        showConfirmButton : true,
        showCloseButton : true,
      })
    }finally{
      setLoading(false);
    }
  };

  if(loading){
    return(
      <div className="w-[100dvw] h-[100dvh] flex items-center justify-center">
        <PacmanLoader color="#64b5f6" size={40} /> 
      </div>
    )
  }

  return (
    <Card className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-[#64b5f6] via-[#b3e5fc] to-[#64b5f6]">
      <CardContent className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <img src="/images/LogoAkucuciin.png" alt="Logo AkuCuciin" className=" w-48 h-auto lg:w-[300px] mx-auto mb-2" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="font-quick  block text-gray-700 font-semibold mb-2">
              Email
            </Label>
            <Input required id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan email Anda" className="w-full p-3 border border-gray-300 rounded-lg " />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </Label>
            <div className="relative">
              <Input required id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan password Anda" className="w-full p-3 border border-gray-300 rounded-lg" />
              <Button type="button" className="absolute right-0 top-0 bg-transparent text-gray-400" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</Button>
            </div>
          </div>
          <Button type="submit" className="w-full mt-3 p-3 bg-[#64b5f6] text-white rounded-xl font-semibold shadow-md focus:outline-none focus:ring-2 hover:shadow-lg transition duration-300">
            Login
          </Button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">© {new Date().getFullYear()} Admin Akucuciin</p>
      </CardContent>
    </Card>
  );
};

export default Login;
