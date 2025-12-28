import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const pickInputSchema = z.object({
  presentId: z.string(),
});

export const picksRouter = createTRPCRouter({
  // Pillar un regalo
  pick: protectedProcedure
    .input(pickInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verificar que el regalo existe y está libre
      const present = await prisma.present.findUnique({
        where: { id: input.presentId },
        include: {
          list: true,
          picks: true,
        },
      });

      if (!present) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Regalo no encontrado",
        });
      }

      // No puede pillar su propio regalo
      if (present.userId === userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No puedes pillar tu propio regalo",
        });
      }

      // Verificar si ya está pillado
      if (present.picks.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Este regalo ya ha sido pillado",
        });
      }

      // Crear el pick
      const pick = await prisma.pick.create({
        data: {
          presentId: input.presentId,
          userId,
          action: "picked",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Actualizar estado del regalo
      await prisma.present.update({
        where: { id: input.presentId },
        data: { status: "reserved" },
      });

      return pick;
    }),

  // Soltar un regalo
  release: protectedProcedure
    .input(pickInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verificar que el pick existe y es del usuario
      const pick = await prisma.pick.findFirst({
        where: {
          presentId: input.presentId,
          userId,
        },
      });

      if (!pick) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No has pillado este regalo",
        });
      }

      // Si ya está comprado, no se puede soltar
      if (pick.action === "purchased") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No puedes soltar un regalo ya comprado",
        });
      }

      // Eliminar el pick
      await prisma.pick.delete({
        where: { id: pick.id },
      });

      // Actualizar estado del regalo a libre
      await prisma.present.update({
        where: { id: input.presentId },
        data: { status: "free" },
      });

      return { success: true };
    }),

  // Marcar como comprado
  purchase: protectedProcedure
    .input(pickInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Verificar que el pick existe y es del usuario
      const pick = await prisma.pick.findFirst({
        where: {
          presentId: input.presentId,
          userId,
        },
      });

      if (!pick) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Primero debes pillar este regalo",
        });
      }

      // Actualizar el pick a purchased
      const updatedPick = await prisma.pick.update({
        where: { id: pick.id },
        data: { action: "purchased" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Actualizar estado del regalo
      await prisma.present.update({
        where: { id: input.presentId },
        data: { status: "purchased" },
      });

      return updatedPick;
    }),

  // Obtener todos los picks del usuario
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const picks = await prisma.pick.findMany({
      where: {
        userId,
      },
      include: {
        present: {
          include: {
            list: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Separar en picked y purchased
    const picked: typeof picks = [];
    const purchased: typeof picks = [];

    for (const pick of picks) {
      if (pick.action === "purchased") {
        purchased.push(pick);
      } else {
        // Incluye "picked" y "reserved"
        picked.push(pick);
      }
    }

    // Ordenar picked por fecha del evento (más próximo primero), nulls al final
    picked.sort((a, b) => {
      const dateA = a.present.list?.dateEvent;
      const dateB = b.present.list?.dateEvent;

      // Si ambos tienen fecha, ordenar ASC
      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      }
      // Si solo A tiene fecha, va primero
      if (dateA && !dateB) {
        return -1;
      }
      // Si solo B tiene fecha, va primero
      if (!dateA && dateB) {
        return 1;
      }
      // Si ninguno tiene fecha, mantener orden original
      return 0;
    });

    // Ordenar purchased por createdAt DESC (más reciente primero)
    purchased.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Formatear respuesta
    const formatPick = (pick: typeof picks[0]) => ({
      id: pick.id,
      presentId: pick.presentId,
      action: pick.action,
      createdAt: pick.createdAt.toISOString(),
      updatedAt: pick.updatedAt.toISOString(),
      present: {
        id: pick.present.id,
        name: pick.present.name,
        description: pick.present.description,
        price: pick.present.price,
        link: pick.present.link,
        status: pick.present.status,
        visibility: pick.present.visibility,
        createdAt: pick.present.createdAt.toISOString(),
        updatedAt: pick.present.updatedAt.toISOString(),
        user: pick.present.user,
        list: pick.present.list
          ? {
              id: pick.present.list.id,
              name: pick.present.list.name,
              description: pick.present.list.description,
              visibility: pick.present.list.visibility,
              dateEvent: pick.present.list.dateEvent?.toISOString() ?? null,
              isForMe: pick.present.list.isForMe,
              createdAt: pick.present.list.createdAt.toISOString(),
              updatedAt: pick.present.list.updatedAt.toISOString(),
              user: pick.present.list.user,
            }
          : null,
      },
    });

    return {
      picked: picked.map(formatPick),
      purchased: purchased.map(formatPick),
    };
  }),
});

