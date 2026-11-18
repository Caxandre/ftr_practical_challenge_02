const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Converte centavos (Int vindo da API) para "R$ 1.234,56". */
export function formatCurrency(cents: number): string {
  return formatter.format(cents / 100);
}

/** Converte um valor digitado (string "1.234,56" ou number em reais) para centavos (Int). */
export function toCents(value: string | number): number {
  if (typeof value === "number") return Math.round(value * 100);

  const normalized = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
}

/** Converte centavos para uma string editável em input ("1234.56"), sem símbolo de moeda. */
export function centsToInputValue(cents: number): string {
  return (cents / 100).toFixed(2);
}
