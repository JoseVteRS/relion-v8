"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useReleasePresent } from "../../hooks/use-picks";
import { ExternalLink, Loader2, X, Calendar, Gift } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { formatDate, formatPrice, getISODateTime } from "@/features/presents/utils/format";

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

interface PickCardProps {
  pick: PickData;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const PickCard = memo(function PickCard({ pick }: PickCardProps) {
  const releaseMutation = useReleasePresent();
  const isPurchased = pick.action === "purchased";
  const isPicked = pick.action === "picked" || pick.action === "reserved";

  const handleRelease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    releaseMutation.mutate({ presentId: pick.presentId });
  };

  const listUrl = pick.present.list ? `/lists/${pick.present.list.id}` : null;

  return (
    <article className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5">
      <div className="relative p-5">
        {/* Header con icono y nombre */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-tight">
              {pick.present.name}
            </h3>
            {pick.present.list && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {pick.present.list.name}
                </span>
              </div>
            )}
          </div>
          
          {/* Precio */}
          {pick.present.price > 0 && (
            <div className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {formatPrice(pick.present.price)}
              </span>
            </div>
          )}
        </div>

        {/* Descripción */}
        {pick.present.description && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {pick.present.description}
          </p>
        )}

        {/* Información de la lista */}
        {pick.present.list && (
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={pick.present.list.user.image || undefined} alt={pick.present.list.user.name} />
                <AvatarFallback className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                  {getInitials(pick.present.list.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Lista de <span className="font-medium text-zinc-700 dark:text-zinc-300">{pick.present.list.user.name}</span>
                </p>
                {pick.present.list.dateEvent && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <time
                      dateTime={getISODateTime(pick.present.list.dateEvent)}
                      suppressHydrationWarning
                      className="text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      {formatDate(pick.present.list.dateEvent)}
                    </time>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
          {!isPurchased && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRelease}
              disabled={releaseMutation.isPending}
              className="w-full gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {releaseMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Soltar regalo
            </Button>
          )}
          
          <div className="flex gap-2">
            {listUrl && (
              <Link href={listUrl} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  Ver lista
                </Button>
              </Link>
            )}
            
            {pick.present.link && (
              <a
                href={pick.present.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver producto
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

