import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { Plus, Tag as TagIcon, ArrowUpDown, type LucideIcon } from "lucide-react";
import { Button } from "../components/ui";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CategoryCard } from "../components/category/CategoryCard";
import { CategoryFormDialog } from "../components/category/CategoryFormDialog";
import { useCategories, type Category } from "../hooks/useCategories";
import { DELETE_CATEGORY_MUTATION } from "../graphql/mutations/category";
import { CATEGORIES_QUERY } from "../graphql/queries/categories";
import { DASHBOARD_QUERY } from "../graphql/queries/dashboard";
import { getCategoryIcon } from "../lib/categoryTaxonomy";

function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <article className="categories-stat-card flex items-center gap-4 border border-gray-200 bg-white px-5">
      <Icon size={18} strokeWidth={1.8} className={iconClassName} aria-hidden />
      <div>
        <p className="text-xl font-semibold leading-6 text-gray-800">{value}</p>
        <p className="categories-stat-label mt-1 font-medium uppercase text-gray-500">{label}</p>
      </div>
    </article>
  );
}

export function Categorias() {
  const { categories, loading, refetch } = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY_MUTATION, {
    refetchQueries: [CATEGORIES_QUERY, DASHBOARD_QUERY],
  });

  const stats = useMemo(() => {
    const totalTransactions = categories.reduce((sum, c) => sum + c.transactionsCount, 0);
    const mostUsed = categories.reduce<Category | null>(
      (top, c) => (!top || c.transactionsCount > top.transactionsCount ? c : top),
      null
    );
    return { totalCategories: categories.length, totalTransactions, mostUsed };
  }, [categories]);

  const openCreate = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategory) return;
    setError(null);
    try {
      await deleteCategory({ variables: { id: deletingCategory.id } });
      setDeletingCategory(null);
      refetch();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("vinculadas")
          ? err.message
          : "Não foi possível excluir a categoria.";
      setError(message);
      setDeletingCategory(null);
    }
  };

  const MostUsedIcon = stats.mostUsed ? getCategoryIcon(stats.mostUsed.icon) : TagIcon;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold leading-6 text-gray-800">Categorias</h1>
          <p className="mt-1 text-sm text-gray-500">Organize suas transações por categorias</p>
        </div>
        <Button onClick={openCreate} size="sm" className="categories-add-button">
          <Plus size={16} /> Nova categoria
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-feedback-danger">{error}</p>}

      <section className="categories-stats-grid mt-7" aria-label="Resumo de categorias">
        <StatCard
          label="Total de categorias"
          value={stats.totalCategories}
          icon={TagIcon}
          iconClassName="text-gray-700"
        />
        <StatCard
          label="Total de transações"
          value={stats.totalTransactions}
          icon={ArrowUpDown}
          iconClassName="text-purple-base"
        />
        <StatCard
          label="Categoria mais utilizada"
          value={stats.mostUsed?.name ?? "—"}
          icon={MostUsedIcon}
          iconClassName="text-blue-base"
        />
      </section>

      {loading ? (
        <p className="mt-5 py-10 text-center text-sm text-gray-500">Carregando…</p>
      ) : categories.length === 0 ? (
        <p className="mt-5 py-10 text-center text-sm text-gray-500">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <section className="categories-card-grid mt-5">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={openEdit}
              onDelete={(c) => setDeletingCategory(c)}
            />
          ))}
        </section>
      )}

      <CategoryFormDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editingCategory} />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${deletingCategory?.name}"? Categorias com transações vinculadas não podem ser excluídas.`}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
