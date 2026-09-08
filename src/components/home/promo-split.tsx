"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DynamicPromoSplitCard } from "@/types/homepage";
import { cn } from "@/lib/utils";

interface PromoSplitProps {
  cards?: DynamicPromoSplitCard[];
  summerBanner?: {
    title: string;
    subtitle?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
    imageSrc?: string | null;
    doodleText?: string | null;
    bgColor?: string | null;
    borderColor?: string | null;
  };
  winterBanner?: {
    title: string;
    subtitle?: string | null;
    ctaText?: string | null;
    ctaUrl?: string | null;
    imageSrc?: string | null;
    doodleText?: string | null;
    bgColor?: string | null;
    borderColor?: string | null;
  };
  className?: string;
}

export function PromoSplit({
  cards,
  summerBanner,
  winterBanner,
  className,
}: PromoSplitProps) {
  // Normalize items to render
  const items: DynamicPromoSplitCard[] = React.useMemo(() => {
    if (cards && cards.length > 0) {
      return cards.filter((c) => c.isActive !== false);
    }
    return [
      {
        id: "summer",
        title: summerBanner?.title || "Stay Cool This Summer",
        subtitle: summerBanner?.subtitle || "Comfortable Uniforms for Active Days",
        ctaText: summerBanner?.ctaText || "SHOP SUMMER DRESS",
        ctaUrl: summerBanner?.ctaUrl || "/category/summer-dress",
        imageSrc: summerBanner?.imageSrc || "/images/summer-flatlay.jpg",
        doodleText: summerBanner?.doodleText || "Play Learn Grow ♡",
        iconEmoji: "☀️",
        bgColor: summerBanner?.bgColor || "#FEF4CE",
        borderColor: summerBanner?.borderColor || "#FBE39A",
      },
      {
        id: "winter",
        title: winterBanner?.title || "Stay Warm This Winter",
        subtitle: winterBanner?.subtitle || "Premium Winter Uniforms for Every Season",
        ctaText: winterBanner?.ctaText || "SHOP WINTER DRESS",
        ctaUrl: winterBanner?.ctaUrl || "/category/winter-dress",
        imageSrc: winterBanner?.imageSrc || "/images/winter-flatlay.jpg",
        doodleText: winterBanner?.doodleText || "Same Spirit New Season ⭐",
        iconEmoji: "❄️",
        bgColor: winterBanner?.bgColor || "#E0F2FE",
        borderColor: winterBanner?.borderColor || "#BAE6FD",
      },
    ];
  }, [cards, summerBanner, winterBanner]);

  if (items.length === 0) return null;

  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        <div
          className={cn(
            "grid gap-3 sm:gap-4",
            items.length === 1
              ? "grid-cols-1"
              : items.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.bgColor || "#FEF4CE",
                borderColor: item.borderColor || "#FBE39A",
              }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-7 lg:p-8 shadow-xs flex flex-col justify-between min-h-[220px] sm:min-h-[240px] transition-transform hover:-translate-y-0.5 duration-200"
            >
              {/* Left Content */}
              <div className="relative z-10 max-w-[55%] space-y-2">
                {item.iconEmoji && (
                  <span className="text-xl inline-block">{item.iconEmoji}</span>
                )}
                <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-brand-navy-950 leading-tight">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-xs sm:text-sm font-semibold text-brand-navy-900/80 leading-snug">
                    {item.subtitle}
                  </p>
                )}
                <div className="pt-1.5">
                  <Link href={item.ctaUrl || "#"}>
                    <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 sm:py-2.5 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                      <span>{item.ctaText || "SHOP NOW"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Doodles & Flat Lay Photo (Right Side) */}
              <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-3 top-2 w-[48%] flex items-center justify-end pointer-events-none">
                {/* Doodles */}
                {item.doodleText && (
                  <div className="absolute top-1 right-3 flex flex-col items-center select-none z-10">
                    <span className="font-handwriting text-xs text-brand-navy-900 font-black rotate-[-4deg] text-center leading-tight hidden sm:block whitespace-pre-line">
                      {item.doodleText}
                    </span>
                  </div>
                )}

                {/* Photo */}
                <div className="relative w-full h-full max-h-44 rounded-xl overflow-hidden shadow-xs bg-white/40">
                  <Image
                    src={item.imageSrc || "/images/summer-flatlay.jpg"}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 768px) 50vw, 300px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
