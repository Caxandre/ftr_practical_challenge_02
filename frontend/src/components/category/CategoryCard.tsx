import { SquarePen, Trash } from "lucide-react";
import { IconButton, Tag } from "../ui";
import { getCategoryIcon, CATEGORY_COLOR_HEX } from "../../lib/categoryTaxonomy";
import type { Category } from "../../hooks/useCategories";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const Icon = getCategoryIcon(category.icon);
  const hex = CATEGORY_COLOR_HEX[category.color];

  return (
    <article className="category-card flex flex-col border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div
          className="category-card-icon flex items-center justify-center rounded-lg"
          style={{ backgroundColor: `${hex}1A`, color: hex }}
        >
          <Icon size={16} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="category-card-actions flex">
          <IconButton
            icon={Trash}
            variant="danger"
            className="category-card-action"
            aria-label="Excluir categoria"
            onClick={() => onDelete(category)}
          />
          <IconButton
            icon={SquarePen}
            className="category-card-action"
            aria-label="Editar categoria"
            onClick={() => onEdit(category)}
          />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold leading-5 text-gray-800">{category.name}</h3>
        {category.description && (
          <p className="category-card-description mt-1 text-xs leading-4 text-gray-500">{category.description}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <Tag color={category.color} label={category.name} />
        <span className="text-xs text-gray-500">
          {category.transactionsCount} {category.transactionsCount === 1 ? "item" : "itens"}
        </span>
      </div>
    </article>
  );
}
