import type { GraphQLContext } from "../../context";
import { Unauthenticated } from "../../errors/AppError";
import {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboard,
} from "../../modules/transaction/transaction.service";

function requireAuth(ctx: GraphQLContext) {
  if (!ctx.userId) throw Unauthenticated();
  return ctx.userId;
}

interface CategoryWithRelation {
  transactionsCount?: number;
  totalAmount?: number;
  transactions?: { amount: number }[];
}

export const transactionResolvers = {
  Query: {
    transactions: (
      _: unknown,
      args: { page?: number; perPage?: number; categoryId?: string; type?: "INCOME" | "EXPENSE" },
      ctx: GraphQLContext
    ) => listTransactions(requireAuth(ctx), args),
    transaction: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      getTransaction(requireAuth(ctx), id),
    dashboard: (_: unknown, __: unknown, ctx: GraphQLContext) => getDashboard(requireAuth(ctx)),
  },
  Mutation: {
    createTransaction: (_: unknown, { data }: { data: unknown }, ctx: GraphQLContext) =>
      createTransaction(requireAuth(ctx), data),
    updateTransaction: (
      _: unknown,
      { id, data }: { id: string; data: unknown },
      ctx: GraphQLContext
    ) => updateTransaction(requireAuth(ctx), id, data),
    deleteTransaction: (_: unknown, { id }: { id: string }, ctx: GraphQLContext) =>
      deleteTransaction(requireAuth(ctx), id),
  },
  Category: {
    transactionsCount: (parent: CategoryWithRelation) =>
      parent.transactionsCount ?? parent.transactions?.length ?? 0,
    totalAmount: (parent: CategoryWithRelation) =>
      parent.totalAmount ??
      parent.transactions?.reduce((sum, t) => sum + t.amount, 0) ??
      0,
  },
};
