import { prefetch, trpc } from "@/trpc/server";

export const prefetchFavorites = async () => {
  return prefetch(trpc.favorites.getAll.queryOptions());
};

