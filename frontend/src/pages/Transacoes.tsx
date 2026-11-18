import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { Plus, Search } from "lucide-react";
import { Button, FilterSelect, Input, Pagination } from "../components/ui";
import { TransactionTable } from "../components/transaction/TransactionTable";
import { TransactionFormDialog } from "../components/transaction/TransactionFormDialog";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useTransactions, type Transaction } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";
import { DELETE_TRANSACTION_MUTATION } from "../graphql/mutations/transaction";
import { DASHBOARD_QUERY } from "../graphql/queries/dashboard";
import { CATEGORIES_QUERY } from "../graphql/queries/categories";
import { TRANSACTIONS_QUERY } from "../graphql/queries/transactions";

function formatPeriod(value: string) {
  const [year, month] = value.split("-").map(Number);
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
  return label.charAt(0).toUpperCase() + label.slice(1).replace(" de ", " / ");
}

export function Transacoes() {
  const [page, setPage] = useState(1);
  const { transactions, total, perPage, loading, refetch } = useTransactions(page);
  const { categories } = useCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("ALL");
  const [categoryId, setCategoryId] = useState("ALL");
  const [period, setPeriod] = useState("ALL");

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [DASHBOARD_QUERY, CATEGORIES_QUERY, TRANSACTIONS_QUERY],
  });

  const openCreate = () => {
    setEditingTransaction(null);
    setDialogOpen(true);
  };

  const openEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingTransaction) return;
    try {
      await deleteTransaction({ variables: { id: deletingTransaction.id } });
      setDeletingTransaction(null);
      refetch();
    } catch {
      setError("Não foi possível excluir a transação.");
    }
  };

  const periods = useMemo(() => {
    const values = new Set(transactions.map((transaction) => transaction.date.slice(0, 7)));
    if (period !== "ALL") values.add(period);
    return Array.from(values).sort().reverse();
  }, [transactions, period]);

  const visibleTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(search.trim().toLowerCase());
    const matchesType = type === "ALL" || transaction.type === type;
    const matchesCategory = categoryId === "ALL" || transaction.category.id === categoryId;
    const matchesPeriod = period === "ALL" || transaction.date.startsWith(period);
    return matchesSearch && matchesType && matchesCategory && matchesPeriod;
  });

  const filtersActive = Boolean(search.trim()) || type !== "ALL" || categoryId !== "ALL" || period !== "ALL";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold leading-6 text-gray-800">Transações</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button onClick={openCreate} size="sm" className="transactions-add-button">
          <Plus size={16} /> Nova transação
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-feedback-danger">{error}</p>}

      <section className="transactions-filter-card mt-7 border border-gray-200 bg-white p-5">
        <div className="transactions-filter-grid">
          <Input
            label="Buscar"
            icon={Search}
            placeholder="Buscar por descrição"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <FilterSelect
            label="Tipo"
            value={type}
            onChange={setType}
            options={[
              { value: "ALL", label: "Todos" },
              { value: "INCOME", label: "Entrada" },
              { value: "EXPENSE", label: "Saída" },
            ]}
          />

          <FilterSelect
            label="Categoria"
            value={categoryId}
            onChange={setCategoryId}
            options={[
              { value: "ALL", label: "Todas" },
              ...categories.map((category) => ({ value: category.id, label: category.name })),
            ]}
          />

          <FilterSelect
            label="Período"
            value={period}
            onChange={setPeriod}
            options={[
              { value: "ALL", label: "Todos os períodos" },
              ...periods.map((value) => ({ value, label: formatPeriod(value) })),
            ]}
          />
        </div>
      </section>

      <section className="transactions-table-card mt-6 overflow-hidden border border-gray-200 bg-white">
        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">Carregando…</p>
        ) : (
          <>
            <TransactionTable
              transactions={visibleTransactions}
              onEdit={openEdit}
              onDelete={(t) => setDeletingTransaction(t)}
            />
            {(total > 0 || filtersActive) && (
              <div className="transactions-pagination border-t border-gray-200 px-5">
                <Pagination
                  page={filtersActive ? 1 : page}
                  perPage={perPage}
                  total={filtersActive ? visibleTransactions.length : total}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        transaction={editingTransaction}
      />

      <ConfirmDialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${deletingTransaction?.description}"? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}
