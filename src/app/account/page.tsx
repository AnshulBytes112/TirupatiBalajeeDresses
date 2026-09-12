"use client";

import * as React from "react";
import Link from "next/link";
import { AccountLayout } from "@/components/account/account-layout";
import { useAuth } from "@/context/auth-context";
import {
  Package,
  Heart,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function AccountOverviewPage() {
  const { profile } = useAuth();
  const [stats, setStats] = React.useState({
    ordersCount: 0,
    addressesCount: 0,
    wishlistCount: 0,
    reviewsCount: 0,
  });
  const [defaultAddress, setDefaultAddress] = React.useState<any>(null);
  const [recentOrders, setRecentOrders] = React.useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        const [profileRes, ordersRes, addressRes] = await Promise.all([
          fetch("/api/account/profile").then((r) => r.json()).catch(() => null),
          fetch("/api/account/orders?limit=3").then((r) => r.json()).catch(() => null),
          fetch("/api/account/addresses").then((r) => r.json()).catch(() => null),
        ]);

        if (profileRes?.data?.stats) {
          setStats(profileRes.data.stats);
        }
        if (ordersRes?.data) {
          setRecentOrders(ordersRes.data);
        }
        if (addressRes?.data) {
          const def = addressRes.data.find((a: any) => a.isDefault) || addressRes.data[0] || null;
          setDefaultAddress(def);
        }
      } finally {
        setIsLoadingData(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AccountLayout
      title={`Welcome back, ${profile?.name?.split(" ")[0] || "Friend"}!`}
      description="Manage your school dress orders, addresses, and account preferences in one place."
    >
      <div className="space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link
            href="/account/orders"
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-navy-900 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-blue-50 p-2.5 text-brand-navy-950">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-brand-navy-950">
                {stats.ordersCount}
              </span>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-600 group-hover:text-brand-navy-900">
              Total Orders
            </p>
          </Link>

          <Link
            href="/account/wishlist"
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-navy-900 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600">
                <Heart className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-brand-navy-950">
                {stats.wishlistCount}
              </span>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-600 group-hover:text-rose-600">
              Saved Items
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-brand-navy-900 hover:shadow-md col-span-2 sm:col-span-1"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-black text-brand-navy-950">
                {stats.addressesCount}
              </span>
            </div>
            <p className="mt-3 text-xs font-bold text-slate-600 group-hover:text-amber-800">
              Saved Addresses
            </p>
          </Link>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Shipping Address */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-black text-slate-900">Default Shipping Address</h3>
                </div>
                <Link
                  href="/account/addresses"
                  className="text-xs font-bold text-brand-navy-900 hover:underline"
                >
                  Manage
                </Link>
              </div>

              {defaultAddress ? (
                <div className="mt-4 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{defaultAddress.fullName}</span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900">
                      DEFAULT
                    </span>
                  </div>
                  <p>{defaultAddress.addressLine1}</p>
                  {defaultAddress.addressLine2 && <p>{defaultAddress.addressLine2}</p>}
                  <p>
                    {defaultAddress.city}, {defaultAddress.state} - <span className="font-mono font-semibold">{defaultAddress.postalCode}</span>
                  </p>
                  <p className="text-slate-500 pt-1">Phone: {defaultAddress.phoneNumber}</p>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  <p>No addresses added yet.</p>
                  <Link
                    href="/account/addresses"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-brand-navy-900 hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add your first delivery address</span>
                  </Link>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
              <span>Verified Delivery Address</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            </div>
          </div>

          {/* Quick Support & Delivery Tracker Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-900" />
                  <h3 className="text-sm font-black text-slate-900">Delivery Assistance</h3>
                </div>
                <Link
                  href="/account/support"
                  className="text-xs font-bold text-brand-navy-900 hover:underline"
                >
                  Help Center
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-amber-50/60 border border-amber-200/50 p-3 text-xs text-amber-950">
                  <p className="font-bold">Need help with sizing or school dress requirements?</p>
                  <p className="text-amber-800/90 mt-0.5">
                    Our uniform specialists are available via WhatsApp and phone for immediate sizing consultation.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">Fast Express Dispatch:</span>
                  <span className="font-bold text-emerald-700">Same Day / 24 Hours</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-50">
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-navy-950 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition"
              >
                <span>Browse Store Catalog</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900">Recent Orders</h3>
            <Link
              href="/account/orders"
              className="text-xs font-bold text-brand-navy-900 hover:underline"
            >
              View All Orders
            </Link>
          </div>

          <div className="mt-4">
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          #{order.orderNumber}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900 uppercase">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {order.items?.length || 1} items &bull; Total: ₹{order.totalAmount}
                      </p>
                    </div>

                    <Link
                      href="/account/orders"
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                <Package className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                <p>You haven&apos;t placed any orders yet.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-brand-navy-900 hover:underline"
                >
                  <span>Start shopping uniform sets</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
