"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/features/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/features/dashboard/ui/components/dashboard-sidebar";

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider >
      <DashboardSidebar />
      <main className="flex flex-col min-h-dvh w-screen">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}

