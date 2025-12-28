import { z } from "zod";

export const listCreateSchema = z.object({
  name: z.string({
    message: "El nombre es requerido",
  }).min(1, "El nombre es requerido"),
  description: z.string({
    message: "La descripción debe ser texto",
  }).optional(),
  dateEvent: z.string({
    message: "La fecha debe ser texto en formato ISO",
  }).optional(),
  visibility: z.enum(["public", "private"], {
    message: "La visibilidad es requerida",
  }),
  isForMe: z.boolean({
    message: "Indica si es para ti o para otra persona",
  }),
  presentIds: z.array(z.string()).optional(),
});

export const listUpdateSchema = z.object({
  id: z.string({
    message: "El ID es requerido",
  }),
  name: z.string({
    message: "El nombre debe ser texto",
  }).optional().nullable(),
  description: z.string({
    message: "La descripción debe ser texto",
  }).optional().nullable(),
  dateEvent: z.string({
    message: "La fecha debe ser texto en formato ISO",
  }).optional().nullable(),
  visibility: z.enum(["public", "private"], {
    message: "Visibilidad inválida",
  }).optional().nullable(),
  isForMe: z.boolean({
    message: "El valor debe ser verdadero o falso",
  }).optional().nullable(),
  presentIds: z.array(z.string()).optional(),
});

export const listDeleteSchema = z.object({
  id: z.string({
    message: "El ID es requerido",
  }),
});
