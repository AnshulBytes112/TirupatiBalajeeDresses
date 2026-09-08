"use client";

import * as React from "react";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromoSplit } from "@/components/home/promo-split";
import { ProductCarouselSection } from "@/components/home/product-carousel-section";
import { TrustBar } from "@/components/home/trust-bar";
import { PromoCombos } from "@/components/home/promo-combos";
import { SchoolSelectorSection } from "@/components/home/school-selector-section";
import { TrustFooterBadges } from "@/components/home/trust-footer-badges";

// Master Products with realistic photography matching reference screenshot
const MASTER_TRENDING_PRODUCTS = [
  {
    id: "p-1",
    name: "Boys Half Sleeve School Shirt",
    slug: "boys-half-sleeve-school-shirt",
    mrp: 699,
    sellingPrice: 499,
    isBestseller: true,
    imageUrl: "/images/shirt.jpg",
  },
  {
    id: "p-2",
    name: "Girls School Pinafore",
    slug: "girls-school-pinafore",
    mrp: 1099,
    sellingPrice: 799,
    isBestseller: false,
    imageUrl: "/images/pinafore.jpg",
  },
  {
    id: "p-3",
    name: "Kids Thermal - Black",
    slug: "kids-thermal-set-black",
    mrp: 899,
    sellingPrice: 599,
    isBestseller: false,
    imageUrl: "/images/thermal.jpg",
  },
  {
    id: "p-4",
    name: "School Shoes (Unisex)",
    slug: "bata-school-shoes-black",
    mrp: 1399,
    sellingPrice: 999,
    isBestseller: true,
    imageUrl: "/images/shoes.jpg",
  },
  {
    id: "p-5",
    name: "School Socks (Pack of 3)",
    slug: "school-socks-pack-of-3",
    mrp: 399,
    sellingPrice: 299,
    isBestseller: false,
    imageUrl: "/images/socks.jpg",
  },
  {
    id: "p-6",
    name: "School Backpack",
    slug: "school-backpack-navy",
    mrp: 1299,
    sellingPrice: 899,
    isBestseller: false,
    imageUrl: "/images/backpack.jpg",
  },
];

export default function HomePage() {
  // Backend state
  const [schools, setSchools] = React.useState<any[]>([]);
  const [banners, setBanners] = React.useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = React.useState<any[]>(MASTER_TRENDING_PRODUCTS);
  const [isLoadingTrending, setIsLoadingTrending] = React.useState(false);

  // Initial Load: Fetch dynamic catalog data from backend API
  React.useEffect(() => {
    async function loadCatalog() {
      try {
        const [schoolRes, bannerRes] = await Promise.all([
          fetch("/api/schools").catch(() => null),
          fetch("/api/banners").catch(() => null),
        ]);

        if (schoolRes?.ok) {
          const json = await schoolRes.json();
          if (json.data?.length) setSchools(json.data);
        }
        if (bannerRes?.ok) {
          const json = await bannerRes.json();
          if (json.data?.length) setBanners(json.data);
        }
      } catch (e) {
        console.warn("Loaded catalog with fallback data:", e);
      }
    }

    loadCatalog();
  }, []);

  const splitBanners = banners.filter((b) => b.position === "PROMO_SPLIT");
  const summerBanner = splitBanners[0];
  const winterBanner = splitBanners[1];

  return (
    <div className="min-h-screen pb-4 space-y-3 sm:space-y-4">
      {/* 1. HERO CAROUSEL: "Uniforms for Every Season" */}
      <HeroCarousel />

      {/* 2. CATEGORIES: "Shop School Uniforms" */}
      <CategoryGrid />

      {/* 3. PROMOTIONAL SPLIT: Stay Cool This Summer & Stay Warm This Winter */}
      <PromoSplit summerBanner={summerBanner} winterBanner={winterBanner} />

      {/* 4. PRODUCT GRID: Trending Now */}
      <ProductCarouselSection
        title="Trending Now"
        subtitle="Most loved products by parents and students alike"
        viewAllHref="/products?filter=trending"
        products={trendingProducts}
        isLoading={isLoadingTrending}
      />

      {/* 5. MIDDLE 5-PILLAR TRUST BAR */}
      <TrustBar />

      {/* 6. PROMO COMBOS: Complete School Look & Thermals Collection */}
      <PromoCombos />

      {/* 7. BOTTOM TRUST FEATURE BADGES */}
      <TrustFooterBadges />

      {/* 8. SCHOOL DISCOVERY SECTION */}
      <SchoolSelectorSection schools={schools} />
    </div>
  );
}
