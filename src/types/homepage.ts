export interface DynamicHeroSlide {
  id: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageSrc: string;
  imageAlt: string;
  doodleText?: string;
  stickyNote?: {
    text: string;
    subtext?: string;
  };
  seasonalBtn1?: { text: string; emoji: string; url: string };
  seasonalBtn2?: { text: string; emoji: string; url: string };
}

export interface DynamicCategoryCard {
  id: string;
  name: string;
  href: string;
  badgeEmoji: string;
  subtitleLine1: string;
  subtitleLine2: string;
  imageSrc?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface DynamicPromoSplitCard {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageSrc: string;
  doodleText?: string;
  iconEmoji?: string;
  bgColor?: string;
  borderColor?: string;
  isActive?: boolean;
}

export interface DynamicPromoComboCard {
  id: string;
  tag?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageSrc: string;
  bgColor?: string;
  borderColor?: string;
  layout?: "image-left" | "image-right";
  isActive?: boolean;
}

export interface DynamicTrendingProduct {
  id: string;
  name: string;
  subtitle?: string;
  schoolName?: string;
  categoryName?: string;
  mrp: number;
  sellingPrice: number;
  discountBadge?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl: string;
  productUrl: string;
  isBestseller?: boolean;
  isActive?: boolean;
}

export interface DynamicHomepageData {
  heroSlides: DynamicHeroSlide[];
  categoryCards: DynamicCategoryCard[];
  promoSplitCards?: DynamicPromoSplitCard[];
  promoSplit?: {
    summerBanner: {
      title: string;
      subtitle: string;
      ctaText: string;
      ctaUrl: string;
      imageSrc: string;
      doodleText?: string;
      bgColor?: string;
      borderColor?: string;
    };
    winterBanner: {
      title: string;
      subtitle: string;
      ctaText: string;
      ctaUrl: string;
      imageSrc: string;
      doodleText?: string;
      bgColor?: string;
      borderColor?: string;
    };
  };
  promoComboCards?: DynamicPromoComboCard[];
  promoCombos?: {
    comboBanner: {
      title: string;
      subtitle: string;
      ctaText: string;
      ctaUrl: string;
      imageSrc: string;
    };
    thermalsBanner: {
      tag: string;
      title: string;
      subtitle: string;
      ctaText: string;
      ctaUrl: string;
      imageSrc: string;
    };
  };
  trendingProducts?: DynamicTrendingProduct[];
  trendingSettings: {
    title: string;
    subtitle: string;
    viewAllHref: string;
  };
  updatedAt?: string;
}
