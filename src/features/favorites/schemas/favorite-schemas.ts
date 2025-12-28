import { z } from "zod";

export const favoriteRemoveSchema = z.object({
  listId: z.string({
    message: "El ID de la lista es requerido",
  }),
});

