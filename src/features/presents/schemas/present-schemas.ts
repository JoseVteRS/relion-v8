import { z } from "zod";


export const presentCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().optional(),
  link: z.string().optional(),
  listId: z.string().optional(),
  visibility: z.enum(["public", "private"]),
});



export const presentUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  listId: z.string().optional().nullable(),
  visibility: z.enum(["public", "private"]).optional().nullable(),
});