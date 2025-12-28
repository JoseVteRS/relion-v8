import { prefetch, trpc } from "@/trpc/server";

export const prefetchPicks = async () => {
  return prefetch(trpc.picks.getAll.queryOptions());
};

