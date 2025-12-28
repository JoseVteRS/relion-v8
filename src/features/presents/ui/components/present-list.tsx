"use client";

import { List, Present } from "@/generated/prisma/client";
import { useConfirm } from "@/hooks/use-confirm";
import { PresentCard } from "./present-card";

type PresentWithListName = Omit<Present, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
  list: Pick<List, "name"> | null;
};

interface PresentListProps {
  presents?: PresentWithListName[] | [];
  onEdit?: (presentId: string) => void;
  onDelete?: (presentId: string) => Promise<void>;
}

export const PresentList = ({
  presents = [],
  onEdit,
  onDelete,
}: PresentListProps) => {
  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    "¿Estás seguro de querer eliminar este regalo?",
    "Esta acción no se puede deshacer"
  );

  if (presents.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p className="text-sm">No hay regalos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <ConfirmDeleteDialog />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {presents.map((present) => (
          <PresentCard key={present.id} present={present}>
            <PresentCard.Header />
            <PresentCard.Description />
            <PresentCard.Metadata />
            <div className="flex items-center gap-2 mt-3">
              <PresentCard.Link />
              <div className="ml-auto">
                <PresentCard.Actions
                  onEdit={onEdit}
                  onDelete={async (id) => {
                    const confirmed = await confirmDelete();
                    if (confirmed) {
                      await onDelete?.(id);
                    }
                  }}
                />
              </div>
            </div>
          </PresentCard>
        ))}
      </div>
    </>
  );
};
