import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllPresents = () => {
  const trpc = useTRPC();
  return useQuery(trpc.presents.getAll.queryOptions());
};

export const useSuspenseGetAllPresents = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.presents.getAll.queryOptions());
};

export const useGetUnassignedPresents = () => {
  const trpc = useTRPC();
  return useQuery(trpc.presents.getUnassigned.queryOptions());
};

export const useCreatePresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.presents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.presents.getAll.queryOptions());
        toast.success("Regalo creado correctamente");
      },
      onError: () => {
        toast.error("Error al crear el regalo");
      },
    })
  );
};

export const useUpdatePresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.presents.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.presents.getAll.queryOptions());
        queryClient.invalidateQueries(trpc.lists.getAll.queryOptions());
        toast.success("Regalo actualizado correctamente");
      },
      onError: () => {
        toast.error("Error al actualizar el regalo");
      },
    })
  );
};

export const useDeletePresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.presents.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.presents.getAll.queryOptions());
        queryClient.invalidateQueries(trpc.lists.getAll.queryOptions());
        toast.success("Regalo eliminado correctamente");
      },
      onError: () => {
        toast.error("Error al eliminar el regalo");
      },
    })
  );
};
