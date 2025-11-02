"use client";

import { Button } from "@/components/ui/button";
import { List, Present } from "@/generated/prisma/client";
import { Calendar, DollarSign, Edit, ExternalLink, Lock, Tag, Trash2 } from "lucide-react";

type PresentWithListName = Omit<Present, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  list: Pick<List, "name"> | null;
};

interface PresentListProps {
  presents?: PresentWithListName[] | [];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getISODateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price / 100);
};

export const PresentList = ({ presents = [] }: PresentListProps) => {
  if (presents.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No hay regalos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {presents.map((present) => {
        const isPrivate = present.visibility === "private";
        const dateCreated = formatDate(present.createdAt);

        return (
          <article
            key={present.id}
            className={`group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-all duration-200 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md ${
              isPrivate ? "bg-stripe" : ""
            }`}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {isPrivate && (
                      <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                    )}
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                      {present.name}
                    </h3>
                  </div>
                  {present.list?.name && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <Tag className="w-3 h-3" />
                      <span className="truncate">{present.list.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {present.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                  {present.description}
                </p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {present.price > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{formatPrice(present.price)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <time dateTime={getISODateTime(present.createdAt)} suppressHydrationWarning>
                    {dateCreated}
                  </time>
                </div>
              </div>

              {/* Link and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                {present.link && (
                  <a
                    href={present.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group/link"
                  >
                    <span>Ver enlace</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </a>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      // TODO: Implementar edición
                      console.log("Editar", present.id);
                    }}
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="sr-only">Editar regalo</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      // TODO: Implementar eliminación
                      console.log("Eliminar", present.id);
                    }}
                    className="text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Eliminar regalo</span>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
