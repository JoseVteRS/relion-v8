"use client";

import { ErrorBoundary } from "react-error-boundary";

import { Button } from "@/components/ui/button";
import { useModal } from "@/features/global/store/modal";
import { PlusIcon } from "lucide-react";
import React, { Suspense } from "react";
import { useSuspenseGetAllPresents } from "../../hooks/use-presents";
import { PresentCreateModal } from "../components/present-create-modal";
import { PresentList } from "../components/present-list";

export const PresentsView = () => {
  const { open } = useModal("present-create");
  const presents = useSuspenseGetAllPresents();

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
        fallback={<div className="text-white">Error loading presents</div>}
      >
        <Suspense
          fallback={<div className="text-white">Loading presents...</div>}
        >
          <PresentList presents={presents?.data ?? []} />
        </Suspense>
      </ErrorBoundary>

      <PresentCreateModal />
    </>
  );
};
