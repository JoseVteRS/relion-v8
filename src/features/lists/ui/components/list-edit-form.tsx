"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Check, Eye, EyeOff, FolderOpen, Gift, Loader2, Plus, User, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { listUpdateSchema } from "../../schemas/list-schemas";
import {
  PresentMultiSelect,
  SelectedPresentsChips,
} from "./present-multi-select";

type FormValues = z.infer<typeof listUpdateSchema>;

type ListUpdateData = FormValues;

interface PresentOption {
  id: string;
  name: string;
  price?: number | null;
}

interface ListEditFormProps {
  onSubmit: (data: ListUpdateData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValues: {
    id: string;
    name: string;
    description?: string | null;
    dateEvent?: string | null;
    visibility: "public" | "private";
    isForMe: boolean;
  };
}

export const ListEditForm = ({
  onSubmit,
  onCancel,
  isLoading,
  initialValues,
}: ListEditFormProps) => {
  const [presentSelectOpen, setPresentSelectOpen] = useState(false);
  const [selectedPresents, setSelectedPresents] = useState<PresentOption[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(listUpdateSchema),
    defaultValues: {
      id: initialValues.id,
      name: initialValues.name,
      description: initialValues.description || "",
      dateEvent: initialValues.dateEvent || undefined,
      visibility: initialValues.visibility,
      isForMe: initialValues.isForMe,
      presentIds: [],
    },
  });

  // Parsear la fecha inicial correctamente
  const parseDateValue = (
    value: string | null | undefined
  ): Date | undefined => {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  };

  const handlePresentSelectionChange = (
    ids: string[],
    presents: PresentOption[]
  ) => {
    form.setValue("presentIds", ids);
    setSelectedPresents(presents);
  };

  const handleRemovePresent = (id: string) => {
    const newIds = (form.getValues("presentIds") || []).filter(
      (pid) => pid !== id
    );
    form.setValue("presentIds", newIds);
    setSelectedPresents((prev) => prev.filter((p) => p.id !== id));
  };

  const visibility = form.watch("visibility");
  const isForMe = form.watch("isForMe");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nombre de la lista */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  Nombre de la lista
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Navidad 2025, Mi cumpleaños, Boda..."
                    className="h-12 text-base"
                    {...field}
                    value={field.value || ""}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Descripción */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                  Descripción
                  <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Añade detalles sobre esta lista o instrucciones para quienes la vean..."
                    className="resize-none min-h-[80px]"
                    {...field}
                    value={field.value || ""}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha del evento */}
          <FormField
            control={form.control}
            name="dateEvent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <CalendarDays className="w-4 h-4" />
                  Fecha del evento
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    value={parseDateValue(field.value)}
                    onChange={(date) => {
                      field.onChange(date ? date.toISOString() : null);
                    }}
                    placeholder="Seleccionar fecha"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Visibilidad con toggle buttons */}
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                  Visibilidad
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => field.onChange("public")}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        visibility === "public"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Pública</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("private")}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        visibility === "private"
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Privada</span>
                    </button>
                  </div>
                </FormControl>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  {visibility === "public"
                    ? "Cualquiera con el enlace podrá ver esta lista"
                    : "Solo tú podrás ver esta lista"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ¿Es para ti? con toggle buttons */}
          <FormField
            control={form.control}
            name="isForMe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                  ¿Para quién es esta lista?
                </FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => field.onChange(true)}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        isForMe
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Para mí</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange(false)}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        !isForMe
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Para otra persona</span>
                    </button>
                  </div>
                </FormControl>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  {isForMe
                    ? "No podrás ver quién ha elegido cada regalo para mantener la sorpresa"
                    : "Podrás ver quién ha elegido cada regalo"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sección de regalos */}
          <FormField
            control={form.control}
            name="presentIds"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Gift className="w-4 h-4" />
                  Añadir más regalos
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    {selectedPresents.length > 0 ? (
                      <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                        <SelectedPresentsChips
                          presents={selectedPresents}
                          onRemove={handleRemovePresent}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-zinc-500 hover:text-zinc-700"
                          onClick={() => setPresentSelectOpen(true)}
                          disabled={isLoading}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Añadir más
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start h-11 text-zinc-500 dark:text-zinc-400 font-normal border-dashed"
                        onClick={() => setPresentSelectOpen(true)}
                        disabled={isLoading}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Buscar y añadir regalos existentes...
                      </Button>
                    )}
                  </div>
                </FormControl>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Añade regalos que ya tengas creados y no estén en otra lista
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botones de acción */}
          <div className="flex gap-3 pt-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 sm:flex-none sm:min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <PresentMultiSelect
        open={presentSelectOpen}
        onOpenChange={setPresentSelectOpen}
        selectedIds={form.watch("presentIds") || []}
        onSelectionChange={handlePresentSelectionChange}
      />
    </>
  );
};
