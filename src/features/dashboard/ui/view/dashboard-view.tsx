"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useDashboardStats } from "../../hooks/use-dashboard";
import { DashboardStatsCard } from "../components/dashboard-stats-card";
import { PickedPresentsList } from "../components/picked-presents-list";
import { PurchasedPresentsList } from "../components/purchased-presents-list";
import { FavoriteListsSection } from "../components/favorite-lists-section";
import { UpcomingEventsSection } from "../components/upcoming-events-section";
import { Gift, CheckCircle2, Euro, Heart, Calendar } from "lucide-react";
import { formatPrice } from "@/features/presents/utils/format";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function DashboardError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Error al cargar el dashboard</h3>
        <p className="text-sm text-muted-foreground">
          {error.message || "Ha ocurrido un error inesperado"}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
      >
        Recargar página
      </Button>
    </div>
  );
}

function DashboardContent() {
  const { data } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatsCard
          title="Regalos pillados"
          value={data.pickedPresents.length}
          description={`${data.pickedPresents.length} regalo${data.pickedPresents.length !== 1 ? "s" : ""} reservado${data.pickedPresents.length !== 1 ? "s" : ""}`}
          icon={<Gift className="w-5 h-5" />}
        />
        <DashboardStatsCard
          title="Regalos comprados"
          value={data.purchasedPresents.length}
          description={`${data.purchasedPresents.length} regalo${data.purchasedPresents.length !== 1 ? "s" : ""} comprado${data.purchasedPresents.length !== 1 ? "s" : ""}`}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
        <DashboardStatsCard
          title="Total gastado"
          value={formatPrice(data.totalSpent)}
          description="Suma de regalos comprados"
          icon={<Euro className="w-5 h-5" />}
          warning="No es valor real: algunos regalos no tienen importe"
        />
        <DashboardStatsCard
          title="Listas favoritas"
          value={data.favoriteLists.length}
          description={`${data.favoriteLists.length} lista${data.favoriteLists.length !== 1 ? "s" : ""} en favoritos`}
          icon={<Heart className="w-5 h-5" />}
        />
      </div>

      {/* Contenido principal en grid responsivo */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Columna izquierda */}
        <div className="space-y-6">
          <PickedPresentsList picks={data.pickedPresents} />
          <PurchasedPresentsList picks={data.purchasedPresents} />
        </div>

        {/* Columna derecha */}
        <div className="space-y-6">
          <FavoriteListsSection favoriteLists={data.favoriteLists} />
          <UpcomingEventsSection upcomingEvents={data.upcomingEvents} />
        </div>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl border bg-neutral-100 dark:bg-neutral-900 animate-pulse"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-64 rounded-xl border bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          <div className="h-64 rounded-xl border bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 rounded-xl border bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          <div className="h-64 rounded-xl border bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function DashboardView() {
  return (
    <ErrorBoundary FallbackComponent={DashboardError}>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </ErrorBoundary>
  );
}

