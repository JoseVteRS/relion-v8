"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, Gift, Heart, Loader2, Share2, Users } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import { useIsFavorite, useToggleFavorite } from "../../hooks/use-lists";

interface PublicListHeaderProps {
  list: {
    id: string;
    name: string;
    description: string | null;
    dateEvent: Date | string | null;
    isForMe: boolean;
    presents: { id: string }[];
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PublicListHeaderComponent({ list }: PublicListHeaderProps) {
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user?.id;
  const isOwner = session?.user?.id === list.user.id;

  // Favoritos - solo para usuarios logueados que no son dueños
  const { data: isFavorite, isLoading: isFavoriteLoading } = useIsFavorite(list.id);
  const toggleFavoriteMutation = useToggleFavorite();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      toast.error("Inicia sesión para añadir a favoritos");
      return;
    }
    toggleFavoriteMutation.mutate({ listId: list.id });
  };

  // Calcular días restantes si hay fecha
  const getDaysUntilEvent = () => {
    if (!list.dateEvent) return null;
    const eventDate = new Date(list.dateEvent);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilEvent();
  const showFavoriteButton = !isOwner;

  return (
    <header className="relative">
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar y nombre del propietario */}
          <div className="flex items-center gap-4 sm:flex-col sm:items-start">
            <Avatar className="w-14 h-14 sm:w-16 sm:h-16">
              <AvatarImage
                src={list.user.image || undefined}
                alt={list.user.name}
              />
              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-lg font-semibold">
                {getInitials(list.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="sm:hidden">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Lista de</p>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">{list.user.name}</p>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            <div className="hidden sm:block mb-1">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Lista de <span className="font-medium text-zinc-700 dark:text-zinc-300">{list.user.name}</span>
              </p>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
              {list.name}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              {list.dateEvent && (
                <>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>{format(new Date(list.dateEvent), "d 'de' MMMM, yyyy", { locale: es })}</span>
                  </div>
                  {daysUntil !== null && daysUntil > 0 && (
                    <span className="text-zinc-400 dark:text-zinc-500">
                      · {daysUntil === 1 ? "¡Mañana!" : `en ${daysUntil} días`}
                    </span>
                  )}
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                </>
              )}

              <div className="flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>{list.presents.length} {list.presents.length === 1 ? "regalo" : "regalos"}</span>
              </div>

              {!list.isForMe && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-600">·</span>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>Para otra persona</span>
                  </div>
                </>
              )}
            </div>

            {/* Descripción */}
            {list.description && (
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {list.description}
              </p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="sm:self-start flex items-center gap-2">
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                disabled={toggleFavoriteMutation.isPending || isFavoriteLoading}
                className="h-9 w-9 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {toggleFavoriteMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isFavorite ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="h-9 w-9 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export const PublicListHeader = memo(PublicListHeaderComponent);

// Skeleton para el header
export const PublicListHeaderSkeleton = memo(function PublicListHeaderSkeleton() {
  return (
    <header>
      <div className="p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-64" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full max-w-md" />
          </div>
        </div>
      </div>
    </header>
  );
});

