"use client";

import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import { useModal } from "@/features/global/store/modal";
import { PlusIcon } from "lucide-react";
import React, { Suspense, useState } from "react";
import {
  useDeletePresent,
  useSuspenseGetAllPresents,
} from "../../hooks/use-presents";
import { PresentCreateModal } from "../components/present-create-modal";
import { PresentEditModal } from "../components/present-edit-modal";
import { PresentList } from "../components/present-list";

type PresentWithList = {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  link?: string | null;
  listId?: string | null;
  visibility: "public" | "private";
  list?: { name: string } | null;
};

export const PresentsView = () => {
  const { open } = useModal("present-create");
  const presents = useSuspenseGetAllPresents();
  const deleteMutation = useDeletePresent();

  // Estado para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [presentToEdit, setPresentToEdit] = useState<PresentWithList | null>(
    null
  );

  const handleEdit = (presentId: string) => {
    const present = presents?.data?.find((p) => p.id === presentId);
    if (present) {
      setPresentToEdit(present);
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (presentId: string) => {
    await deleteMutation.mutateAsync(presentId);
  };

  return (
    <>
      <header className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-bold">Regalos</h1>
        <Button onClick={open}>
          <PlusIcon />
          Crear regalo
        </Button>
      </header>

      <ErrorBoundary
        fallback={
          <div className="text-center py-12">
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              Error al cargar los regalos
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Por favor, intenta recargar la página
            </p>
          </div>
        }
      >
        <Suspense
          fallback={
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              <p className="text-sm">Cargando regalos...</p>
            </div>
          }
        >
          <PresentList
            presents={presents?.data ?? []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>

      <PresentCreateModal />
      <PresentEditModal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        present={presentToEdit}
      />
    </>
  );
};
