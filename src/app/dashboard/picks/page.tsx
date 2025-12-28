import { prefetchPicks } from "@/features/picks/server/prefetch";
import { PicksView } from "@/features/picks/ui/view/picks-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis reservas | Relion",
  description: "Regalos que has pillado o comprado",
};

export default async function Page() {
  await requireAuth();

  await prefetchPicks();

  return (
    <HydrateClient>
      <PicksView />
    </HydrateClient>
  );
}