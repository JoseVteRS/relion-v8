import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";

// Cache global de atoms por ID del modal
const modalAtoms = new Map<string, ReturnType<typeof atom<boolean>>>();

// Obtiene o crea el atom para un modal por ID
function getModalAtom(id: string) {
  if (!modalAtoms.has(id)) {
    modalAtoms.set(id, atom(false));
  }
  return modalAtoms.get(id)!;
}

/**
 * Hook para abrir/cerrar sin re-render del componente que lo usa
 */
export function useModal(id: string) {
  const setIsOpen = useSetAtom(getModalAtom(id));

  const open = useCallback(() => setIsOpen(true), [setIsOpen]);
  const close = useCallback(() => setIsOpen(false), [setIsOpen]);
  const toggle = useCallback(() => setIsOpen((p) => !p), [setIsOpen]);

  return { open, close, toggle };
}

/**
 * Hook para la UI del modal (lee el estado)
 */
export function useModalState(id: string) {
  return useAtom(getModalAtom(id));
}
