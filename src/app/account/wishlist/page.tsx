"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AccountLayout } from "@/components/account/account-layout";
import { toast } from "sonner";
import { Heart, ShoppingBag, Trash2, ArrowRight, Loader2, Star } from "lucide-react";

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    sellingPrice: number;
    mrp: number;
    rating: number;
    category?: { name: string };
    images?: Array<{ url: string; alt?: string | null }>;
  };
}

export default function AccountWishlistPage() {
  const [items, setItems] = React.useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchWishlist = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/wishlist");
      const json = await res.json();
      if (json.success && json.data) {
        setItems(json.data);
      }
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/account/wishlist?id=${itemId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Item removed from wishlist");
        fetchWishlist();
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  return (
    <AccountLayout
      title="Saved Wishlist"
      description="Keep track of uniform items, blazers, and shoes you plan to purchase."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
          <Link
            href="/shop"
            className="text-xs font-bold text-brand-navy-900 hover:underline"
          >
            Continue Shopping
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-brand-navy-950" />
            <p className="mt-2 text-xs text-slate-500">Loading your wishlist...</p>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const p = item.product;
              const imgUrl = p.images?.[0]?.url || "/images/shirt.jpg";
              const discount =
                p.mrp > p.sellingPrice
                  ? Math.round(((Number(p.mrp) - Number(p.sellingPrice)) / Number(p.mrp)) * 100)
                  : 0;

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:shadow-md"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50">
                      <Image
                        src={imgUrl}
                        alt={p.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      {discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-black uppercase text-white shadow-xs">
                          {discount}% OFF
                        </span>
                      )}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-400 shadow-xs backdrop-blur-xs hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="mt-3">
                      {p.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {p.category.name}
                        </span>
                      )}
                      <h4 className="line-clamp-2 text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-navy-900 transition">
                        <Link href={`/product/${p.slug}`}>{p.name}</Link>
                      </h4>

                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-sm font-black text-slate-900">
                          ₹{Number(p.sellingPrice).toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{Number(p.mrp).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-brand-navy-950 py-2 text-xs font-bold text-white hover:bg-brand-navy-800 transition"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
                      <span>View Options & Buy</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <Heart className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-900">Your wishlist is empty</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Save uniform items, sports tracksuits, and school accessories while browsing to easily buy them later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-5 rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition"
            >
              <span>Browse Store Catalog</span>
              <ArrowRight className="h-4 w-4 text-amber-400" />
            </Link>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
