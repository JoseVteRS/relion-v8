"use client";

import { useModalState } from "@/features/global/store/modal";
import { Modal } from "@/features/global/ui/components/modal";
import { useCreateList } from "../../hooks/use-lists";
import { ListCreateForm } from "./list-create-form";

const MODAL_ID = "list-create";

export function ListCreateModal() {
  const [isOpen, setIsOpen] = useModalState(MODAL_ID);
  const createMutation = useCreateList();

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      title="Crear lista"
      description="Completa la información de la lista"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <ListCreateForm
        onSubmit={(data) => {
          createMutation.mutate(data, {
            onSuccess: handleSuccess,
          });
        }}
        onCancel={() => setIsOpen(false)}
        isLoading={createMutation.isPending}
      />
    </Modal>
  );
}

