import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  description: z.string().trim().min(1, "Descrição é obrigatória"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => Number.parseFloat(v.replace(",", ".")) > 0, "Valor deve ser maior que zero"),
  date: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
