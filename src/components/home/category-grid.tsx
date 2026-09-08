"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
  className?: string;
}

export function CategoryGrid({ className }: CategoryGridProps) {
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

        {/* Categories Row: 2 Featured Cards on Left + 7 Circular Categories on Right */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3 sm:gap-3.5 items-stretch">
          {/* 1. Summer Dress Featured Card */}
          <Link
            href="/category/summer-dress"
            className="group col-span-1 rounded-2xl bg-white border border-amber-200/80 p-3 flex flex-col justify-between shadow-xs hover:border-amber-400 hover:shadow-sm transition-all text-center"
          >
            <div className="relative aspect-square w-full rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 mb-2">
              <span className="absolute top-0 right-0 text-base select-none">☀️</span>
              <div className="relative w-full h-full">
                <Image
                  src="/images/shirt.jpg"
                  alt="Summer Dress"
                  fill
                  className="object-contain p-1 group-hover:scale-105 transition-transform"
                  sizes="120px"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs sm:text-[13px] font-black text-brand-navy-950 leading-tight">
                Summer Dress
              </h3>
              <p className="text-[10px] sm:text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">
                Light. Breathable.<br />All-Day Comfort.
              </p>
            </div>
          </Link>

          {/* 2. Winter Dress Featured Card */}
          <Link
            href="/category/winter-dress"
            className="group col-span-1 rounded-2xl bg-white border border-sky-200/80 p-3 flex flex-col justify-between shadow-xs hover:border-sky-400 hover:shadow-sm transition-all text-center"
          >
            <div className="relative aspect-square w-full rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 mb-2">
              <span className="absolute top-0 right-0 text-base select-none">❄️</span>
              <div className="relative w-full h-full">
                <Image
                  src="/images/winter-flatlay.jpg"
                  alt="Winter Dress"
                  fill
                  className="object-contain p-1 group-hover:scale-105 transition-transform"
                  sizes="120px"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs sm:text-[13px] font-black text-brand-navy-950 leading-tight">
                Winter Dress
              </h3>
              <p className="text-[10px] sm:text-[10.5px] font-semibold text-slate-500 mt-1 leading-tight">
                Warm. Cozy.<br />Same Great Quality.
              </p>
            </div>
          </Link>

          {/* 3. Circular: School Shoes */}
          <Link
            href="/category/school-shoes"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/shoes.jpg"
                alt="School Shoes"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              School Shoes
            </span>
          </Link>

          {/* 4. Circular: School Bags */}
          <Link
            href="/category/school-bags"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/backpack.jpg"
                alt="School Bags"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              School Bags
            </span>
          </Link>

          {/* 5. Circular: Socks & Stockings */}
          <Link
            href="/category/socks-stockings"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/socks.jpg"
                alt="Socks & Stockings"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              Socks &amp; Stockings
            </span>
          </Link>

          {/* 6. Circular: Belts & Accessories */}
          <Link
            href="/category/belts-accessories"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/belt.jpg"
                alt="Belts & Accessories"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              Belts &amp; Accessories
            </span>
          </Link>

          {/* 7. Circular: Stationery */}
          <Link
            href="/category/stationery"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <Image
                src="/images/stationery.jpg"
                alt="Stationery"
                fill
                className="object-contain p-2"
                sizes="96px"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              Stationery
            </span>
          </Link>

          {/* 8. Circular: Water Bottles */}
          <Link
            href="/category/water-bottles"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 64 64" className="h-11 w-11 sm:h-12 sm:w-12 drop-shadow-xs" fill="none">
                <rect x="23" y="16" width="18" height="40" rx="6" fill="#1D4ED8" />
                <rect x="26" y="8" width="12" height="9" rx="3" fill="#1E40AF" />
                <path d="M28 8 C28 4 36 4 36 8" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="25" y="24" width="14" height="2" rx="1" fill="#60A5FA" />
                <path d="M29 32 L35 32" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              Water Bottles
            </span>
          </Link>

          {/* 9. Circular: Lunch Boxes */}
          <Link
            href="/category/lunch-boxes"
            className="group col-span-1 flex flex-col items-center justify-between p-2 text-center"
          >
            <div className="relative aspect-square w-full max-w-[84px] sm:max-w-[96px] rounded-full bg-[#F3F4F6] flex items-center justify-center p-2 shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 64 64" className="h-11 w-11 sm:h-12 sm:w-12 drop-shadow-xs" fill="none">
                <rect x="12" y="22" width="40" height="26" rx="6" fill="#1E40AF" />
                <rect x="10" y="18" width="44" height="8" rx="3" fill="#3B82F6" />
                <rect x="25" y="20" width="14" height="4" rx="1.5" fill="#FBBF24" />
                <rect x="20" y="28" width="24" height="14" rx="2" fill="#2563EB" />
              </svg>
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors mt-2 leading-tight">
              Lunch Boxes
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
