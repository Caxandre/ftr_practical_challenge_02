import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
  remember: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  email: z.string().trim().email("E-mail inválido"),
  password: z.union([z.literal(""), z.string().min(6, "Senha deve ter ao menos 6 caracteres")]).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
