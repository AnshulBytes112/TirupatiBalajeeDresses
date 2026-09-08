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
    seasonalBtn1: { text: "Summer Dress", emoji: "☀️", url: "/category/summer-dress" },
    seasonalBtn2: { text: "Winter Dress", emoji: "❄️", url: "/category/winter-dress" },
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
    seasonalBtn1: { text: "Thermals", emoji: "🔥", url: "/category/thermals" },
    seasonalBtn2: { text: "Blazers", emoji: "🧥", url: "/category/winter-dress" },
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
    seasonalBtn1: { text: "Combo Packs", emoji: "✨", url: "/combos" },
    seasonalBtn2: { text: "Stationery", emoji: "✏️", url: "/category/stationery" },
  },
];

export const DEFAULT_CATEGORY_CARDS: DynamicCategoryCard[] = [
  {
    id: "summer-dress",
    name: "Summer Dress",
    href: "/category/summer-dress",
    badgeEmoji: "☀️",
    subtitleLine1: "Light. Breathable.",
    subtitleLine2: "All-Day Comfort.",
    imageSrc: "/images/shirt.jpg",
    borderColor: "border-amber-200/80",
    hoverBorderColor: "hover:border-amber-400",
    isActive: true,
  },
  {
    id: "winter-dress",
    name: "Winter Dress",
    href: "/category/winter-dress",
    badgeEmoji: "❄️",
    subtitleLine1: "Warm. Cozy.",
    subtitleLine2: "Same Great Quality.",
    imageSrc: "/images/winter-flatlay.jpg",
    borderColor: "border-sky-200/80",
    hoverBorderColor: "hover:border-sky-400",
    isActive: true,
  },
  {
    id: "school-shoes",
    name: "School Shoes",
    href: "/category/school-shoes",
    badgeEmoji: "👟",
    subtitleLine1: "Durable. Anti-Skid.",
    subtitleLine2: "Daily Uniform Fit.",
    imageSrc: "/images/shoes.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
    isActive: true,
  },
  {
    id: "school-bags",
    name: "School Bags",
    href: "/category/school-bags",
    badgeEmoji: "🎒",
    subtitleLine1: "Spacious. Sturdy.",
    subtitleLine2: "Ergonomic Straps.",
    imageSrc: "/images/backpack.jpg",
    borderColor: "border-indigo-200/80",
    hoverBorderColor: "hover:border-indigo-400",
    isActive: true,
  },
  {
    id: "socks-stockings",
    name: "Socks & Stockings",
    href: "/category/socks-stockings",
    badgeEmoji: "🧦",
    subtitleLine1: "Soft Combed Cotton.",
    subtitleLine2: "Snug Everyday Fit.",
    imageSrc: "/images/socks.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
    isActive: true,
  },
  {
    id: "belts-accessories",
    name: "Belts & Accessories",
    href: "/category/belts-accessories",
    badgeEmoji: "👔",
    subtitleLine1: "Smart Finish.",
    subtitleLine2: "Official Uniform Fit.",
    imageSrc: "/images/belt.jpg",
    borderColor: "border-slate-200/80",
    hoverBorderColor: "hover:border-slate-400",
    isActive: true,
  },
  {
    id: "stationery",
    name: "Stationery",
    href: "/category/stationery",
    badgeEmoji: "✏️",
    subtitleLine1: "Essential Supplies.",
    subtitleLine2: "Classroom Ready.",
    imageSrc: "/images/stationery.jpg",
    borderColor: "border-amber-200/80",
    hoverBorderColor: "hover:border-amber-400",
    isActive: true,
  },
  {
    id: "water-bottles",
    name: "Water Bottles",
    href: "/category/water-bottles",
    badgeEmoji: "💧",
    subtitleLine1: "BPA-Free & Safe.",
    subtitleLine2: "Leak-Proof Daily.",
    imageSrc: "/images/water_bottle.jpg",
    borderColor: "border-blue-200/80",
    hoverBorderColor: "hover:border-blue-400",
    isActive: true,
  },
  {
    id: "lunch-boxes",
    name: "Lunch Boxes",
    href: "/category/lunch-boxes",
    badgeEmoji: "🍱",
    subtitleLine1: "Food Grade Steel.",
    subtitleLine2: "Fresh & Organized.",
    imageSrc: "/images/lunch_box.jpg",
    borderColor: "border-emerald-200/80",
    hoverBorderColor: "hover:border-emerald-400",
    isActive: true,
  },
];

