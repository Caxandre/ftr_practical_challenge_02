import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeClosed, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, leftElement, rightElement, className, disabled, type = "text", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
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
          {Icon && <Icon size={18} className="shrink-0 text-gray-400" aria-hidden />}
          {leftElement}

          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400",
              "disabled:cursor-not-allowed",
              className
            )}
            aria-invalid={Boolean(error)}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
            </button>
          )}

          {!isPassword && rightElement}
        </div>

        {error && <span className="text-xs text-feedback-danger">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
