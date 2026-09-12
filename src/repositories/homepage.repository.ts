import { prisma } from "@/lib/prisma";
import {
  DynamicHomepageData,
  DynamicHeroSlide,
  DynamicCategoryCard,
  DynamicPromoSplitCard,
  DynamicPromoComboCard,
  DynamicTrendingProduct,
} from "@/types/homepage";

export const DEFAULT_HERO_SLIDES: DynamicHeroSlide[] = [
  {
    id: "hero-uniforms-season",
    badge: "SCHOOL DAYS, BRIGHTER ALWAYS",
    titleLine1: "Uniforms for",
    titleLine2: "Every Season",
    subtitle: "Comfort. Confidence. A Brighter Tomorrow.",
    ctaText: "SHOP SCHOOL UNIFORMS",
    ctaUrl: "/categories/school-uniforms",
    imageSrc: "/images/hero-kids.jpg",
    imageAlt: "Indian school children smiling in uniform",
    doodleText: "Same Values Every Season",
    stickyNote: {
      text: "Good Uniforms",
      subtext: "Brighter Futures 😊",
    },
    seasonalBtn1: { text: "Summer Uniforms", emoji: "☀️", url: "/categories/summer-dress" },
    seasonalBtn2: { text: "Winter Blazers", emoji: "❄️", url: "/categories/winter-dress" },
  },
  {
    id: "hero-winter-warmers",
    badge: "WINTER ESSENTIALS 2026",
    titleLine1: "Warmth for",
    titleLine2: "Every Adventure",
    subtitle: "Ultra-soft thermals, cozy sweaters & blazers for school mornings.",
    ctaText: "EXPLORE WINTER DRESS",
    ctaUrl: "/categories/winter-dress",
    imageSrc: "/images/combo-kids.jpg",
    imageAlt: "School students in winter school dress",
    doodleText: "Ready for Brighter Mornings",
    stickyNote: {
      text: "Cozy & Warm",
      subtext: "All Day Long ❄️",
    },
    seasonalBtn1: { text: "Thermal Sets", emoji: "🔥", url: "/categories/thermals" },
    seasonalBtn2: { text: "School Sweaters", emoji: "🧥", url: "/categories/winter-dress" },
  },
  {
    id: "hero-school-combos",
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
    seasonalBtn1: { text: "Primary Bundles", emoji: "🎒", url: "/combos" },
    seasonalBtn2: { text: "Shoes & Socks", emoji: "👟", url: "/categories/school-shoes" },
  },
];

export const DEFAULT_CATEGORY_CARDS: DynamicCategoryCard[] = [
  {
    id: "cat-summer-dress",
    name: "Summer Dress",
    href: "/categories/summer-dress",
    badgeEmoji: "☀️",
    subtitleLine1: "Cool & Crisp",
    subtitleLine2: "Cotton Blends",
    imageSrc: "/images/shirt.jpg",
    borderColor: "border-amber-200/80",
    hoverBorderColor: "hover:border-amber-400",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-winter-dress",
    name: "Winter Dress",
    href: "/categories/winter-dress",
    badgeEmoji: "❄️",
    subtitleLine1: "Warm Blazers &",
    subtitleLine2: "Sweaters",
    imageSrc: "/images/pinafore.jpg",
    borderColor: "border-sky-200/80",
    hoverBorderColor: "hover:border-sky-400",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-thermals",
    name: "Thermals",
    href: "/categories/thermals",
    badgeEmoji: "🔥",
    subtitleLine1: "Ultra-Soft",
    subtitleLine2: "Thermal Layers",
    imageSrc: "/images/thermal.jpg",
    borderColor: "border-rose-200/80",
    hoverBorderColor: "hover:border-rose-400",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-school-shoes",
    name: "School Shoes",
    href: "/categories/school-shoes",
    badgeEmoji: "👟",
    subtitleLine1: "Durable Oxford &",
    subtitleLine2: "PT Shoes",
    imageSrc: "/images/shoes.jpg",
    borderColor: "border-indigo-200/80",
    hoverBorderColor: "hover:border-indigo-400",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "cat-school-bags",
    name: "School Bags",
    href: "/categories/school-bags",
    badgeEmoji: "🎒",
    subtitleLine1: "Ergonomic &",
    subtitleLine2: "Spacious",
    imageSrc: "/images/backpack.jpg",
    borderColor: "border-emerald-200/80",
    hoverBorderColor: "hover:border-emerald-400",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "cat-stationery",
    name: "Stationery",
    href: "/categories/stationery",
    badgeEmoji: "✏️",
    subtitleLine1: "Geometry &",
    subtitleLine2: "Notebooks",
    imageSrc: "/images/accessories.jpg",
    borderColor: "border-purple-200/80",
    hoverBorderColor: "hover:border-purple-400",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    href: "/categories/belts-accessories",
    badgeEmoji: "👔",
    subtitleLine1: "Ties, Belts &",
    subtitleLine2: "Socks",
    imageSrc: "/images/socks.jpg",
    borderColor: "border-orange-200/80",
    hoverBorderColor: "hover:border-orange-400",
    displayOrder: 7,
    isActive: true,
  },
  {
    id: "cat-combos",
    name: "Combo Packs",
    href: "/combos",
    badgeEmoji: "⭐",
    subtitleLine1: "All-in-One",
    subtitleLine2: "Value Bundles",
    imageSrc: "/images/combo-kids.jpg",
    borderColor: "border-blue-200/80",
    hoverBorderColor: "hover:border-blue-400",
    displayOrder: 8,
    isActive: true,
  },
];

