"use client";

import { Button } from "@/components/ui/button";
import { useSuspenseGetFavorites } from "../../hooks/use-favorites";
import { AlertCircle, Heart, RefreshCw } from "lucide-react";
import { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FavoriteListCard } from "../components/favorite-list-card";
import Link from "next/link";

// Componente de error memoizado
const FavoriteListsError = memo(function FavoriteListsError({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500 dark:text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Error al cargar favoritos
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          No se pudieron cargar tus listas favoritas. Por favor, intenta de nuevo.
        </p>
        <Button
          onClick={resetErrorBoundary}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Intentar de nuevo
        </Button>
      </div>
    </div>
  );
});

// Skeleton para loading state
const FavoriteListsSkeleton = memo(function FavoriteListsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 p-5 animate-pulse"
        >
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-3 w-3/4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2 w-1/2" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
        </div>
      ))}
    </div>
  );
});

// Estado vacío
const EmptyFavorites = memo(function EmptyFavorites() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center">
          <Heart className="w-10 h-10 text-rose-500 dark:text-rose-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          No tienes listas favoritas
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          Las listas se añaden a favoritos cuando visitas el enlace de una lista pública y haces clic en el botón de favoritos.
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Comparte o visita enlaces de listas públicas para comenzar a guardar tus favoritos.
        </p>
      </div>
    </div>
  );
});

// Contenido principal
function FavoriteListsContent() {
  const { data: favorites } = useSuspenseGetFavorites();

  if (favorites.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {favorites.map((favorite) => (
        <FavoriteListCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
}

// Vista principal con ErrorBoundary y Suspense
export function FavoriteListsView() {
  return (
    <div className="relative min-h-screen">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/30 dark:bg-rose-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <ErrorBoundary FallbackComponent={FavoriteListsError}>
          <Suspense fallback={<FavoriteListsSkeleton />}>
            <FavoriteListsContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

