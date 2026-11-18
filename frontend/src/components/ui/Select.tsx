import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, disabled, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 transition-colors",
            "focus-within:border-brand-base focus-within:ring-2 focus-within:ring-brand-base/20",
            error ? "border-feedback-danger" : "border-gray-300",
            disabled && "cursor-not-allowed bg-gray-100 opacity-60"
          )}
        >
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full cursor-pointer appearance-none bg-transparent text-sm text-gray-800 outline-none",
              "disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          >
            {children}
          </select>
          <ChevronDown size={18} className="shrink-0 text-gray-400" aria-hidden />
        </div>

        {error && <span className="text-xs text-feedback-danger">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
