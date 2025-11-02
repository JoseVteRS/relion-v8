import { presentsRouter } from '@/features/presents/server/procedure';
import { createTRPCRouter } from '../init';


export const appRouter = createTRPCRouter({
  presents: presentsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;