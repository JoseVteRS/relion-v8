"use client";

import { Modal } from "@/features/global/ui/components/modal";
import { useUpdatePresent } from "../../hooks/use-presents";
import { PresentEditForm } from "./present-edit-form";

interface PresentWithList {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  link?: string | null;
  listId?: string | null;
  visibility: "public" | "private";
  list?: { name: string } | null;
}

interface PresentEditModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  present: PresentWithList | null;
}

export function PresentEditModal({
  isOpen,
  onOpenChange,
  present,
}: PresentEditModalProps) {
  const updateMutation = useUpdatePresent();

  if (!present) {
    return null;
  }

  return (
    <Modal
      title="Editar regalo"
      description="Actualiza la información del regalo"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <PresentEditForm
        initialValues={{
          id: present.id,
          name: present.name,
          description: present.description,
          price: present.price,
          link: present.link,
          listId: present.listId,
          listName: present.list?.name || null,
          visibility: present.visibility,
        }}
        onSubmit={(data) => {
          updateMutation.mutate(data, {
            onSuccess: () => onOpenChange(false),
          });
        }}
        onCancel={() => onOpenChange(false)}
        isLoading={updateMutation.isPending}
      />
    </Modal>
  );
}