export const DEFAULT_PROMO_SPLIT_CARDS: DynamicPromoSplitCard[] = [
  {
    id: "promo-summer",
    title: "Stay Cool This Summer",
    subtitle: "Comfortable Uniforms for Active Days",
    ctaText: "SHOP SUMMER DRESS",
    ctaUrl: "/category/summer-dress",
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
    subtitle: "Premium Winter Uniforms for Every Season",
    ctaText: "SHOP WINTER DRESS",
    ctaUrl: "/category/winter-dress",
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
    title: "COMPLETE SCHOOL LOOK",
    subtitle: "Uniforms + Shoes + Accessories",
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
    title: "Warmth for Every Adventure",
    subtitle: "Ultra-soft thermal innerwear designed for winter school days.",
    ctaText: "EXPLORE NOW",
    ctaUrl: "/category/thermals",
    imageSrc: "/images/thermals-stack.jpg",
    bgColor: "#FDF2F4",
    borderColor: "#FCE1E6",
    layout: "image-right",
    isActive: true,
  },
];

export const DEFAULT_TRENDING_PRODUCTS: DynamicTrendingProduct[] = [
  {
    id: "tp-1",
    name: "Boys Half Sleeve School Shirt",
    subtitle: "Regular Fit • 100% Breathable Cotton",
    schoolName: "Universal School Uniform",
    categoryName: "Summer Dress",
    mrp: 699,
    sellingPrice: 499,
    discountBadge: "29% OFF",
    rating: 4.8,
    reviewCount: 124,
    imageUrl: "/images/shirt.jpg",
    productUrl: "/product/boys-half-sleeve-school-shirt",
    isBestseller: true,
    isActive: true,
  },
  {
    id: "tp-2",
    name: "Girls School Pinafore",
    subtitle: "Pleated Skirt • Wrinkle Resistant Fabric",
    schoolName: "Universal School Uniform",
    categoryName: "Uniforms",
    mrp: 1099,
    sellingPrice: 799,
    discountBadge: "27% OFF",
    rating: 4.9,
    reviewCount: 98,
    imageUrl: "/images/pinafore.jpg",
    productUrl: "/product/girls-school-pinafore",
    isBestseller: false,
    isActive: true,
  },
  {
    id: "tp-3",
    name: "Kids Thermal Set - Black",
    subtitle: "Ultra-Warm Fleece Lining • Lightweight",
    schoolName: "Winter Collection",
    categoryName: "Thermals",
    mrp: 899,
    sellingPrice: 599,
    discountBadge: "33% OFF",
    rating: 4.7,
    reviewCount: 156,
    imageUrl: "/images/thermal.jpg",
    productUrl: "/product/kids-thermal-set-black",
    isBestseller: false,
    isActive: true,
  },
  {
    id: "tp-4",
    name: "School Shoes (Unisex)",
    subtitle: "Anti-Skid Rubber Sole • Cushioned Insole",
    schoolName: "Bata / Action Official",
    categoryName: "Footwear",
    mrp: 1399,
    sellingPrice: 999,
    discountBadge: "29% OFF",
    rating: 4.8,
    reviewCount: 210,
    imageUrl: "/images/shoes.jpg",
    productUrl: "/product/bata-school-shoes-black",
    isBestseller: true,
    isActive: true,
  },
  {
    id: "tp-5",
    name: "School Socks (Pack of 3)",
    subtitle: "Combed Cotton • Odour Free Elastic",
    schoolName: "Everyday Essentials",
    categoryName: "Socks",
    mrp: 399,
    sellingPrice: 299,
    discountBadge: "25% OFF",
    rating: 4.6,
    reviewCount: 88,
    imageUrl: "/images/socks.jpg",
    productUrl: "/product/school-socks-pack-of-3",
    isBestseller: false,
    isActive: true,
  },
  {
    id: "tp-6",
    name: "School Backpack (Navy)",
    subtitle: "Water-Resistant Fabric • Multi-Compartment",
    schoolName: "Bags & Gear",
    categoryName: "School Bags",
    mrp: 1299,
    sellingPrice: 899,
    discountBadge: "31% OFF",
    rating: 4.9,
    reviewCount: 142,
    imageUrl: "/images/backpack.jpg",
    productUrl: "/product/school-backpack-navy",
    isBestseller: false,
    isActive: true,
  },
];

