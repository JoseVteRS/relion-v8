"use client";

import { Modal } from "@/features/global/ui/components/modal";
import { useUpdateList } from "../../hooks/use-lists";
import { ListEditForm } from "./list-edit-form";

interface ListData {
  id: string;
  name: string;
  description?: string | null;
  dateEvent?: string | null;
  visibility: "public" | "private";
  isForMe: boolean;
}

interface ListEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  list: ListData | null;
}

export function ListEditModal({
  isOpen,
  onOpenChange,
  list,
}: ListEditModalProps) {
  const updateMutation = useUpdateList();

  const handleSuccess = () => {
    onOpenChange(false);
  };

  if (!list) {
    return null;
  }

  return (
    <Modal
      title="Editar lista"
      description="Modifica la información de la lista"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ListEditForm
        onSubmit={(data) => {
          updateMutation.mutate(data, {
            onSuccess: handleSuccess,
          });
        }}
        onCancel={() => onOpenChange(false)}
        isLoading={updateMutation.isPending}
        initialValues={list}
      />
    </Modal>
  );
}

