import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "danger";
  size?: "md" | "sm";
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  solid: "bg-brand-base text-white hover:bg-brand-dark disabled:hover:bg-brand-base",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:hover:bg-white",
  danger: "bg-feedback-danger text-white hover:bg-red-dark disabled:hover:bg-feedback-danger",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "solid", size = "md", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
