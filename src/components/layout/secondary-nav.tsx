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

const DEFAULT_NAV_ITEMS: NavItem[] = [
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

interface SecondaryNavProps {
  activeCategory?: string;
  onSelectCategory?: (category: string) => void;
  className?: string;
  items?: NavItem[];
}

export function SecondaryNav({
  activeCategory,
  onSelectCategory,
  className,
  items,
}: SecondaryNavProps) {
  const pathname = usePathname();
  const [navItems, setNavItems] = React.useState<NavItem[]>(items || DEFAULT_NAV_ITEMS);

  // Fetch dynamic categories from backend if items not provided directly
  React.useEffect(() => {
    if (items && items.length > 0) return;

    fetch("/api/categories?format=navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const dynamicPills: NavItem[] = [{ label: "ALL", href: "/categories" }];

          data.data.forEach((cat: any) => {
            dynamicPills.push({
              label: cat.label || cat.name.toUpperCase(),
              href: `/shop/${cat.slug}`,
            });

            // Include primary children if any (e.g. Summer Dress, Winter Dress)
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

          setNavItems(dynamicPills);
        }
      })
      .catch((err) => {
        console.error("Failed to load dynamic navigation:", err);
      });
  }, [items]);

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
          {navItems.map((item) => {
            const itemSlug = item.href.replace("/shop/", "").replace("/category/", "").replace("/", "");
            const isMatch =
              pathname === item.href ||
              (item.href === "/categories" && (pathname === "/categories" || pathname === "/category")) ||
              (itemSlug && pathname.includes(itemSlug) && item.href !== "/categories") ||
              (item.label === activeCategory);

            return (
              <Link
                key={item.href + item.label}
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
