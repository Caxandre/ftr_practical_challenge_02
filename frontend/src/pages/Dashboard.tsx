import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  Plus,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { DASHBOARD_QUERY } from "../graphql/queries/dashboard";
import { formatCurrency } from "../lib/formatCurrency";
import { formatDate } from "../lib/formatDate";
import { getCategoryIcon } from "../lib/categoryTaxonomy";
import { Tag } from "../components/ui";
import { TransactionFormDialog } from "../components/transaction/TransactionFormDialog";
import { useCategories, type Category } from "../hooks/useCategories";
import type { Transaction } from "../hooks/useTransactions";

interface DashboardData {
  dashboard: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    recentTransactions: Transaction[];
  };
}

const categoryToneClasses: Record<Category["color"], string> = {
  GRAY: "bg-gray-200 text-gray-600",
  BLUE: "bg-blue-light text-blue-base",
  PURPLE: "bg-purple-light text-purple-base",
  PINK: "bg-pink-light text-pink-base",
  RED: "bg-red-light text-red-base",
  ORANGE: "bg-orange-light text-orange-base",
  YELLOW: "bg-yellow-light text-yellow-base",
  GREEN: "bg-green-light text-green-base",
};

function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <article className="dashboard-summary-card flex flex-col justify-center border border-gray-200 bg-white px-5">
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={1.8} className={iconClassName} aria-hidden />
        <p className="dashboard-eyebrow font-medium uppercase text-gray-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-semibold leading-6 text-gray-800">{formatCurrency(value)}</p>
    </article>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const Icon = getCategoryIcon(transaction.category.icon);
  const isIncome = transaction.type === "INCOME";
  const DirectionIcon = isIncome ? CircleArrowUp : CircleArrowDown;

  return (
    <li className="dashboard-transaction-row items-center gap-4 border-b border-gray-200 px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`dashboard-category-icon flex shrink-0 items-center justify-center rounded-lg ${categoryToneClasses[transaction.category.color]}`}
        >
          <Icon size={15} strokeWidth={1.8} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-5 text-gray-800">{transaction.description}</p>
          <p className="text-xs leading-4 text-gray-500">{formatDate(transaction.date)}</p>
        </div>
      </div>

      <Tag
        color={isIncome ? "GREEN" : transaction.category.color}
        label={isIncome ? "Receita" : transaction.category.name}
        className="max-sm:hidden"
      />

      <div className="flex items-center justify-end gap-2 whitespace-nowrap text-xs font-semibold text-gray-800">
        <span>
          {isIncome ? "+" : "-"} {formatCurrency(Math.abs(transaction.amount))}
        </span>
        <DirectionIcon
          size={14}
          className={isIncome ? "text-green-base" : "text-red-base"}
          aria-hidden
        />
      </div>
    </li>
  );
}

export function Dashboard() {
  const { data, loading } = useQuery<DashboardData>(DASHBOARD_QUERY);
  const { categories } = useCategories();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const summary = data?.dashboard;
  const transactions = summary?.recentTransactions.slice(0, 5) ?? [];

  return (
    <div>
      <section className="dashboard-summary-grid" aria-label="Resumo financeiro">
        <SummaryCard
          label="Saldo total"
          value={summary?.totalBalance ?? 0}
          icon={Wallet}
          iconClassName="text-purple-base"
        />
        <SummaryCard
          label="Receitas do mês"
          value={summary?.monthlyIncome ?? 0}
          icon={CircleArrowUp}
          iconClassName="text-green-dark"
        />
        <SummaryCard
          label="Despesas do mês"
          value={summary?.monthlyExpense ?? 0}
          icon={CircleArrowDown}
          iconClassName="text-red-base"
        />
      </section>

      <div className="dashboard-content-grid mt-5 items-start">
        <section className="dashboard-panel overflow-hidden border border-gray-200 bg-white">
          <header className="dashboard-panel-header flex items-center justify-between border-b border-gray-200 px-5">
            <h2 className="dashboard-eyebrow font-medium uppercase text-gray-500">
              Transações recentes
            </h2>
            <Link to="/transacoes" className="flex items-center gap-2 text-xs font-medium text-brand-base hover:text-brand-dark">
              Ver todas
              <ChevronRight size={16} aria-hidden />
            </Link>
          </header>

          {loading && <p className="px-5 py-6 text-sm text-gray-500">Carregando…</p>}
          {!loading && transactions.length === 0 && (
            <p className="px-5 py-6 text-sm text-gray-500">Nenhuma transação ainda.</p>
          )}

          <ul>{transactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}</ul>

          <button
            type="button"
            onClick={() => setTransactionDialogOpen(true)}
            className="dashboard-panel-footer flex items-center justify-center gap-2 text-xs font-medium text-brand-base hover:text-brand-dark"
          >
            <Plus size={16} aria-hidden />
            Nova transação
          </button>
        </section>

        <section className="dashboard-panel overflow-hidden border border-gray-200 bg-white">
          <header className="dashboard-panel-header flex items-center justify-between border-b border-gray-200 px-5">
            <h2 className="dashboard-eyebrow font-medium uppercase text-gray-500">Categorias</h2>
            <Link to="/categorias" className="flex items-center gap-2 text-xs font-medium text-brand-base hover:text-brand-dark">
              Gerenciar
              <ChevronRight size={16} aria-hidden />
            </Link>
          </header>

          <ul className="px-5 py-2.5">
            {categories.slice(0, 5).map((category) => (
              <li key={category.id} className="dashboard-category-row h-10 items-center gap-3">
                <Tag color={category.color} label={category.name} className="w-fit max-w-full truncate" />
                <span className="whitespace-nowrap text-xs text-gray-500">
                  {category.transactionsCount} {category.transactionsCount === 1 ? "item" : "itens"}
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-gray-800">
                  {formatCurrency(category.totalAmount)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <TransactionFormDialog
        open={transactionDialogOpen}
        onOpenChange={setTransactionDialogOpen}
        categories={categories}
      />
    </div>
  );
}
