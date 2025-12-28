import { prefetchPublicList } from "@/features/lists/server/prefetch";
import { PublicListView } from "@/features/lists/ui/view/public-list-view";
import { HydrateClient } from "@/trpc/server";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    listId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { listId } = await params;
  return {
    title: `Lista de regalos`,
    description: `Ver lista de regalos compartida`,
  };
}

export default async function PublicListPage({ params }: PageProps) {
  const { listId } = await params;

  // Prefetch la lista para hidratación
  await prefetchPublicList(listId);

  return (
    <HydrateClient>
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <PublicListView listId={listId} />
      </main>
    </HydrateClient>
  );
}
