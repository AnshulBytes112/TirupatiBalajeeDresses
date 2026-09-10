"use client";

import * as React from "react";
import { X, RotateCcw } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

export interface ActiveFilterPillsProps {
  filters: ActiveFilter[];
  onRemoveFilter: (key: string, value: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterPills({
  filters,
  onRemoveFilter,
  onClearAll,
  className = "",
}: ActiveFilterPillsProps) {
  if (filters.length === 0) return null;

  return (
    <div className={`mb-5 flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
        Applied Filters:
      </span>
      {filters.map((filter, idx) => (
        <span
          key={`${filter.key}-${filter.value}-${idx}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy-50 border border-brand-navy-200 px-3 py-1 text-xs font-medium text-brand-navy-900 shadow-2xs hover:bg-brand-navy-100 transition-colors"
        >
          <span className="text-slate-400 font-normal text-[11px]">{filter.label}:</span>
          <span className="font-semibold">{filter.value}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(filter.key, filter.value)}
            className="rounded-full p-0.5 text-slate-400 hover:bg-brand-navy-200 hover:text-brand-navy-950 transition-colors"
            aria-label={`Remove filter ${filter.label} ${filter.value}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 underline decoration-red-300 underline-offset-4 ml-1 transition-colors"
      >
        <RotateCcw className="h-3 w-3" />
        Clear All
      </button>
    </div>
  );
}
