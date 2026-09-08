import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  rating: number;
  maxRating?: number;
  reviewsCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showCount?: boolean;
}

export function Rating({
  rating,
  maxRating = 5,
  reviewsCount,
  size = "sm",
  className,
  showCount = true,
}: RatingProps) {
  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalf = !isFilled && index < rating;

          return (
            <Star
              key={index}
              className={cn(
                iconSizes[size],
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-slate-100 text-slate-300"
              )}
            />
          );
        })}
      </div>

      <span className="text-xs font-bold text-brand-navy-900">{rating.toFixed(1)}</span>

      {showCount && reviewsCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewsCount})</span>
      )}
    </div>
  );
}
