import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { favoriteRemoveSchema } from "../schemas/favorite-schemas";

export const favoritesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const favorites = await prisma.favoriteList.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
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
            _count: {
              select: {
                presents: true,
              },
            },
          },
        },
      },
    });

    return favorites.map((favorite) => ({
      id: favorite.id,
      listId: favorite.listId,
      createdAt: favorite.createdAt.toISOString(),
      updatedAt: favorite.updatedAt.toISOString(),
      list: {
        id: favorite.list.id,
        name: favorite.list.name,
        description: favorite.list.description,
        visibility: favorite.list.visibility,
        dateEvent: favorite.list.dateEvent?.toISOString() ?? null,
        isForMe: favorite.list.isForMe,
        createdAt: favorite.list.createdAt.toISOString(),
        updatedAt: favorite.list.updatedAt.toISOString(),
        user: favorite.list.user,
        _count: favorite.list._count,
      },
    }));
  }),

  remove: protectedProcedure
    .input(favoriteRemoveSchema)
    .mutation(async ({ ctx, input }) => {
      const favorite = await prisma.favoriteList.findFirst({
        where: {
          listId: input.listId,
          userId: ctx.session.user.id,
        },
      });

      if (!favorite) {
        return { success: false };
      }

      await prisma.favoriteList.delete({
        where: { id: favorite.id },
      });

      return { success: true };
    }),
});

