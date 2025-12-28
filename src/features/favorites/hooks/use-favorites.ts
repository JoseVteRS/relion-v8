import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseGetFavorites = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.favorites.getAll.queryOptions());
};

export const useRemoveFavorite = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.favorites.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.favorites.getAll.queryOptions());
        toast.success("Lista eliminada de favoritos");
      },
      onError: () => {
        toast.error("Error al eliminar de favoritos");
      },
    })
  );
};

