import { prefetch, trpc } from "@/trpc/server";

export const prefetchGetAllPresents = async () => {
  return prefetch(trpc.presents.getAll.queryOptions());
};
