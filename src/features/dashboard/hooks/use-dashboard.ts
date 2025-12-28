import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.dashboard.getStats.queryOptions());
};

