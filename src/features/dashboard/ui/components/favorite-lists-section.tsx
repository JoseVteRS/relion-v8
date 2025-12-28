"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FavoriteList = {
  id: string;
  listId: string;
  createdAt: string;
  list: {
    id: string;
    name: string;
    description: string | null;
    dateEvent: string | null;
    visibility: string;
    isForMe: boolean;
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

interface FavoriteListsSectionProps {
  favoriteLists: FavoriteList[];
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function FavoriteListsSection({
  favoriteLists,
}: FavoriteListsSectionProps) {
  if (favoriteLists.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Listas favoritas
          </CardTitle>
          <CardDescription>
            No tienes listas favoritas todavía
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Listas favoritas
            </CardTitle>
            <CardDescription>
              {favoriteLists.length} lista{favoriteLists.length !== 1 ? "s" : ""} en favoritos
            </CardDescription>
          </div>
          <Link href="/dashboard/favorites">
            <Button variant="ghost" size="sm">
              Ver todas
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {favoriteLists.map((favorite) => (
            <Link
              key={favorite.id}
              href={`/lists/${favorite.listId}`}
              className="block"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={favorite.list.user.image || undefined}
                    alt={favorite.list.user.name}
                  />
                  <AvatarFallback className="text-xs bg-neutral-200 dark:bg-neutral-700">
                    {getInitials(favorite.list.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 truncate">
                    {favorite.list.name}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {favorite.list._count.presents} regalo
                    {favorite.list._count.presents !== 1 ? "s" : ""} •{" "}
                    {favorite.list.user.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

