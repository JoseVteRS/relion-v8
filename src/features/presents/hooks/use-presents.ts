import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const useGetAllPresents = () => {
  const trpc = useTRPC();
  return useQuery(trpc.presents.getAll.queryOptions());
};


export const useSuspenseGetAllPresents = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.presents.getAll.queryOptions());
};