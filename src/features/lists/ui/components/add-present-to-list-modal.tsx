"use client";

import { Modal } from "@/features/global/ui/components/modal";
import { useCreatePresent } from "@/features/presents/hooks/use-presents";
import { PresentCreateForm } from "@/features/presents/ui/components/present-create-form";

interface AddPresentToListModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string | null;
  listName?: string;
}

export function AddPresentToListModal({
  isOpen,
  onOpenChange,
  listId,
  listName,
}: AddPresentToListModalProps) {
  const createMutation = useCreatePresent();

  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      title="Añadir regalo a la lista"
      description={listName ? `Añadir regalo a "${listName}"` : "Completa la información del regalo"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <PresentCreateForm
        onSubmit={(data) => {
          createMutation.mutate(data, {
            onSuccess: handleSuccess,
          });
        }}
        onCancel={() => onOpenChange(false)}
        isLoading={createMutation.isPending}
        initialValues={{
          listId: listId || undefined,
        }}
      />
    </Modal>
  );
}

