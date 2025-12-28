"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListCard } from "@/features/lists/ui/components/list-card";
import { useRemoveFavorite } from "../../hooks/use-favorites";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

type FavoriteListData = {
  id: string;
  listId: string;
  createdAt: string;
  updatedAt: string;
  list: {
    id: string;
    name: string;
    description: string | null;
    visibility: "public" | "private";
    dateEvent: string | null;
    isForMe: boolean;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    _count: {
      presents: number;
    };
  };
};

interface FavoriteListCardProps {
  favorite: FavoriteListData;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const FavoriteListCard = memo(function FavoriteListCard({
  favorite,
}: FavoriteListCardProps) {
  const removeFavoriteMutation = useRemoveFavorite();

  const handleRemoveFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavoriteMutation.mutate({ listId: favorite.listId });
  };

  const list = favorite.list;

  return (
    <Link href={`/lists/${list.id}`} className="block">
      <ListCard list={list}>
        <div className="p-5 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={list.user.image || undefined} alt={list.user.name} />
              <AvatarFallback className="text-[10px] bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                {getInitials(list.user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Lista de <span className="font-medium text-zinc-700 dark:text-zinc-300">{list.user.name}</span>
            </span>
          </div>
        </div>
        <ListCard.Header />
        <ListCard.EventDate />
        <ListCard.Description />
        <ListCard.Stats />
        <div className="px-5 pb-5 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFavorite}
            disabled={removeFavoriteMutation.isPending}
            className="w-full gap-2 text-zinc-500 hover:text-rose-500 dark:text-zinc-400 dark:hover:text-rose-400"
          >
            {removeFavoriteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            )}
            Quitar de favoritos
          </Button>
        </div>
      </ListCard>
    </Link>
  );
});

