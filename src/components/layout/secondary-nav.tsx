"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

const SECONDARY_NAV_ITEMS: NavItem[] = [
  { label: "ALL", href: "/" },
  { label: "SCHOOL UNIFORMS", href: "/category/school-uniforms" },
  { label: "THERMALS", href: "/category/thermals" },
  { label: "SCHOOL SHOES", href: "/category/school-shoes" },
  { label: "BAGS", href: "/category/school-bags" },
  { label: "STATIONERY", href: "/category/stationery" },
  { label: "ACCESSORIES", href: "/category/belts-accessories" },
  { label: "LUNCH BOXES", href: "/category/lunch-boxes" },
  { label: "WATER BOTTLES", href: "/category/water-bottles" },
  { label: "COMBOS", href: "/combos" },
  { label: "OFFERS", href: "/offers", isSpecial: true },
];

interface SecondaryNavProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
}

export function SecondaryNav({
  activeCategory = "ALL",
  onSelectCategory,
  className,
}: SecondaryNavProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-full bg-white border-b border-slate-100 shadow-xs relative z-30",
        className
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-2.5 sm:py-3 text-[11px] sm:text-xs font-black tracking-wider text-slate-700 uppercase"
          aria-label="Secondary navigation"
        >
          {SECONDARY_NAV_ITEMS.map((item) => {
            const isMatch =
              item.label === activeCategory ||
              (item.href === "/" && pathname === "/" && activeCategory === "ALL");

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(item.label);
                  }
                }}
                className={cn(
                  "shrink-0 rounded-full px-3 sm:px-4 py-1.5 transition-all duration-200 whitespace-nowrap",
                  isMatch
                    ? "bg-brand-navy-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100/80",
                  item.isSpecial &&
                    !isMatch &&
                    "text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
