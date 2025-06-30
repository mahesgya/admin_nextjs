"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/features/sidebar/toggle-mode";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const isLoginPage = pathName === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      {!isLoginPage && <AppSidebar />}
      <main>
        {!isLoginPage && <SidebarTrigger />}
        {!isLoginPage && <ModeToggle />}
        {children}
      </main>
    </SidebarProvider>
  );
}
