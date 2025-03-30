import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";
import AppLayout from "./AppLayout";

export const metadata: Metadata = {
  title: "Admin AkuCuciin",
  description: "Dashboard Admin untuk mengelola website utama Akucuciin.",
};

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.className}`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
