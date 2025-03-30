"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle-mode";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isLoginPage = pathName === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        {!isLoginPage && <AppSidebar />}
        <main>
          {!isLoginPage && <SidebarTrigger />}
          {!isLoginPage && <ModeToggle />}
          {children}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
