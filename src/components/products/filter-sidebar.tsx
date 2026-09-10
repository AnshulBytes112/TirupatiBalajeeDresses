"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Search, Star, Check } from "lucide-react";

export interface FilterState {
  school?: string;
  season?: string;
  gender?: string;
  classGrade?: string;
  category?: string;
  subcategory?: string;
  size?: string;
  color?: string;
  brand?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  discount?: string | number;
  rating?: string | number;
  inStock?: boolean;
  outOfStock?: boolean;
  hasDiscount?: boolean;
}

export interface FilterOptionItem {
  label?: string;
  name?: string;
  value?: string | number;
  slug?: string;
  id?: string;
  count?: number;
  hex?: string;
  bgClass?: string;
}

export interface FilterOptionsData {
  schools: Array<{ id: string; name: string; slug: string; count?: number }>;
  categories: Array<{ id: string; name: string; slug: string; count?: number; parentId?: string | null }>;
  brands: Array<{ id: string; name: string; slug: string; count?: number }>;
  sizes: Array<{ label: string; value: string; count?: number }>;
  colors: Array<{ name: string; hex: string; bgClass: string }>;
  classes: Array<{ label: string; value: string; count?: number }>;
  seasons: Array<{ label: string; value: string; count?: number }>;
  genders: Array<{ label: string; value: string; count?: number }>;
  discounts: Array<{ label: string; value: number; count?: number }>;
  ratings: Array<{ label: string; value: number; count?: number }>;
  availability?: {
    inStock: number;
    outOfStock: number;
  };
  priceRange: { min: number; max: number };
  totalProducts?: number;
}

export interface FilterSidebarProps {
  filters: FilterState;
  options: FilterOptionsData;
  onFilterChange: (newFilters: FilterState) => void;
  onClearAll: () => void;
  className?: string;
}

