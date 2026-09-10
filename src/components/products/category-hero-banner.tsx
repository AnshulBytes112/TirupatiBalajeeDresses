"use client";

import * as React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Shirt, Flame, Footprints, Briefcase, Tag, Layers } from "lucide-react";

export interface CategoryHeroBannerProps {
  categorySlug?: string;
  season?: string;
  title?: string;
  subtitle?: string;
}

export function CategoryHeroBanner({
  categorySlug = "school-uniforms",
  season = "SUMMER",
  title,
  subtitle,
}: CategoryHeroBannerProps) {
  // Determine banner theme based on category & season
  const isSummer = season === "SUMMER" || categorySlug === "summer-dress";
  const isWinter = season === "WINTER" || categorySlug === "winter-dress";
  const isThermals = categorySlug === "thermals";
  const isShoes = categorySlug === "school-shoes";
  const isBags = categorySlug === "school-bags";
  const isOffers = categorySlug === "offers";

  let bannerTitle = title || "Summer School Uniforms";
  let bannerSubtitle = subtitle || "Lightweight. Breathable. Perfect for Everyday Learning.";
  let bannerImage = "/images/hero-kids.jpg";
  let bannerBgClass = "from-sky-50 via-blue-50/60 to-brand-cream-50 border-sky-100";
  let badge1 = { icon: <Shirt className="h-3.5 w-3.5 text-sky-600" />, label: "Premium Fabric" };
  let badge2 = { icon: <Sparkles className="h-3.5 w-3.5 text-amber-500" />, label: "All-Day Comfort" };
  let badge3 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />, label: "Trusted by Parents" };
  let slogan = "Stay Cool Stay Confident";

  if (isWinter) {
    bannerTitle = title || "Winter School Uniforms";
    bannerSubtitle = subtitle || "Warm. Certified. Designed for Cold School Days.";
    bannerImage = "/images/winter-flatlay.jpg";
    bannerBgClass = "from-indigo-50 via-slate-50 to-brand-cream-50 border-indigo-100";
    badge1 = { icon: <Flame className="h-3.5 w-3.5 text-rose-600" />, label: "Thermal Insulation" };
    badge2 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />, label: "Pure Acrylic Wool" };
    badge3 = { icon: <Sparkles className="h-3.5 w-3.5 text-amber-500" />, label: "Non-Itch Finish" };
    slogan = "Stay Warm Stay Active";
  } else if (isThermals) {
    bannerTitle = title || "Kids Winter Thermals";
    bannerSubtitle = subtitle || "Super Soft Multi-Stretch Thermal Innerwear for Everyday School.";
    bannerImage = "/images/thermal.jpg";
    bannerBgClass = "from-amber-50 via-orange-50/40 to-brand-cream-50 border-amber-100";
    badge1 = { icon: <Flame className="h-3.5 w-3.5 text-orange-600" />, label: "3-Layer Thermal Active" };
    badge2 = { icon: <Shirt className="h-3.5 w-3.5 text-amber-600" />, label: "Micro-Brushed Fleece" };
    badge3 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />, label: "Antibacterial Shield" };
    slogan = "Extreme Winter Warmth";
  } else if (isShoes) {
    bannerTitle = title || "School Shoes & Footwear";
    bannerSubtitle = subtitle || "Orthopedic Comfort & Anti-Slip Soles for Daily Assembly and Sports.";
    bannerImage = "/images/shoes.jpg";
    bannerBgClass = "from-slate-100 via-stone-50 to-brand-cream-50 border-slate-200";
    badge1 = { icon: <Footprints className="h-3.5 w-3.5 text-slate-700" />, label: "Anti-Skid TPR Soles" };
    badge2 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />, label: "Cushioned Memory Foam" };
    badge3 = { icon: <Sparkles className="h-3.5 w-3.5 text-amber-500" />, label: "Scuff Resistant" };
    slogan = "Step with Confidence";
  } else if (isBags) {
    bannerTitle = title || "Ergonomic School Bags";
    bannerSubtitle = subtitle || "Spinal Support Cushioning & Durable Water-Repellent Fabric.";
    bannerImage = "/images/backpack.jpg";
    bannerBgClass = "from-cyan-50 via-blue-50/50 to-brand-cream-50 border-cyan-100";
    badge1 = { icon: <Briefcase className="h-3.5 w-3.5 text-cyan-700" />, label: "Spinal Protection" };
    badge2 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />, label: "900D Waterproof Fabric" };
    badge3 = { icon: <Sparkles className="h-3.5 w-3.5 text-amber-500" />, label: "Reflective Safety" };
    slogan = "Lightweight Carrying";
  } else if (isOffers) {
    bannerTitle = title || "Special School Offers & Bundles";
    bannerSubtitle = subtitle || "Flat Discounts & Combo Packs for Complete School Kits.";
    bannerImage = "/images/combo-kids.jpg";
    bannerBgClass = "from-rose-50 via-amber-50/50 to-brand-cream-50 border-rose-100";
    badge1 = { icon: <Tag className="h-3.5 w-3.5 text-rose-600" />, label: "Flat 20% OFF" };
    badge2 = { icon: <Layers className="h-3.5 w-3.5 text-amber-600" />, label: "Combo Kits Savings" };
    badge3 = { icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />, label: "Free Shipping > ₹999" };
    slogan = "Best Value Guaranteed";
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-gradient-to-r ${bannerBgClass} p-5 sm:p-7 lg:p-8 mb-6 shadow-xs min-h-[170px] sm:min-h-[190px] flex items-center`}
    >
      {/* Background Kids / Product Photography Layer (Blended at the back) */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-full sm:w-2/3 md:w-1/2 lg:w-5/12 h-full z-0 overflow-hidden">
        <Image
          src={bannerImage}
          alt={bannerTitle}
          fill
          className="object-cover object-top opacity-90 sm:opacity-95"
          sizes="(max-width: 640px) 100vw, 500px"
          priority
        />
        {/* Soft gradient mask ensuring text in front has crystal clear contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/80 sm:via-[#FAF7F2]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2]/40 to-transparent sm:hidden" />
      </div>

      {/* Decorative Doodles & Glow */}
      <div className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 rounded-full bg-sky-200/40 blur-2xl z-0" />
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-24 w-24 rounded-full bg-amber-200/30 blur-xl z-0" />

      {/* Hand-drawn Paper Airplane */}
      <svg
        className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 h-7 w-7 text-sky-400/50 hidden md:block z-10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 2L2 22l10-4 10 4L12 2z" />
      </svg>

      {/* Foreground Content: Text, Badges, and Slogan in Front */}
      <div className="relative z-10 flex flex-col justify-center max-w-lg lg:max-w-xl">
        {/* Slogan Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-sky-900 border border-sky-200/80 shadow-2xs mb-2 w-fit">
          <span className="text-amber-500">✨</span>
          <span>{slogan}</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 tracking-tight leading-tight">
          {bannerTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium max-w-md">
          {bannerSubtitle}
        </p>

        {/* Feature Badges Row in Front */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-brand-navy-950 border border-slate-200/90 shadow-2xs">
            {badge1.icon}
            <span>{badge1.label}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-brand-navy-950 border border-slate-200/90 shadow-2xs">
            {badge2.icon}
            <span>{badge2.label}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold text-brand-navy-950 border border-slate-200/90 shadow-2xs">
            {badge3.icon}
            <span>{badge3.label}</span>
          </div>
        </div>
      </div>

      {/* Handwritten Floating Badge on the side */}
      <div className="absolute bottom-3 right-4 sm:right-6 bg-brand-yellow-400 text-brand-navy-950 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg shadow-md border border-brand-yellow-500 rotate-[-3deg] z-10">
        ⭐ Certified School Wear
      </div>
    </div>
  );
}
