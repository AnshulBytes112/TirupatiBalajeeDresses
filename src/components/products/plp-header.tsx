"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PLPHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  totalProducts: number;
  currentSort: string;
  onSortChange: (sort: string) => void;
  isLoading?: boolean;
}

export const SORT_OPTIONS = [
  { value: "popular", label: "Popularity" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "discount_desc", label: "Highest Discount" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "newest", label: "Newest" },
];

export interface CategoryPillItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

export const CATEGORY_PILLS: CategoryPillItem[] = [
  { label: "ALL", href: "/categories" },
  { label: "SCHOOL UNIFORMS", href: "/shop/school-uniforms" },
  { label: "SUMMER DRESS", href: "/shop/school-uniforms/summer-dress" },
  { label: "WINTER DRESS", href: "/shop/school-uniforms/winter-dress" },
  { label: "THERMALS", href: "/shop/thermals" },
  { label: "SCHOOL SHOES", href: "/shop/school-shoes" },
  { label: "BAGS", href: "/shop/school-bags" },
  { label: "STATIONERY", href: "/shop/stationery" },
  { label: "ACCESSORIES", href: "/shop/belts-accessories" },
  { label: "LUNCH BOXES", href: "/shop/lunch-boxes-bottles" },
  { label: "COMBOS", href: "/shop/combos" },
  { label: "OFFERS", href: "/shop/school-uniforms?discount=20", isSpecial: true },
];


export function PLPHeader({
  title,
  description,
  breadcrumbs,
  totalProducts,
  currentSort,
  onSortChange,
  isLoading = false,
}: PLPHeaderProps) {
  const pathname = usePathname();
  const [pills, setPills] = React.useState(CATEGORY_PILLS);

  React.useEffect(() => {
    fetch("/api/categories?format=navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const dynamicPills: CategoryPillItem[] = [{ label: "ALL", href: "/categories" }];

          data.data.forEach((cat: any) => {
            dynamicPills.push({
              label: cat.label || cat.name.toUpperCase(),
              href: `/shop/${cat.slug}`,
            });

            if (Array.isArray(cat.children)) {
              cat.children.forEach((child: any) => {
                dynamicPills.push({
                  label: child.label || child.name.toUpperCase(),
                  href: `/shop/${cat.slug}/${child.slug}`,
                });
              });
            }
          });

          dynamicPills.push({
            label: "OFFERS",
            href: "/shop/school-uniforms?discount=20",
            isSpecial: true,
          });

          setPills(dynamicPills);
        }
      })
      .catch((err) => console.error("PLPHeader nav load error:", err));
  }, []);

  return (
    <div className="mb-4 sm:mb-6">
      {/* Category Pill Sub-Navigation */}
      <div className="mb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 bg-white">
        <nav
          className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-2.5 sm:py-3 text-[11px] sm:text-xs font-black tracking-wider uppercase"
          aria-label="Category sub-navigation"
        >
          {pills.map((pill) => {
            const pillSlug = pill.href.replace("/shop/", "").replace("/category/", "").replace("/", "");
            const isMatch =
              pathname === pill.href ||
              (pill.href === "/categories" && (pathname === "/categories" || pathname === "/category")) ||
              (pillSlug && pathname.includes(pillSlug) && pill.href !== "/categories");

            return (
              <Link
                key={pill.label}
                href={pill.href}
                className={cn(
                  "shrink-0 rounded-full px-3.5 sm:px-4 py-1.5 transition-all duration-200 whitespace-nowrap",
                  isMatch
                    ? "bg-brand-navy-950 text-white shadow-xs"
                    : "text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100/80",
                  pill.isSpecial &&
                    !isMatch &&
                    "text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100"
                )}
              >
                {pill.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Semantic Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-3 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap"
      >
        <Link
          href="/"
          className="hover:text-brand-navy-950 transition-colors font-semibold text-slate-600"
        >
          Home
        </Link>
        {breadcrumbs
          .filter((item) => item.label.toLowerCase() !== "home")
          .map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-brand-navy-950 transition-colors font-semibold text-slate-600"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-bold text-brand-navy-950 truncate max-w-[220px] sm:max-w-none">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
      </nav>

      {/* Main Bar: Products Count & Sort Dropdown */}
      <div className="flex items-center justify-between pt-1 pb-3 border-b border-slate-200">
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-black text-brand-navy-950">
            {isLoading ? "Updating..." : `${totalProducts} Products`}
          </span>
        </div>

        {/* Desktop Sort Dropdown */}
        <div className="hidden lg:flex items-center gap-2">
          <label
            htmlFor="desktop-sort"
            className="text-xs font-bold text-slate-500 flex items-center gap-1.5"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <span>Sort by</span>
          </label>
          <select
            id="desktop-sort"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-brand-navy-950 shadow-2xs focus:border-brand-navy-900 focus:outline-hidden cursor-pointer hover:border-slate-300 transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
