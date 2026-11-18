import {
  Briefcase,
  Utensils,
  ShoppingCart,
  CarFront,
  HeartPulse,
  House,
  Dumbbell,
  PawPrint,
  Gift,
  ReceiptText,
  Wrench,
  Ticket,
  Mailbox,
  Luggage,
  BookOpen,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_COLORS = [
  "GRAY",
  "BLUE",
  "PURPLE",
  "PINK",
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
] as const;

export type CategoryColorValue = (typeof CATEGORY_COLORS)[number];

export const CATEGORY_ICONS = [
  "piggy-bank",
  "utensils",
  "shopping-cart",
  "car-front",
  "heart-pulse",
  "house",
  "dumbbell",
  "paw-print",
  "gift",
  "receipt-text",
  "briefcase-business",
  "tool-case",
  "ticket",
  "mailbox",
  "baggage-claim",
  "book-open",
] as const;

export type CategoryIconValue = (typeof CATEGORY_ICONS)[number];

export const CATEGORY_ICON_MAP: Record<CategoryIconValue, LucideIcon> = {
  "piggy-bank": PiggyBank,
  utensils: Utensils,
  "shopping-cart": ShoppingCart,
  "car-front": CarFront,
  "heart-pulse": HeartPulse,
  house: House,
  dumbbell: Dumbbell,
  "paw-print": PawPrint,
  gift: Gift,
  "receipt-text": ReceiptText,
  "briefcase-business": Briefcase,
  "tool-case": Wrench,
  ticket: Ticket,
  mailbox: Mailbox,
  "baggage-claim": Luggage,
  "book-open": BookOpen,
};

export function getCategoryIcon(icon: string): LucideIcon {
  return CATEGORY_ICON_MAP[icon as CategoryIconValue] ?? ShoppingCart;
}

export const CATEGORY_COLOR_HEX: Record<CategoryColorValue, string> = {
  GRAY: "#6B7280",
  BLUE: "#2563EB",
  PURPLE: "#9333EA",
  PINK: "#DB2777",
  RED: "#DC2626",
  ORANGE: "#EA580C",
  YELLOW: "#CA8A04",
  GREEN: "#16A34A",
};
