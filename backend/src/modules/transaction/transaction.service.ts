import { prisma } from "../../lib/prisma";
import { NotFound, Forbidden, ValidationError } from "../../errors/AppError";
import { createTransactionSchema, updateTransactionSchema } from "./transaction.schema";

async function assertCategoryOwnership(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) {
    throw ValidationError("Categoria inválida");
  }
}

// Busca por id isolado (sem filtrar por userId) para distinguir "não existe" (NOT_FOUND)
// de "existe mas é de outro usuário" (FORBIDDEN) — ver 01-orquestrador.md §3.2.
async function assertTransactionOwnership(userId: string, id: string) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  if (!transaction) throw NotFound("Transação não encontrada");
  if (transaction.userId !== userId) throw Forbidden("Esta transação pertence a outro usuário");
  return transaction;
}

export async function listTransactions(
  userId: string,
  params: { page?: number; perPage?: number; categoryId?: string | null; type?: "INCOME" | "EXPENSE" | null }
) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const perPage = params.perPage && params.perPage > 0 ? params.perPage : 10;

  const where = {
    userId,
    ...(params.categoryId ? { categoryId: params.categoryId } : {}),
    ...(params.type ? { type: params.type } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: { include: { transactions: { select: { amount: true } } } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.transaction.count({ where }),
  ]);

  return { items, total, page, perPage };
}

export async function getTransaction(userId: string, id: string) {
  await assertTransactionOwnership(userId, id);

  return prisma.transaction.findUniqueOrThrow({
    where: { id },
    include: { category: { include: { transactions: { select: { amount: true } } } } },
  });
}

export async function createTransaction(userId: string, input: unknown) {
  const data = createTransactionSchema.parse(input);
  await assertCategoryOwnership(userId, data.categoryId);

  const transaction = await prisma.transaction.create({
    data: { ...data, userId },
    include: { category: { include: { transactions: { select: { amount: true } } } } },
  });

  return transaction;
}

export async function updateTransaction(userId: string, id: string, input: unknown) {
  const data = updateTransactionSchema.parse(input);

  await assertTransactionOwnership(userId, id);

  if (data.categoryId) {
    await assertCategoryOwnership(userId, data.categoryId);
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data,
    include: { category: { include: { transactions: { select: { amount: true } } } } },
  });

  return transaction;
}

export async function deleteTransaction(userId: string, id: string) {
  await assertTransactionOwnership(userId, id);

  await prisma.transaction.delete({ where: { id } });
  return true;
}

export async function getDashboard(userId: string) {
  const transactions = await prisma.transaction.findMany({ where: { userId } });

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  let totalBalance = 0;
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  for (const t of transactions) {
    const signed = t.type === "INCOME" ? t.amount : -t.amount;
    totalBalance += signed;

    if (t.date >= monthStart && t.date < monthEnd) {
      if (t.type === "INCOME") monthlyIncome += t.amount;
      else monthlyExpense += t.amount;
    }
  }

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { category: { include: { transactions: { select: { amount: true } } } } },
    orderBy: { date: "desc" },
    take: 5,
  });

  return { totalBalance, monthlyIncome, monthlyExpense, recentTransactions };
}
