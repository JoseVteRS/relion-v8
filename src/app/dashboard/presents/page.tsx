import { prefetchGetAllPresents } from "@/features/presents/server/prefetch";
import { PresentsView } from "@/features/presents/ui/view/presents-view";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";

export default async function Page() {
  await requireAuth();

  await prefetchGetAllPresents();

  return (
    <HydrateClient>
      <PresentsView />
    </HydrateClient>
  );
}
