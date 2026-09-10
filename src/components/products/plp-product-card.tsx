"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export interface PLPProductItem {
  id: string;
  name: string;
  title?: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  category?: { name: string; slug: string } | null;
  categoryName?: string;
  brand?: { name: string; slug: string } | null;
  school?: { name: string; slug: string } | null;
  schoolName?: string | null;
  schools?: Array<{ name: string; slug: string }>;
  isBestseller?: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  images?: Array<{ url: string; alt?: string | null }>;
  imageUrl?: string;
  variants?: Array<{
    id: string;
    size: string;
    color?: string | null;
    sellingPrice: number;
    isAvailable: boolean;
  }>;
}

export interface PLPProductCardProps {
  product: PLPProductItem;
  isWishlisted?: boolean;
  onWishlistToggle?: (productId: string) => void;
}

export function PLPProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle,
}: PLPProductCardProps) {
  const [wishlistActive, setWishlistActive] = React.useState(isWishlisted);

  const displayTitle = product.name || product.title || "School Uniform Item";
  const displayImage =
    product.imageUrl ||
    (product.images && product.images.length > 0 ? product.images[0].url : null) ||
    "/images/shirt.jpg";

  const mrp = Number(product.mrp || 0);
  const sellingPrice = Number(product.sellingPrice || 0);
  const hasDiscount = mrp > sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;

  const isNewItem = product.slug.includes("blazer") || product.isFeatured;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlistActive;
    setWishlistActive(nextState);
    if (nextState) {
      toast.success(`${displayTitle} added to your wishlist!`);
    } else {
      toast.info(`${displayTitle} removed from wishlist.`);
    }
    onWishlistToggle?.(product.id);
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 sm:p-3.5 shadow-2xs hover:shadow-card transition-all duration-300 hover:-translate-y-1">
      {/* Top Image Frame */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50/70 flex items-center justify-center">
        {/* Floating Badges */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          {product.isBestseller && (
            <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-white shadow-2xs">
              Best Seller
            </span>
          )}
          {!product.isBestseller && isNewItem && (
            <span className="rounded-md bg-brand-yellow-400 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-brand-navy-950 shadow-2xs">
              New
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 backdrop-blur-xs text-slate-400 shadow-2xs hover:bg-white hover:text-red-500 hover:scale-110 active:scale-95 transition-all"
          aria-label={
            wishlistActive
              ? `Remove ${displayTitle} from wishlist`
              : `Add ${displayTitle} to wishlist`
          }
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              wishlistActive ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* Product Image */}
        <Link
          href={`/product/${product.slug}`}
          className="relative h-full w-full flex items-center justify-center p-3"
        >
          <Image
            src={displayImage}
            alt={displayTitle}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>
      </div>

      {/* Product Content Details */}
      <div className="mt-2.5 sm:mt-3 flex flex-col gap-1.5 flex-1 justify-between">
        <div>
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-brand-navy-950 hover:text-brand-navy-700 transition-colors leading-snug">
              {displayTitle}
            </h3>
          </Link>
        </div>

        {/* Pricing Row matching Mockup */}
        <div className="mt-0.5 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-black text-brand-navy-950 font-sans">
            ₹{sellingPrice.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
              ₹{mrp.toLocaleString("en-IN")}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[10px] sm:text-xs font-black text-emerald-600">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
