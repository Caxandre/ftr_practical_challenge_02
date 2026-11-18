import { z } from "zod";

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1, "Descrição é obrigatória"),
  amount: z.number().int().positive("Valor deve ser maior que zero"),
  type: z.enum(["INCOME", "EXPENSE"], { errorMap: () => ({ message: "Tipo inválido" }) }),
  date: z.coerce.date(),
  categoryId: z.string().trim().min(1, "Categoria é obrigatória"),
});

export const updateTransactionSchema = z.object({
  description: z.string().trim().min(1, "Descrição é obrigatória").optional(),
  amount: z.number().int().positive("Valor deve ser maior que zero").optional(),
  type: z.enum(["INCOME", "EXPENSE"], { errorMap: () => ({ message: "Tipo inválido" }) }).optional(),
  date: z.coerce.date().optional(),
  categoryId: z.string().trim().min(1, "Categoria é obrigatória").optional(),
});
