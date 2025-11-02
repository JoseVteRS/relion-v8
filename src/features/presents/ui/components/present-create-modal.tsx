"use client";

import { useModalState } from "@/features/global/store/modal";
import { Modal } from "@/features/global/ui/components/modal";
import { PresentCreateForm } from "./present-create-form";

const MODAL_ID = "present-create";

interface PresentCreateModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PresentCreateModal() {
  const [isOpen, setIsOpen] = useModalState(MODAL_ID);

  return (
    <Modal
      title="Crear regalo"
      description="Completa la información del regalo"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <PresentCreateForm />
    </Modal>
  );
}
