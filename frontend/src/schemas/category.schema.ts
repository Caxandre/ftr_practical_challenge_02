import { z } from "zod";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../lib/categoryTaxonomy";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  description: z.string().trim().optional(),
  color: z.enum(CATEGORY_COLORS),
  icon: z.enum(CATEGORY_ICONS),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
