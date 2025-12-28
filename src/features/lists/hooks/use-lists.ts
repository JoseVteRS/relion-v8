import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllLists = () => {
  const trpc = useTRPC();
  return useQuery(trpc.lists.getAll.queryOptions());
};

export const useSuspenseGetAllLists = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.lists.getAll.queryOptions());
};

export const useCreateList = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.lists.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.lists.getAll.queryOptions());
        toast.success("Lista creada correctamente");
      },
      onError: () => {
        toast.error("Error al crear la lista");
      },
    })
  );
};

export const useUpdateList = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.lists.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.lists.getAll.queryOptions());
        toast.success("Lista actualizada correctamente");
      },
      onError: () => {
        toast.error("Error al actualizar la lista");
      },
    })
  );
};

export const useDeleteList = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.lists.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.lists.getAll.queryOptions());
        toast.success("Lista eliminada correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar la lista");
      },
    })
  );
};

export const useIsFavorite = (listId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.lists.isFavorite.queryOptions({ listId }));
};

export const useToggleFavorite = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.lists.toggleFavorite.mutationOptions({
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(
          trpc.lists.isFavorite.queryOptions({ listId: variables.listId })
        );
        toast.success(
          data.isFavorite
            ? "Lista añadida a favoritos"
            : "Lista eliminada de favoritos"
        );
      },
      onError: () => {
        toast.error("Error al actualizar favoritos");
      },
    })
  );
};

