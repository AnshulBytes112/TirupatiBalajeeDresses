"use client";

import * as React from "react";
import { Link as LinkIcon, Search, Check, ChevronDown, Sparkles, ExternalLink } from "lucide-react";

export interface SystemUrlOption {
  label: string;
  url: string;
  group: "Pages" | "Categories" | "Schools" | "Special";
}

const DEFAULT_MAIN_ROUTES: SystemUrlOption[] = [
  { label: "All Products (Catalog)", url: "/shop", group: "Pages" },
  { label: "All Categories Directory", url: "/categories", group: "Pages" },
  { label: "Schools Directory", url: "/schools", group: "Pages" },
  { label: "Combos & Sets", url: "/combos", group: "Pages" },
  { label: "Special Offers & Deals", url: "/offers", group: "Pages" },
];

export interface SystemUrlSelectorProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
}

export function SystemUrlSelector({
  label,
  value,
  onChange,
  placeholder = "Select or type a URL (e.g. /shop/school-uniforms)...",
  className = "",
}: SystemUrlSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dynamicOptions, setDynamicOptions] = React.useState<SystemUrlOption[]>(DEFAULT_MAIN_ROUTES);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Fetch active categories and schools on mount
  React.useEffect(() => {
    async function loadDynamicUrls() {
      try {
        const [catRes, schoolRes] = await Promise.all([
          fetch("/api/categories").catch(() => null),
          fetch("/api/schools").catch(() => null),
        ]);

        const extraOptions: SystemUrlOption[] = [];

        if (catRes?.ok) {
          const catJson = await catRes.json();
          if (catJson.data?.length) {
            catJson.data.forEach((cat: any) => {
              extraOptions.push({
                label: `Category: ${cat.name}`,
                url: `/shop/${cat.slug}`,
                group: "Categories",
              });
              if (cat.children?.length) {
                cat.children.forEach((child: any) => {
                  extraOptions.push({
                    label: `Subcategory: ${cat.name} → ${child.name}`,
                    url: `/shop/${cat.slug}/${child.slug}`,
                    group: "Categories",
                  });
                });
              }
            });
          }
        }

        if (schoolRes?.ok) {
          const schoolJson = await schoolRes.json();
          if (schoolJson.data?.length) {
            schoolJson.data.forEach((school: any) => {
              extraOptions.push({
                label: `School: ${school.name}`,
                url: `/schools/${school.slug}`,
                group: "Schools",
              });
            });
          }
        }

        if (extraOptions.length > 0) {
          // Merge unique by URL
          const map = new Map<string, SystemUrlOption>();
          DEFAULT_MAIN_ROUTES.forEach((item) => map.set(item.url, item));
          extraOptions.forEach((item) => map.set(item.url, item));
          setDynamicOptions(Array.from(map.values()));
        }
      } catch (e) {
        // Fallback to DEFAULT_MAIN_ROUTES
      }
    }

    loadDynamicUrls();
  }, []);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = dynamicOptions.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opt.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${className}`}>
      {label && (
        <label className="font-bold text-stone-700 flex items-center justify-between text-xs">
          <span>{label}</span>
          <span className="text-[10px] text-stone-500 font-semibold flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" /> Active System URLs
          </span>
        </label>
      )}

      {/* Input / Trigger */}
      <div className="relative flex items-center rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] hover:border-stone-400 focus-within:border-[#1C1917] focus-within:bg-white transition-all shadow-2xs">
        <div className="pl-3 text-stone-400">
          <LinkIcon className="h-3.5 w-3.5" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2 text-xs text-[#1C1917] font-medium placeholder:text-stone-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="pr-3 pl-2 py-2 text-stone-400 hover:text-stone-700 transition-colors"
          tabIndex={-1}
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Options Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-2xl border border-[#E5DCD3] bg-white p-1.5 shadow-xl animate-in fade-in-50 zoom-in-95">
          {/* Quick Filter Bar */}
          <div className="sticky top-0 bg-white px-2 py-1.5 border-b border-[#F0EBE4] mb-1 flex items-center gap-1.5 text-stone-400">
            <Search className="h-3 w-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter active URLs..."
              className="w-full bg-transparent text-[11px] text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {filteredOptions.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-stone-500">
              No matching URLs found. You can type any custom URL.
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredOptions.map((opt) => {
                const isSelected = value === opt.url;

                return (
                  <button
                    key={opt.url}
                    type="button"
                    onClick={() => {
                      onChange(opt.url);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#1C1917] text-white"
                        : "text-stone-700 hover:bg-[#FAF7F2] hover:text-stone-900"
                    }`}
                  >
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                            isSelected
                              ? "bg-white/20 text-amber-300"
                              : opt.group === "Pages"
                              ? "bg-amber-100 text-amber-800"
                              : opt.group === "Categories"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {opt.group}
                        </span>
                        <span className="font-bold truncate">{opt.label}</span>
                      </div>
                      <div
                        className={`text-[10.5px] font-mono truncate ${
                          isSelected ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {opt.url}
                      </div>
                    </div>

                    {isSelected && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
