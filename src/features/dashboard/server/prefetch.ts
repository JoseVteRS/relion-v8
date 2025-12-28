import { prefetch, trpc } from "@/trpc/server";

export const prefetchDashboardStats = async () => {
  return prefetch(trpc.dashboard.getStats.queryOptions());
};

