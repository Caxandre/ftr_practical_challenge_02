import bcrypt from "bcryptjs";
import type { GraphQLContext } from "../../context";
import { signUp, signIn } from "../../modules/auth/auth.service";
import { updateProfileSchema } from "../../modules/auth/auth.schema";
import { Unauthenticated, ValidationError, NotFound } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
      if (!ctx.userId) throw Unauthenticated();
      const user = await prisma.user.findUnique({ where: { id: ctx.userId } });
      if (!user) throw NotFound("Usuário não encontrado");
      return user;
    },
  },
  Mutation: {
    signUp: async (_: unknown, { data }: { data: unknown }) => signUp(data),
    signIn: async (_: unknown, { data }: { data: unknown }) => signIn(data),
    updateProfile: async (_: unknown, { data }: { data: unknown }, ctx: GraphQLContext) => {
      if (!ctx.userId) throw Unauthenticated();
      const parsed = updateProfileSchema.parse(data);

      if (parsed.email) {
        const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
        if (existing && existing.id !== ctx.userId) {
          throw ValidationError("E-mail já cadastrado");
        }
      }

      const updateData: Record<string, unknown> = {};
      if (parsed.name) updateData.name = parsed.name;
      if (parsed.email) updateData.email = parsed.email;
      if (parsed.password) updateData.passwordHash = await bcrypt.hash(parsed.password, 10);

      return prisma.user.update({ where: { id: ctx.userId }, data: updateData });
    },
  },
};
