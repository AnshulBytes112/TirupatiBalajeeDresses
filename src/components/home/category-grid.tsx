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

  const gridClass =
    previewDevice === "mobile"
      ? "grid-cols-2 gap-2.5"
      : previewDevice === "tablet"
      ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
      : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3 lg:gap-3.5";

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

        {/* Unified Category Cards Grid: Applied across all items */}
        <div className={cn("grid items-stretch", gridClass)}>
          {activeCards.map((cat, index) => (
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
                <div className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden">
                  {cat.imageSrc ? (
                    <Image
                      src={cat.imageSrc}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform mix-blend-multiply"
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 20vw, 120px"
                      priority={index < 5}
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

