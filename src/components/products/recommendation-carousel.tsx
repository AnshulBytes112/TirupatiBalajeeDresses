"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export interface RecommendationItem {
  id: string;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  imageUrl?: string;
  rating?: number;
}

const DEFAULT_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: "rec-1",
    name: "School Shoes (Formal)",
    slug: "school-shoes-formal",
    mrp: 1399,
    sellingPrice: 999,
    imageUrl: "/images/shoes.jpg",
    rating: 4.8,
  },
  {
    id: "rec-2",
    name: "School Backpack",
    slug: "school-backpack",
    mrp: 1299,
    sellingPrice: 899,
    imageUrl: "/images/backpack.jpg",
    rating: 4.85,
  },
  {
    id: "rec-3",
    name: "Lunch Box (750ml)",
    slug: "lunch-box-750ml",
    mrp: 699,
    sellingPrice: 499,
    imageUrl: "/images/lunchbox.jpg",
    rating: 4.8,
  },
  {
    id: "rec-4",
    name: "Water Bottle (1L)",
    slug: "water-bottle-1l",
    mrp: 599,
    sellingPrice: 399,
    imageUrl: "/images/waterbottle.jpg",
    rating: 4.9,
  },
  {
    id: "rec-5",
    name: "Stationery Set",
    slug: "stationery-set",
    mrp: 499,
    sellingPrice: 299,
    imageUrl: "/images/stationery.jpg",
    rating: 4.85,
  },
];

export function RecommendationCarousel({
  items = DEFAULT_RECOMMENDATIONS,
  title = "You May Also Like",
}: {
  items?: RecommendationItem[];
  title?: string;
}) {
  const [wishlistMap, setWishlistMap] = React.useState<Record<string, boolean>>({});
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const toggleWishlist = (id: string, name: string) => {
    const isAdded = !wishlistMap[id];
    setWishlistMap((prev) => ({ ...prev, [id]: isAdded }));
    if (isAdded) {
      toast.success(`${name} added to your wishlist!`);
    } else {
      toast.info(`${name} removed from wishlist.`);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  return (
    <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-slate-200">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
          {title}
        </h2>
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            type="button"
            onClick={scrollLeft}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory"
      >
        {items.map((item) => {
          const discountPct =
            item.mrp > item.sellingPrice
              ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
              : 0;

          return (
            <div
              key={item.id}
              className="w-[165px] sm:w-[200px] lg:w-[220px] shrink-0 snap-start group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3 shadow-2xs hover:shadow-card transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 flex items-center justify-center">
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(item.id, item.name);
                  }}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-xs text-slate-400 shadow-xs hover:text-red-500 transition-colors"
                  aria-label={`Add ${item.name} to wishlist`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      wishlistMap[item.id] ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </button>

                <Link
                  href={`/product/${item.slug}`}
                  className="relative h-full w-full flex items-center justify-center p-2"
                >
                  <Image
                    src={item.imageUrl || "/images/shirt.jpg"}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    sizes="200px"
                  />
                </Link>
              </div>

              {/* Details */}
              <div className="mt-2 flex flex-col gap-1">
                <Link href={`/product/${item.slug}`}>
                  <h3 className="line-clamp-1 text-xs sm:text-sm font-bold text-brand-navy-950 hover:text-brand-navy-700 transition-colors">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-brand-navy-950">
                    ₹{item.sellingPrice.toLocaleString("en-IN")}
                  </span>
                  {item.mrp > item.sellingPrice && (
                    <span className="text-[10px] sm:text-[11px] text-slate-400 line-through">
                      ₹{item.mrp.toLocaleString("en-IN")}
                    </span>
                  )}
                  {discountPct > 0 && (
                    <span className="text-[10px] font-black text-emerald-600 ml-auto">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