export const DEFAULT_PROMO_SPLIT = {
  summerBanner: {
    title: DEFAULT_PROMO_SPLIT_CARDS[0].title,
    subtitle: DEFAULT_PROMO_SPLIT_CARDS[0].subtitle,
    ctaText: DEFAULT_PROMO_SPLIT_CARDS[0].ctaText,
    ctaUrl: DEFAULT_PROMO_SPLIT_CARDS[0].ctaUrl,
    imageSrc: DEFAULT_PROMO_SPLIT_CARDS[0].imageSrc,
    doodleText: DEFAULT_PROMO_SPLIT_CARDS[0].doodleText,
    bgColor: DEFAULT_PROMO_SPLIT_CARDS[0].bgColor,
    borderColor: DEFAULT_PROMO_SPLIT_CARDS[0].borderColor,
  },
  winterBanner: {
    title: DEFAULT_PROMO_SPLIT_CARDS[1].title,
    subtitle: DEFAULT_PROMO_SPLIT_CARDS[1].subtitle,
    ctaText: DEFAULT_PROMO_SPLIT_CARDS[1].ctaText,
    ctaUrl: DEFAULT_PROMO_SPLIT_CARDS[1].ctaUrl,
    imageSrc: DEFAULT_PROMO_SPLIT_CARDS[1].imageSrc,
    doodleText: DEFAULT_PROMO_SPLIT_CARDS[1].doodleText,
    bgColor: DEFAULT_PROMO_SPLIT_CARDS[1].bgColor,
    borderColor: DEFAULT_PROMO_SPLIT_CARDS[1].borderColor,
  },
};

