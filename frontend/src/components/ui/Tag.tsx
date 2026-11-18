import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

export type TagColor = "GRAY" | "BLUE" | "PURPLE" | "PINK" | "RED" | "ORANGE" | "YELLOW" | "GREEN";

export interface TagProps {
  color: TagColor;
  label: string;
  icon?: LucideIcon;
  className?: string;
}

const colorClasses: Record<TagColor, string> = {
  GRAY: "bg-gray-200 text-gray-700",
  BLUE: "bg-blue-light text-blue-dark",
  PURPLE: "bg-purple-light text-purple-dark",
  PINK: "bg-pink-light text-pink-dark",
  RED: "bg-red-light text-red-dark",
  ORANGE: "bg-orange-light text-orange-dark",
  YELLOW: "bg-yellow-light text-yellow-dark",
  GREEN: "bg-green-light text-green-dark",
};

export function Tag({ color, label, icon: Icon, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        colorClasses[color],
        className
      )}
    >
      {Icon && <Icon size={12} aria-hidden />}
      {label}
    </span>
  );
}
