import prisma from "@/lib/db";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

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
});
