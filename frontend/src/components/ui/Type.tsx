import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { cn } from "../../lib/cn";
import { formatCurrency } from "../../lib/formatCurrency";

export interface TypeProps {
  type: "INCOME" | "EXPENSE";
  amount: number;
  className?: string;
  showIcon?: boolean;
}

export function Type({ type, amount, className, showIcon = false }: TypeProps) {
  const isIncome = type === "INCOME";
  const Icon = isIncome ? CircleArrowUp : CircleArrowDown;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold",
        isIncome ? "text-green-base" : "text-red-base",
        className
      )}
    >
      {showIcon && <Icon size={14} aria-hidden />}
      {isIncome ? "+" : "-"} {formatCurrency(amount)}
    </span>
  );
}
