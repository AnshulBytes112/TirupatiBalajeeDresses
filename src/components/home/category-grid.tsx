"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import { usePreviewDevice } from "@/context/preview-device-context";

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

interface CategoryGridProps {
  cards?: CategoryCardItem[];
  className?: string;
}

export function CategoryGrid({ cards, className }: CategoryGridProps) {
  const previewDevice = usePreviewDevice();
  if (!cards || cards.length === 0) return null;
  const activeCards = cards;

  // Dynamic column layout that adjusts automatically based on card count & viewport
  const getGridClass = () => {
    if (previewDevice === "mobile") {
      return activeCards.length === 1
        ? "flex flex-wrap gap-3 justify-start"
        : "grid grid-cols-2 gap-2.5";
    }
    if (previewDevice === "tablet") {
      if (activeCards.length <= 2) return "flex flex-wrap gap-3.5 justify-start";
      if (activeCards.length === 3) return "grid grid-cols-3 gap-3 max-w-2xl";
      return "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3";
    }

    // Desktop
    const count = activeCards.length;
    if (count <= 2) return "flex flex-wrap gap-4 justify-start";
    if (count === 3) return "grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-w-3xl";
    if (count === 4) return "grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-4xl";
    if (count <= 6) return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3";
    return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-9 gap-2.5 sm:gap-3 lg:gap-3.5";
  };

  const isFewCards = activeCards.length <= 2;

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

        {/* Dynamic Category Cards Grid: Adapts cleanly to 1 card, 3 cards, or many cards */}
        <div className={cn("items-stretch", getGridClass())}>
          {activeCards.map((cat, index) => (
            <Link
              key={cat.id}
              href={cat.href}
              className={cn(
                "group rounded-2xl bg-white border p-3 sm:p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all text-center min-w-0",
                isFewCards
                  ? "w-48 sm:w-56 max-w-[240px] shrink-0"
                  : "col-span-1 w-full",
                cat.borderColor || "border-slate-200/80",
                cat.hoverBorderColor || "hover:border-slate-400"
              )}
            >
              {/* Circular Product / Icon Container */}
              <div className="relative aspect-square w-full max-w-[140px] mx-auto rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 mb-2.5">
                {cat.badgeEmoji && (
                  <span className="absolute top-0 right-0 text-sm sm:text-base select-none z-10">
                    {cat.badgeEmoji}
                  </span>
                )}
                <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                  {cat.imageSrc ? (
                    <Image
                      src={cat.imageSrc}
                      alt={cat.name}
                      fill
                      unoptimized={Boolean(
                        cat.imageSrc.startsWith("data:") ||
                        cat.imageSrc.startsWith("http")
                      )}
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 150px"
                      priority={index < 5}
                    />
                  ) : (
                    cat.svgIcon
                  )}
                </div>
              </div>

              {/* Title & 2-Line Value Subtitle */}
              <div className="w-full min-w-0 px-0.5">
                <h3 className="text-xs sm:text-[13px] font-black text-brand-navy-950 leading-snug break-words hyphens-auto">
                  {cat.name}
                </h3>
                {(cat.subtitleLine1 || cat.subtitleLine2) && (
                  <p className="text-[10px] sm:text-[10.5px] font-semibold text-slate-500 mt-1 leading-snug break-words">
                    {cat.subtitleLine1}
                    {cat.subtitleLine1 && cat.subtitleLine2 && <br />}
                    {cat.subtitleLine2}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

