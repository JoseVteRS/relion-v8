"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Lock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { PublicListHeader, PublicListHeaderSkeleton } from "../sections/public-list-header";
import { PublicListOwnerBlock } from "../sections/public-list-owner-block";
import { PublicListPresentsSection, PublicListPresentsSectionSkeleton } from "../sections/public-list-presents";

interface PublicListViewProps {
  listId: string;
}

// Componente de error memoizado
const ListError = memo(function ListError({
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
          Lista no encontrada
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          Esta lista no existe, es privada o no tienes permisos para verla.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={resetErrorBoundary}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </Button>
          <Link href="/">
            <Button className="gap-2 w-full sm:w-auto bg-violet-600 hover:bg-violet-700">
              <ArrowLeft className="w-4 h-4" />
              Ir al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

// Loader completo memoizado
const ListLoading = memo(function ListLoading() {
  return (
    <div className="space-y-10">
      <PublicListHeaderSkeleton />
      <PublicListPresentsSectionSkeleton />
    </div>
  );
});

// Contenido principal de la lista
function ListContent({ listId }: { listId: string }) {
  const trpc = useTRPC();
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: list } = useSuspenseQuery(
    trpc.lists.getPublicById.queryOptions({ listId })
  );

  const currentUserId = session?.user?.id;
  const isOwner = list.user.id === currentUserId;

  // Mostrar skeleton mientras la sesión se carga para evitar flash
  if (isSessionPending) {
    return <ListLoading />;
  }

  // Si es el dueño y la lista es para sí mismo, mostrar mensaje
  if (isOwner && list.isForMe) {
    return <PublicListOwnerBlock />;
  }

  return (
    <div className="space-y-10">
      <PublicListHeader list={list} />
      <PublicListPresentsSection
        presents={list.presents}
        isOwner={isOwner}
        isForMe={list.isForMe}
      />
    </div>
  );
}

export function PublicListView({ listId }: PublicListViewProps) {
  return (
    <div className="relative min-h-screen">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-fuchsia-200/30 dark:bg-fuchsia-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 sm:py-12">
        <ErrorBoundary FallbackComponent={ListError}>
          <Suspense fallback={<ListLoading />}>
            <ListContent listId={listId} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
