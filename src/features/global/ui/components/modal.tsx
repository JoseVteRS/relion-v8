"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";

type ModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
};

export function Modal({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
}: ModalProps) {
  return (
    <ResponsiveDialog
      title={title ?? ""}
      description={description ?? ""}
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </ResponsiveDialog>
  );
}
