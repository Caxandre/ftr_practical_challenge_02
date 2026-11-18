import { forwardRef, type ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "outline" | "danger";
  "aria-label": string;
}

const variants: Record<NonNullable<IconButtonProps["variant"]>, string> = {
  outline: "border border-gray-300 bg-white text-gray-600 hover:bg-gray-100",
  danger: "border border-red-base/30 bg-white text-red-base hover:bg-red-light",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = "outline", className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon size={16} aria-hidden />
    </button>
  )
);

IconButton.displayName = "IconButton";
