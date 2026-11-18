import type { Request } from "express";
import { prisma } from "./lib/prisma";
import { getUserIdFromRequest } from "./middlewares/auth.middleware";

export interface GraphQLContext {
  userId: string | null;
  prisma: typeof prisma;
}

export async function createContext({ req }: { req: Request }): Promise<GraphQLContext> {
  return {
    userId: getUserIdFromRequest(req),
    prisma,
  };
}
