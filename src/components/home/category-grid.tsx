"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface CategoryCardItem {
  id: string;
  name: string;
  href: string;
  badgeEmoji: string;
  subtitleLine1: string;
  subtitleLine2: string;
  imageSrc?: string;
  svgIcon?: React.ReactNode;
  borderColor?: string;
  hoverBorderColor?: string;
}

const CATEGORY_CARDS: CategoryCardItem[] = [
  {
    id: "summer-dress",
    name: "Summer Dress",
    href: "/category/summer-dress",
    badgeEmoji: "☀️",
    subtitleLine1: "Light. Breathable.",
    subtitleLine2: "All-Day Comfort.",
    imageSrc: "/images/shirt.jpg",
    borderColor: "border-amber-200/80",
    hoverBorderColor: "hover:border-amber-400",
  },
  {
    id: "winter-dress",
    name: "Winter Dress",
    href: "/category/winter-dress",
    badgeEmoji: "❄️",
    subtitleLine1: "Warm. Cozy.",
    subtitleLine2: "Same Great Quality.",
    imageSrc: "/images/winter-flatlay.jpg",
    borderColor: "border-sky-200/80",
    hoverBorderColor: "hover:border-sky-400",
  },
  {
    id: "school-shoes",
    name: "School Shoes",
    href: "/category/school-shoes",
    badgeEmoji: "👟",
    subtitleLine1: "Durable. Anti-Skid.",
    subtitleLine2: "Daily Uniform Fit.",
    imageSrc: "/images/shoes.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
  },
  {
    id: "school-bags",
    name: "School Bags",
    href: "/category/school-bags",
    badgeEmoji: "🎒",
    subtitleLine1: "Spacious. Sturdy.",
    subtitleLine2: "Ergonomic Straps.",
    imageSrc: "/images/backpack.jpg",
    borderColor: "border-indigo-200/80",
    hoverBorderColor: "hover:border-indigo-400",
  },
  {
    id: "socks-stockings",
    name: "Socks & Stockings",
    href: "/category/socks-stockings",
    badgeEmoji: "🧦",
    subtitleLine1: "Soft Combed Cotton.",
    subtitleLine2: "Snug Everyday Fit.",
    imageSrc: "/images/socks.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
  },
  {
    id: "belts-accessories",
    name: "Belts & Accessories",
    href: "/category/belts-accessories",
    badgeEmoji: "👔",
    subtitleLine1: "Smart Finish.",
    subtitleLine2: "Official Uniform Fit.",
    imageSrc: "/images/belt.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
  },
  {
    id: "stationery",
    name: "Stationery",
    href: "/category/stationery",
    badgeEmoji: "✏️",
    subtitleLine1: "Essential Supplies.",
    subtitleLine2: "Classroom Ready.",
    imageSrc: "/images/stationery.jpg",
    borderColor: "border-amber-200/80",
    hoverBorderColor: "hover:border-amber-400",
  },
  {
    id: "water-bottles",
    name: "Water Bottles",
    href: "/category/water-bottles",
    badgeEmoji: "💧",
    subtitleLine1: "BPA-Free & Safe.",
    subtitleLine2: "Leak-Proof Daily.",
    svgIcon: (
      <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-11 sm:w-11 drop-shadow-xs" fill="none">
        <rect x="23" y="16" width="18" height="40" rx="6" fill="#1D4ED8" />
        <rect x="26" y="8" width="12" height="9" rx="3" fill="#1E40AF" />
        <path d="M28 8 C28 4 36 4 36 8" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <rect x="25" y="24" width="14" height="2" rx="1" fill="#60A5FA" />
        <path d="M29 32 L35 32" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    borderColor: "border-blue-200/80",
    hoverBorderColor: "hover:border-blue-400",
  },
  {
    id: "lunch-boxes",
    name: "Lunch Boxes",
    href: "/category/lunch-boxes",
    badgeEmoji: "🍱",
    subtitleLine1: "Food Grade Steel.",
    subtitleLine2: "Fresh & Organized.",
    svgIcon: (
      <svg viewBox="0 0 64 64" className="h-10 w-10 sm:h-11 sm:w-11 drop-shadow-xs" fill="none">
        <rect x="12" y="22" width="40" height="26" rx="6" fill="#1E40AF" />
        <rect x="10" y="18" width="44" height="8" rx="3" fill="#3B82F6" />
        <rect x="25" y="20" width="14" height="4" rx="1.5" fill="#FBBF24" />
        <rect x="20" y="28" width="24" height="14" rx="2" fill="#2563EB" />
      </svg>
    ),
    borderColor: "border-emerald-200/80",
    hoverBorderColor: "hover:border-emerald-400",
  },
];

interface CategoryGridProps {
  cards?: CategoryCardItem[];
  className?: string;
}

export function CategoryGrid({ cards, className }: CategoryGridProps) {
  const activeCards = cards && cards.length > 0 ? cards : CATEGORY_CARDS;

  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-brand-navy-950">
            Shop School Uniforms
          </h2>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-black text-brand-navy-950 hover:text-brand-navy-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Unified Category Cards Grid: Applied across all 9 items */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3 lg:gap-3.5 items-stretch">
          {activeCards.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={cn(
                "group col-span-1 rounded-2xl bg-white border p-2.5 sm:p-3 flex flex-col justify-between shadow-xs hover:shadow-sm transition-all text-center",
                cat.borderColor || "border-slate-200/80",
                cat.hoverBorderColor || "hover:border-slate-400"
              )}
            >
              {/* Circular Product / Icon Container */}
              <div className="relative aspect-square w-full rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 mb-2">
                <span className="absolute top-0 right-0 text-sm sm:text-base select-none">
                  {cat.badgeEmoji}
                </span>
                <div className="relative w-full h-full flex items-center justify-center">
                  {cat.imageSrc ? (
                    <Image
                      src={cat.imageSrc}
                      alt={cat.name}
                      fill
                      className="object-contain p-1 group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 120px"
                    />
                  ) : (
                    cat.svgIcon
                  )}
                </div>
              </div>

              {/* Title & 2-Line Value Subtitle */}
              <div>
                <h3 className="text-xs sm:text-[12.5px] lg:text-[13px] font-black text-brand-navy-950 leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[9.5px] sm:text-[10px] lg:text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">
                  {cat.subtitleLine1}
                  <br />
                  {cat.subtitleLine2}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