export const DEFAULT_PROMO_SPLIT_CARDS: DynamicPromoSplitCard[] = [
  {
    id: "promo-summer",
    title: "Stay Cool This Summer",
    subtitle: "Comfortable Uniforms for Active Days",
    ctaText: "SHOP SUMMER DRESS",
    ctaUrl: "/categories/summer-dress",
    imageSrc: "/images/summer-flatlay.jpg",
    doodleText: "Play Learn Grow ♡",
    iconEmoji: "☀️",
    bgColor: "#FEF4CE",
    borderColor: "#FBE39A",
    isActive: true,
  },
  {
    id: "promo-winter",
    title: "Stay Warm This Winter",
    subtitle: "Soft Blazers, Sweaters & Thermals",
    ctaText: "SHOP WINTER DRESS",
    ctaUrl: "/categories/winter-dress",
    imageSrc: "/images/winter-flatlay.jpg",
    doodleText: "Same Spirit New Season ⭐",
    iconEmoji: "❄️",
    bgColor: "#E0F2FE",
    borderColor: "#BAE6FD",
    isActive: true,
  },
];

export const DEFAULT_PROMO_COMBO_CARDS: DynamicPromoComboCard[] = [
  {
    id: "combo-complete-look",
    tag: "BEST VALUE",
    title: "Complete School Look",
    subtitle: "Uniforms + Shoes + Accessories in one discounted bundle",
    ctaText: "SHOP COMBO SETS",
    ctaUrl: "/combos",
    imageSrc: "/images/combo-kids.jpg",
    bgColor: "#E1F1FD",
    borderColor: "#C6E4FA",
    layout: "image-left",
    isActive: true,
  },
  {
    id: "combo-thermals",
    tag: "THERMALS COLLECTION",
    title: "Winter Warmth Inside Out",
    subtitle: "Premium soft-knit thermal innerwear sets for everyday school warmth",
    ctaText: "EXPLORE THERMALS",
    ctaUrl: "/categories/thermals",
    imageSrc: "/images/thermal.jpg",
    bgColor: "#FDF2F4",
    borderColor: "#FCE1E6",
    layout: "image-right",
    isActive: true,
  },
];

