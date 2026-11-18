import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationButton } from "./PaginationButton";

export interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, perPage, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = total === 0 ? 0 : (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm text-gray-500">
        {from} a {to} | {total} resultados
      </span>

      <div className="flex items-center gap-1">
        <PaginationButton
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </PaginationButton>

        {pages.map((p, idx) => {
          const prev = pages[idx - 1];
          const showEllipsis = prev !== undefined && p - prev > 1;
          return (
            <span key={p} className="flex items-center gap-1">
              {showEllipsis && <span className="px-1 text-gray-400">…</span>}
              <PaginationButton active={p === page} onClick={() => onPageChange(p)}>
                {p}
              </PaginationButton>
            </span>
          );
        })}

        <PaginationButton
          aria-label="Próxima página"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </PaginationButton>
      </div>
    </div>
  );
}
