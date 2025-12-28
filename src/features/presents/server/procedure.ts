import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import {
  presentCreateSchema,
  presentUpdateSchema,
} from "../schemas/present-schemas";
import { priceToCents } from "../utils/price";

export const presentsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const presents = await prisma.present.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        list: {
          select: {
            name: true,
          },
        },
      },
    });

    return presents;
  }),

  getUnassigned: protectedProcedure.query(async ({ ctx }) => {
    const presents = await prisma.present.findMany({
      where: {
        userId: ctx.session.user.id,
        listId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return presents;
  }),
  create: protectedProcedure
    .input(presentCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const present = await prisma.present.create({
        data: {
          name: input.name,
          description: input.description,
          link: input.link,
          listId: input.listId,
          visibility: input.visibility,
          price: priceToCents(input.price),
          userId: ctx.session.user.id,
        },
      });
      return present;
    }),

  update: protectedProcedure
    .input(presentUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const present = await prisma.present.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          name: input.name ?? undefined,
          description: input.description ?? undefined,
          price: priceToCents(input.price),
          link: input.link ?? undefined,
          listId: input.listId ?? undefined,
          visibility: input.visibility ?? undefined,
        },
      });
      return present;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const present = await prisma.present.delete({
        where: {
          id,
          userId: ctx.session.user.id,
        },
      });
      return present;
    }),
});
