import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const signInSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").optional(),
  email: z.string().trim().email("E-mail inválido").optional(),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres").optional(),
});
