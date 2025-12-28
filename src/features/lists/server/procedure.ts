import prisma from "@/lib/db";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  listCreateSchema,
  listDeleteSchema,
  listUpdateSchema,
} from "../schemas/list-schemas";

export const listsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const lists = await prisma.list.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            presents: true,
          },
        },
      },
    });

    return lists;
  }),
  create: protectedProcedure
    .input(listCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const dateEvent = input.dateEvent
        ? new Date(input.dateEvent)
        : undefined;

      return prisma.$transaction(async (tx) => {
        const list = await tx.list.create({
          data: {
            name: input.name,
            description: input.description,
            dateEvent,
            visibility: input.visibility,
            isForMe: input.isForMe,
            userId: ctx.session.user.id,
          },
          include: {
            _count: {
              select: {
                presents: true,
              },
            },
          },
        });

        // Asignar regalos a la lista si se proporcionaron
        if (input.presentIds && input.presentIds.length > 0) {
          await tx.present.updateMany({
            where: {
              id: { in: input.presentIds },
              userId: ctx.session.user.id,
              listId: null, // Solo regalos sin asignar
            },
            data: {
              listId: list.id,
            },
          });
        }

        return list;
      });
    }),
  update: protectedProcedure
    .input(listUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const dateEvent = input.dateEvent
        ? new Date(input.dateEvent)
        : input.dateEvent === null
          ? null
          : undefined;

      return prisma.$transaction(async (tx) => {
        const list = await tx.list.update({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
          data: {
            name: input.name ?? undefined,
            description: input.description ?? undefined,
            dateEvent,
            visibility: input.visibility ?? undefined,
            isForMe: input.isForMe ?? undefined,
          },
          include: {
            _count: {
              select: {
                presents: true,
              },
            },
          },
        });

        // Asignar nuevos regalos a la lista si se proporcionaron
        if (input.presentIds && input.presentIds.length > 0) {
          await tx.present.updateMany({
            where: {
              id: { in: input.presentIds },
              userId: ctx.session.user.id,
              listId: null, // Solo regalos sin asignar
            },
            data: {
              listId: list.id,
            },
          });
        }

        return list;
      });
    }),
  delete: protectedProcedure
    .input(listDeleteSchema)
    .mutation(async ({ ctx, input }) => {
      await prisma.list.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      return { success: true };
    }),

  // Public procedure - no auth required
  getPublicById: baseProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ input }) => {
      const list = await prisma.list.findUnique({
        where: {
          id: input.listId,
          visibility: "public",
        },
        select: {
          id: true,
          name: true,
          description: true,
          dateEvent: true,
          isForMe: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          presents: {
            where: {
              visibility: "public",
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              link: true,
              status: true,
              picks: {
                select: {
                  id: true,
                  action: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!list) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lista no encontrada o es privada",
        });
      }

      return list;
    }),

  // Check if current user has favorited a list
  isFavorite: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .query(async ({ ctx, input }) => {
      const favorite = await prisma.favoriteList.findFirst({
        where: {
          listId: input.listId,
          userId: ctx.session.user.id,
        },
      });
      return !!favorite;
    }),

  // Toggle favorite status for a list
  toggleFavorite: protectedProcedure
    .input(z.object({ listId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await prisma.favoriteList.findFirst({
        where: {
          listId: input.listId,
          userId: ctx.session.user.id,
        },
      });

      if (existing) {
        await prisma.favoriteList.delete({
          where: { id: existing.id },
        });
        return { isFavorite: false };
      } else {
        await prisma.favoriteList.create({
          data: {
            listId: input.listId,
            userId: ctx.session.user.id,
          },
        });
        return { isFavorite: true };
      }
    }),
});

