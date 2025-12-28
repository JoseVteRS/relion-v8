"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useGetAllLists } from "@/features/lists/hooks/use-lists";
import { Check, FolderOpen, Gift, Loader2, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

interface ListSearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (listId: string, listName: string) => void;
  selectedListId?: string;
}

export function ListSearchCommand({
  open,
  onOpenChange,
  onSelect,
  selectedListId,
}: ListSearchCommandProps) {
  const router = useRouter();
  const { data: lists, isLoading } = useGetAllLists();
  const [search, setSearch] = useState("");

  const filteredLists = useMemo(() => {
    if (!lists) return [];
    if (!search) return lists;
    return lists.filter((list) =>
      list.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [lists, search]);

  const handleSelect = (listId: string, listName: string) => {
    onSelect(listId, listName);
    onOpenChange(false);
    setSearch("");
  };

  const handleCreateList = () => {
    onOpenChange(false);
    setSearch("");
    router.push("/dashboard/lists?create=true");
  };

  return (
    <ResponsiveDialog
      title="Añadir a una lista"
      description="Selecciona dónde guardar este regalo"
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) setSearch("");
      }}
    >
      <Command className="rounded-xl border-0" shouldFilter={false}>
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <CommandInput
            placeholder="Buscar lista por nombre..."
            value={search}
            onValueChange={setSearch}
            className="pl-10 h-12 border-0 border-b border-zinc-100 dark:border-zinc-800 rounded-none focus:ring-0"
          />
        </div>

        <CommandList className="max-h-[300px] p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              <p className="text-sm text-zinc-500">Cargando tus listas...</p>
            </div>
          ) : filteredLists.length === 0 ? (
            <CommandEmpty className="py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {search ? "No se encontraron listas" : "No tienes listas aún"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    {search ? "Prueba con otro nombre" : "Crea tu primera lista para organizar tus regalos"}
                  </p>
                </div>
                <button
                  onClick={handleCreateList}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Crear nueva lista
                </button>
              </div>
            </CommandEmpty>
          ) : (
            <>
              <CommandGroup>
                <p className="px-2 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  Tus listas ({filteredLists.length})
                </p>
                {filteredLists.map((list) => {
                  const isSelected = selectedListId === list.id;
                  return (
                    <CommandItem
                      key={list.id}
                      value={list.id}
                      onSelect={() => handleSelect(list.id, list.name)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors my-1 ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-emerald-100 dark:bg-emerald-900/40"
                          : "bg-zinc-100 dark:bg-zinc-800"
                      }`}>
                        <FolderOpen className={`w-4 h-4 ${
                          isSelected
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-500 dark:text-zinc-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isSelected
                            ? "text-emerald-700 dark:text-emerald-300"
                            : "text-zinc-700 dark:text-zinc-200"
                        }`}>
                          {list.name}
                        </p>
                        {list._count?.presents !== undefined && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Gift className="w-3 h-3" />
                            {list._count.presents} {list._count.presents === 1 ? "regalo" : "regalos"}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {/* Create new list button */}
              <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleCreateList}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                    <Plus className="w-4 h-4 text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Crear nueva lista
                  </span>
                </button>
              </div>
            </>
          )}
        </CommandList>
      </Command>
    </ResponsiveDialog>
  );
}

