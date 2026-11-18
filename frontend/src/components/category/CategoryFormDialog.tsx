import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client";
import { cn } from "../../lib/cn";
import { Dialog, Input, Button } from "../ui";
import { categorySchema, type CategoryFormValues } from "../../schemas/category.schema";
import {
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  CATEGORY_COLOR_HEX,
  CATEGORY_ICON_MAP,
} from "../../lib/categoryTaxonomy";
import { CREATE_CATEGORY_MUTATION, UPDATE_CATEGORY_MUTATION } from "../../graphql/mutations/category";
import { CATEGORIES_QUERY } from "../../graphql/queries/categories";
import { DASHBOARD_QUERY } from "../../graphql/queries/dashboard";
import type { Category } from "../../hooks/useCategories";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
}

export function CategoryFormDialog({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const isEditing = Boolean(category);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", color: "GREEN", icon: "shopping-cart" },
  });

  useEffect(() => {
    if (open) {
      reset(
        category
          ? {
              name: category.name,
              description: category.description ?? "",
              color: category.color,
              icon: category.icon as CategoryFormValues["icon"],
            }
          : { name: "", description: "", color: "GREEN", icon: "shopping-cart" }
      );
    }
  }, [open, category, reset]);

  const refetchQueries = [CATEGORIES_QUERY, DASHBOARD_QUERY];
  const [createCategory] = useMutation(CREATE_CATEGORY_MUTATION, { refetchQueries });
  const [updateCategory] = useMutation(UPDATE_CATEGORY_MUTATION, { refetchQueries });

  const color = watch("color");
  const icon = watch("icon");

  const onSubmit = async (values: CategoryFormValues) => {
    if (isEditing && category) {
      await updateCategory({ variables: { id: category.id, data: values } });
    } else {
      await createCategory({ variables: { data: values } });
    }
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Editar categoria" : "Nova categoria"}
      description={isEditing ? "Atualize os dados da categoria" : "Organize suas transações com categorias"}
      contentClassName="category-dialog"
    >
      <form className="category-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input label="Título" placeholder="Ex. Alimentação" error={errors.name?.message} {...register("name")} />

        <div>
          <Input
            label="Descrição"
            placeholder="Descrição da categoria"
            error={errors.description?.message}
            {...register("description")}
          />
          {!errors.description && <p className="category-optional-label mt-1.5 text-gray-500">Opcional</p>}
        </div>

        <div className="category-form-group">
          <span className="category-form-label font-medium text-gray-700">Ícone</span>
          <div className="category-icon-grid">
            {CATEGORY_ICONS.map((iconName) => {
              const Icon = CATEGORY_ICON_MAP[iconName];
              const selected = icon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setValue("icon", iconName)}
                  className={cn(
                    "category-icon-option flex items-center justify-center border transition-colors",
                    selected
                      ? "is-selected border-brand-base bg-brand-base/10 text-brand-base"
                      : "border-gray-200 text-gray-500 hover:bg-gray-100"
                  )}
                  aria-label={iconName}
                  aria-pressed={selected}
                >
                  <Icon size={16} aria-hidden />
                </button>
              );
            })}
          </div>
        </div>

        <div className="category-form-group">
          <span className="category-form-label font-medium text-gray-700">Cor</span>
          <div className="category-color-grid">
            {CATEGORY_COLORS.filter((colorName) => colorName !== "GRAY").map((colorName) => {
              const selected = color === colorName;
              return (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => setValue("color", colorName)}
                  className={cn("category-color-option", selected && "is-selected")}
                  style={{ backgroundColor: CATEGORY_COLOR_HEX[colorName] }}
                  aria-label={colorName}
                  aria-pressed={selected}
                />
              );
            })}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="category-save-button w-full">
          Salvar
        </Button>
      </form>
    </Dialog>
  );
}
