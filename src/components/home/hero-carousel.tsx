"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Shirt,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  id: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageSrc: string;
  imageAlt: string;
  doodleText?: string;
  stickyNote?: { text: string; subtext?: string };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "uniforms-season",
    badge: "SCHOOL DAYS, BRIGHTER ALWAYS",
    titleLine1: "Uniforms for",
    titleLine2: "Every Season",
    subtitle: "Comfort. Confidence. A Brighter Tomorrow.",
    ctaText: "SHOP SCHOOL UNIFORMS",
    ctaUrl: "/category/school-uniforms",
    imageSrc: "/images/hero-kids.jpg",
    imageAlt: "Indian school children smiling in uniform",
    doodleText: "Same Values Every Season",
    stickyNote: {
      text: "Good Uniforms",
      subtext: "Brighter Futures 😊",
    },
  },
  {
    id: "winter-warmers",
    badge: "WINTER ESSENTIALS 2026",
    titleLine1: "Warmth for",
    titleLine2: "Every Adventure",
    subtitle: "Ultra-soft thermals, cozy sweaters & blazers for school mornings.",
    ctaText: "EXPLORE WINTER DRESS",
    ctaUrl: "/category/winter-dress",
    imageSrc: "/images/combo-kids.jpg",
    imageAlt: "School students in winter school dress",
    doodleText: "Ready for Brighter Mornings",
    stickyNote: {
      text: "Cozy & Warm",
      subtext: "All Day Long ❄️",
    },
  },
  {
    id: "school-combos",
    badge: "ALL-IN-ONE PACKS",
    titleLine1: "Complete Look",
    titleLine2: "Every Grade",
    subtitle: "Matching uniform sets, durable shoes, socks, belts & bags in one kit.",
    ctaText: "SHOP COMBO SETS",
    ctaUrl: "/combos",
    imageSrc: "/images/hero-kids.jpg",
    imageAlt: "Complete school kit and accessories",
    doodleText: "Same Uniform Bigger Dreams",
    stickyNote: {
      text: "Ready for School",
      subtext: "100% Genuine 🎒",
    },
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Moving / sliding every 3 seconds (3000ms)
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="w-full pt-2 sm:pt-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero campaign carousel"
    >
      <Container size="xl">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#D7EEFD] via-[#E4F2FE] to-[#F2F8FE] border border-sky-100/80 min-h-[440px] sm:min-h-[470px] lg:min-h-[490px] flex items-center shadow-xs transition-all duration-500">
          {/* 1. BACKGROUND IMAGE OF SCHOOL CHILDREN (POSITIONED ON RIGHT/CENTER-RIGHT) */}
          <div className="absolute right-0 sm:right-6 lg:right-16 bottom-0 top-0 h-full w-[70%] sm:w-[58%] md:w-[52%] lg:w-[48%] pointer-events-none z-0 flex items-end justify-end">
            <div
              key={slide.id + "-img"}
              className="relative w-full h-full animate-fadeIn transition-opacity duration-700"
              style={{
                maskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
              }}
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority
                className="object-contain object-bottom sm:object-right-bottom transition-transform duration-700"
                sizes="(max-width: 640px) 70vw, 550px"
              />
            </div>
          </div>

          {/* 2. DOODLES OVERLAY */}
          {/* Flying Paper Plane Doodle (Top Center) */}
          <div className="pointer-events-none absolute left-[38%] top-5 hidden md:block text-sky-700/60 rotate-12 select-none z-10">
            <svg width="56" height="38" viewBox="0 0 60 42" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 20L56 3L35 39L25 24L2 20Z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M56 3L25 24" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Star & Wand Sparkles Doodle (Center Sky) */}
          <div className="pointer-events-none absolute left-[44%] top-24 hidden lg:block text-sky-700/40 select-none z-10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>

          {/* "Same Values Every Season" Handwritten Doodle (Top Right) */}
          <div className="pointer-events-none absolute right-10 sm:right-16 top-6 hidden xl:flex flex-col items-center text-slate-700 select-none z-20">
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-amber-500">✨</span>
              <span className="font-handwriting text-base text-slate-800 font-black rotate-[-3deg] tracking-tight">
                &ldquo;{slide.doodleText || "Same Values Every Season"}&rdquo;
              </span>
              <span className="text-sm text-amber-500">⭐</span>
            </div>
            <div className="mt-0.5 text-slate-600/80 rotate-12">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          {/* Sticky Note: "Good Uniforms Brighter Futures 😊" (Far Right) */}
          <div className="pointer-events-none absolute right-4 sm:right-8 bottom-10 hidden lg:flex flex-col items-start bg-[#FAF2B5] text-brand-navy-950 px-3.5 py-2.5 rounded shadow-md rotate-[-4deg] border border-[#EBE196] max-w-[145px] z-20 select-none">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-white/70 rounded-xs shadow-xs" />
            <p className="font-display font-black text-[11px] leading-tight">
              Good Uniforms
            </p>
            <p className="font-display font-extrabold text-[11px] text-brand-navy-800 mt-0.5">
              Brighter Futures 😊
            </p>
          </div>

          {/* 3. FOREGROUND TEXT CONTENT (LEFT SIDE - IN FRONT) */}
          <div className="relative z-10 w-full px-5 py-8 sm:px-10 sm:py-10 lg:px-14">
            <div key={slide.id + "-text"} className="max-w-[340px] sm:max-w-md lg:max-w-lg space-y-3 sm:space-y-4 animate-fadeIn">
              {/* Badge */}
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-brand-navy-950">
                {slide.badge}
              </div>

              {/* Headline */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-black text-brand-navy-950 leading-[1.06] tracking-tight">
                {slide.titleLine1} <br />
                <span className="text-brand-navy-950">{slide.titleLine2}</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-bold text-slate-600 leading-snug">
                {slide.subtitle}
              </p>

              {/* Seasonal Pill Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link
                  href="/category/summer-dress"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD21F] px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black text-brand-navy-950 shadow-xs hover:bg-amber-400 transition-colors"
                >
                  <span className="text-sm">☀️</span>
                  <span>Summer Dress</span>
                </Link>
                <Link
                  href="/category/winter-dress"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-black text-brand-navy-950 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">❄️</span>
                  <span>Winter Dress</span>
                </Link>
              </div>

              {/* Primary CTA Button */}
              <div className="pt-1.5">
                <Link href={slide.ctaUrl}>
                  <button className="inline-flex items-center gap-2 rounded-full bg-[#07142F] px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md hover:bg-brand-navy-800 transition-all hover:scale-[1.02] active:scale-98">
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>

              {/* 3 Benefits Below CTA */}
              <div className="pt-2.5 flex flex-wrap items-center gap-3 sm:gap-5 text-brand-navy-950 text-[10.5px] sm:text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs">
                    <Shirt className="h-3 w-3 text-brand-navy-950" />
                  </div>
                  <span>Premium Fabric</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs">
                    <Sparkles className="h-3 w-3 text-brand-navy-950" />
                  </div>
                  <span>Perfect Fit</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-xs">
                    <ShieldCheck className="h-3 w-3 text-brand-navy-950" />
                  </div>
                  <span>Trusted by Parents</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Navigation Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-brand-navy-950 shadow-md hover:scale-105 active:scale-95 transition-all border border-slate-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Right Navigation Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-brand-navy-950 shadow-md hover:scale-105 active:scale-95 transition-all border border-slate-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Bottom Pagination Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === currentSlide
                    ? "w-5 bg-brand-navy-950"
                    : "w-1.5 bg-slate-300 hover:bg-slate-400"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
