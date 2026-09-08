"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
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
  Check,
  Database,
  Palette,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProductCard } from "@/components/product/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";

// Dynamic Category Icon mapper
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
  "school-uniforms": <Shirt className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />,
};

interface ProductItem {
  id: string;
  title: string;
  name: string;
  slug: string;
  mrp: number;
  sellingPrice: number;
  basePrice: number;
  salePrice?: number | null;
  isBestseller: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  category: { id: string; name: string; slug: string };
  school?: { id: string; name: string; slug: string } | null;
  images: { id: string; url: string; alt?: string | null }[];
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  productsCount: number;
  children: { id: string; name: string; slug: string; productsCount: number }[];
}

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  productsCount: number;
}

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string | null;
  image: string;
  ctaText?: string | null;
  ctaUrl?: string | null;
  badge?: string | null;
  position: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = React.useState("All");
  const [isDemoModalOpen, setIsDemoModalOpen] = React.useState(false);
  const [wishlist, setWishlist] = React.useState<Record<string, boolean>>({});

  // Backend state
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [brands, setBrands] = React.useState<BrandItem[]>([]);
  const [banners, setBanners] = React.useState<BannerItem[]>([]);
  
  const [isLoadingProducts, setIsLoadingProducts] = React.useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  // 1. Fetch Categories, Brands & Banners on initial load
  const fetchInitialData = React.useCallback(async () => {
    try {
      setHasError(false);
      const [catRes, brandRes, bannerRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/brands"),
        fetch("/api/banners"),
      ]);

      if (!catRes.ok || !brandRes.ok || !bannerRes.ok) {
        throw new Error("Failed to load initial website catalog data");
      }

      const catJson = await catRes.json();
      const brandJson = await brandRes.json();
      const bannerJson = await bannerRes.json();

      setCategories(catJson.data || []);
      setBrands(brandJson.data || []);
      setBanners(bannerJson.data || []);
    } catch (err) {
      console.error("Initial data load error:", err);
      setHasError(true);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  // 2. Fetch Products dynamically based on active filter tab
  const fetchProducts = React.useCallback(async (tab: string) => {
    try {
      setIsLoadingProducts(true);
      let queryUrl = "/api/products?limit=12&sortBy=popular";

      if (tab === "Uniforms") {
        queryUrl += "&category=school-uniforms";
      } else if (tab === "Thermals") {
        queryUrl += "&category=thermals";
      } else if (tab === "School Items") {
        queryUrl += "&category=school-accessories";
      } else if (tab === "Bestsellers") {
        queryUrl += "&isBestseller=true";
      }

      const res = await fetch(queryUrl);
      if (!res.ok) throw new Error("Failed to fetch products");

      const json = await res.json();
      setProducts(json.data || []);
    } catch (err) {
      console.error("Products fetch error:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  React.useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  React.useEffect(() => {
    fetchProducts(activeTab);
  }, [activeTab, fetchProducts]);

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

  // Hero & Split banners from dynamic backend
  const heroBanner = banners.find((b) => b.position === "HERO") || {
    title: "Uniforms for Every Season",
    subtitle: "Comfort. Confidence. A Brighter Tomorrow.",
    badge: "School Days, Brighter Always",
    ctaText: "SHOP SCHOOL UNIFORMS",
    ctaUrl: "/category/school-uniforms",
  };

  const splitBanners = banners.filter((b) => b.position === "PROMO_SPLIT");
  const summerBanner = splitBanners[0] || {
    title: "Stay Cool This Summer",
    subtitle: "Comfortable Uniforms for Active Days",
    ctaText: "SHOP SUMMER DRESS",
    ctaUrl: "/category/summer-dress",
  };
  const winterBanner = splitBanners[1] || {
    title: "Stay Warm This Winter",
    subtitle: "Premium Winter Uniforms for Every Season",
    ctaText: "SHOP WINTER DRESS",
    ctaUrl: "/category/winter-dress",
  };

  if (hasError && categories.length === 0) {
    return (
      <div className="py-20">
        <Container size="md">
          <ErrorState
            title="Failed to connect to database"
            message="We could not retrieve catalog data from PostgreSQL. Please ensure the backend database is running and try again."
            onRetry={fetchInitialData}
          />
        </Container>
      </div>
    );
  }

  return (
    <div className="space-y-10 sm:space-y-16 pb-12">
      {/* 1. HERO SECTION (DYNAMICALLY BACKEND DRIVEN) */}
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
                  {heroBanner.badge || "School Days, Brighter Always"}
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-brand-navy-950 leading-[1.1]">
                  Uniforms for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-navy-950 via-brand-navy-800 to-sky-700">
                    Every Season
                  </span>
                </h1>

                <p className="max-w-xl text-sm sm:text-base font-medium text-slate-600 leading-relaxed">
                  {heroBanner.subtitle ||
                    "Comfort. Confidence. A Brighter Tomorrow. Providing premium quality school uniforms, thermals, durable shoes, and academic essentials for students across India."}
                </p>

                {/* Season Badges */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <Link href="/category/summer-dress">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow-200/90 px-4 py-1.5 text-xs sm:text-sm font-bold text-brand-navy-950 shadow-subtle hover:bg-brand-yellow-300 transition-colors">
                      ☀️ Summer Dress
                    </span>
                  </Link>
                  <Link href="/category/winter-dress">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-200/80 px-4 py-1.5 text-xs sm:text-sm font-bold text-sky-950 shadow-subtle hover:bg-sky-300 transition-colors">
                      ❄️ Winter Dress
                    </span>
                  </Link>
                </div>

                {/* Hero CTA & Quick Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link href={heroBanner.ctaUrl || "/category/school-uniforms"}>
                    <Button
                      variant="default"
                      size="lg"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      {heroBanner.ctaText || "SHOP SCHOOL UNIFORMS"}
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsDemoModalOpen(true)}
                  >
                    Database Architecture Status
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

      {/* 2. SHOP BY CATEGORY (DYNAMICALLY FROM POSTGRESQL) */}
      <section>
        <Container size="xl">
          <SectionHeader
            title="Shop by Category"
            subtitle="Everything your child needs for school, organized by essentials"
            viewAllHref="/categories"
          />

          {isLoadingInitial ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4 pt-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100">
                  <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4 pt-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100/80 shadow-subtle hover:shadow-card-hover hover:border-brand-yellow-300 transition-all duration-200 text-center"
                >
                  <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-brand-cream-100/90 group-hover:bg-brand-yellow-200/70 group-hover:scale-105 transition-all">
                    {categoryIcons[cat.slug] || <Shirt className="h-6 w-6 text-brand-navy-900" />}
                  </div>
                  <span className="text-xs font-bold text-brand-navy-950 group-hover:text-brand-navy-800 transition-colors leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
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
                  {summerBanner.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-brand-navy-800/80 max-w-xs">
                  {summerBanner.subtitle}
                </p>
              </div>

              <div className="pt-4">
                <Link href={summerBanner.ctaUrl || "/category/summer-dress"}>
                  <Button
                    variant="primary"
                    size="default"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {summerBanner.ctaText || "SHOP SUMMER DRESS"}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Winter Card */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-pastel-blue p-6 sm:p-8 border border-brand-pastel-blue-border shadow-card flex flex-col justify-between min-h-[220px]">
              <div className="space-y-2">
                <span className="inline-block text-2xl">❄️</span>
                <h3 className="text-xl sm:text-2xl font-black text-brand-navy-950">
                  {winterBanner.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-700 max-w-xs">
                  {winterBanner.subtitle}
                </p>
              </div>

              <div className="pt-4">
                <Link href={winterBanner.ctaUrl || "/category/winter-dress"}>
                  <Button
                    variant="primary"
                    size="default"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {winterBanner.ctaText || "SHOP WINTER DRESS"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. TRENDING NOW (DYNAMICALLY SERVED FROM POSTGRESQL VIA REST API) */}
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
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-3">
                  <Skeleton className="aspect-[4/4.2] w-full rounded-xl" />
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found in this collection"
              description="Check back soon or explore our complete school uniforms catalog."
              actionLabel="View All Uniforms"
              onAction={() => setActiveTab("All")}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name || product.title}
                  slug={product.slug}
                  basePrice={product.mrp || product.basePrice}
                  salePrice={product.sellingPrice || product.salePrice}
                  imageUrl={product.images[0]?.url}
                  categoryName={product.category?.name}
                  schoolName={product.school?.name || null}
                  isBestseller={product.isBestseller}
                  rating={product.rating}
                  reviewsCount={product.reviewCount}
                  isWishlisted={!!wishlist[product.id]}
                  onWishlistToggle={toggleWishlist}
                />
              ))}
            </div>
          )}
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
              <Link href="/combos">
                <Button variant="default" size="sm" className="self-start">
                  SHOP COMBO SETS
                </Button>
              </Link>
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
              <Link href="/category/thermals">
                <Button variant="default" size="sm" className="self-start">
                  EXPLORE NOW
                </Button>
              </Link>
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

      {/* 6. TOP BRANDS (DYNAMICALLY FROM DATABASE) */}
      <section>
        <Container size="xl">
          <SectionHeader
            title="Top Brands"
            subtitle="Quality you can trust for everyday school life"
            align="between"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brand/${brand.slug}`}
                className="flex h-14 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-subtle p-3 text-center hover:border-brand-yellow-300 hover:shadow-card transition-all"
              >
                <span className="text-xs font-black tracking-tight text-brand-navy-900">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* MODAL: Database Architecture Verification Modal */}
      <Modal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        title="Phase 1: Database & API Architecture Status"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Database className="h-4 w-4 text-emerald-600" />
              <span>PostgreSQL & Prisma Schema Connected:</span>
            </div>
            <p className="text-slate-600 pl-6">
              Live PostgreSQL database with Decimal precision for prices, UUID keys, composite indexes, soft deletes, and inventory tracking.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Seeded Database Statistics:</span>
            </div>
            <p className="text-slate-600 pl-6">
              • <strong>{brands.length}</strong> Brands (TirupatiBalajee, Bata, Nivia, Cello, Camlin, etc.)<br />
              • <strong>{categories.length}</strong> Main Categories & Subcategories<br />
              • <strong>41</strong> Uniforms & Essentials Products with <strong>391</strong> Variants & Inventory records<br />
              • <strong>6</strong> Major Indian Schools with Many-to-Many Uniform mappings
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3.5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-brand-navy-950">
              <Palette className="h-4 w-4 text-emerald-600" />
              <span>API Layer Status:</span>
            </div>
            <p className="text-slate-600 pl-6">
              <code>GET /api/products</code> • <code>GET /api/categories</code> • <code>GET /api/schools</code> • <code>GET /api/brands</code> • <code>GET /api/banners</code> (All active with Zod validation and standard JSON envelope).
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
