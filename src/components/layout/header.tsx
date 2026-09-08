"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  PhoneCall,
  MapPin,
  Truck,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-nav">
      {/* 1. Top Announcement Bar */}
      <div className="bg-brand-navy-950 text-white text-[11px] sm:text-xs py-2 px-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <Truck className="h-3.5 w-3.5 text-brand-yellow-400" />
              Free Shipping on orders above ₹999
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium text-slate-200">
              <RefreshCcw className="h-3.5 w-3.5 text-brand-yellow-400" />
              Easy Returns & Exchanges
            </span>
            <span className="hidden lg:flex items-center gap-1.5 font-medium text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-yellow-400" />
              100% Genuine Products
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            {siteConfig.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-yellow-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Desktop Header */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5 gap-4 lg:gap-8">
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden rounded-full p-2 text-brand-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex flex-col group">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-brand-navy-950">
                  Tirupati<span className="text-brand-navy-800">Balajee</span>
                </span>
                <span className="rounded bg-brand-yellow-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-brand-navy-950 tracking-wider">
                  Dresses
                </span>
              </div>
              <span className="text-[9px] tracking-wider text-slate-400 font-semibold uppercase">
                Dress Them For A Brighter Tomorrow
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-extrabold tracking-wide text-brand-navy-900">
            {siteConfig.navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-brand-navy-700",
                    isActive && "text-brand-navy-950 font-black",
                    link.isSpecial &&
                      "rounded-full bg-brand-pastel-pink px-3 py-1 text-brand-pastel-pink-text font-black hover:bg-pink-100"
                  )}
                >
                  {link.label}
                  {isActive && !link.isSpecial && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-yellow-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for uniforms, thermals, bags..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 px-4 py-2 pl-10 text-xs sm:text-sm text-brand-navy-950 placeholder:text-slate-400 focus:border-brand-yellow-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-yellow-400/20 transition-all"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Actions: Account, Wishlist, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              href="/account"
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="User account"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-navy-900 hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-navy-950 px-1 text-[10px] font-bold text-white">
                0
              </span>
            </Link>

            <Link
              href="/cart"
              className="relative flex h-10 items-center gap-2 rounded-full bg-brand-yellow-400 px-3.5 sm:px-4 py-2 font-bold text-xs sm:text-sm text-brand-navy-950 shadow-sm hover:bg-brand-yellow-500 transition-all active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-navy-950 text-[10px] font-black text-white">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uniforms, thermals, bags..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/70 px-4 py-2 pl-10 text-xs text-brand-navy-950 placeholder:text-slate-400 focus:border-brand-yellow-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-yellow-400/20"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="TirupatiBalajee Dresses"
      >
        <div className="flex flex-col gap-6 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Categories
            </span>
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-bold text-brand-navy-900 hover:bg-slate-100 transition-colors",
                  link.isSpecial && "bg-brand-pastel-pink text-brand-pastel-pink-text"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Links
            </span>
            {siteConfig.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-brand-navy-950"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="rounded-2xl bg-brand-cream-100 p-4 text-xs space-y-2 text-slate-600">
            <p className="font-bold text-brand-navy-950">Customer Assistance</p>
            <p className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-brand-navy-800" />
              {siteConfig.contact.phone}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-brand-navy-800" />
              Delhi NCR, India
            </p>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
