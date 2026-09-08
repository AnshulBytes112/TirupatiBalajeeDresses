"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Price } from "./price";
import { Rating } from "./rating";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  id: string;
  title: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  imageUrl?: string;
  isBestseller?: boolean;
  categoryName?: string;
  schoolName?: string | null;
  rating?: number;
  reviewsCount?: number;
  onWishlistToggle?: (id: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

export function ProductCard({
  id,
  title,
  slug,
  basePrice,
  salePrice,
  imageUrl,
  isBestseller,
  categoryName,
  schoolName,
  rating = 4.8,
  reviewsCount = 24,
  onWishlistToggle,
  isWishlisted = false,
  className,
}: ProductCardProps) {
  const currentPrice = salePrice || basePrice;
  const originalPrice = salePrice ? basePrice : undefined;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-3 sm:p-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Top Header inside Card */}
      <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-brand-cream-50 flex items-center justify-center">
        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1.5">
          {isBestseller && (
            <Badge variant="bestseller">Best Seller</Badge>
          )}
          {schoolName && (
            <Badge variant="school" className="text-[10px] bg-white/90 backdrop-blur-xs">
              {schoolName}
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle?.(id);
          }}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-slate-500 shadow-subtle hover:bg-white hover:text-red-500 hover:scale-110 active:scale-90 transition-all"
          aria-label="Add to wishlist"
        >
          <Heart
            className={cn(
              "h-4 w-4",
              isWishlisted && "fill-red-500 text-red-500"
            )}
          />
        </button>

        {/* Product Image */}
        <Link href={`/product/${slug}`} className="relative h-full w-full flex items-center justify-center p-3">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          {categoryName && (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {categoryName}
            </p>
          )}

          <Link href={`/product/${slug}`}>
            <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-brand-navy-950 hover:text-brand-navy-700 transition-colors leading-snug">
              {title}
            </h3>
          </Link>
        </div>

        <div>
          <Rating rating={rating} reviewsCount={reviewsCount} size="sm" className="mb-1" />
          <Price
            price={currentPrice}
            originalPrice={originalPrice}
            size="md"
            showDiscountBadge={true}
          />
        </div>
      </div>
    </div>
  );
}
