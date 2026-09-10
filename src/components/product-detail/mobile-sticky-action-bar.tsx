"use client";

import * as React from "react";
import { ShoppingBag, Zap, Heart, XCircle } from "lucide-react";
import { VariantDTO } from "./variant-selector";

interface MobileStickyActionBarProps {
  variant: VariantDTO | null;
  basePrice: number;
  baseMrp: number;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isAddingToCart: boolean;
}

export function MobileStickyActionBar({
  variant,
  basePrice,
  baseMrp,
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onBuyNow,
  isAddingToCart,
}: MobileStickyActionBarProps) {
  const isOutOfStock = variant ? !variant.isAvailable : false;
  const currentPrice = variant?.sellingPrice ?? basePrice;
  const currentMrp = variant?.mrp ?? baseMrp;
  const discountPct = currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 block border-t border-slate-200 bg-white/95 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between gap-3">
        {/* Price & Variant Pill */}
        <div className="flex flex-col min-w-[90px]">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-slate-900">₹{currentPrice}</span>
            {currentMrp > currentPrice && (
              <span className="text-xs text-slate-400 line-through">₹{currentMrp}</span>
            )}
          </div>
          <span className="truncate text-[10px] font-semibold text-slate-500">
            {variant ? `${variant.size}${variant.color ? ` • ${variant.color}` : ""}` : "Select Option"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-1 items-center gap-2">
          {/* Wishlist Icon */}
          <button
            type="button"
            onClick={onWishlistToggle}
            aria-label="Wishlist"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition ${
              isWishlisted
                ? "border-rose-300 bg-rose-50 text-rose-600"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-600" : ""}`} />
          </button>

          {isOutOfStock ? (
            <div className="flex h-11 flex-1 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
              <XCircle className="mr-1.5 h-4 w-4 text-rose-500" />
              Out of Stock
            </div>
          ) : (
            <>
              {/* Add to Cart */}
              <button
                type="button"
                onClick={onAddToCart}
                disabled={isAddingToCart}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-blue-900 bg-white text-xs font-bold text-blue-900 transition active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                ADD TO CART
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={onBuyNow}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-yellow-400 text-xs font-extrabold text-blue-950 shadow transition active:scale-95 hover:bg-yellow-300"
              >
                <Zap className="h-4 w-4 fill-blue-950" />
                BUY NOW
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
