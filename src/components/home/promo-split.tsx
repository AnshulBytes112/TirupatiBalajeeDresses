"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface PromoSplitProps {
  summerBanner?: {
    title: string;
    subtitle?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
  };
  winterBanner?: {
    title: string;
    subtitle?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
  };
  className?: string;
}

export function PromoSplit({ summerBanner, winterBanner, className }: PromoSplitProps) {
  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* 1. Stay Cool This Summer (Yellow Card) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FEF4CE] border border-[#FBE39A] p-5 sm:p-7 lg:p-8 shadow-xs flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
            {/* Left Content */}
            <div className="relative z-10 max-w-[55%] space-y-2">
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-brand-navy-950 leading-tight">
                {summerBanner?.title || "Stay Cool This Summer"}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-brand-navy-900/80 leading-snug">
                {summerBanner?.subtitle || "Comfortable Uniforms for Active Days"}
              </p>
              <div className="pt-1.5">
                <Link href={summerBanner?.ctaUrl || "/category/summer-dress"}>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 sm:py-2.5 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                    <span>{summerBanner?.ctaText || "SHOP SUMMER DRESS"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Doodles & Flat Lay Photo (Right Side) */}
            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-3 top-2 w-[48%] flex items-center justify-end">
              {/* Doodles */}
              <div className="absolute top-1 right-3 flex flex-col items-center select-none z-10">
                <span className="text-xl text-amber-500">☀️</span>
                <span className="font-handwriting text-xs text-amber-900 font-black rotate-[-6deg] text-center leading-tight hidden sm:block">
                  Play<br />Learn<br />Grow
                </span>
                <span className="text-xs text-amber-700 mt-0.5 hidden sm:block">♡</span>
              </div>

              {/* Realistic Summer Flat Lay Image */}
              <div className="relative w-full h-full max-h-44 rounded-xl overflow-hidden shadow-xs bg-white/40">
                <Image
                  src="/images/summer-flatlay.jpg"
                  alt="Summer Dress and Skirt"
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
            </div>
          </div>

          {/* 2. Stay Warm This Winter (Blue Card) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#E0F2FE] border border-[#BAE6FD] p-5 sm:p-7 lg:p-8 shadow-xs flex flex-col justify-between min-h-[220px] sm:min-h-[240px]">
            {/* Left Content */}
            <div className="relative z-10 max-w-[55%] space-y-2">
              <div className="text-sky-600 text-lg">❄️</div>
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-brand-navy-950 leading-tight">
                {winterBanner?.title || "Stay Warm This Winter"}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-snug">
                {winterBanner?.subtitle || "Premium Winter Uniforms for Every Season"}
              </p>
              <div className="pt-1.5">
                <Link href={winterBanner?.ctaUrl || "/category/winter-dress"}>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 sm:py-2.5 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                    <span>{winterBanner?.ctaText || "SHOP WINTER DRESS"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Doodles & Flat Lay Photo (Right Side) */}
            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-3 top-2 w-[48%] flex items-center justify-end">
              {/* Doodles */}
              <div className="absolute top-1 right-2 flex flex-col items-center select-none z-10">
                <span className="font-handwriting text-xs text-slate-800 font-black rotate-[4deg] text-center leading-tight hidden sm:block">
                  &ldquo;Same Spirit<br />New Season&rdquo;
                </span>
                <span className="text-xs text-sky-600 mt-0.5 hidden sm:block">⭐</span>
              </div>

              {/* Realistic Winter Flat Lay Image */}
              <div className="relative w-full h-full max-h-44 rounded-xl overflow-hidden shadow-xs bg-white/40">
                <Image
                  src="/images/winter-flatlay.jpg"
                  alt="Winter Blazer and Hoodie"
                  fill
                  className="object-contain p-1"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
