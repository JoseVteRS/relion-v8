"use client";

import { Button } from "@/components/ui/button";
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
import { Check, Euro, Eye, EyeOff, Gift, Link2, ListIcon, Loader2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { presentUpdateSchema } from "../../schemas/present-schemas";
import { ListSearchCommand } from "./list-search-command";

type FormValues = z.infer<typeof presentUpdateSchema>;

interface PresentEditFormProps {
  onSubmit: (data: FormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  initialValues: {
    id: string;
    name: string;
    description?: string | null;
    price?: number | null;
    link?: string | null;
    listId?: string | null;
    listName?: string | null;
    visibility: "public" | "private";
  };
}

export const PresentEditForm = ({
  onSubmit,
  onCancel,
  isLoading,
  initialValues,
}: PresentEditFormProps) => {
  const [listSearchOpen, setListSearchOpen] = useState(false);
  const [selectedListName, setSelectedListName] = useState<string | null>(
    initialValues.listName || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(presentUpdateSchema),
    defaultValues: {
      id: initialValues.id,
      name: initialValues.name,
      description: initialValues.description || "",
      price: initialValues.price
        ? (initialValues.price / 100).toFixed(2)
        : undefined,
      link: initialValues.link || "",
      listId: initialValues.listId || undefined,
      visibility: initialValues.visibility,
    },
  });

  const handleListSelect = (listId: string, listName: string) => {
    form.setValue("listId", listId);
    setSelectedListName(listName);
  };

  const handleClearList = () => {
    form.setValue("listId", null);
    setSelectedListName(null);
  };

  const visibility = form.watch("visibility");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección principal - Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Gift className="w-4 h-4 text-amber-500" />
                  Nombre del regalo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: PlayStation 5, Libro de cocina, Viaje a París..."
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
                    placeholder="Añade detalles como talla, color, modelo específico..."
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

          {/* Precio y Enlace en grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                    Precio
                    <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="pl-9"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(e.target.value || undefined)
                        }
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enlace del producto
                    <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <Input
                        type="url"
                        placeholder="https://amazon.es/..."
                        className="pl-9"
                        {...field}
                        value={field.value || ""}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                      onClick={() => field.onChange("private")}
                      disabled={isLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        visibility === "private"
                          ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      <EyeOff className="w-4 h-4" />
                      <span className="text-sm font-medium">Privado</span>
                    </button>
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
                      <span className="text-sm font-medium">Público</span>
                    </button>
                  </div>
                </FormControl>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  {visibility === "private"
                    ? "Solo tú podrás ver este regalo"
                    : "Cualquiera con el enlace de tu lista podrá verlo"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Selector de Lista */}
          <FormField
            control={form.control}
            name="listId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-zinc-500 dark:text-zinc-400">
                  Añadir a una lista
                  <span className="ml-1 text-xs text-zinc-400 dark:text-zinc-500">opcional</span>
                </FormLabel>
                <FormControl>
                  {selectedListName ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <ListIcon className="w-4 h-4 text-zinc-500" />
                      <span className="flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {selectedListName}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-zinc-500 hover:text-zinc-700"
                        onClick={handleClearList}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start h-11 text-zinc-500 dark:text-zinc-400 font-normal border-dashed"
                      onClick={() => setListSearchOpen(true)}
                      disabled={isLoading}
                    >
                      <ListIcon className="mr-2 h-4 w-4" />
                      Buscar y seleccionar lista...
                    </Button>
                  )}
                </FormControl>
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

      <ListSearchCommand
        open={listSearchOpen}
        onOpenChange={setListSearchOpen}
        onSelect={handleListSelect}
        selectedListId={form.watch("listId") || undefined}
      />
    </>
  );
};

