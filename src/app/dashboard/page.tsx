import { prefetchDashboardStats } from "@/features/dashboard/server/prefetch";
import { DashboardView } from "@/features/dashboard/ui/view/dashboard-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Relion",
  description: "Resumen de tus regalos, listas y eventos",
};

export default async function Page() {
  await requireAuth();

  await prefetchDashboardStats();

  return (
    <HydrateClient>
      <DashboardView />
    </HydrateClient>
  );
}