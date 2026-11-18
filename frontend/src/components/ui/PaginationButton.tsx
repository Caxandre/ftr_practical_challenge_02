import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface PaginationButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function PaginationButton({ active, className, disabled, ...props }: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-brand-base text-white"
          : "text-gray-600 hover:bg-gray-200",
        className
      )}
      {...props}
    />
  );
}
