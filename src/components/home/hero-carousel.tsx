"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
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

import { usePreviewDevice } from "@/context/preview-device-context";

export interface HeroCarouselProps {
  slides?: HeroSlide[];
  className?: string;
}

export function HeroCarousel({ slides, className }: HeroCarouselProps) {
  const activeSlides = slides && slides.length > 0 ? slides : HERO_SLIDES;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const previewDevice = usePreviewDevice();
  const isMobile = previewDevice === "mobile";

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = React.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  // Auto slide every 3 seconds (3000ms)
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -40) {
      nextSlide();
    } else if (info.offset.x > 40) {
      prevSlide();
    }
  };

  return (
    <section
      className="w-full pt-2 sm:pt-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero campaign carousel"
    >
      <Container size="xl">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#D7EEFD] via-[#E4F2FE] to-[#F2F8FE] border border-sky-100/80 shadow-xs",
            isMobile
              ? "min-h-[350px]"
              : "min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
          )}
        >
          {/* ReactBits Smooth Sliding Track */}
          <motion.div
            className="flex h-full w-full cursor-grab active:cursor-grabbing"
            animate={{ x: `-${currentSlide * 100}%` }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
              mass: 0.8,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          >
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;

              return (
                <div
                  key={slide.id}
                  className={cn(
                    "relative flex-none w-full flex items-center overflow-hidden",
                    isMobile
                      ? "min-h-[350px]"
                      : "min-h-[380px] sm:min-h-[440px] lg:min-h-[480px]"
                  )}
                >
                  {/* 1. BACKGROUND IMAGE (Positioned nicely on mobile & desktop) */}
                  <div
                    className={cn(
                      "absolute right-0 bottom-0 top-0 h-full pointer-events-none z-0 flex items-end justify-end",
                      isMobile
                        ? "w-[50%] sm:w-[50%]"
                        : "sm:right-4 lg:right-12 w-[65%] sm:w-[54%] md:w-[50%] lg:w-[46%]"
                    )}
                  >
                    <div
                      className="relative w-full h-full"
                      style={{
                        maskImage:
                          "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 40%, black 100%)",
                        WebkitMaskImage:
                          "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 15%, black 40%, black 100%)",
                      }}
                    >
                      <Image
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        fill
                        priority={idx === 0}
                        className="object-contain object-bottom sm:object-right-bottom scale-95 sm:scale-100 origin-bottom"
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 550px"
                      />
                    </div>
                  </div>

                  {/* 2. DOODLES OVERLAY (Hidden on small mobile for clean fit) */}
                  {/* Paper Plane Doodle */}
                  {!isMobile && (
                    <div className="pointer-events-none absolute left-[40%] top-4 hidden md:block text-sky-700/50 rotate-12 select-none z-10">
                      <svg width="50" height="34" viewBox="0 0 60 42" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 20L56 3L35 39L25 24L2 20Z" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M56 3L25 24" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {/* Handwritten Doodle Note (Top Right on desktop) */}
                  {!isMobile && (
                    <div className="pointer-events-none absolute right-8 sm:right-14 top-4 hidden xl:flex flex-col items-center text-slate-700 select-none z-20">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-amber-500">✨</span>
                        <span className="font-handwriting text-sm text-slate-800 font-black rotate-[-3deg] tracking-tight">
                          &ldquo;{slide.doodleText || "Same Values Every Season"}&rdquo;
                        </span>
                        <span className="text-sm text-amber-500">⭐</span>
                      </div>
                    </div>
                  )}

                  {/* Sticky Note (Desktop) */}
                  {!isMobile && slide.stickyNote && (
                    <div className="pointer-events-none absolute right-4 sm:right-8 bottom-8 hidden lg:flex flex-col items-start bg-[#FAF2B5] text-brand-navy-950 px-3 py-2 rounded shadow-md rotate-[-4deg] border border-[#EBE196] max-w-[135px] z-20 select-none">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-white/70 rounded-xs" />
                      <p className="font-display font-black text-[10px] leading-tight">
                        {slide.stickyNote.text}
                      </p>
                      <p className="font-display font-extrabold text-[10px] text-brand-navy-800 mt-0.5">
                        {slide.stickyNote.subtext}
                      </p>
                    </div>
                  )}

                  {/* 3. FOREGROUND CONTENT (LEFT SIDE - RESPONSIVE MOBILE FIT) */}
                  <div
                    className={cn(
                      "relative z-10 w-full",
                      isMobile
                        ? "px-3 py-4"
                        : "px-4 py-6 sm:px-8 sm:py-8 lg:px-14 lg:py-10"
                    )}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.6, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className={cn(
                        "space-y-2 sm:space-y-3.5",
                        isMobile
                          ? "max-w-[220px]"
                          : "max-w-[260px] xs:max-w-[300px] sm:max-w-md lg:max-w-lg"
                      )}
                    >
                      {/* Badge */}
                      <div className="inline-block text-[9.5px] sm:text-xs font-black uppercase tracking-wider text-brand-navy-950 bg-white/70 px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {slide.badge}
                      </div>

                      {/* Headline */}
                      <h1
                        className={cn(
                          "font-display font-black text-brand-navy-950 leading-[1.15] tracking-tight",
                          isMobile
                            ? "text-xl sm:text-2xl"
                            : "text-2xl sm:text-3xl md:text-4xl lg:text-[46px]"
                        )}
                      >
                        {slide.titleLine1} <br />
                        <span className="text-brand-navy-950">{slide.titleLine2}</span>
                      </h1>

                      {/* Subtitle */}
                      <p
                        className={cn(
                          "font-semibold text-slate-600 leading-snug",
                          isMobile
                            ? "text-[10.5px] max-w-[200px]"
                            : "text-[11px] sm:text-xs md:text-sm max-w-[280px] sm:max-w-sm"
                        )}
                      >
                        {slide.subtitle}
                      </p>

                      {/* Seasonal Pill Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5">
                        <Link
                          href="/shop/school-uniforms/summer-dress"
                          className="inline-flex items-center gap-1 rounded-full bg-[#FFD21F] px-2.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-black text-brand-navy-950 shadow-xs hover:bg-amber-400 transition-colors"
                        >
                          <span>☀️</span>
                          <span>Summer Dress</span>
                        </Link>
                        <Link
                          href="/shop/school-uniforms/winter-dress"
                          className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-black text-brand-navy-950 border border-slate-200 shadow-xs hover:bg-slate-50 transition-colors"
                        >
                          <span>❄️</span>
                          <span>Winter Dress</span>
                        </Link>
                      </div>

                      {/* Primary CTA Button */}
                      <div className="pt-1 sm:pt-2">
                        <Link href={slide.ctaUrl}>
                          <button className="inline-flex items-center gap-1.5 rounded-full bg-[#07142F] px-4 py-1.5 sm:px-6 sm:py-2.5 text-[10.5px] sm:text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-brand-navy-800 transition-all hover:scale-[1.02] active:scale-98">
                            <span>{slide.ctaText}</span>
                            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                        </Link>
                      </div>

                      {/* 3 Benefits Below CTA */}
                      <div className="pt-1 hidden xs:flex flex-wrap items-center gap-2 sm:gap-4 text-brand-navy-950 text-[9.5px] sm:text-[11.5px] font-bold">
                        <div className="flex items-center gap-1">
                          <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white shadow-xs">
                            <Shirt className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-navy-950" />
                          </div>
                          <span>Premium Fabric</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-white shadow-xs">
                            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-navy-950" />
                          </div>
                          <span>Perfect Fit</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Navigation Arrows (Desktop & Tablet) */}
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-brand-navy-950 shadow-md hover:scale-105 active:scale-95 transition-all border border-slate-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white text-brand-navy-950 shadow-md hover:scale-105 active:scale-95 transition-all border border-slate-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Bottom Pagination Indicator */}
          <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
            {activeSlides.map((_, idx) => (
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

