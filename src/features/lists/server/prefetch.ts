import { prefetch, trpc } from "@/trpc/server";

export const prefetchGetAllLists = async () => {
  return prefetch(trpc.lists.getAll.queryOptions());
};

export const prefetchPublicList = async (listId: string) => {
  return prefetch(trpc.lists.getPublicById.queryOptions({ listId }));
};

