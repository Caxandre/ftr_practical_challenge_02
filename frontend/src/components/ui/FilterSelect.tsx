import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  error?: string;
}

export function FilterSelect({ label, value, options, onChange, error }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const selectedLabel = options.find((option) => option.value === value)?.label ?? options[0]?.label;

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="transaction-filter-select-field">
      <label id={labelId}>{label}</label>
      <div className="relative">
        <button
          type="button"
          className={cn("transaction-filter-select-trigger", error && "is-invalid")}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{selectedLabel}</span>
          <ChevronDown size={18} className={open ? "rotate-180" : ""} aria-hidden />
        </button>

        {open && (
          <div className="transaction-filter-select-menu" role="listbox" aria-label={`Selecionar ${label.toLowerCase()}`}>
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? "is-selected" : ""}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {selected && <Check size={15} aria-hidden />}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-feedback-danger">{error}</span>}
    </div>
  );
}
