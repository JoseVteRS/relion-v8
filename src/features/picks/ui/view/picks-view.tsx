"use client";

import { Button } from "@/components/ui/button";
import { useSuspenseGetPicks } from "../../hooks/use-picks";
import { AlertCircle, Gift, RefreshCw, Hand, Check } from "lucide-react";
import { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PickCard } from "../components/pick-card";

type PickData = {
  id: string;
  presentId: string;
  action: "picked" | "reserved" | "purchased";
  createdAt: string;
  updatedAt: string;
  present: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    link: string | null;
    status: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    list: {
      id: string;
      name: string;
      description: string | null;
      visibility: string;
      dateEvent: string | null;
      isForMe: boolean;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        image: string | null;
      };
    } | null;
  };
};

// Componente de error memoizado
const PicksError = memo(function PicksError({
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
          Error al cargar tus reservas
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          No se pudieron cargar tus regalos pillados y comprados. Por favor, intenta de nuevo.
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
const PicksSkeleton = memo(function PicksSkeleton() {
  return (
    <div className="space-y-8">
      {/* Sección Pillados */}
      <div>
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-48" />
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
      </div>
      
      {/* Sección Comprados */}
      <div>
        <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((i) => (
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
      </div>
    </div>
  );
});

// Estado vacío
const EmptyPicks = memo(function EmptyPicks() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
          <Gift className="w-10 h-10 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          No tienes reservas
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          Aun no has pillado o comprado ningun regalo. Visita listas publicas para comenzar a reservar regalos.
        </p>
      </div>
    </div>
  );
});

// Sección de regalos pillados
const PickedSection = memo(function PickedSection({ picks }: { picks: PickData[] }) {
  if (picks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Hand className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Regalos Pillados
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          ({picks.length})
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {picks.map((pick) => (
          <PickCard key={pick.id} pick={pick} />
        ))}
      </div>
    </section>
  );
});

// Sección de regalos comprados
const PurchasedSection = memo(function PurchasedSection({ picks }: { picks: PickData[] }) {
  if (picks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Regalos Comprados
        </h2>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          ({picks.length})
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {picks.map((pick) => (
          <PickCard key={pick.id} pick={pick} />
        ))}
      </div>
    </section>
  );
});

// Contenido principal
function PicksContent() {
  const { data } = useSuspenseGetPicks();
  const { picked, purchased } = data;

  if (picked.length === 0 && purchased.length === 0) {
    return <EmptyPicks />;
  }

  return (
    <div className="space-y-8">
      <PickedSection picks={picked} />
      <PurchasedSection picks={purchased} />
    </div>
  );
}

// Vista principal con ErrorBoundary y Suspense
export function PicksView() {
  return (
    <div className="relative min-h-screen">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 dark:bg-amber-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <ErrorBoundary FallbackComponent={PicksError}>
          <Suspense fallback={<PicksSkeleton />}>
            <PicksContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

