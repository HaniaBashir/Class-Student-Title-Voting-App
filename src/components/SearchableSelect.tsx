import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SelectOption } from "../types";
import { cn } from "../utils/cn";

type SearchableSelectProps = {
  label: string;
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  helperText?: string;
  clearLabel?: string;
};

function SearchableSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  disabled,
  helperText,
  clearLabel = "Clear selection",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  return (
    <div className="space-y-2" ref={rootRef}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-slate-800">{label}</label>
        {helperText ? <span className="text-xs text-slate-400">{helperText}</span> : null}
      </div>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-500/20",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
            open && "border-slate-300 ring-2 ring-accent-500/10",
          )}
        >
          <span className={cn(!selectedOption && "text-slate-400")}>
            {selectedOption?.label ?? placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value ? (
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  onChange("");
                  setQuery("");
                }}
                className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </span>
            ) : null}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </button>

        {open ? (
          <div className="absolute z-30 mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name..."
                className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full rounded-2xl px-3 py-2 text-left text-sm text-slate-500 transition hover:bg-slate-50"
              >
                {clearLabel}
              </button>

              {filteredOptions.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">No matching names.</p>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    disabled={option.disabled}
                    onClick={() => {
                      if (option.disabled) {
                        return;
                      }
                      onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-start justify-between rounded-2xl px-3 py-2 text-left text-sm transition",
                      option.disabled
                        ? "cursor-not-allowed bg-slate-50 text-slate-300"
                        : "hover:bg-slate-50",
                      value === option.value && "bg-accent-50 text-accent-500",
                    )}
                  >
                    <span>{option.label}</span>
                    {option.description ? (
                      <span className="ml-3 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                        {option.description}
                      </span>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SearchableSelect;