export const DEFAULT_TRENDING_PRODUCTS: DynamicTrendingProduct[] = [
  {
    id: "trend-1",
    name: "Boys Half Sleeve School Shirt",
    subtitle: "Premium Cotton Poly Blend",
    schoolName: "Delhi Public School",
    categoryName: "Summer Dress",
    mrp: 699,
    sellingPrice: 499,
    discountBadge: "29% OFF",
    rating: 4.9,
    reviewCount: 42,
    imageUrl: "/images/shirt.jpg",
    productUrl: "/products/boys-half-sleeve-school-shirt",
    isBestseller: true,
    isActive: true,
  },
  {
    id: "trend-2",
    name: "Girls School Pinafore",
    subtitle: "Pleated High-Grade Poly Viscose",
    schoolName: "Kendriya Vidyalaya",
    categoryName: "Summer Dress",
    mrp: 1099,
    sellingPrice: 799,
    discountBadge: "27% OFF",
    rating: 4.8,
    reviewCount: 38,
    imageUrl: "/images/pinafore.jpg",
    productUrl: "/products/girls-school-pinafore",
    isBestseller: false,
    isActive: true,
  },
  {
    id: "trend-3",
    name: "Kids Thermal Set - Charcoal Black",
    subtitle: "Soft Fleece Lined Multi-Stretch",
    schoolName: "All Schools",
    categoryName: "Thermals",
    mrp: 899,
    sellingPrice: 599,
    discountBadge: "33% OFF",
    rating: 5.0,
    reviewCount: 65,
    imageUrl: "/images/thermal.jpg",
    productUrl: "/products/kids-thermal-set-black",
    isBestseller: true,
    isActive: true,
  },
  {
    id: "trend-4",
    name: "Bata School Leather Shoes (Unisex)",
    subtitle: "Formal Breathable Leather Sole",
    schoolName: "All Schools",
    categoryName: "School Shoes",
    mrp: 1399,
    sellingPrice: 999,
    discountBadge: "29% OFF",
    rating: 4.7,
    reviewCount: 51,
    imageUrl: "/images/shoes.jpg",
    productUrl: "/products/bata-school-shoes-black",
    isBestseller: true,
    isActive: true,
  },
  {
    id: "trend-5",
    name: "School Socks (Pack of 3 Pairs)",
    subtitle: "Anti-Odor Cushioned Terry Cotton",
    schoolName: "All Schools",
    categoryName: "Accessories",
    mrp: 399,
    sellingPrice: 299,
    discountBadge: "25% OFF",
    rating: 4.9,
    reviewCount: 89,
    imageUrl: "/images/socks.jpg",
    productUrl: "/products/school-socks-pack-of-3",
    isBestseller: false,
    isActive: true,
  },
  {
    id: "trend-6",
    name: "Senior School Ergonomic Backpack",
    subtitle: "Water Resistant with Reflector Strips",
    schoolName: "All Schools",
    categoryName: "School Bags",
    mrp: 1299,
    sellingPrice: 899,
    discountBadge: "31% OFF",
    rating: 4.8,
    reviewCount: 30,
    imageUrl: "/images/backpack.jpg",
    productUrl: "/products/school-backpack-navy",
    isBestseller: false,
    isActive: true,
  },
];

