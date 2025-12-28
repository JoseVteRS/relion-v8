import { dashboardRouter } from '@/features/dashboard/server/procedure';
import { favoritesRouter } from '@/features/favorites/server/procedure';
import { listsRouter } from '@/features/lists/server/procedure';
import { picksRouter } from '@/features/picks/server/procedure';
import { presentsRouter } from '@/features/presents/server/procedure';
import { createTRPCRouter } from '../init';


export const appRouter = createTRPCRouter({
  presents: presentsRouter,
  lists: listsRouter,
  picks: picksRouter,
  favorites: favoritesRouter,
  dashboard: dashboardRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
