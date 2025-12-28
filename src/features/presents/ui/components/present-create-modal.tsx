"use client";

import { useModalState } from "@/features/global/store/modal";
import { Modal } from "@/features/global/ui/components/modal";
import { useCreatePresent } from "../../hooks/use-presents";
import { PresentCreateForm } from "./present-create-form";

const MODAL_ID = "present-create";

export function PresentCreateModal() {
  const [isOpen, setIsOpen] = useModalState(MODAL_ID);
  const createMutation = useCreatePresent();

  return (
    <Modal
      title="Crear regalo"
      description="Completa la información del regalo"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PresentCreateForm
        onSubmit={(data) => {
          createMutation.mutate(data);
        }}
        onCancel={() => setIsOpen(false)}
        isLoading={createMutation.isPending}
      />
    </Modal>
  );
}
