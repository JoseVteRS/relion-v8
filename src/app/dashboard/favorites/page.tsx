import { prefetchFavorites } from "@/features/favorites/server/prefetch";
import { FavoriteListsView } from "@/features/favorites/ui/view/favorite-lists-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listas favoritas | Relion",
  description: "Tus listas favoritas guardadas",
};

export default async function Page() {
  await requireAuth();

  await prefetchFavorites();

  return (
    <HydrateClient>
      <FavoriteListsView />
    </HydrateClient>
  );
}