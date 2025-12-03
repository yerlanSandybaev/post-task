import { initTRPC } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { connectDB } from '@/lib/db';

export async function createContext(_opts: CreateNextContextOptions) {
  // ensure DB is connected for each request
  await connectDB();
  return {};
}

type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
