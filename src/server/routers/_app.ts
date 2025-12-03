import { router } from '@/server/trpc';
import { postsRouter } from '@/server/routers/posts';

export const appRouter = router({
  posts: postsRouter,
});

export type AppRouter = typeof appRouter;
