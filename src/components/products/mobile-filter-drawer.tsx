"use client";

import * as React from "react";
import { SlidersHorizontal, ArrowUpDown, X, Check, Star, Search } from "lucide-react";
import { FilterState, FilterOptionsData } from "./filter-sidebar";
import { SORT_OPTIONS } from "./plp-header";

export interface MobileFilterDrawerProps {
  filters: FilterState;
  options: FilterOptionsData;
  totalProducts: number;
  currentSort: string;
  onFilterChange: (newFilters: FilterState) => void;
  onSortChange: (newSort: string) => void;
  onClearAll: () => void;
}

export function MobileFilterDrawer({
  filters,
  options,
  totalProducts,
  currentSort,
  onFilterChange,
  onSortChange,
  onClearAll,
}: MobileFilterDrawerProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [sortOpen, setSortOpen] = React.useState(false);
  const [draftFilters, setDraftFilters] = React.useState<FilterState>(filters);
  const [schoolSearch, setSchoolSearch] = React.useState("");

  // Sync draft filters when opened
  React.useEffect(() => {
    if (filterOpen) {
      setDraftFilters(filters);
    }
  }, [filterOpen, filters]);

  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (filterOpen || sortOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen, sortOpen]);

  // Calculate active filter count for sticky top bar
  const activeCount = Object.entries(filters).filter(
    ([k, v]) => v !== undefined && v !== "" && v !== false
  ).length;

  // Calculate active draft count inside open drawer
  const activeDraftCount = Object.entries(draftFilters).filter(
    ([k, v]) => v !== undefined && v !== "" && v !== false
  ).length;

  const handleApply = () => {
    onFilterChange(draftFilters);
    setFilterOpen(false);
  };

  const handleClearAll = () => {
    setDraftFilters({});
    onClearAll();
    setFilterOpen(false);
  };

  const handleMultiToggle = (key: keyof FilterState, value: string) => {
    const currentStr = (draftFilters[key] as string) || "";
    const currentList = currentStr
      ? currentStr.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    let nextList: string[];
    if (currentList.some((v) => v.toLowerCase() === value.toLowerCase())) {
      nextList = currentList.filter((v) => v.toLowerCase() !== value.toLowerCase());
    } else {
      nextList = [...currentList, value];
    }
    setDraftFilters((prev) => ({
      ...prev,
      [key]: nextList.length > 0 ? nextList.join(",") : undefined,
    }));
  };

  const isMultiChecked = (key: keyof FilterState, value: string) => {
    const currentStr = (draftFilters[key] as string) || "";
    if (!currentStr) return false;
    const currentList = currentStr.split(",").map((s) => s.trim().toLowerCase());
    return currentList.includes(value.toLowerCase());
  };

  const filteredSchools = options.schools.filter((s) =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <>
      {/* Mobile Top Fixed/Sticky Action Bar */}
      <div className="lg:hidden sticky top-[124px] md:top-[80px] z-30 bg-white/95 backdrop-blur-md border-y border-slate-200 px-4 py-2.5 flex items-center gap-3 shadow-xs mb-3 -mx-4 sm:-mx-6">
        {/* Filter Trigger Button */}
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-brand-yellow-400 py-3 px-4 text-xs font-black text-brand-navy-950 shadow-xs active:scale-98 hover:bg-yellow-300 transition-all tracking-wider uppercase cursor-pointer"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>FILTER {activeCount > 0 ? `(${activeCount})` : ""}</span>
        </button>

        {/* Sort Trigger Button */}
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 px-4 text-xs font-bold text-brand-navy-950 shadow-2xs active:scale-98 hover:bg-slate-50 transition-all truncate tracking-wider uppercase cursor-pointer"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">SORT</span>
        </button>
      </div>

      {/* 1. Filter Bottom Sheet Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setFilterOpen(false)}
          />

          {/* Sheet Body */}
          <div className="relative z-10 flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Handle & Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-brand-navy-900" />
                <h3 className="text-base font-black text-brand-navy-950 uppercase tracking-wide">
                  Filters
                </h3>
                {activeDraftCount > 0 && (
                  <span className="rounded-full bg-brand-yellow-400 text-brand-navy-950 text-[10px] font-black px-2 py-0.5">
                    {activeDraftCount} active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-xs font-bold text-slate-500 hover:text-red-600 underline cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {options.categories.map((cat) => {
                    const isChecked = isMultiChecked("category", cat.slug);

                    return (
                      <label
                        key={cat.id}
                        className="flex items-center justify-between text-xs py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleMultiToggle("category", cat.slug)}
                            className="h-4 w-4 rounded-sm accent-brand-navy-900"
                          />
                          <span
                            className={
                              isChecked
                                ? "font-bold text-brand-navy-950"
                                : "text-slate-700"
                            }
                          >
                            {cat.name}
                          </span>
                        </div>
                        {cat.count !== undefined && cat.count > 0 && (
                          <span className="text-[11px] text-slate-400">({cat.count})</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* School */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2">
                  School
                </h4>
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search school..."
                    value={schoolSearch}
                    onChange={(e) => setSchoolSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-1.5 pl-8 pr-3 text-xs"
                  />
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {filteredSchools.map((s) => {
                    const isChecked = isMultiChecked("school", s.slug);
                    return (
                      <label
                        key={s.id}
                        className="flex items-center justify-between text-xs py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleMultiToggle("school", s.slug)}
                            className="h-4 w-4 rounded-sm accent-brand-navy-900"
                          />
                          <span className={isChecked ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                            {s.name}
                          </span>
                        </div>
                        {s.count !== undefined && s.count > 0 && (
                          <span className="text-[11px] text-slate-400">({s.count})</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Brand */}
              {options.brands && options.brands.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                    Brand
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {options.brands.map((b) => {
                      const isChecked = isMultiChecked("brand", b.slug);
                      return (
                        <label
                          key={b.id}
                          className="flex items-center justify-between text-xs py-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleMultiToggle("brand", b.slug)}
                              className="h-4 w-4 rounded-sm accent-brand-navy-900"
                            />
                            <span className={isChecked ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                              {b.name}
                            </span>
                          </div>
                          {b.count !== undefined && b.count > 0 && (
                            <span className="text-[11px] text-slate-400">({b.count})</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Season */}
              {options.seasons && options.seasons.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                    Season
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {options.seasons.map((s) => {
                      const isSelected = isMultiChecked("season", s.value);
                      return (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => handleMultiToggle("season", s.value)}
                          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                            isSelected
                              ? "bg-brand-navy-950 text-white shadow-xs"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {s.label} {s.count !== undefined ? `(${s.count})` : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gender */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Gender
                </h4>
                <div className="flex flex-wrap gap-2">
                  {options.genders.map((g) => {
                    const isSelected = isMultiChecked("gender", g.value);
                    return (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => handleMultiToggle("gender", g.value)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-brand-navy-950 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {g.label} {g.count !== undefined ? `(${g.count})` : ""}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Class / Grade */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Class / Grade
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {options.classes.map((c) => {
                    const isChecked = isMultiChecked("classGrade", c.value);
                    return (
                      <label
                        key={c.value}
                        className="flex items-center justify-between text-xs py-1 cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleMultiToggle("classGrade", c.value)}
                            className="h-4 w-4 rounded-sm accent-brand-navy-900"
                          />
                          <span className={isChecked ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                            {c.label}
                          </span>
                        </div>
                        {c.count !== undefined && c.count > 0 && (
                          <span className="text-[11px] text-slate-400">({c.count})</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Size
                </h4>
                <div className="flex flex-wrap gap-2">
                  {options.sizes.map((s) => {
                    const isSelected = isMultiChecked("size", s.value);
                    return (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => handleMultiToggle("size", s.value)}
                        className={`min-w-[40px] rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-brand-navy-950 text-white shadow-xs"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Color
                </h4>
                <div className="flex flex-wrap gap-3">
                  {options.colors.map((c) => {
                    const isSelected = isMultiChecked("color", c.name);
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleMultiToggle("color", c.name)}
                        className={`h-7 w-7 rounded-full border shadow-2xs flex items-center justify-center transition-all ${
                          c.bgClass
                        } ${
                          isSelected
                            ? "ring-2 ring-brand-navy-950 ring-offset-2 scale-110"
                            : "border-slate-200 hover:scale-105"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            className={`h-3.5 w-3.5 ${
                              c.name === "White" || c.name === "Yellow"
                                ? "text-slate-900"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Price Range
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={draftFilters.minPrice || ""}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={draftFilters.maxPrice || ""}
                    onChange={(e) =>
                      setDraftFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Availability
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={Boolean(draftFilters.inStock)}
                        onChange={(e) =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            inStock: e.target.checked ? true : undefined,
                          }))
                        }
                        className="h-4 w-4 rounded-sm accent-brand-navy-900"
                      />
                      <span className={draftFilters.inStock ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                        In Stock
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between text-xs py-1 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={Boolean(draftFilters.outOfStock)}
                        onChange={(e) =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            outOfStock: e.target.checked ? true : undefined,
                          }))
                        }
                        className="h-4 w-4 rounded-sm accent-brand-navy-900"
                      />
                      <span className={draftFilters.outOfStock ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                        Out of Stock
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Discount */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Discount
                </h4>
                <div className="space-y-2">
                  {options.discounts.map((d) => (
                    <label
                      key={d.value}
                      className="flex items-center justify-between text-xs py-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={Number(draftFilters.discount) === d.value}
                          onChange={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              discount: Number(prev.discount) === d.value ? undefined : d.value,
                            }))
                          }
                          className="h-4 w-4 rounded-sm accent-brand-navy-900"
                        />
                        <span className={Number(draftFilters.discount) === d.value ? "font-bold text-brand-navy-950" : "text-slate-700"}>
                          {d.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div>
                <h4 className="text-xs font-black text-brand-navy-950 uppercase tracking-wider mb-2.5">
                  Customer Rating
                </h4>
                <div className="space-y-2">
                  {options.ratings.map((r) => (
                    <label
                      key={r.value}
                      className="flex items-center justify-between text-xs py-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={Number(draftFilters.rating) === r.value}
                          onChange={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              rating: Number(prev.rating) === r.value ? undefined : r.value,
                            }))
                          }
                          className="h-4 w-4 rounded-sm accent-brand-navy-900"
                        />
                        <span className="flex items-center gap-1 font-medium">
                          {Array.from({ length: Math.floor(r.value) }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-slate-500 text-[11px] ml-1">&amp; above</span>
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Apply CTA Bar */}
            <div className="border-t border-slate-200 p-4 bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 rounded-xl border border-slate-300 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 cursor-pointer active:scale-98 transition-all"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-2 rounded-xl bg-brand-yellow-400 py-3 text-center text-xs font-black uppercase tracking-wider text-brand-navy-950 shadow-sm active:scale-98 cursor-pointer hover:bg-yellow-300 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sort Bottom Sheet Drawer */}
      {sortOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSortOpen(false)}
          />

          <div className="relative z-10 flex flex-col rounded-t-3xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 pb-6">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-black text-brand-navy-950 uppercase tracking-wide flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort Products
              </h3>
              <button
                type="button"
                onClick={() => setSortOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                aria-label="Close sort"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 px-2 py-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = currentSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onSortChange(opt.value);
                      setSortOpen(false);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold transition-colors hover:bg-slate-50"
                  >
                    <span className={isSelected ? "font-black text-brand-navy-950" : "text-slate-700"}>
                      {opt.label}
                    </span>
                    {isSelected && <Check className="h-4 w-4 text-brand-navy-950" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

