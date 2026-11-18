import { prisma } from "../../lib/prisma";
import { NotFound, Forbidden, CategoryHasTransactions } from "../../errors/AppError";
import { createCategorySchema, updateCategorySchema } from "./category.schema";

function withDerivedFields<T extends { transactions: { amount: number }[] }>(category: T) {
  const { transactions, ...rest } = category;
  return {
    ...rest,
    transactionsCount: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
  };
}

// Busca por id isolado (sem filtrar por userId) para distinguir "não existe" (NOT_FOUND)
// de "existe mas é de outro usuário" (FORBIDDEN) — ver 01-orquestrador.md §3.2.
async function assertOwnership(userId: string, id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw NotFound("Categoria não encontrada");
  if (category.userId !== userId) throw Forbidden("Esta categoria pertence a outro usuário");
  return category;
}

export async function listCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    include: { transactions: { select: { amount: true } } },
    orderBy: { createdAt: "asc" },
  });

  return categories.map(withDerivedFields);
}

export async function getCategory(userId: string, id: string) {
  await assertOwnership(userId, id);

  const category = await prisma.category.findUniqueOrThrow({
    where: { id },
    include: { transactions: { select: { amount: true } } },
  });

  return withDerivedFields(category);
}

export async function createCategory(userId: string, input: unknown) {
  const data = createCategorySchema.parse(input);

  const category = await prisma.category.create({
    data: { ...data, userId },
    include: { transactions: { select: { amount: true } } },
  });

  return withDerivedFields(category);
}

export async function updateCategory(userId: string, id: string, input: unknown) {
  const data = updateCategorySchema.parse(input);

  await assertOwnership(userId, id);

  const category = await prisma.category.update({
    where: { id },
    data,
    include: { transactions: { select: { amount: true } } },
  });

  return withDerivedFields(category);
}

export async function deleteCategory(userId: string, id: string) {
  await assertOwnership(userId, id);

  const withCount = await prisma.category.findUniqueOrThrow({
    where: { id },
    include: { _count: { select: { transactions: true } } },
  });

  if (withCount._count.transactions > 0) {
    throw CategoryHasTransactions();
  }

  await prisma.category.delete({ where: { id } });
  return true;
}
