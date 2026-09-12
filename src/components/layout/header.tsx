"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  PackageCheck,
  HelpCircle,
  Shield,
  X,
  LogOut,
  LogIn,
  GraduationCap,
  FolderTree,
  ChevronDown,
  Sparkles,
  Layout,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "@/config/site";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Account Popover Dropdown State
  const [isAccountMenuOpen, setIsAccountMenuOpen] = React.useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);
  const accountMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Check if admin key exists in localStorage
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("tirupati_admin_key");
      setIsAdminLoggedIn(Boolean(key && key.trim()));
    }
  }, [pathname, isAccountMenuOpen]);

  // Click outside listener to close account menu
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("tirupati_admin_key");
      localStorage.removeItem("user_session");
      setIsAdminLoggedIn(false);
      setIsAccountMenuOpen(false);
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  React.useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    setSearchQuery(q);
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.delete("search");
    const queryStr = params.toString();
    router.push(queryStr ? `${pathname}?${queryStr}` : pathname);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-nav">
      {/* 1. ROW 1: Thin Top Utility Strip */}
      <div className="bg-[#13264F] text-white text-[11px] sm:text-xs py-1.5 px-4">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          {/* Left features */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="h-3.5 w-3.5 text-brand-yellow-400 shrink-0" />
              Free Shipping on orders above ₹999
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium">
              <RefreshCcw className="h-3.5 w-3.5 text-brand-yellow-400 shrink-0" />
              Easy Returns &amp; Exchanges
            </span>
            <span className="hidden lg:flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-brand-yellow-400 shrink-0" />
              100% Genuine Products
            </span>
          </div>

          {/* Right utility links */}
          <div className="hidden sm:flex items-center gap-5 text-slate-200 text-[11px] font-medium shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 bg-brand-yellow-400 text-brand-navy-950 font-black px-2.5 py-0.5 rounded-full hover:bg-yellow-300 transition-colors shadow-2xs"
            >
              <Shield className="h-3 w-3" />
              <span>Admin Portal</span>
            </Link>
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 hover:text-brand-yellow-400 transition-colors"
            >
              <PackageCheck className="h-3.5 w-3.5" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-1.5 hover:text-brand-yellow-400 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Help &amp; Support</span>
            </Link>
            <Link
              href="/stores"
              className="flex items-center gap-1.5 hover:text-brand-yellow-400 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Find a Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. ROW 2: Main Navigation Bar */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 gap-4 lg:gap-6">
          {/* Logo & Mobile Menu Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden rounded-lg p-1.5 text-brand-navy-950 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand Logo matching master design */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              {/* Logo Triangle Icon */}
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-navy-950 text-white shadow-xs">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-brand-yellow-400">
                  <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-base sm:text-lg font-black tracking-tight text-brand-navy-950 leading-none">
                    Tirupati<span className="text-brand-navy-800">Balajee</span>
                  </span>
                  <span className="text-[9px] font-black uppercase text-brand-navy-700 tracking-wider">
                    Dresses
                  </span>
                </div>
                <span className="text-[8px] sm:text-[8.5px] tracking-wide text-slate-500 font-bold uppercase leading-tight mt-0.5">
                  Dress Them For A Brighter Tomorrow
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-black tracking-wider text-brand-navy-950 uppercase">
            {siteConfig.navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 transition-colors hover:text-brand-navy-700 whitespace-nowrap",
                    isActive && "text-brand-navy-950 font-black",
                    link.isSpecial &&
                      "text-rose-600 hover:text-rose-700 font-black"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-yellow-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Input Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md relative items-center"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for uniforms, thermals, bags..."
              className="w-full rounded-full border border-slate-200 bg-slate-50/90 px-4 py-1.5 sm:py-2 pl-9 pr-10 text-xs sm:text-sm text-brand-navy-950 placeholder:text-slate-400 focus:border-brand-navy-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-brand-navy-900/20 transition-all"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy-950 cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>

          {/* Action Icons: Account Popover, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Account Icon with Interactive Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className={cn(
                  "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-brand-navy-950 hover:bg-slate-100 transition-colors relative cursor-pointer",
                  isAccountMenuOpen && "bg-slate-100 ring-2 ring-brand-navy-950/20"
                )}
                aria-label="User account menu"
                aria-expanded={isAccountMenuOpen}
              >
                <User className="h-4.5 w-4.5" />
                {isAdminLoggedIn && (
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Account Header / Status */}
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-brand-navy-950 uppercase tracking-wider">
                        {isAdminLoggedIn ? "Admin Session" : "My Account"}
                      </span>
                      {isAdminLoggedIn && (
                        <span className="rounded-full bg-brand-navy-950 px-2 py-0.5 text-[9px] font-black uppercase text-amber-400">
                          Super-Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {isAdminLoggedIn
                        ? "Full Store & Catalog Access"
                        : "Sign in for personalized orders"}
                    </p>
                  </div>

                  {/* Links List */}
                  <div className="py-1.5 space-y-0.5">
                    {isAdminLoggedIn ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-navy-950 hover:bg-amber-50/70 hover:text-amber-900 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-amber-500" />
                          <span>Super-Admin Hub</span>
                        </Link>
                        <Link
                          href="/admin/schools"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy-950 transition-colors"
                        >
                          <GraduationCap className="h-4 w-4 text-slate-500" />
                          <span>Schools &amp; Bindings</span>
                        </Link>
                        <Link
                          href="/admin/products"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy-950 transition-colors"
                        >
                          <ShoppingBag className="h-4 w-4 text-slate-500" />
                          <span>Products &amp; Stock</span>
                        </Link>
                        <Link
                          href="/admin/categories"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy-950 transition-colors"
                        >
                          <FolderTree className="h-4 w-4 text-slate-500" />
                          <span>Category CMS</span>
                        </Link>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy-950 transition-colors"
                        >
                          <User className="h-4 w-4 text-slate-500" />
                          <span>Customer View</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-brand-navy-950 hover:bg-slate-100 transition-colors"
                        >
                          <LogIn className="h-4 w-4 text-slate-600" />
                          <span>Sign In / Customer Account</span>
                        </Link>
                        <Link
                          href="/track-order"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-brand-navy-950 transition-colors"
                        >
                          <PackageCheck className="h-4 w-4 text-slate-500" />
                          <span>Orders &amp; Tracking</span>
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setIsAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 bg-amber-50/60 hover:bg-amber-100 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-amber-500" />
                          <span>Admin Login Portal</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1.5 mt-1 border-t border-slate-100">
                    {isAdminLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" />
                          <span>Logout / Lock Session</span>
                        </span>
                        <span className="text-[10px] uppercase font-mono text-rose-400">Exit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-slate-400" />
                        <span>Sign Out / Clear Cache</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-brand-navy-950 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-navy-950 px-1 text-[9px] font-black text-white">
                0
              </span>
            </Link>

            {/* Cart with Yellow Badge */}
            <Link
              href="/cart"
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-brand-navy-950 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-yellow-400 text-[9px] font-black text-brand-navy-950 px-1 shadow-xs">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="md:hidden px-4 pb-2.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search uniforms, thermals, bags..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 pl-9 pr-10 text-xs text-brand-navy-950 placeholder:text-slate-400 focus:border-brand-navy-900 focus:bg-white focus:outline-hidden"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy-950 cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="TirupatiBalajee Dresses"
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Account Profile Bar in Mobile Drawer */}
          <div className="rounded-2xl bg-stone-100 p-3.5 border border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-brand-navy-950 text-white flex items-center justify-center font-bold text-xs">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-brand-navy-950">
                    {isAdminLoggedIn ? "Super Admin Account" : "Storefront User"}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {isAdminLoggedIn ? "Logged in with Admin Key" : "Guest / Customer"}
                  </p>
                </div>
              </div>

              {isAdminLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-[10px] font-bold text-rose-600 hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg bg-brand-navy-950 px-2.5 py-1 text-[10px] font-bold text-amber-400 hover:bg-stone-900 flex items-center gap-1"
                >
                  <LogIn className="h-3 w-3" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {isAdminLoggedIn && (
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 flex items-center gap-2">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 rounded-lg bg-brand-yellow-400 py-1.5 text-center text-[11px] font-black uppercase tracking-wider text-brand-navy-950"
                >
                  Admin Hub
                </Link>
                <Link
                  href="/admin/schools"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-1 rounded-lg bg-white border border-stone-200 py-1.5 text-center text-[11px] font-bold text-brand-navy-950"
                >
                  Schools &amp; Bindings
                </Link>
              </div>
            )}
          </div>

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
                  "rounded-xl px-3 py-2 text-sm font-bold text-brand-navy-900 hover:bg-slate-100 transition-colors",
                  link.isSpecial && "text-rose-600"
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
            <Link
              href="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-navy-950 flex items-center gap-2"
            >
              <PackageCheck className="h-4 w-4 text-slate-500" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/help"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-navy-950 flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4 text-slate-500" />
              <span>Help &amp; Support</span>
            </Link>
            <Link
              href="/stores"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-navy-950 flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-slate-500" />
              <span>Find a Store</span>
            </Link>
          </div>

          <div className="rounded-2xl bg-brand-cream-100 p-4 text-xs space-y-2 text-slate-600">
            <p className="font-bold text-brand-navy-950">Customer Support</p>
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
