"use client";

import { Button } from "@/components/ui/button";
import { List } from "@/generated/prisma/client";
import {
  Calendar,
  Gift,
  Globe,
  Link2,
  Lock,
  Pencil,
  Plus,
  Trash2,
  User,
  Users,
} from "lucide-react";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";
import { formatDate, getISODateTime } from "../../utils/format";

type ListWithStats = Omit<List, "createdAt" | "updatedAt" | "dateEvent"> & {
  createdAt: string;
  updatedAt: string;
  dateEvent: string | null;
  isForMe: boolean;
  _count?: {
    presents: number;
  };
};

interface ListCardContextValue {
  list: ListWithStats;
  isPrivate: boolean;
  onAddPresent?: (listId: string) => void;
  onEdit?: (listId: string) => void;
  onDelete?: (listId: string) => void;
}

const ListCardContext = createContext<ListCardContextValue | null>(null);

const useListCardContext = () => {
  const context = useContext(ListCardContext);
  if (!context) {
    throw new Error("ListCard subcomponents must be used within ListCard");
  }
  return context;
};

interface ListCardProps {
  list: ListWithStats;
  children: React.ReactNode;
  onAddPresent?: (listId: string) => void;
  onEdit?: (listId: string) => void;
  onDelete?: (listId: string) => void;
}

const ListCardRoot = ({
  list,
  children,
  onAddPresent,
  onEdit,
  onDelete,
}: ListCardProps) => {
  const isPrivate = list.visibility === "private";

  return (
    <ListCardContext.Provider
      value={{ list, isPrivate, onAddPresent, onEdit, onDelete }}
    >
      <article className="group relative rounded-xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-0.5">
        {isPrivate && (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent,transparent_10px,rgba(139,92,246,0.03)_10px,rgba(139,92,246,0.03)_20px)] pointer-events-none" />
        )}
        <div className="relative">{children}</div>
      </article>
    </ListCardContext.Provider>
  );
};

const ListCardHeader = () => {
  const { list, isPrivate } = useListCardContext();

  return (
    <div className="p-5 pb-0">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 tracking-tight">
          {list.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
              isPrivate
                ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {isPrivate ? (
              <Lock className="w-2.5 h-2.5" />
            ) : (
              <Globe className="w-2.5 h-2.5" />
            )}
            {isPrivate ? "Privada" : "Pública"}
          </span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${
              list.isForMe
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {list.isForMe ? (
              <User className="w-2.5 h-2.5" />
            ) : (
              <Users className="w-2.5 h-2.5" />
            )}
            {list.isForMe ? "Para mí" : "Para otro"}
          </span>
        </div>
      </div>
    </div>
  );
};

ListCardHeader.displayName = "ListCard.Header";

const ListCardBadges = () => {
  return null; // Badges ya están integrados en el Header
};

ListCardBadges.displayName = "ListCard.Badges";

const ListCardEventDate = () => {
  const { list } = useListCardContext();

  if (!list.dateEvent) {
    return null;
  }

  return (
    <div className="px-5 pt-4">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
        <time
          dateTime={getISODateTime(list.dateEvent)}
          suppressHydrationWarning
          className="text-xs font-medium text-neutral-600 dark:text-neutral-300"
        >
          {formatDate(list.dateEvent)}
        </time>
      </div>
    </div>
  );
};

ListCardEventDate.displayName = "ListCard.EventDate";

const ListCardDescription = () => {
  const { list } = useListCardContext();

  if (!list.description) {
    return null;
  }

  return (
    <div className="px-5 pt-3">
      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
        {list.description}
      </p>
    </div>
  );
};

ListCardDescription.displayName = "ListCard.Description";

const ListCardStats = () => {
  const { list, onAddPresent } = useListCardContext();
  const presentsCount = list._count?.presents ?? 0;

  return (
    <div className="p-5 pt-4">
      <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-100/80 dark:bg-neutral-800/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-neutral-700 shadow-sm">
            <Gift className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {presentsCount}
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              {presentsCount === 1 ? "regalo" : "regalos"}
            </p>
          </div>
        </div>

        {presentsCount === 0 && onAddPresent && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddPresent(list.id)}
            className="h-8 text-xs gap-1 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir
          </Button>
        )}
      </div>
    </div>
  );
};

ListCardStats.displayName = "ListCard.Stats";

const ListCardActions = () => {
  const { list, onEdit, onDelete } = useListCardContext();

  const getListUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/lists/${list.id}`;
  };

  const handleCopyLink = async () => {
    const url = getListUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado");
    } catch {
      toast.error("Error al copiar");
    }
  };

  return (
    <div className="px-5 pb-5 pt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopyLink}
            className="h-8 w-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            title="Copiar enlace"
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(list.id)}
              className="h-8 w-8 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              title="Editar lista"
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(list.id)}
              className="h-8 w-8 text-neutral-400 hover:text-red-500 dark:hover:text-red-400"
              title="Eliminar lista"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

ListCardActions.displayName = "ListCard.Actions";

export const ListCard = Object.assign(ListCardRoot, {
  Header: ListCardHeader,
  Badges: ListCardBadges,
  EventDate: ListCardEventDate,
  Description: ListCardDescription,
  Stats: ListCardStats,
  Actions: ListCardActions,
});