export function FilterSidebar({
  filters,
  options,
  onFilterChange,
  onClearAll,
  className = "",
}: FilterSidebarProps) {
  // Accordion collapsed state for sections
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    category: false,
    school: false,
    brand: false,
    gender: false,
    season: false,
    classGrade: false,
    size: false,
    color: false,
    price: false,
    availability: false,
    discount: false,
    rating: false,
  });

  const [schoolSearch, setSchoolSearch] = React.useState("");
  const [showAllSchools, setShowAllSchools] = React.useState(false);

  const toggleSection = (section: string) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper for multi-select toggling (comma-separated values)
  const handleMultiToggle = (key: keyof FilterState, value: string) => {
    const currentStr = (filters[key] as string) || "";
    const currentList = currentStr
      ? currentStr.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    let nextList: string[];
    if (currentList.some((v) => v.toLowerCase() === value.toLowerCase())) {
      nextList = currentList.filter((v) => v.toLowerCase() !== value.toLowerCase());
    } else {
      nextList = [...currentList, value];
    }
    onFilterChange({
      ...filters,
      [key]: nextList.length > 0 ? nextList.join(",") : undefined,
    });
  };

  const isMultiChecked = (key: keyof FilterState, value: string) => {
    const currentStr = (filters[key] as string) || "";
    if (!currentStr) return false;
    const currentList = currentStr.split(",").map((s) => s.trim().toLowerCase());
    return currentList.includes(value.toLowerCase());
  };

  const hasActiveFilters = Object.values(filters).some(
    (val) => val !== undefined && val !== "" && val !== false
  );

  const filteredSchools = options.schools.filter((s) =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const displayedSchools = showAllSchools
    ? filteredSchools
    : filteredSchools.slice(0, 5);

  return (
    <aside
      className={`w-64 xl:w-72 shrink-0 space-y-5 select-none ${className}`}
      aria-label="Product Filters"
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h2 className="text-base font-black text-brand-navy-950 uppercase tracking-wider flex items-center gap-2">
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-brand-gold-500 animate-pulse" />
          )}
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-bold text-slate-500 hover:text-brand-navy-950 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* 1. Category Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Category</span>
          {collapsed.category ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.category && (
          <div className="mt-2.5 space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {options.categories.map((cat) => {
              const isChecked = isMultiChecked("category", cat.slug);

              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMultiToggle("category", cat.slug)}
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                      {cat.name}
                    </span>
                  </div>
                  {cat.count !== undefined && cat.count > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                      ({cat.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. School Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("school")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>School</span>
          {collapsed.school ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.school && (
          <div className="mt-2.5 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search school..."
                value={schoolSearch}
                onChange={(e) => setSchoolSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-brand-navy-950 placeholder-slate-400 focus:border-brand-navy-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {displayedSchools.map((school) => {
                const isChecked = isMultiChecked("school", school.slug);
                return (
                  <label
                    key={school.id}
                    className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiToggle("school", school.slug)}
                        className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                      />
                      <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                        {school.name}
                      </span>
                    </div>
                    {school.count !== undefined && school.count > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                        ({school.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

            {filteredSchools.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllSchools(!showAllSchools)}
                className="text-xs font-bold text-brand-navy-900 hover:underline pt-1 block"
              >
                {showAllSchools ? "- Show Less" : "+ Show More"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Brand Accordion */}
      {options.brands && options.brands.length > 0 && (
        <div className="border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => toggleSection("brand")}
            className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
          >
            <span>Brand</span>
            {collapsed.brand ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {!collapsed.brand && (
            <div className="mt-2.5 space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {options.brands.map((brand) => {
                const isChecked = isMultiChecked("brand", brand.slug);
                return (
                  <label
                    key={brand.id}
                    className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiToggle("brand", brand.slug)}
                        className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                      />
                      <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                        {brand.name}
                      </span>
                    </div>
                    {brand.count !== undefined && brand.count > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                        ({brand.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Season Accordion */}
      {options.seasons && options.seasons.length > 0 && (
        <div className="border-b border-slate-200 pb-4">
          <button
            type="button"
            onClick={() => toggleSection("season")}
            className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
          >
            <span>Season</span>
            {collapsed.season ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {!collapsed.season && (
            <div className="mt-2.5 space-y-1.5">
              {options.seasons.map((s) => {
                const isChecked = isMultiChecked("season", s.value);
                return (
                  <label
                    key={s.value}
                    className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiToggle("season", s.value)}
                        className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                      />
                      <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                        {s.label}
                      </span>
                    </div>
                    {s.count !== undefined && s.count > 0 && (
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                        ({s.count})
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Gender Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("gender")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Gender</span>
          {collapsed.gender ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.gender && (
          <div className="mt-2.5 space-y-1.5">
            {options.genders.map((g) => {
              const isChecked = isMultiChecked("gender", g.value);
              return (
                <label
                  key={g.value}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMultiToggle("gender", g.value)}
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                      {g.label}
                    </span>
                  </div>
                  {g.count !== undefined && g.count > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                      ({g.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Class / Grade Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("classGrade")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Class / Grade</span>
          {collapsed.classGrade ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.classGrade && (
          <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {options.classes.map((c) => {
              const isChecked = isMultiChecked("classGrade", c.value);
              return (
                <label
                  key={c.value}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMultiToggle("classGrade", c.value)}
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                      {c.label}
                    </span>
                  </div>
                  {c.count !== undefined && c.count > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                      ({c.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Size Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("size")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Size</span>
          {collapsed.size ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.size && (
          <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {options.sizes.map((s) => {
              const isChecked = isMultiChecked("size", s.value);
              return (
                <label
                  key={s.value}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleMultiToggle("size", s.value)}
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                      {s.label}
                    </span>
                  </div>
                  {s.count !== undefined && s.count > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                      ({s.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Color Accordion (Swatches) */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("color")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Color</span>
          {collapsed.color ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.color && (
          <div className="mt-3 flex flex-wrap gap-2.5">
            {options.colors.map((c) => {
              const isSelected = isMultiChecked("color", c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleMultiToggle("color", c.name)}
                  title={c.name}
                  aria-label={`Filter by ${c.name}`}
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border shadow-2xs transition-all ${
                    c.bgClass
                  } ${
                    isSelected
                      ? "ring-2 ring-brand-navy-950 ring-offset-2 scale-110"
                      : "border-slate-200 hover:scale-105"
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`h-3 w-3 ${
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
        )}
      </div>

      {/* 9. Price Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Price</span>
          {collapsed.price ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.price && (
          <div className="mt-3 space-y-3">
            {/* Visual Slider Bar */}
            <div className="relative pt-2 pb-1">
              <div className="h-1.5 w-full rounded-full bg-slate-200 relative">
                <div className="absolute left-0 right-0 h-full bg-brand-yellow-400 rounded-full" />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2">
                <span>₹{filters.minPrice || 0}</span>
                <span>₹{filters.maxPrice || 2000}</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Min</span>
                <input
                  type="number"
                  placeholder="₹0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      minPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-brand-navy-950 focus:border-brand-navy-500 focus:outline-hidden"
                />
              </div>
              <span className="text-slate-400 mt-3">-</span>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Max</span>
                <input
                  type="number"
                  placeholder="₹2000"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-brand-navy-950 focus:border-brand-navy-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 10. Availability Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Availability</span>
          {collapsed.availability ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.availability && (
          <div className="mt-2.5 space-y-1.5">
            <label className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(filters.inStock)}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      inStock: e.target.checked ? true : undefined,
                    })
                  }
                  className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                />
                <span className={filters.inStock ? "font-bold text-brand-navy-950" : "font-medium"}>
                  In Stock
                </span>
              </div>
              {options.availability?.inStock !== undefined && (
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                  ({options.availability.inStock})
                </span>
              )}
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(filters.outOfStock)}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      outOfStock: e.target.checked ? true : undefined,
                    })
                  }
                  className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                />
                <span className={filters.outOfStock ? "font-bold text-brand-navy-950" : "font-medium"}>
                  Out of Stock
                </span>
              </div>
              {options.availability?.outOfStock !== undefined && (
                <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                  ({options.availability.outOfStock})
                </span>
              )}
            </label>
          </div>
        )}
      </div>

      {/* 11. Discount Accordion */}
      <div className="border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={() => toggleSection("discount")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Discount</span>
          {collapsed.discount ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.discount && (
          <div className="mt-2.5 space-y-1.5">
            {options.discounts.map((d) => {
              const isChecked = Number(filters.discount) === d.value;
              return (
                <label
                  key={d.value}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onFilterChange({
                          ...filters,
                          discount: isChecked ? undefined : d.value,
                        })
                      }
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className={isChecked ? "font-bold text-brand-navy-950" : "font-medium"}>
                      {d.label}
                    </span>
                  </div>
                  {d.count !== undefined && d.count > 0 && (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600">
                      ({d.count})
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 12. Rating Accordion */}
      <div className="pb-4">
        <button
          type="button"
          onClick={() => toggleSection("rating")}
          className="flex w-full items-center justify-between py-1 text-xs font-black text-brand-navy-950 uppercase tracking-wider hover:text-brand-navy-700"
        >
          <span>Rating</span>
          {collapsed.rating ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {!collapsed.rating && (
          <div className="mt-2.5 space-y-1.5">
            {options.ratings.map((r) => {
              const isChecked = Number(filters.rating) === r.value;
              return (
                <label
                  key={r.value}
                  className="flex items-center justify-between text-xs text-slate-700 hover:text-brand-navy-950 cursor-pointer py-0.5 group"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onFilterChange({
                          ...filters,
                          rating: isChecked ? undefined : r.value,
                        })
                      }
                      className="h-3.5 w-3.5 rounded-sm border-slate-300 text-brand-navy-900 focus:ring-brand-navy-500 cursor-pointer accent-brand-navy-900"
                    />
                    <span className="flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: Math.floor(r.value) }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-[11px] font-semibold text-slate-600 ml-1">
                        &amp; above
                      </span>
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

