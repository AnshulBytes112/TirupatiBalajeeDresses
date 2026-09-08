"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DynamicPromoComboCard } from "@/types/homepage";
import { cn } from "@/lib/utils";

interface PromoCombosProps {
  cards?: DynamicPromoComboCard[];
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
  cards,
  comboBanner,
  thermalsBanner,
  className,
}: PromoCombosProps) {
  const items: DynamicPromoComboCard[] = React.useMemo(() => {
    if (cards && cards.length > 0) {
      return cards.filter((c) => c.isActive !== false);
    }
    return [
      {
        id: "combo-complete-look",
        tag: "BEST VALUE",
        title: comboBanner?.title || "Complete School Look",
        subtitle: comboBanner?.subtitle || "Uniforms + Shoes + Accessories",
        ctaText: comboBanner?.ctaText || "SHOP COMBO SETS",
        ctaUrl: comboBanner?.ctaUrl || "/combos",
        imageSrc: comboBanner?.imageSrc || "/images/combo-kids.jpg",
        bgColor: "#E1F1FD",
        borderColor: "#C6E4FA",
        layout: "image-left",
      },
      {
        id: "combo-thermals",
        tag: thermalsBanner?.tag || "THERMALS COLLECTION",
        title: thermalsBanner?.title || "Warmth for Every Adventure",
        subtitle:
          thermalsBanner?.subtitle ||
          "Ultra-soft thermal innerwear designed for winter school days.",
        ctaText: thermalsBanner?.ctaText || "EXPLORE NOW",
        ctaUrl: thermalsBanner?.ctaUrl || "/category/thermals",
        imageSrc: thermalsBanner?.imageSrc || "/images/thermals-stack.jpg",
        bgColor: "#FDF2F4",
        borderColor: "#FCE1E6",
        layout: "image-right",
      },
    ];
  }, [cards, comboBanner, thermalsBanner]);

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
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {items.map((item) => {
            const isImageLeft = item.layout !== "image-right";

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: item.bgColor || "#E1F1FD",
                  borderColor: item.borderColor || "#C6E4FA",
                }}
                className={cn(
                  "relative overflow-hidden rounded-2xl sm:rounded-3xl border p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 min-h-[200px] transition-transform hover:-translate-y-0.5 duration-200",
                  !isImageLeft && "sm:flex-row-reverse"
                )}
              >
                {/* Photo */}
                <div className="relative w-36 sm:w-44 aspect-[4/3.2] rounded-xl overflow-hidden shadow-xs bg-white/50 shrink-0">
                  <Image
                    src={item.imageSrc || "/images/combo-kids.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 relative z-10 w-full">
                  {item.tag && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-navy-800 bg-white/60 px-2 py-0.5 rounded-full inline-block">
                      {item.tag}
                    </span>
                  )}
                  <h3 className="font-display text-base sm:text-xl font-black text-brand-navy-950 uppercase tracking-tight leading-tight">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-tight">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="pt-1.5">
                    <Link href={item.ctaUrl || "#"}>
                      <button className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-black uppercase text-white shadow-xs hover:bg-brand-navy-800 transition-all">
                        <span>{item.ctaText || "SHOP NOW"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
