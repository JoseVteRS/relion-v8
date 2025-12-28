"use client";

import { PickAction, PresentStatus } from "@/generated/prisma/client";
import { Gift, PackageOpen } from "lucide-react";
import { memo } from "react";
import {
  PublicPresentCard,
  PublicPresentCardSkeleton,
} from "./public-present-card";

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

interface PublicPresentListProps {
  presents: PublicPresent[];
  isOwner: boolean;
  isForMe: boolean;
}

export const PublicPresentList = memo(function PublicPresentList({
  presents,
  isOwner,
  isForMe,
}: PublicPresentListProps) {
  if (presents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
          <PackageOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
          Esta lista está vacía
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
          El propietario aún no ha añadido regalos. ¡Vuelve más tarde!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {presents.map((present) => (
        <PublicPresentCard
          key={present.id}
          present={present}
          isOwner={isOwner}
          isForMe={isForMe}
        />
      ))}
    </div>
  );
});

// Skeleton loader para la lista
export const PublicPresentListSkeleton = memo(function PublicPresentListSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PublicPresentCardSkeleton key={i} />
      ))}
    </div>
  );
});
