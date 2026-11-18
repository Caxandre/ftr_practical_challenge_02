import { z } from "zod";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../utils/categoryTaxonomy";

export const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().optional().nullable(),
  color: z.enum(CATEGORY_COLORS, { errorMap: () => ({ message: "Cor inválida" }) }),
  icon: z.enum(CATEGORY_ICONS, { errorMap: () => ({ message: "Ícone inválido" }) }),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório").optional(),
  description: z.string().trim().optional().nullable(),
  color: z.enum(CATEGORY_COLORS, { errorMap: () => ({ message: "Cor inválida" }) }).optional(),
  icon: z.enum(CATEGORY_ICONS, { errorMap: () => ({ message: "Ícone inválido" }) }).optional(),
});
