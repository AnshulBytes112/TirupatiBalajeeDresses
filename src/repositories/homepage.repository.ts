import { prisma } from "@/lib/prisma";
import {
  DynamicHomepageData,
  DynamicHeroSlide,
  DynamicCategoryCard,
  DynamicPromoSplitCard,
  DynamicPromoComboCard,
  DynamicTrendingProduct,
} from "@/types/homepage";

export const DEFAULT_HERO_SLIDES: DynamicHeroSlide[] = [];

export const DEFAULT_CATEGORY_CARDS: DynamicCategoryCard[] = [];

export const DEFAULT_PROMO_SPLIT_CARDS: DynamicPromoSplitCard[] = [];

export const DEFAULT_PROMO_COMBO_CARDS: DynamicPromoComboCard[] = [];

export const DEFAULT_TRENDING_PRODUCTS: DynamicTrendingProduct[] = [];

export const DEFAULT_PROMO_SPLIT = {
  summerBanner: {
    title: "",
    subtitle: "",
    ctaText: "",
    ctaUrl: "",
    imageSrc: "",
    doodleText: "",
    bgColor: "",
    borderColor: "",
  },
  winterBanner: {
    title: "",
    subtitle: "",
    ctaText: "",
    ctaUrl: "",
    imageSrc: "",
    doodleText: "",
    bgColor: "",
    borderColor: "",
  },
};

export const DEFAULT_PROMO_COMBOS = {
  comboBanner: {
    title: "",
    subtitle: "",
    ctaText: "",
    ctaUrl: "",
    imageSrc: "",
  },
  thermalsBanner: {
    tag: "",
    title: "",
    subtitle: "",
    ctaText: "",
    ctaUrl: "",
    imageSrc: "",
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
