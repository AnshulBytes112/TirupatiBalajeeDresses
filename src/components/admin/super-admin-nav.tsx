"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  ShoppingBag,
  FolderTree,
  Layout,
  Truck,
  Users,
  Shield,
  ExternalLink,
  Lock,
  Sparkles,
  GraduationCap,
} from "lucide-react";

interface SuperAdminNavProps {
  activeTab?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Analytics Hub", icon: TrendingUp, match: (path: string) => path === "/admin" },
  { href: "/admin/products", label: "Products & Stock", icon: ShoppingBag, match: (path: string) => path.startsWith("/admin/products") },
  { href: "/admin/schools", label: "Schools & Bindings", icon: GraduationCap, match: (path: string) => path.startsWith("/admin/schools") },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, match: (path: string) => path.startsWith("/admin/categories") },
  { href: "/admin/homepage", label: "Homepage CMS", icon: Layout, match: (path: string) => path.startsWith("/admin/homepage") },
  { href: "/admin/shipping", label: "Shipping & Pincodes", icon: Truck, match: (path: string) => path.startsWith("/admin/shipping") },
  { href: "/admin/users", label: "Users & RBAC", icon: Users, match: (path: string) => path.startsWith("/admin/users") },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: Shield, match: (path: string) => path.startsWith("/admin/audit-logs") },
];

export function SuperAdminNav({ subtitle, actions }: SuperAdminNavProps) {
  const pathname = usePathname();

  const handleLockSession = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tirupati_admin_key");
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DCD3] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between py-3 border-b border-[#EFE8E0]">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1917] text-white shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-display font-black text-sm text-amber-400">TB</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-base text-[#1C1917] tracking-tight">
                    TirupatiBalajee CMS
                  </span>
                  <span className="rounded-full bg-[#1C1917] px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-amber-400 shadow-2xs">
                    SUPER ADMIN
                  </span>
                </div>
                {subtitle && (
                  <p className="text-[11px] font-medium text-stone-500">
                    {subtitle}
                  </p>
                )}
              </div>
            </Link>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-2">
            {actions}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD3] bg-white hover:bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-xs transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Live Storefront</span>
            </Link>

            <button
              onClick={handleLockSession}
              title="Lock Admin Session"
              className="inline-flex items-center gap-1 rounded-xl border border-[#E5DCD3] bg-white hover:bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-stone-600 shadow-xs transition-colors"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* Bottom Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
          {ADMIN_NAV_LINKS.map((link) => {
            const isActive = link.match(pathname);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-stone-600 hover:text-[#1C1917] hover:bg-[#EFE8E0]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-amber-400" : "text-stone-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
