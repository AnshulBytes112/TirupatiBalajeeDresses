"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Shirt,
  Layers,
  Flame,
  Footprints,
  Backpack,
  Package,
  BookOpen,
  Droplet,
  Tag,
  Star,
  Check,
  Code2,
  Database,
  Layers as LayersIcon,
  Palette,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ProductCard } from "@/components/product/product-card";
import { siteConfig } from "@/config/site";

// Category icon map
const categoryIcons: Record<string, React.ReactNode> = {
  "summer-dress": <Shirt className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />,
  "winter-dress": <Layers className="h-6 w-6 sm:h-7 sm:w-7 text-sky-600" />,
  thermals: <Flame className="h-6 w-6 sm:h-7 sm:w-7 text-rose-500" />,
  "school-shoes": <Footprints className="h-6 w-6 sm:h-7 sm:w-7 text-slate-800" />,
  "school-bags": <Backpack className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-600" />,
  "socks-stockings": <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />,
  "belts-accessories": <Tag className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-600" />,
  stationery: <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-cyan-600" />,
  "water-bottles": <Droplet className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />,
  "lunch-boxes": <Package className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-600" />,
};

// Foundational sample showcase items
const sampleProducts = [
  {
    id: "prod-1",
    title: "Boys Half Sleeve School Shirt",
    slug: "boys-half-sleeve-school-shirt",
    basePrice: 699,
    salePrice: 499,
    categoryName: "Summer Dress",
    schoolName: "Delhi Public School",
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 356,
  },
  {
    id: "prod-2",
    title: "Girls School Pinafore Dress",
    slug: "girls-school-pinafore-dress",
    basePrice: 1099,
    salePrice: 799,
    categoryName: "Summer Dress",
    schoolName: "DAV Public School",
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 210,
  },
  {
    id: "prod-3",
    title: "Kids Thermal Top & Bottom - Black",
    slug: "kids-thermal-black",
    basePrice: 899,
    salePrice: 599,
    categoryName: "Thermals",
    schoolName: null,
    isBestseller: true,
    rating: 4.7,
    reviewsCount: 184,
  },
  {
    id: "prod-4",
    title: "Classic School Shoes (Unisex Oxford)",
    slug: "classic-school-shoes-unisex",
    basePrice: 1399,
    salePrice: 999,
    categoryName: "School Shoes",
    schoolName: null,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 420,
  },
  {
    id: "prod-5",
    title: "Cushioned School Socks (Pack of 3)",
    slug: "cushioned-school-socks-3pack",
    basePrice: 399,
    salePrice: 299,
    categoryName: "Socks & Stockings",
    schoolName: null,
    isBestseller: false,
    rating: 4.6,
    reviewsCount: 95,
  },
  {
    id: "prod-6",
    title: "Ergonomic Lightweight School Backpack",
    slug: "ergonomic-lightweight-school-backpack",
    basePrice: 1299,
    salePrice: 859,
    categoryName: "School Bags",
    schoolName: null,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 168,
  },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("All");
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        toast.success("Added to your wishlist! ❤️");
      } else {
        toast.info("Removed from wishlist");
      }
      return { ...prev, [id]: nextState };
    });
  };

  return (
    <div className="space-y-10 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION (MASTER REFERENCE) */}
      <section className="pt-4 sm:pt-6">
        <Container size="xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-brand-cream-50 to-amber-50 border border-sky-100/60 p-6 sm:p-10 lg:p-14 shadow-card">
            {/* Background Doodles & Floating Badges */}
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-brand-yellow-200/40 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Hero Content */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-navy-900 shadow-subtle border border-slate-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  School Days, Brighter Always
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-navy-950 leading-[1.1]">
                  Uniforms for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy-950 via-brand-navy-800 to-sky-700">
                    Every Season
                  </span>
                </h1>

                <p className="max-w-xl text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                  Comfort. Confidence. A Brighter Tomorrow. Providing premium quality school
                  uniforms, thermals, durable shoes, and academic essentials for students across India.
                </p>

                {/* Season Badges */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow-200/90 px-4 py-1.5 text-xs sm:text-sm font-bold text-brand-navy-950 shadow-subtle">
                    ☀️ Summer Dress
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-200/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-950 shadow-subtle">
                    ❄️ Winter Dress
                  </span>
                </div>

                {/* Hero CTA & Quick Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="default"
                    size="lg"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                    onClick={() => toast.success("Browsing School Uniforms Catalog")}
                  >
                    SHOP SCHOOL UNIFORMS
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsDemoModalOpen(true)}
                  >
                    Architecture Status
                  </Button>
                </div>

                {/* Trust Points */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200/70 text-brand-navy-950">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Premium Fabric</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Perfect Fit Guarantee</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Trusted by Parents</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Graphic Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl bg-white/90 p-6 shadow-card border border-white/80 backdrop-blur-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-brand-yellow-300 px-3 py-1 text-xs font-extrabold text-brand-navy-950">
                      2026 Academic Season
                    </span>
                    <span className="text-xs font-bold text-slate-400">100% Genuine</span>
                  </div>

                  <div className="relative aspect-[4/3] w-full rounded-2xl bg-gradient-to-tr from-sky-50 to-brand-cream-100 flex flex-col items-center justify-center p-4 text-center border border-slate-100">
                    <div className="h-16 w-16 rounded-full bg-brand-yellow-400 flex items-center justify-center shadow-button mb-2">
                      <Shirt className="h-8 w-8 text-brand-navy-950" />
                    </div>
                    <h3 className="text-base font-extrabold text-brand-navy-950">
                      All School Boards Covered
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      CBSE • ICSE • State Boards • International
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
                    <span>Sizes: 4Y - 16Y & Adult</span>
                    <span className="text-emerald-600">In Stock Ready to Ship</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. SHOP BY CATEGORY (MASTER REFERENCE) */}
      <section>
        <Container size="xl">
          <SectionHeader
            title="Shop by Category"
            subtitle="Everything your child needs for school, organized by essentials"
            viewAllHref="/categories"
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4 pt-2">
            {siteConfig.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100/80 shadow-subtle hover:shadow-card-hover hover:border-brand-yellow-300 transition-all duration-200 text-center"
              >
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-brand-cream-100/90 group-hover:bg-brand-yellow-200/70 group-hover:scale-105 transition-all">
                  {categoryIcons[cat.id] || <Shirt className="h-6 w-6 text-brand-navy-900" />}
                </div>
                <span className="text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. SEASONAL PROMO CARDS (SUMMER & WINTER SPLIT) */}
      <section>
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Summer Card */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-pastel-yellow p-6 sm:p-8 border border-brand-yellow-200 shadow-card flex flex-col justify-between min-h-[220px]">
              <div className="space-y-2">
                <span className="inline-block text-2xl">☀️</span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-navy-950">
                  Stay Cool This Summer
                </h3>
                <p className="text-xs sm:text-sm font-medium text-brand-navy-800/80 max-w-xs">
                  Breathable cotton blend shirts, skirts, shorts & active wear for school days.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="default"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => toast.success("Opening Summer Uniforms")}
                >
                  SHOP SUMMER DRESS
                </Button>
              </div>
            </div>

            {/* Winter Card */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-pastel-blue p-6 sm:p-8 border border-brand-pastel-blue-border shadow-card flex flex-col justify-between min-h-[220px]">
              <div className="space-y-2">
                <span className="inline-block text-2xl">❄️</span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-navy-950">
                  Stay Warm This Winter
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xs">
                  Premium blazers, sweaters, thermal inners, and cardigans for chilly mornings.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  size="default"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  onClick={() => toast.success("Opening Winter Uniforms")}
                >
                  SHOP WINTER DRESS
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. TRENDING NOW (MASTER REFERENCE PRODUCT GRID) */}
      <section>
        <Container size="xl">
          <SectionHeader
            title="Trending Now"
            subtitle="Most loved products by parents and students alike"
            viewAllHref="/trending"
          />

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-4">
            {["All", "Uniforms", "Thermals", "School Items", "Bestsellers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-brand-yellow-400 text-brand-navy-950 shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {sampleProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                slug={product.slug}
                basePrice={product.basePrice}
                salePrice={product.salePrice}
                categoryName={product.categoryName}
                schoolName={product.schoolName}
                isBestseller={product.isBestseller}
                rating={product.rating}
                reviewsCount={product.reviewsCount}
                isWishlisted={!!wishlist[product.id]}
                onWishlistToggle={toggleWishlist}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. TRIO PROMO BANNERS */}
      <section>
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Promo 1: Blue */}
            <div className="rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100/80 p-6 border border-sky-200 shadow-card flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 bg-sky-200/80 px-2.5 py-0.5 rounded-full">
                  Combo Pack
                </span>
                <h3 className="mt-2 text-lg font-black text-brand-navy-950">COMPLETE SCHOOL LOOK</h3>
                <p className="text-xs text-slate-600 mt-1">Uniforms + Shoes + Accessories</p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="self-start"
                onClick={() => toast.success("Opening Combo Sets")}
              >
                SHOP COMBO SETS
              </Button>
            </div>

            {/* Promo 2: Pink */}
            <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100/80 p-6 border border-pink-200 shadow-card flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-800 bg-pink-200/80 px-2.5 py-0.5 rounded-full">
                  Thermals Collection
                </span>
                <h3 className="mt-2 text-lg font-black text-brand-navy-950">Warmth for Every Adventure</h3>
                <p className="text-xs text-slate-600 mt-1">Soft, lightweight multi-stretch thermals</p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="self-start"
                onClick={() => toast.success("Opening Thermals")}
              >
                EXPLORE NOW
              </Button>
            </div>

            {/* Promo 3: Yellow */}
            <div className="rounded-3xl bg-gradient-to-br from-yellow-50 to-amber-100/80 p-6 border border-amber-200 shadow-card flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-brand-yellow-300 px-2.5 py-0.5 rounded-full font-bold">
                  Special Offer
                </span>
                <h3 className="mt-2 text-lg font-black text-brand-navy-950">Flat 20% OFF</h3>
                <p className="text-xs text-slate-600 mt-1">On Uniforms, Thermals & School Items</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-dashed border-amber-500 bg-white px-2.5 py-1 text-xs font-black text-amber-900">
                  CODE: SCHOOL20
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. TOP BRANDS */}
      <section>
        <Container size="xl">
          <SectionHeader
            title="Top Brands"
            subtitle="Quality you can trust for everyday school life"
            align="between"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {siteConfig.brands.map((brand) => (
              <div
                key={brand.slug}
                className="flex h-14 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-subtle p-3 text-center"
              >
                <span className="text-xs font-black tracking-tight text-brand-navy-900">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* MODAL: Architecture Verification Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Phase 0: Architecture & Foundation Status"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Layered Architecture Established:</span>
            </div>
            <p className="text-slate-600 pl-6">
              UI components (<code>src/components</code>) → Hooks (<code>src/hooks</code>) →
              Services (<code>src/services</code>) → Repositories (<code>src/repositories</code>) →
              Database (<code>src/lib/prisma.ts</code>)
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>Database Layer:</span>
            </div>
            <p className="text-slate-600 pl-6">
              Prisma ORM schema with User, School, Category, Product, ProductVariant, Cart, Order,
              Review models.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Palette className="h-4 w-4 text-emerald-600" />
              <span>Design System Tokens:</span>
            </div>
            <p className="text-slate-600 pl-6">
              Cream (#FAF7F2), Buttery Yellow (#FACC15), Dark Navy (#0F172A), Pastel Blue/Pink/Green
              matching master reference.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="yellow" onClick={() => setIsDemoModalOpen(false)}>
              Close & Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
