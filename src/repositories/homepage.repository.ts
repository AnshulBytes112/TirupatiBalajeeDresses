import { prisma } from "@/lib/prisma";
import {
  DynamicHomepageData,
  DynamicHeroSlide,
  DynamicCategoryCard,
  DynamicPromoBanner,
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
  },
];

export const DEFAULT_PROMO_SPLIT = {
  summerBanner: {
    title: "Stay Cool This Summer",
    subtitle: "Comfortable Uniforms for Active Days",
    ctaText: "SHOP SUMMER DRESS",
    ctaUrl: "/category/summer-dress",
    imageSrc: "/images/summer-flatlay.jpg",
    doodleText: "Play Learn Grow ♡",
    bgColor: "#FEF4CE",
    borderColor: "#FBE39A",
  },
  winterBanner: {
    title: "Stay Warm This Winter",
    subtitle: "Premium Winter Uniforms for Every Season",
    ctaText: "SHOP WINTER DRESS",
    ctaUrl: "/category/winter-dress",
    imageSrc: "/images/winter-flatlay.jpg",
    doodleText: "Same Spirit New Season ⭐",
    bgColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
};

export const DEFAULT_PROMO_COMBOS = {
  comboBanner: {
    title: "COMPLETE SCHOOL LOOK",
    subtitle: "Uniforms + Shoes + Accessories",
    ctaText: "SHOP COMBO SETS",
    ctaUrl: "/combos",
    imageSrc: "/images/combo-kids.jpg",
  },
  thermalsBanner: {
    tag: "THERMALS COLLECTION",
    title: "Warmth for Every Adventure",
    subtitle: "Ultra-soft thermal innerwear designed for winter school days.",
    ctaText: "EXPLORE NOW",
    ctaUrl: "/category/thermals",
    imageSrc: "/images/thermals-stack.jpg",
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

      return {
        heroSlides: sectionMap["hero_carousel"] || DEFAULT_HERO_SLIDES,
        categoryCards: sectionMap["category_grid"] || DEFAULT_CATEGORY_CARDS,
        promoSplit: sectionMap["promo_split"] || DEFAULT_PROMO_SPLIT,
        promoCombos: sectionMap["promo_combos"] || DEFAULT_PROMO_COMBOS,
        trendingSettings:
          sectionMap["trending_section"] || DEFAULT_TRENDING_SETTINGS,
        updatedAt: sections[0]?.updatedAt?.toISOString() || new Date().toISOString(),
      };
    } catch (e) {
      console.warn("Error fetching homepage data from DB, using defaults:", e);
      return {
        heroSlides: DEFAULT_HERO_SLIDES,
        categoryCards: DEFAULT_CATEGORY_CARDS,
        promoSplit: DEFAULT_PROMO_SPLIT,
        promoCombos: DEFAULT_PROMO_COMBOS,
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
    if (data.promoSplit) {
      promises.push(this.updateSection("promo_split", data.promoSplit));
    }
    if (data.promoCombos) {
      promises.push(this.updateSection("promo_combos", data.promoCombos));
    }
    if (data.trendingSettings) {
      promises.push(this.updateSection("trending_section", data.trendingSettings));
    }

    await Promise.all(promises);
    return this.getHomepageData();
  }
}

export const homepageRepository = new HomepageRepository();
