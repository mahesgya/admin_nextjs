"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await authService.loginAdmin(email, password, router);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-[#64b5f6] via-[#b3e5fc] to-[#64b5f6]">
      <div className="max-w-md w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
        <img src="/images/LogoAkucuciin.png" alt="Logo AkuCuciin" className=" w-32 h-auto lg:w-[200px] mx-auto mb-2" />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#64b5f6]"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-3 p-3 bg-[#64b5f6] text-white rounded-xl font-semibold shadow-md hover:from-gray-900 hover:to-black focus:outline-none focus:ring-2 focus:ring-black hover:shadow-lg transition duration-300"
          >
            Login
          </Button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">© {new Date().getFullYear()} Admin Akucuciin</p>
      </div>
    </div>
  );
};

export default Login;
