"use client";

import { Button } from "@/components/ui/button";
import {
  usePickPresent,
  usePurchasePresent,
  useReleasePresent,
} from "@/features/picks/hooks/use-picks";
import { PickAction, PresentStatus } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import {
  Check,
  ExternalLink,
  Hand,
  Loader2,
  Lock,
  ShoppingBag,
  X,
} from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface Pick {
  id: string;
  action: PickAction;
  user: {
    id: string;
    name: string;
  };
}

interface PublicPresent {
  id: string;
  name: string;
  description: string | null;
  price: number;
  link: string | null;
  status: PresentStatus;
  picks: Pick[];
}

interface PublicPresentCardProps {
  present: PublicPresent;
  isOwner: boolean;
  isForMe: boolean;
}

export const PublicPresentCard = memo(function PublicPresentCard({
  present,
  isOwner,
  isForMe,
}: PublicPresentCardProps) {
  const { data: session } = authClient.useSession();
  const pickMutation = usePickPresent();
  const releaseMutation = useReleasePresent();
  const purchaseMutation = usePurchasePresent();

  const currentUserId = session?.user?.id;
  const isLoggedIn = !!currentUserId;

  // Determinar el estado del regalo
  const activePick = present.picks[0];
  const isPicked = present.status === "reserved" || present.status === "purchased";
  const isPurchased = present.status === "purchased";
  const isPickedByMe = activePick?.user.id === currentUserId;

  // El dueño solo ve estados si la lista es para otra persona
  const canSeeStatus = !isOwner || !isForMe;
  // Solo usuarios que no son dueños pueden interactuar
  const canInteract = !isOwner && isLoggedIn;

  const isLoading =
    pickMutation.isPending ||
    releaseMutation.isPending ||
    purchaseMutation.isPending;

  const handlePick = () => {
    pickMutation.mutate({ presentId: present.id });
  };

  const handleRelease = () => {
    releaseMutation.mutate({ presentId: present.id });
  };

  const handlePurchase = () => {
    purchaseMutation.mutate({ presentId: present.id });
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(priceInCents / 100);
  };

  // Estilos según estado - Paleta neutra
  const getCardStyles = () => {
    if (isPurchased && canSeeStatus) {
      return "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 opacity-60";
    }
    if (isPicked && canSeeStatus) {
      return "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800";
    }
    return "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md";
  };

  // Badge de estado - Solo mostrar si está reservado/comprado
  const StatusIndicator = () => {
    if (!canSeeStatus) return null;

    // Si yo lo compré, mostrar "Comprado" (único badge con color - confirmación)
    if (isPurchased && isPickedByMe) {
      return (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-medium">
            <Check className="w-3 h-3" />
            Comprado
          </div>
        </div>
      );
    }

    // Si otro lo compró, mostrar "No disponible"
    if (isPurchased && !isPickedByMe) {
      return (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium">
            <Lock className="w-3 h-3" />
            No disponible
          </div>
        </div>
      );
    }

    // Si yo lo pillé (reservado), mostrar "Reservado"
    if (isPicked && isPickedByMe) {
      return (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-800 text-xs font-medium">
            <Hand className="w-3 h-3" />
            Reservado
          </div>
        </div>
      );
    }

    // Si otro lo pilló (reservado), mostrar "Pillado"
    if (isPicked && !isPickedByMe) {
      return (
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium">
            <Lock className="w-3 h-3" />
            Pillado
          </div>
        </div>
      );
    }

    // Si está disponible, no mostrar badge (solo el botón de acción)
    return null;
  };

  // Determinar si hay badge para ajustar padding
  const hasBadge = canSeeStatus && isPicked;

  return (
    <article className={`group relative rounded-xl border overflow-hidden transition-all duration-300 ${getCardStyles()}`}>
      <StatusIndicator />

      <div className={`p-5 ${hasBadge ? "pt-12" : "pt-5"}`}>
        {/* Nombre - Elemento principal */}
        <h3 className={`text-lg font-semibold mb-1 line-clamp-2 ${
          isPurchased && canSeeStatus
            ? "text-zinc-500 dark:text-zinc-500 line-through"
            : "text-zinc-900 dark:text-zinc-100"
        }`}>
          {present.name}
        </h3>

        {/* Precio - Secundario */}
        {present.price > 0 && (
          <p className={`text-sm font-medium mb-3 ${
            isPurchased && canSeeStatus
              ? "text-zinc-400 dark:text-zinc-600"
              : "text-zinc-600 dark:text-zinc-400"
          }`}>
            {formatPrice(present.price)}
          </p>
        )}

        {/* Descripción */}
        {present.description && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
            {present.description}
          </p>
        )}

        {/* Enlace al producto */}
        {present.link && (
          <div className="mb-4">
            <a
              href={present.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
            >
              Ver producto
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Acciones */}
        {canInteract && (
          <div className="space-y-3">
            {/* Estado: Disponible - Mostrar botón de pillar (CTA principal - único con color) */}
            {!isPicked && (
              <Button
                onClick={handlePick}
                disabled={isLoading}
                className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Hand className="w-4 h-4 mr-2" />
                )}
                ¡Lo pillo yo!
              </Button>
            )}

            {/* Estado: Pillado por mí - Mostrar opciones */}
            {isPicked && isPickedByMe && !isPurchased && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleRelease}
                  disabled={isLoading}
                  variant="outline"
                  className="h-10 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {releaseMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <X className="w-4 h-4 mr-1.5" />
                  )}
                  Soltar
                </Button>
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {purchaseMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-1.5" />
                  )}
                  Comprado
                </Button>
              </div>
            )}

            {/* Estado: Ya lo compré */}
            {isPicked && isPickedByMe && isPurchased && (
              <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                ¡Ya lo compraste!
              </p>
            )}

            {/* Estado: Pillado por otro */}
            {isPicked && !isPickedByMe && (
              <p className="text-center text-sm text-zinc-400 dark:text-zinc-500">
                Alguien ya se encarga de este regalo
              </p>
            )}
          </div>
        )}

        {/* Prompt de login */}
        {!isOwner && !isLoggedIn && !isPurchased && (
          <Button
            variant="outline"
            asChild
            className="w-full h-10 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Link href="/login">
              <Hand className="w-4 h-4 mr-2" />
              Inicia sesión para pillar
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
});

// Skeleton para loading
export const PublicPresentCardSkeleton = memo(function PublicPresentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden animate-pulse">
      <div className="p-5">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-16 mb-3" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-1" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 mb-4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24 mb-4" />
        <div className="h-11 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
      </div>
    </div>
  );
});
