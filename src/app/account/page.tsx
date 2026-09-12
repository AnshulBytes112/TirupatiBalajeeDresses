"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Shield,
  Key,
  PackageCheck,
  Heart,
  ShoppingBag,
  LogOut,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";

export default function AccountPage() {
  const router = useRouter();
  const [adminKey, setAdminKey] = React.useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const key = localStorage.getItem("tirupati_admin_key");
      setIsAdminLoggedIn(Boolean(key && key.trim()));
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      toast.error("Please enter a valid Admin Secret Key");
      return;
    }
    localStorage.setItem("tirupati_admin_key", adminKey.trim());
    setIsAdminLoggedIn(true);
    toast.success("Super-Admin session authenticated!");
    router.push("/admin");
  };

  const handleLogout = () => {
    localStorage.removeItem("tirupati_admin_key");
    localStorage.removeItem("user_session");
    setIsAdminLoggedIn(false);
    toast.success("Logged out successfully");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-brand-cream-50/40 py-8 sm:py-12">
      <Container size="md">
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-xl">
          {/* Header Profile Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-brand-navy-950 text-white flex items-center justify-center font-black text-xl shadow-md">
                <User className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-brand-navy-950">
                    {isAdminLoggedIn ? "Administrator Account" : "Welcome to TirupatiBalajee"}
                  </h1>
                  {isAdminLoggedIn && (
                    <span className="rounded-full bg-brand-navy-950 px-2.5 py-0.5 text-[10px] font-black uppercase text-amber-400">
                      Super Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAdminLoggedIn
                    ? "Active administrative session with catalog & affiliation permissions"
                    : "Manage your uniform orders, tracking, and school dress preferences"}
                </p>
              </div>
            </div>

            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            )}
          </div>

          {/* Quick Access Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <Link
              href="/track-order"
              className="rounded-2xl border border-slate-200 p-4 hover:border-brand-navy-900 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy-950">Track Orders</h3>
                  <p className="text-[11px] text-slate-500">View shipment and dispatch status</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/wishlist"
              className="rounded-2xl border border-slate-200 p-4 hover:border-brand-navy-900 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy-950">Saved Wishlist</h3>
                  <p className="text-[11px] text-slate-500">Your saved school uniforms & items</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/categories"
              className="rounded-2xl border border-slate-200 p-4 hover:border-brand-navy-900 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy-950">School Uniforms Directory</h3>
                  <p className="text-[11px] text-slate-500">Browse by school affiliation</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/cart"
              className="rounded-2xl border border-slate-200 p-4 hover:border-brand-navy-900 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-brand-navy-950">Shopping Bag</h3>
                  <p className="text-[11px] text-slate-500">Proceed to checkout</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Super-Admin Management Block */}
          {isAdminLoggedIn ? (
            <div className="rounded-2xl bg-stone-900 text-white p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-400" />
                  <h3 className="text-base font-black uppercase tracking-wider text-amber-400">
                    Super-Admin Management Portal
                  </h3>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  Session Active
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Link
                  href="/admin"
                  className="rounded-xl bg-stone-800 hover:bg-stone-700 p-3 text-center text-xs font-bold text-white transition-colors"
                >
                  Analytics Hub
                </Link>
                <Link
                  href="/admin/schools"
                  className="rounded-xl bg-brand-yellow-400 hover:bg-yellow-300 p-3 text-center text-xs font-black text-brand-navy-950 transition-colors"
                >
                  Schools &amp; Bindings
                </Link>
                <Link
                  href="/admin/products"
                  className="rounded-xl bg-stone-800 hover:bg-stone-700 p-3 text-center text-xs font-bold text-white transition-colors"
                >
                  Products &amp; Stock
                </Link>
                <Link
                  href="/admin/homepage"
                  className="rounded-xl bg-stone-800 hover:bg-stone-700 p-3 text-center text-xs font-bold text-white transition-colors"
                >
                  Homepage CMS
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-black text-brand-navy-950 uppercase tracking-wider">
                  Admin &amp; Staff Login
                </h3>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Store managers and administrators can enter their secret key below to unlock CMS access.
              </p>
              <form onSubmit={handleAdminLogin} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Key className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter Super-Admin Secret Key..."
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs font-mono font-bold focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-400 shadow-sm hover:bg-stone-900 transition-colors cursor-pointer"
                >
                  Authenticate
                </button>
              </form>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
