"use client";

import { Button } from "@/components/ui/button";
import { List, Present } from "@/generated/prisma/client";
import {
  Calendar,
  Edit,
  ExternalLink,
  Gift,
  Lock,
  Tag,
  Trash2,
} from "lucide-react";
import React, { createContext, useContext } from "react";
import { formatDate, formatPrice, getISODateTime } from "../../utils/format";

type PresentWithListName = Omit<Present, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  list: Pick<List, "name"> | null;
};

interface PresentCardContextValue {
  present: PresentWithListName;
  isPrivate: boolean;
}

const PresentCardContext = createContext<PresentCardContextValue | null>(null);

const usePresentCardContext = () => {
  const context = useContext(PresentCardContext);
  if (!context) {
    throw new Error(
      "PresentCard subcomponents must be used within PresentCard"
    );
  }
  return context;
};

interface PresentCardProps {
  present: PresentWithListName;
  children: React.ReactNode;
}

const PresentCardRoot = ({ present, children }: PresentCardProps) => {
  const isPrivate = present.visibility === "private";

  return (
    <PresentCardContext.Provider value={{ present, isPrivate }}>
      <article
        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5"
      >
        <div className="relative p-5">{children}</div>
      </article>
    </PresentCardContext.Provider>
  );
};

const PresentCardHeader = () => {
  const { present, isPrivate } = usePresentCardContext();

  return (
    <div className="flex items-start gap-4">
      {/* Gift icon container */}
      <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
        <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          {isPrivate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
              <Lock className="w-2.5 h-2.5" />
              Privado
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 line-clamp-2 leading-tight">
          {present.name}
        </h3>
        {present.list?.name && (
          <div className="flex items-center gap-1.5">
            <Tag className="w-3 h-3 text-zinc-400" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {present.list.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Price badge */}
      {present.price > 0 && (
        <div className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tabular-nums">
            {formatPrice(present.price)}
          </span>
        </div>
      )}
    </div>
  );
};

PresentCardHeader.displayName = "PresentCard.Header";

const PresentCardDescription = () => {
  const { present } = usePresentCardContext();

  if (!present.description) {
    return null;
  }

  return (
    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pl-15">
      {present.description}
    </p>
  );
};

PresentCardDescription.displayName = "PresentCard.Description";

const PresentCardMetadata = () => {
  const { present } = usePresentCardContext();
  const dateCreated = formatDate(present.createdAt);

  return (
    <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-500">
        <Calendar className="w-3.5 h-3.5" />
        <time
          dateTime={getISODateTime(present.createdAt)}
          suppressHydrationWarning
        >
          {dateCreated}
        </time>
      </div>
    </div>
  );
};

PresentCardMetadata.displayName = "PresentCard.Metadata";

const PresentCardLink = () => {
  const { present } = usePresentCardContext();

  if (!present.link) {
    return null;
  }

  return (
    <a
      href={present.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group/link"
    >
      <ExternalLink className="w-3 h-3" />
      <span>Ver producto</span>
    </a>
  );
};

PresentCardLink.displayName = "PresentCard.Link";

interface PresentCardActionsProps {
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
}

const PresentCardActions = ({ onEdit, onDelete }: PresentCardActionsProps) => {
  const { present } = usePresentCardContext();

  const handleEdit = () => {
    if (onEdit) {
      onEdit(present.id);
    } else {
      console.log("Editar", present.id);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(present.id);
    } else {
      console.log("Eliminar", present.id);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleEdit}
        className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <Edit className="w-3.5 h-3.5" />
        <span className="sr-only">Editar regalo</span>
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => {
          void handleDelete();
        }}
        className="h-8 w-8 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:text-zinc-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/30"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span className="sr-only">Eliminar regalo</span>
      </Button>
    </div>
  );
};

PresentCardActions.displayName = "PresentCard.Actions";

export const PresentCard = Object.assign(PresentCardRoot, {
  Header: PresentCardHeader,
  Description: PresentCardDescription,
  Metadata: PresentCardMetadata,
  Link: PresentCardLink,
  Actions: PresentCardActions,
});

