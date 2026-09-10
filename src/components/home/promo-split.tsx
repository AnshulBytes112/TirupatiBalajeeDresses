"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DynamicPromoSplitCard } from "@/types/homepage";
import { cn } from "@/lib/utils";

import { usePreviewDevice } from "@/context/preview-device-context";

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
  const previewDevice = usePreviewDevice();

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
        ctaUrl: summerBanner?.ctaUrl || "/shop/school-uniforms/summer-dress",
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
        ctaUrl: winterBanner?.ctaUrl || "/shop/school-uniforms/winter-dress",
        imageSrc: winterBanner?.imageSrc || "/images/winter-flatlay.jpg",
        doodleText: winterBanner?.doodleText || "Same Spirit New Season ⭐",
        iconEmoji: "❄️",
        bgColor: winterBanner?.bgColor || "#E0F2FE",
        borderColor: winterBanner?.borderColor || "#BAE6FD",
      },
    ];
  }, [cards, summerBanner, winterBanner]);

  if (items.length === 0) return null;

  const isMobile = previewDevice === "mobile";

  const gridClass =
    previewDevice === "mobile"
      ? "grid-cols-1 gap-3"
      : previewDevice === "tablet"
      ? "grid-cols-1 md:grid-cols-2 gap-3"
      : items.length === 1
      ? "grid-cols-1"
      : items.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        <div className={cn("grid gap-3 sm:gap-4", gridClass)}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.bgColor || "#FEF4CE",
                borderColor: item.borderColor || "#FBE39A",
              }}
              className={cn(
                "relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-xs flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200",
                isMobile
                  ? "p-4 sm:p-5 min-h-[190px]"
                  : "p-5 sm:p-7 lg:p-8 min-h-[220px] sm:min-h-[240px]"
              )}
            >
              {/* Left Content */}
              <div
                className={cn(
                  "relative z-10 space-y-1.5 sm:space-y-2",
                  isMobile ? "max-w-[58%]" : "max-w-[55%]"
                )}
              >
                {item.iconEmoji && (
                  <span className="text-lg sm:text-xl inline-block">{item.iconEmoji}</span>
                )}
                <h3
                  className={cn(
                    "font-display font-black text-brand-navy-950 leading-tight",
                    isMobile
                      ? "text-lg sm:text-xl"
                      : "text-xl sm:text-2xl lg:text-3xl"
                  )}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-[11px] sm:text-xs md:text-sm font-semibold text-brand-navy-900/80 leading-snug">
                    {item.subtitle}
                  </p>
                )}
                <div className="pt-1 sm:pt-1.5">
                  <Link href={item.ctaUrl || "#"}>
                    <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                      <span>{item.ctaText || "SHOP NOW"}</span>
                      <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Doodles & Flat Lay Photo (Right Side) */}
              <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-3 top-2 w-[44%] sm:w-[48%] flex items-center justify-end pointer-events-none">
                {/* Doodles */}
                {item.doodleText && (
                  <div className="absolute top-1 right-2 sm:right-3 flex flex-col items-center select-none z-10">
                    <span
                      className={cn(
                        "font-handwriting text-brand-navy-900 font-black rotate-[-4deg] text-center leading-tight whitespace-pre-line",
                        isMobile ? "hidden" : "hidden sm:block text-xs"
                      )}
                    >
                      {item.doodleText}
                    </span>
                  </div>
                )}

                {/* Photo */}
                <div
                  className={cn(
                    "relative w-full h-full rounded-xl overflow-hidden shadow-xs bg-white/40",
                    isMobile ? "max-h-36" : "max-h-44"
                  )}
                >
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
