"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AccountLayout } from "@/components/account/account-layout";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  ExternalLink,
  Loader2,
  Calendar,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  sku: string;
  variantName?: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
  variant?: {
    product?: {
      images?: Array<{ url: string; alt?: string | null }>;
    };
  };
}

interface CustomerOrder {
  id: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  createdAt: string;
  items: OrderItem[];
  address?: {
    fullName: string;
    city: string;
    state: string;
    postalCode: string;
  } | null;
}

export default function AccountOrdersPage() {
  const [orders, setOrders] = React.useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/account/orders");
        const json = await res.json();
        if (json.success && json.data) {
          setOrders(json.data);
        }
      } catch {
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  const getStatusBadgeClass = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-amber-100 text-amber-900 border-amber-200";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <AccountLayout
      title="My Orders"
      description="Track and view details of your past and current uniform orders."
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-brand-navy-950" />
            <p className="mt-2 text-xs text-slate-500">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-mono font-black text-sm text-slate-900">
                        Order #{order.orderNumber}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500">Order Total:</span>
                    <p className="text-base font-black text-slate-900">
                      ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100 py-2">
                  {order.items?.map((item) => {
                    const imgUrl =
                      item.variant?.product?.images?.[0]?.url || "/images/shirt.jpg";
                    return (
                      <div key={item.id} className="py-3 flex items-center gap-4">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                          <Image
                            src={imgUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900">
                            {item.productName}
                          </h4>
                          {item.variantName && (
                            <p className="text-xs text-slate-500">{item.variantName}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-0.5">
                            Qty: {item.quantity} &bull; ₹{Number(item.unitPrice)} each
                          </p>
                        </div>

                        <div className="text-right text-xs font-bold text-slate-900">
                          ₹{Number(item.total).toLocaleString("en-IN")}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                  <div className="text-slate-500">
                    {order.address && (
                      <span>
                        Delivery to: <strong className="text-slate-800">{order.address.fullName}</strong> ({order.address.city}, {order.address.postalCode})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/shop`}
                      className="rounded-xl border border-slate-200 px-3.5 py-1.5 font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Buy Again
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Package className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-900">No orders found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              When you purchase school uniforms, track pants, or accessories, your order tracking details will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-5 rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition"
            >
              <span>Explore Uniform Store</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </Link>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
