"use client";

import * as React from "react";
import { SearchX, RotateCcw } from "lucide-react";

export interface PLPEmptyStateProps {
  onClearFilters: () => void;
  title?: string;
  description?: string;
}

export function PLPEmptyState({
  onClearFilters,
  title = "No Products Found",
  description = "We couldn't find any products matching your selected filter criteria. Try loosening your filters or clearing all selections.",
}: PLPEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-cream-300 bg-brand-cream-50/50 p-8 sm:p-12 text-center my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream-200 text-brand-navy-900 mb-4 shadow-inner">
        <SearchX className="h-8 w-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-serif font-bold text-brand-navy-950">
        {title}
      </h3>

      <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
        {description}
      </p>

      <button
        type="button"
        onClick={onClearFilters}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-navy-800 transition-all active:scale-98"
      >
        <RotateCcw className="h-3.5 w-3.5 text-brand-gold-400" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );
}
