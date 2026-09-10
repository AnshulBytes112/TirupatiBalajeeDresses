"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Sparkles, Clock, ArrowRight } from "lucide-react";

export interface RelatedProductItem {
  id: string;
  title: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  isBestseller: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  school?: string | null;
  imageUrl: string;
}

interface RelatedProductsSectionProps {
  currentProductId: string;
  currentProductSlug: string;
  relatedProducts: RelatedProductItem[];
}

export function RelatedProductsSection({
  currentProductId,
  currentProductSlug,
  relatedProducts,
}: RelatedProductsSectionProps) {
  const [recentlyViewed, setRecentlyViewed] = React.useState<RelatedProductItem[]>([]);

  // Update Recently Viewed in localStorage and fetch items from server
  React.useEffect(() => {
    try {
      const storageKey = "tbd_recently_viewed_ids";
      const stored = localStorage.getItem(storageKey);
      let ids: string[] = stored ? JSON.parse(stored) : [];

      // Add current product ID to the front if not present, and limit to 10
      ids = [currentProductId, ...ids.filter((id) => id !== currentProductId)].slice(0, 10);
      localStorage.setItem(storageKey, JSON.stringify(ids));

      // Fetch the other items (excluding the current one)
      const otherIds = ids.filter((id) => id !== currentProductId).slice(0, 6);
      if (otherIds.length > 0) {
        fetch("/api/products/recently-viewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: otherIds }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success && Array.isArray(json.data)) {
              setRecentlyViewed(json.data);
            }
          })
          .catch(() => {});
      }
    } catch {
      // LocalStorage or private browsing error fallback
    }
  }, [currentProductId]);

  return (
    <div className="space-y-12">
      {/* 1. YOU MAY ALSO LIKE */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                You May Also Like
              </h3>
              <p className="text-xs text-slate-500">
                Compatible items and matching uniform essentials
              </p>
            </div>
            <Link
              href="/shop/school-uniforms"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:underline"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCardItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 2. RECENTLY VIEWED */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-4 border-t border-slate-200 pt-10">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-900" />
            <h3 className="text-xl font-bold tracking-tight text-slate-900">
              Recently Viewed Products
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {recentlyViewed.map((p) => (
              <ProductCardItem key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCardItem({ product }: { product: RelatedProductItem }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-blue-900 hover:shadow-md"
    >
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-50">
          {product.isBestseller && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              Bestseller
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              {product.discountPercentage}% OFF
            </span>
          )}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-2 transition duration-300 group-hover:scale-105"
          />
        </div>

        <div className="mt-2.5">
          {product.school && (
            <span className="block truncate text-[11px] font-semibold text-blue-900">
              {product.school}
            </span>
          )}
          <h4 className="line-clamp-2 text-xs font-bold text-slate-900 group-hover:text-blue-900">
            {product.name}
          </h4>
        </div>
      </div>

      <div className="mt-2.5 border-t border-slate-100 pt-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-extrabold text-slate-900">
            ₹{product.sellingPrice}
          </span>
          {product.mrp > product.sellingPrice && (
            <span className="text-xs text-slate-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-slate-700">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span>{Number(product.rating || 4.8).toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({product.reviewCount || 12})</span>
        </div>
      </div>
    </Link>
  );
}
