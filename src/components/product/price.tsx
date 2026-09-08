import * as React from "react";
import { formatINR, calculateDiscount, cn } from "@/lib/utils";

export interface PriceProps {
  price: number;
  originalPrice?: number | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showDiscountBadge?: boolean;
}

const sizeClasses = {
  sm: {
    current: "text-sm font-bold",
    original: "text-xs",
    discount: "text-[10px] px-1.5 py-0.2",
  },
  md: {
    current: "text-base font-extrabold",
    original: "text-xs",
    discount: "text-xs px-1.5 py-0.5",
  },
  lg: {
    current: "text-xl font-extrabold",
    original: "text-sm",
    discount: "text-xs px-2 py-0.5",
  },
  xl: {
    current: "text-2xl font-black sm:text-3xl",
    original: "text-base",
    discount: "text-sm px-2.5 py-1",
  },
};

export function Price({
  price,
  originalPrice,
  size = "md",
  className,
  showDiscountBadge = true,
}: PriceProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount ? calculateDiscount(originalPrice, price) : 0;
  const styles = sizeClasses[size];

  return (
    <div className={cn("inline-flex items-center gap-2 flex-wrap", className)}>
      <span className={cn("text-brand-navy-950 tracking-tight", styles.current)}>
        {formatINR(price)}
      </span>

      {hasDiscount && (
        <>
          <span className={cn("text-slate-400 line-through font-medium", styles.original)}>
            {formatINR(originalPrice)}
          </span>

          {showDiscountBadge && discountPercent > 0 && (
            <span
              className={cn(
                "rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200",
                styles.discount
              )}
            >
              {discountPercent}% OFF
            </span>
          )}
        </>
      )}
    </div>
  );
}
