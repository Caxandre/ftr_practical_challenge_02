import type { GraphQLContext } from "../../context";
import { Unauthenticated } from "../../errors/AppError";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../modules/category/category.service";

function requireAuth(ctx: GraphQLContext) {
  if (!ctx.userId) throw Unauthenticated();
  return ctx.userId;
}

export const categoryResolvers = {
  Query: {
    categories: (_: unknown, __: unknown, ctx: GraphQLContext) => listCategories(requireAuth(ctx)),
    category: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      getCategory(requireAuth(ctx), id),
  },
  Mutation: {
    createCategory: (_: unknown, { data }: { data: unknown }, ctx: GraphQLContext) =>
      createCategory(requireAuth(ctx), data),
    updateCategory: (_: unknown, { id, data }: { id: string; data: unknown }, ctx: GraphQLContext) =>
      updateCategory(requireAuth(ctx), id, data),
    deleteCategory: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      deleteCategory(requireAuth(ctx), id),
  },
};
