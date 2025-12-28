import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePickPresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.picks.pick.mutationOptions({
      onSuccess: () => {
        // Invalidar la query de la lista pública
        queryClient.invalidateQueries({ queryKey: ["lists", "getPublicById"] });
        toast.success("¡Regalo pillado!");
      },
      onError: (error) => {
        toast.error(error.message || "Error al pillar el regalo");
      },
    })
  );
};

export const useReleasePresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.picks.release.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lists", "getPublicById"] });
        toast.success("Regalo liberado");
      },
      onError: (error) => {
        toast.error(error.message || "Error al liberar el regalo");
      },
    })
  );
};

export const usePurchasePresent = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.picks.purchase.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lists", "getPublicById"] });
        toast.success("¡Regalo marcado como comprado!");
      },
      onError: (error) => {
        toast.error(error.message || "Error al marcar como comprado");
      },
    })
  );
};

export const useSuspenseGetPicks = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.picks.getAll.queryOptions());
};

