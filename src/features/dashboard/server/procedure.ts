import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const dashboardRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const now = new Date();

    // Ejecutar todas las queries en paralelo para optimizar
    const [
      pickedPresents,
      purchasedPresents,
      purchasedForTotal,
      favoriteLists,
    ] = await Promise.all([
      // Últimos 5 regalos pillados (picked o reserved)
      prisma.pick.findMany({
        where: {
          userId,
          action: {
            in: ["picked", "reserved"],
          },
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          presentId: true,
          action: true,
          createdAt: true,
          updatedAt: true,
          present: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              link: true,
              status: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              list: {
                select: {
                  id: true,
                  name: true,
                  dateEvent: true,
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
          },
        },
      }),

      // Últimos 5 regalos comprados
      prisma.pick.findMany({
        where: {
          userId,
          action: "purchased",
        },
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          presentId: true,
          action: true,
          createdAt: true,
          updatedAt: true,
          present: {
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              link: true,
              status: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              list: {
                select: {
                  id: true,
                  name: true,
                  dateEvent: true,
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
          },
        },
      }),

      // Total gastado (solo regalos comprados con price > 0)
      prisma.pick.findMany({
        where: {
          userId,
          action: "purchased",
          present: {
            price: {
              gt: 0,
            },
          },
        },
        select: {
          present: {
            select: {
              price: true,
            },
          },
        },
      }),

      // Listas favoritas
      prisma.favoriteList.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          listId: true,
          createdAt: true,
          list: {
            select: {
              id: true,
              name: true,
              description: true,
              dateEvent: true,
              visibility: true,
              isForMe: true,
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
      }),
    ]);

    // Calcular total gastado
    const totalSpent = purchasedForTotal.reduce(
      (sum, pick) => sum + pick.present.price,
      0
    );

    // Filtrar próximos eventos (solo listas favoritas con dateEvent futuro)
    const upcomingEvents = favoriteLists
      .filter((fav) => {
        const dateEvent = fav.list.dateEvent;
        return dateEvent && new Date(dateEvent) >= now;
      })
      .sort((a, b) => {
        const dateA = a.list.dateEvent ? new Date(a.list.dateEvent).getTime() : 0;
        const dateB = b.list.dateEvent ? new Date(b.list.dateEvent).getTime() : 0;
        return dateA - dateB;
      })
      .map((fav) => ({
        id: fav.id,
        listId: fav.listId,
        createdAt: fav.createdAt.toISOString(),
        list: {
          id: fav.list.id,
          name: fav.list.name,
          description: fav.list.description,
          dateEvent: fav.list.dateEvent?.toISOString() ?? null,
          visibility: fav.list.visibility,
          isForMe: fav.list.isForMe,
          user: fav.list.user,
          _count: fav.list._count,
        },
      }));

    // Formatear respuesta
    const formatPick = (pick: (typeof pickedPresents)[0] | (typeof purchasedPresents)[0]) => ({
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
        createdAt: pick.present.createdAt.toISOString(),
        user: pick.present.user,
        list: pick.present.list
          ? {
              id: pick.present.list.id,
              name: pick.present.list.name,
              dateEvent: pick.present.list.dateEvent?.toISOString() ?? null,
              user: pick.present.list.user,
            }
          : null,
      },
    });

    return {
      pickedPresents: pickedPresents.map(formatPick),
      purchasedPresents: purchasedPresents.map(formatPick),
      totalSpent,
      favoriteLists: favoriteLists.map((fav) => ({
        id: fav.id,
        listId: fav.listId,
        createdAt: fav.createdAt.toISOString(),
        list: {
          id: fav.list.id,
          name: fav.list.name,
          description: fav.list.description,
          dateEvent: fav.list.dateEvent?.toISOString() ?? null,
          visibility: fav.list.visibility,
          isForMe: fav.list.isForMe,
          user: fav.list.user,
          _count: fav.list._count,
        },
      })),
      upcomingEvents,
    };
  }),
});
