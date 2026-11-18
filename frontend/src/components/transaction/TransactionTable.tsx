import { CircleArrowDown, CircleArrowUp, SquarePen, Trash } from "lucide-react";
import { IconButton, Tag } from "../ui";
import { formatCurrency } from "../../lib/formatCurrency";
import { formatDate } from "../../lib/formatDate";
import { getCategoryIcon } from "../../lib/categoryTaxonomy";
import type { Transaction } from "../../hooks/useTransactions";
import type { Category } from "../../hooks/useCategories";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
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

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return <p className="py-10 text-center text-sm text-gray-500">Nenhuma transação encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="transactions-table w-full text-left text-sm">
        <colgroup>
          <col className="transactions-description-column" />
          <col className="transactions-date-column" />
          <col className="transactions-category-column" />
          <col className="transactions-type-column" />
          <col className="transactions-value-column" />
          <col className="transactions-actions-column" />
        </colgroup>
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <th className="px-5 font-medium">Descrição</th>
            <th className="px-3 font-medium">Data</th>
            <th className="px-3 font-medium">Categoria</th>
            <th className="px-3 font-medium">Tipo</th>
            <th className="px-3 text-right font-medium">Valor</th>
            <th className="px-5 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const Icon = getCategoryIcon(transaction.category.icon);
            const isIncome = transaction.type === "INCOME";
            const DirectionIcon = isIncome ? CircleArrowUp : CircleArrowDown;

            return (
              <tr key={transaction.id} className="border-b border-gray-200 last:border-b-0">
                <td className="px-5 font-medium text-gray-800">
                  <div className="flex items-center gap-3">
                    <span
                      className={`transactions-row-icon flex shrink-0 items-center justify-center rounded-lg ${categoryToneClasses[transaction.category.color]}`}
                    >
                      <Icon size={15} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className="truncate">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-3 text-xs text-gray-500">{formatDate(transaction.date)}</td>
                <td className="px-3">
                  <Tag color={transaction.category.color} label={transaction.category.name} />
                </td>
                <td className="px-3">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-medium ${isIncome ? "text-green-dark" : "text-red-base"}`}
                  >
                    <DirectionIcon size={14} aria-hidden />
                    {isIncome ? "Entrada" : "Saída"}
                  </span>
                </td>
                <td className="px-3 text-right text-xs font-semibold text-gray-800">
                  {isIncome ? "+" : "-"} {formatCurrency(Math.abs(transaction.amount))}
                </td>
                <td className="transactions-actions-cell">
                  <div className="transactions-actions flex justify-end">
                    <IconButton
                      icon={Trash}
                      variant="danger"
                      className="transactions-action-button"
                      aria-label="Excluir transação"
                      onClick={() => onDelete(transaction)}
                    />
                    <IconButton
                      icon={SquarePen}
                      className="transactions-action-button"
                      aria-label="Editar transação"
                      onClick={() => onEdit(transaction)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
