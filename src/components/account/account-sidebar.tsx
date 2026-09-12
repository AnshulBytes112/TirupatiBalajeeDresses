"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Shield,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    label: "My Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Saved Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Help & Support",
    href: "/account/support",
    icon: HelpCircle,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const isSuperAdmin = profile?.role === "SUPER_ADMIN" || profile?.role === "ADMIN";

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* Customer Quick Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy-950 font-black text-amber-400 text-lg shadow-xs">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-black text-slate-900">
              {profile?.name || "Valued Customer"}
            </h3>
            <p className="truncate text-xs text-slate-500">
              {profile?.email || "Signed in"}
            </p>
          </div>
        </div>

        {isSuperAdmin && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-300/40 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-500/20 transition"
            >
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-amber-700" />
                <span>Super Admin Panel</span>
              </div>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition",
                isActive
                  ? "bg-brand-navy-950 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-amber-400" : "text-slate-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
