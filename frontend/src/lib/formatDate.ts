import { format, parseISO } from "date-fns";

/** "2026-09-01T00:00:00.000Z" -> "01/09/26" */
export function formatDate(iso: string): string {
  return format(parseISO(iso), "dd/MM/yy");
}

/** Date -> "2026-09-01" (para <input type="date">) */
export function toDateInputValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}