export const DEFAULT_PROMO_COMBOS = {
  comboBanner: {
    title: DEFAULT_PROMO_COMBO_CARDS[0].title,
    subtitle: DEFAULT_PROMO_COMBO_CARDS[0].subtitle,
    ctaText: DEFAULT_PROMO_COMBO_CARDS[0].ctaText,
    ctaUrl: DEFAULT_PROMO_COMBO_CARDS[0].ctaUrl,
    imageSrc: DEFAULT_PROMO_COMBO_CARDS[0].imageSrc,
  },
  thermalsBanner: {
    tag: DEFAULT_PROMO_COMBO_CARDS[1].tag || "THERMALS COLLECTION",
    title: DEFAULT_PROMO_COMBO_CARDS[1].title,
    subtitle: DEFAULT_PROMO_COMBO_CARDS[1].subtitle,
    ctaText: DEFAULT_PROMO_COMBO_CARDS[1].ctaText,
    ctaUrl: DEFAULT_PROMO_COMBO_CARDS[1].ctaUrl,
    imageSrc: DEFAULT_PROMO_COMBO_CARDS[1].imageSrc,
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

      // Normalize promo split cards
      let promoSplitCards: DynamicPromoSplitCard[] = DEFAULT_PROMO_SPLIT_CARDS;
      if (Array.isArray(sectionMap["promo_split"])) {
        promoSplitCards = sectionMap["promo_split"];
      } else if (sectionMap["promo_split"]?.summerBanner && sectionMap["promo_split"]?.winterBanner) {
        promoSplitCards = [
          {
            id: "promo-summer",
            title: sectionMap["promo_split"].summerBanner.title,
            subtitle: sectionMap["promo_split"].summerBanner.subtitle,
            ctaText: sectionMap["promo_split"].summerBanner.ctaText,
            ctaUrl: sectionMap["promo_split"].summerBanner.ctaUrl,
            imageSrc: sectionMap["promo_split"].summerBanner.imageSrc,
            doodleText: sectionMap["promo_split"].summerBanner.doodleText || "Play Learn Grow ♡",
            iconEmoji: "☀️",
            bgColor: sectionMap["promo_split"].summerBanner.bgColor || "#FEF4CE",
            borderColor: sectionMap["promo_split"].summerBanner.borderColor || "#FBE39A",
            isActive: true,
          },
          {
            id: "promo-winter",
            title: sectionMap["promo_split"].winterBanner.title,
            subtitle: sectionMap["promo_split"].winterBanner.subtitle,
            ctaText: sectionMap["promo_split"].winterBanner.ctaText,
            ctaUrl: sectionMap["promo_split"].winterBanner.ctaUrl,
            imageSrc: sectionMap["promo_split"].winterBanner.imageSrc,
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
      if (Array.isArray(sectionMap["promo_combos"])) {
        promoComboCards = sectionMap["promo_combos"];
      } else if (sectionMap["promo_combos"]?.comboBanner && sectionMap["promo_combos"]?.thermalsBanner) {
        promoComboCards = [
          {
            id: "combo-complete-look",
            tag: "BEST VALUE",
            title: sectionMap["promo_combos"].comboBanner.title,
            subtitle: sectionMap["promo_combos"].comboBanner.subtitle,
            ctaText: sectionMap["promo_combos"].comboBanner.ctaText,
            ctaUrl: sectionMap["promo_combos"].comboBanner.ctaUrl,
            imageSrc: sectionMap["promo_combos"].comboBanner.imageSrc,
            bgColor: "#E1F1FD",
            borderColor: "#C6E4FA",
            layout: "image-left",
            isActive: true,
          },
          {
            id: "combo-thermals",
            tag: sectionMap["promo_combos"].thermalsBanner.tag || "THERMALS COLLECTION",
            title: sectionMap["promo_combos"].thermalsBanner.title,
            subtitle: sectionMap["promo_combos"].thermalsBanner.subtitle,
            ctaText: sectionMap["promo_combos"].thermalsBanner.ctaText,
            ctaUrl: sectionMap["promo_combos"].thermalsBanner.ctaUrl,
            imageSrc: sectionMap["promo_combos"].thermalsBanner.imageSrc,
            bgColor: "#FDF2F4",
            borderColor: "#FCE1E6",
            layout: "image-right",
            isActive: true,
          },
        ];
      }

      // Normalize trending products
      const trendingProducts: DynamicTrendingProduct[] =
        Array.isArray(sectionMap["trending_products"])
          ? sectionMap["trending_products"]
          : DEFAULT_TRENDING_PRODUCTS;

      return {
        heroSlides: sectionMap["hero_carousel"] || DEFAULT_HERO_SLIDES,
        categoryCards: sectionMap["category_grid"] || DEFAULT_CATEGORY_CARDS,
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
    return prisma.homepageSection.upsert({
      where: { sectionKey },
      update: {
        content,
        title: metadata?.title,
        subtitle: metadata?.subtitle,
        badge: metadata?.badge,
        displayOrder: metadata?.displayOrder ?? 0,
        isActive: true,
      },
      create: {
        sectionKey,
        content,
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

    if (data.heroSlides) {
      promises.push(this.updateSection("hero_carousel", data.heroSlides));
    }
    if (data.categoryCards) {
      promises.push(this.updateSection("category_grid", data.categoryCards));
    }
    if (data.promoSplitCards) {
      promises.push(this.updateSection("promo_split", data.promoSplitCards));
    } else if (data.promoSplit) {
      promises.push(this.updateSection("promo_split", data.promoSplit));
    }
    if (data.promoComboCards) {
      promises.push(this.updateSection("promo_combos", data.promoComboCards));
    } else if (data.promoCombos) {
      promises.push(this.updateSection("promo_combos", data.promoCombos));
    }
    if (data.trendingProducts) {
      promises.push(this.updateSection("trending_products", data.trendingProducts));
    }
    if (data.trendingSettings) {
      promises.push(this.updateSection("trending_section", data.trendingSettings));
    }

    await Promise.all(promises);
    return this.getHomepageData();
  }
}

export const homepageRepository = new HomepageRepository();
