"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  isBestseller?: boolean;
  category?: { name: string; slug: string };
  imageUrl?: string;
}

interface ProductCarouselSectionProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  products?: ProductItem[];
  isLoading?: boolean;
  className?: string;
}

export function ProductCarouselSection({
  title = "Trending Now",
  subtitle = "Most loved products by parents and students alike",
  viewAllHref = "/products?filter=trending",
  products = [],
  isLoading = false,
  className,
}: ProductCarouselSectionProps) {
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-brand-navy-950">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-black text-brand-navy-950 hover:text-brand-navy-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 6 Products Grid matching reference */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-3 space-y-2.5">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3.5 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
            {products.slice(0, 6).map((item) => {
              const discountPercent =
                item.mrp && item.sellingPrice
                  ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
                  : 0;

              const isWish = !!wishlist[item.id];

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-2.5 sm:p-3 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Top Image Box */}
                  <div className="relative aspect-square w-full rounded-xl bg-[#F8FAFC] flex items-center justify-center p-2 overflow-hidden">
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(item.id, e)}
                      className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-400 hover:text-red-500 shadow-xs transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 stroke-[1.5]",
                          isWish && "fill-red-500 text-red-500"
                        )}
                      />
                    </button>

                    {/* Best Seller Badge (Bottom Left of Image) */}
                    {item.isBestseller && (
                      <div className="absolute left-2 bottom-2 z-10">
                        <span className="rounded-md bg-[#15803D] px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                          Best Seller
                        </span>
                      </div>
                    )}

                    {/* Product Photo */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative h-full w-full flex items-center justify-center group-hover:scale-105 transition-transform"
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 640px) 50vw, 200px"
                        />
                      ) : (
                        <div className="text-slate-300">
                          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="mt-2.5 flex flex-col justify-between flex-1">
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="line-clamp-1 text-xs sm:text-[13px] font-semibold text-slate-900 group-hover:text-brand-navy-800 transition-colors leading-tight">
                        {item.name}
                      </h3>
                    </Link>

                    {/* Price and Discount Row */}
                    <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-slate-900">
                        ₹{item.sellingPrice}
                      </span>
                      {item.mrp > item.sellingPrice && (
                        <>
                          <span className="text-[10.5px] sm:text-xs text-slate-400 line-through">
                            ₹{item.mrp}
                          </span>
                          <span className="text-[10.5px] sm:text-xs font-bold text-[#15803D]">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
