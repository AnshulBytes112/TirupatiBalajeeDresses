"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

interface PromoCombosProps {
  comboBanner?: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
    imageSrc?: string;
  };
  thermalsBanner?: {
    tag?: string;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaUrl?: string;
    imageSrc?: string;
  };
  className?: string;
}

export function PromoCombos({
  comboBanner,
  thermalsBanner,
  className,
}: PromoCombosProps) {
  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {/* 1. Complete School Look (Sky Blue Card) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#E1F1FD] border border-[#C6E4FA] p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 min-h-[200px]">
            {/* Student Photo (Left) */}
            <div className="relative w-36 sm:w-44 aspect-[4/3.4] rounded-xl overflow-hidden shadow-xs bg-sky-100 shrink-0">
              <Image
                src={comboBanner?.imageSrc || "/images/combo-kids.jpg"}
                alt={comboBanner?.title || "School Uniform Combos"}
                fill
                className="object-cover object-top"
                sizes="180px"
              />
            </div>

            {/* Content & Doodles (Right) */}
            <div className="flex-1 space-y-2 relative z-10">
              <span className="text-lg text-sky-600">✨</span>
              <h3 className="font-display text-base sm:text-lg font-black text-brand-navy-950 uppercase tracking-tight">
                {comboBanner?.title || "Complete School Look"}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-tight">
                {comboBanner?.subtitle || "Uniforms + Shoes + Accessories"}
              </p>
              <div className="pt-1.5">
                <Link href={comboBanner?.ctaUrl || "/combos"}>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                    <span>{comboBanner?.ctaText || "SHOP COMBO SETS"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Doodles in background */}
            <div className="pointer-events-none absolute right-4 bottom-2 text-sky-600/30 select-none">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 18h8M10 14h4M12 2v6M9 8h6M12 8l4 6H8l4-6z" />
              </svg>
            </div>
          </div>

          {/* 2. Thermals Collection (Soft Pink Card) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#FDF2F4] border border-[#FCE1E6] p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 min-h-[200px]">
            {/* Content (Left) */}
            <div className="flex-1 space-y-1.5 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-700">
                {thermalsBanner?.tag || "Thermals Collection"}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-brand-navy-950 leading-tight">
                {thermalsBanner?.title || (
                  <>
                    Warmth for <br />
                    Every Adventure
                  </>
                )}
              </h3>
              <div className="pt-2">
                <Link href={thermalsBanner?.ctaUrl || "/category/thermals"}>
                  <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                    <span>{thermalsBanner?.ctaText || "EXPLORE NOW"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Thermals Stack Photo (Right) */}
            <div className="relative w-40 sm:w-48 aspect-[4/3.2] rounded-xl overflow-hidden shadow-xs bg-white/50 shrink-0">
              <Image
                src={thermalsBanner?.imageSrc || "/images/thermals-stack.jpg"}
                alt="Kids Thermals Stack"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
