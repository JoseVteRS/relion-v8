"use client";

import { List } from "@/generated/prisma/client";
import { ListCard } from "./list-card";

type ListWithStats = Omit<List, "createdAt" | "updatedAt" | "dateEvent"> & {
  createdAt: string;
  updatedAt: string;
  dateEvent: string | null;
  isForMe: boolean;
  _count?: {
    presents: number;
  };
};

interface ListListProps {
  lists?: ListWithStats[] | [];
  onAddPresent?: (listId: string) => void;
  onEdit?: (listId: string) => void;
  onDelete?: (listId: string) => void;
}

export const ListList = ({ lists = [], onAddPresent, onEdit, onDelete }: ListListProps) => {
  if (lists.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-sm mb-2">No tienes listas todavía</p>
        <p className="text-xs">Crea tu primera lista para comenzar</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lists.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          onAddPresent={onAddPresent}
          onEdit={onEdit}
          onDelete={onDelete}
        >
          <ListCard.Header />
          <ListCard.EventDate />
          <ListCard.Description />
          <ListCard.Stats />
          <ListCard.Actions />
        </ListCard>
      ))}
    </div>
  );
};
