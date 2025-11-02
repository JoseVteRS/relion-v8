import { DashboardLayoutClient } from "@/features/dashboard/ui/components/dashboard-layout-client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      <div className="max-w-7xl container mx-auto px-5">{children}</div>
    </DashboardLayoutClient>
  );
}
