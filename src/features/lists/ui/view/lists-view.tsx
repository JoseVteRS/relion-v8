"use client";

import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import { useModal } from "@/features/global/store/modal";
import { useConfirm } from "@/hooks/use-confirm";
import { PlusIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useDeleteList, useSuspenseGetAllLists } from "../../hooks/use-lists";
import { AddPresentToListModal } from "../components/add-present-to-list-modal";
import { ListCreateModal } from "../components/list-create-modal";
import { ListEditModal } from "../components/list-edit-modal";
import { ListList } from "../components/list-list";

interface ListForEdit {
  id: string;
  name: string;
  description?: string | null;
  dateEvent?: string | null;
  visibility: "public" | "private";
  isForMe: boolean;
}

export const ListsView = () => {
  const { open } = useModal("list-create");
  const lists = useSuspenseGetAllLists();
  const deleteMutation = useDeleteList();
  const searchParams = useSearchParams();

  // Abrir modal de crear si viene de la búsqueda de listas
  useEffect(() => {
    if (searchParams.get("create") === "true") {
      open();
      // Limpiar el parámetro de la URL
      window.history.replaceState({}, "", "/dashboard/lists");
    }
  }, [searchParams, open]);

  // Estado para el modal de añadir regalo
  const [addPresentModalOpen, setAddPresentModalOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [selectedListName, setSelectedListName] = useState<string | undefined>(undefined);

  // Estado para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<ListForEdit | null>(null);

  // Diálogo de confirmación para eliminar
  const [ConfirmDeleteDialog, confirmDelete] = useConfirm(
    "¿Estás seguro de querer eliminar esta lista?",
    "Esta acción no se puede deshacer. Todos los regalos asociados perderán su lista."
  );

  const handleAddPresent = (listId: string) => {
    const list = lists?.data?.find((l) => l.id === listId);
    setSelectedListId(listId);
    setSelectedListName(list?.name);
    setAddPresentModalOpen(true);
  };

  const handleEdit = (listId: string) => {
    const list = lists?.data?.find((l) => l.id === listId);
    if (list) {
      setListToEdit({
        id: list.id,
        name: list.name,
        description: list.description,
        dateEvent: list.dateEvent
          ? list.dateEvent instanceof Date
            ? list.dateEvent.toISOString()
            : list.dateEvent
          : null,
        visibility: list.visibility,
        isForMe: list.isForMe,
      });
      setEditModalOpen(true);
    }
  };

  const handleDelete = async (listId: string) => {
    const confirmed = await confirmDelete();
    if (confirmed) {
      deleteMutation.mutate({ id: listId });
    }
  };

  return (
    <>
      <ConfirmDeleteDialog />
      <header className="flex items-center justify-between py-5">
        <h1 className="text-2xl font-bold">Listas</h1>
        <Button onClick={open}>
          <PlusIcon />
          Crear lista
        </Button>
      </header>

      <ErrorBoundary
        fallback={
          <div className="text-center py-12">
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              Error al cargar las listas
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
              <p className="text-sm">Cargando listas...</p>
            </div>
          }
        >
          <ListList 
            lists={lists?.data ?? []} 
            onAddPresent={handleAddPresent}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Suspense>
      </ErrorBoundary>

      <ListCreateModal />
      <AddPresentToListModal
        isOpen={addPresentModalOpen}
        onOpenChange={setAddPresentModalOpen}
        listId={selectedListId}
        listName={selectedListName}
      />
      <ListEditModal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        list={listToEdit}
      />
    </>
  );
};
