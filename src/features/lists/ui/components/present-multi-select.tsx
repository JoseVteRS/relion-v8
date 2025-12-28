"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { useGetUnassignedPresents } from "@/features/presents/hooks/use-presents";
import { Check, Gift, X } from "lucide-react";
import { useMemo, useState } from "react";

interface PresentOption {
  id: string;
  name: string;
  price?: number | null;
}

interface PresentMultiSelectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[], presents: PresentOption[]) => void;
}

export function PresentMultiSelect({
  open,
  onOpenChange,
  selectedIds,
  onSelectionChange,
}: PresentMultiSelectProps) {
  const { data: presents, isLoading } = useGetUnassignedPresents();
  const [search, setSearch] = useState("");
  const [localSelection, setLocalSelection] = useState<string[]>(selectedIds);

  // Sync local selection when opening
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSelection(selectedIds);
    }
    onOpenChange(isOpen);
    if (!isOpen) setSearch("");
  };

  const filteredPresents = useMemo(() => {
    if (!presents) return [];
    if (!search) return presents;
    return presents.filter((present) =>
      present.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [presents, search]);

  const toggleSelection = (presentId: string) => {
    setLocalSelection((prev) =>
      prev.includes(presentId)
        ? prev.filter((id) => id !== presentId)
        : [...prev, presentId]
    );
  };

  const handleConfirm = () => {
    const selectedPresents = presents?.filter((p) =>
      localSelection.includes(p.id)
    ) || [];
    onSelectionChange(localSelection, selectedPresents);
    onOpenChange(false);
    setSearch("");
  };

  const handleClear = () => {
    setLocalSelection([]);
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(price / 100);
  };

  return (
    <ResponsiveDialog
      title="Añadir regalos"
      description="Selecciona los regalos que quieres añadir a esta lista"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <div className="flex flex-col h-full max-h-[70vh]">
        {/* Selected count header */}
        {localSelection.length > 0 && (
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/50">
            <span className="text-sm font-medium">
              {localSelection.length} regalo{localSelection.length !== 1 ? "s" : ""} seleccionado{localSelection.length !== 1 ? "s" : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-7 text-xs"
            >
              Limpiar
            </Button>
          </div>
        )}

        <Command className="rounded-none border-0" shouldFilter={false}>
          <CommandInput
            placeholder="Buscar regalo..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[40vh]">
            {isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Cargando regalos...
              </div>
            ) : filteredPresents.length === 0 ? (
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-4">
                  <Gift className="h-8 w-8 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No hay regalos disponibles
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Crea regalos primero o desasígnalos de otras listas
                  </p>
                </div>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredPresents.map((present) => {
                  const isSelected = localSelection.includes(present.id);
                  return (
                    <CommandItem
                      key={present.id}
                      value={present.id}
                      onSelect={() => toggleSelection(present.id)}
                      className="flex items-center gap-3 py-3"
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-input"
                        }`}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{present.name}</p>
                        {present.price && (
                          <p className="text-xs text-muted-foreground">
                            {formatPrice(present.price)}
                          </p>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>

        {/* Action buttons - fixed at bottom */}
        <div className="flex gap-2 p-3 border-t mt-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={localSelection.length === 0}
          >
            Añadir {localSelection.length > 0 && `(${localSelection.length})`}
          </Button>
        </div>
      </div>
    </ResponsiveDialog>
  );
}

// Componente para mostrar los regalos seleccionados como chips
interface SelectedPresentsChipsProps {
  presents: PresentOption[];
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function SelectedPresentsChips({
  presents,
  onRemove,
  disabled,
}: SelectedPresentsChipsProps) {
  if (presents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {presents.map((present) => (
        <Badge
          key={present.id}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          <span className="truncate max-w-[150px]">{present.name}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => onRemove(present.id)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Quitar {present.name}</span>
            </button>
          )}
        </Badge>
      ))}
    </div>
  );
}

