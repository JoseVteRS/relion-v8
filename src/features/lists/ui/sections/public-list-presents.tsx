"use client";

import { PickAction, PresentStatus } from "@/generated/prisma/client";
import { memo } from "react";
import {
  PublicPresentList,
  PublicPresentListSkeleton,
} from "../components/public-present-list";

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

interface PublicListPresentsSectionProps {
  presents: PublicPresent[];
  isOwner: boolean;
  isForMe: boolean;
}

function PublicListPresentsSectionComponent({
  presents,
  isOwner,
  isForMe,
}: PublicListPresentsSectionProps) {
  return (
    <section>
      {/* Header de sección */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Regalos
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Elige el que quieras regalar
        </p>
      </div>

      <PublicPresentList
        presents={presents}
        isOwner={isOwner}
        isForMe={isForMe}
      />
    </section>
  );
}

export const PublicListPresentsSection = memo(PublicListPresentsSectionComponent);

// Skeleton para la sección de regalos
export const PublicListPresentsSectionSkeleton = memo(
  function PublicListPresentsSectionSkeleton() {
    return (
      <section>
        <div className="mb-6">
          <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-24 mb-2 animate-pulse" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-48 animate-pulse" />
        </div>
        <PublicPresentListSkeleton />
      </section>
    );
  }
);

