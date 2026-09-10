"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  // Hide general bottom nav on Product Detail Pages and Admin pages to give full priority to PDP CTA
  if (pathname?.startsWith("/product/") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/categories", icon: LayoutGrid },
    { label: "Cart", href: "/cart", icon: ShoppingBag, badge: 0 },
    { label: "Account", href: "/account", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 block lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-4 py-2 shadow-lg">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-bold text-slate-500 transition-colors",
                isActive && "text-brand-navy-950"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-yellow-400 px-1 text-[9px] font-black text-brand-navy-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-brand-yellow-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
