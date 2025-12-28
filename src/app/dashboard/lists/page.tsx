import { prefetchGetAllLists } from "@/features/lists/server/prefetch";
import { ListsView } from "@/features/lists/ui/view/lists-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

export default async function Page() {
    await requireAuth();

  await prefetchGetAllLists();

    return (
    <HydrateClient>
      <ListsView />
    </HydrateClient>
    );
}