export const DEFAULT_PROMO_SPLIT = {
  summerBanner: {
    title: "Stay Cool This Summer",
    subtitle: "Comfortable Uniforms for Active Days",
    ctaText: "SHOP SUMMER DRESS",
    ctaUrl: "/categories/summer-dress",
    imageSrc: "/images/summer-flatlay.jpg",
    doodleText: "Play Learn Grow ♡",
    bgColor: "#FEF4CE",
    borderColor: "#FBE39A",
  },
  winterBanner: {
    title: "Stay Warm This Winter",
    subtitle: "Soft Blazers, Sweaters & Thermals",
    ctaText: "SHOP WINTER DRESS",
    ctaUrl: "/categories/winter-dress",
    imageSrc: "/images/winter-flatlay.jpg",
    doodleText: "Same Spirit New Season ⭐",
    bgColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
};

export const DEFAULT_PROMO_COMBOS = {
  comboBanner: {
    title: "Complete School Look",
    subtitle: "Uniforms + Shoes + Accessories",
    ctaText: "SHOP COMBO SETS",
    ctaUrl: "/combos",
    imageSrc: "/images/combo-kids.jpg",
  },
  thermalsBanner: {
    tag: "THERMALS COLLECTION",
    title: "Winter Warmth Inside Out",
    subtitle: "Soft-knit thermals for school days",
    ctaText: "EXPLORE THERMALS",
    ctaUrl: "/categories/thermals",
    imageSrc: "/images/thermal.jpg",
  },
};

export const DEFAULT_TRENDING_SETTINGS = {
  title: "Trending Now",
  subtitle: "Most loved products by parents and students alike",
  viewAllHref: "/products?filter=trending",
};

export class HomepageRepository {
  /**
   * Retrieves active dynamic homepage data, falling back to seed defaults if DB is empty
   */
  async getHomepageData(): Promise<DynamicHomepageData> {
    try {
      const sections = await prisma.homepageSection.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      });

      const sectionMap: Record<string, any> = {};
      sections.forEach((sec: any) => {
        sectionMap[sec.sectionKey] = sec.content;
      });

      // Normalize hero slides
      const heroSlides =
        Array.isArray(sectionMap["hero_carousel"]) && sectionMap["hero_carousel"].length > 0
          ? sectionMap["hero_carousel"]
          : DEFAULT_HERO_SLIDES;

      // Normalize category cards
      const categoryCards =
        Array.isArray(sectionMap["category_grid"]) && sectionMap["category_grid"].length > 0
          ? sectionMap["category_grid"]
          : DEFAULT_CATEGORY_CARDS;

      // Normalize promo split cards
      let promoSplitCards: DynamicPromoSplitCard[] = DEFAULT_PROMO_SPLIT_CARDS;
      if (Array.isArray(sectionMap["promo_split"]) && sectionMap["promo_split"].length > 0) {
        promoSplitCards = sectionMap["promo_split"];
      } else if (sectionMap["promo_split"]?.summerBanner && sectionMap["promo_split"]?.winterBanner) {
        promoSplitCards = [
          {
            id: "promo-summer",
            title: sectionMap["promo_split"].summerBanner.title || DEFAULT_PROMO_SPLIT.summerBanner.title,
            subtitle: sectionMap["promo_split"].summerBanner.subtitle || DEFAULT_PROMO_SPLIT.summerBanner.subtitle,
            ctaText: sectionMap["promo_split"].summerBanner.ctaText || DEFAULT_PROMO_SPLIT.summerBanner.ctaText,
            ctaUrl: sectionMap["promo_split"].summerBanner.ctaUrl || DEFAULT_PROMO_SPLIT.summerBanner.ctaUrl,
            imageSrc: sectionMap["promo_split"].summerBanner.imageSrc || DEFAULT_PROMO_SPLIT.summerBanner.imageSrc,
            doodleText: sectionMap["promo_split"].summerBanner.doodleText || "Play Learn Grow ♡",
            iconEmoji: "☀️",
            bgColor: sectionMap["promo_split"].summerBanner.bgColor || "#FEF4CE",
            borderColor: sectionMap["promo_split"].summerBanner.borderColor || "#FBE39A",
            isActive: true,
          },
          {
            id: "promo-winter",
            title: sectionMap["promo_split"].winterBanner.title || DEFAULT_PROMO_SPLIT.winterBanner.title,
            subtitle: sectionMap["promo_split"].winterBanner.subtitle || DEFAULT_PROMO_SPLIT.winterBanner.subtitle,
            ctaText: sectionMap["promo_split"].winterBanner.ctaText || DEFAULT_PROMO_SPLIT.winterBanner.ctaText,
            ctaUrl: sectionMap["promo_split"].winterBanner.ctaUrl || DEFAULT_PROMO_SPLIT.winterBanner.ctaUrl,
            imageSrc: sectionMap["promo_split"].winterBanner.imageSrc || DEFAULT_PROMO_SPLIT.winterBanner.imageSrc,
            doodleText: sectionMap["promo_split"].winterBanner.doodleText || "Same Spirit New Season ⭐",
            iconEmoji: "❄️",
            bgColor: sectionMap["promo_split"].winterBanner.bgColor || "#E0F2FE",
            borderColor: sectionMap["promo_split"].winterBanner.borderColor || "#BAE6FD",
            isActive: true,
          },
        ];
      }

      // Normalize promo combo cards
      let promoComboCards: DynamicPromoComboCard[] = DEFAULT_PROMO_COMBO_CARDS;
      if (Array.isArray(sectionMap["promo_combos"]) && sectionMap["promo_combos"].length > 0) {
        promoComboCards = sectionMap["promo_combos"];
      } else if (sectionMap["promo_combos"]?.comboBanner && sectionMap["promo_combos"]?.thermalsBanner) {
        promoComboCards = [
          {
            id: "combo-complete-look",
            tag: "BEST VALUE",
            title: sectionMap["promo_combos"].comboBanner.title || DEFAULT_PROMO_COMBOS.comboBanner.title,
            subtitle: sectionMap["promo_combos"].comboBanner.subtitle || DEFAULT_PROMO_COMBOS.comboBanner.subtitle,
            ctaText: sectionMap["promo_combos"].comboBanner.ctaText || DEFAULT_PROMO_COMBOS.comboBanner.ctaText,
            ctaUrl: sectionMap["promo_combos"].comboBanner.ctaUrl || DEFAULT_PROMO_COMBOS.comboBanner.ctaUrl,
            imageSrc: sectionMap["promo_combos"].comboBanner.imageSrc || DEFAULT_PROMO_COMBOS.comboBanner.imageSrc,
            bgColor: "#E1F1FD",
            borderColor: "#C6E4FA",
            layout: "image-left",
            isActive: true,
          },
          {
            id: "combo-thermals",
            tag: sectionMap["promo_combos"].thermalsBanner.tag || "THERMALS COLLECTION",
            title: sectionMap["promo_combos"].thermalsBanner.title || DEFAULT_PROMO_COMBOS.thermalsBanner.title,
            subtitle: sectionMap["promo_combos"].thermalsBanner.subtitle || DEFAULT_PROMO_COMBOS.thermalsBanner.subtitle,
            ctaText: sectionMap["promo_combos"].thermalsBanner.ctaText || DEFAULT_PROMO_COMBOS.thermalsBanner.ctaText,
            ctaUrl: sectionMap["promo_combos"].thermalsBanner.ctaUrl || DEFAULT_PROMO_COMBOS.thermalsBanner.ctaUrl,
            imageSrc: sectionMap["promo_combos"].thermalsBanner.imageSrc || DEFAULT_PROMO_COMBOS.thermalsBanner.imageSrc,
            bgColor: "#FDF2F4",
            borderColor: "#FCE1E6",
            layout: "image-right",
            isActive: true,
          },
        ];
      }

      // Normalize trending products
      const trendingProducts: DynamicTrendingProduct[] =
        Array.isArray(sectionMap["trending_products"]) && sectionMap["trending_products"].length > 0
          ? sectionMap["trending_products"]
          : DEFAULT_TRENDING_PRODUCTS;

      return {
        heroSlides,
        categoryCards,
        promoSplitCards,
        promoSplit: sectionMap["promo_split"] || DEFAULT_PROMO_SPLIT,
        promoComboCards,
        promoCombos: sectionMap["promo_combos"] || DEFAULT_PROMO_COMBOS,
        trendingProducts,
        trendingSettings:
          sectionMap["trending_section"] || DEFAULT_TRENDING_SETTINGS,
        updatedAt: sections[0]?.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (e) {
      console.warn("Error fetching homepage data from DB, using defaults:", e);
      return {
        heroSlides: DEFAULT_HERO_SLIDES,
        categoryCards: DEFAULT_CATEGORY_CARDS,
        promoSplitCards: DEFAULT_PROMO_SPLIT_CARDS,
        promoSplit: DEFAULT_PROMO_SPLIT,
        promoComboCards: DEFAULT_PROMO_COMBO_CARDS,
        promoCombos: DEFAULT_PROMO_COMBOS,
        trendingProducts: DEFAULT_TRENDING_PRODUCTS,
        trendingSettings: DEFAULT_TRENDING_SETTINGS,
      };
    }
  }

  /**
   * Super-Admin: Updates or inserts a specific homepage section
   */
  async updateSection(
    sectionKey: string,
    content: any,
    metadata?: { title?: string; subtitle?: string; badge?: string; displayOrder?: number }
  ) {
    const safeContent = content === undefined ? [] : JSON.parse(JSON.stringify(content));

    return prisma.homepageSection.upsert({
      where: { sectionKey },
      update: {
        content: safeContent,
        title: metadata?.title,
        subtitle: metadata?.subtitle,
        badge: metadata?.badge,
        displayOrder: metadata?.displayOrder ?? 0,
        isActive: true,
      },
      create: {
        sectionKey,
        content: safeContent,
        title: metadata?.title,
        subtitle: metadata?.subtitle,
        badge: metadata?.badge,
        displayOrder: metadata?.displayOrder ?? 0,
        isActive: true,
      },
    });
  }

  /**
   * Super-Admin: Batch update all homepage sections
   */
  async saveEntireHomepage(data: Partial<DynamicHomepageData>) {
    const promises: Promise<any>[] = [];

    if (data.heroSlides !== undefined) {
      promises.push(this.updateSection("hero_carousel", data.heroSlides));
    }
    if (data.categoryCards !== undefined) {
      promises.push(this.updateSection("category_grid", data.categoryCards));
    }
    if (data.promoSplitCards !== undefined) {
      promises.push(this.updateSection("promo_split", data.promoSplitCards));
    } else if (data.promoSplit !== undefined) {
      promises.push(this.updateSection("promo_split", data.promoSplit));
    }
    if (data.promoComboCards !== undefined) {
      promises.push(this.updateSection("promo_combos", data.promoComboCards));
    } else if (data.promoCombos !== undefined) {
      promises.push(this.updateSection("promo_combos", data.promoCombos));
    }
    if (data.trendingProducts !== undefined) {
      promises.push(this.updateSection("trending_products", data.trendingProducts));
    }
    if (data.trendingSettings !== undefined) {
      promises.push(this.updateSection("trending_section", data.trendingSettings));
    }

    await Promise.all(promises);
    return this.getHomepageData();
  }
}

export const homepageRepository = new HomepageRepository();
