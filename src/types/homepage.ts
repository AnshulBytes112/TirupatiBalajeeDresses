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

export interface DynamicPromoBanner {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageSrc: string;
  doodleText?: string;
  bgColor?: string;
  borderColor?: string;
}

export interface DynamicHomepageData {
  heroSlides: DynamicHeroSlide[];
  categoryCards: DynamicCategoryCard[];
  promoSplit: {
    summerBanner: DynamicPromoBanner;
    winterBanner: DynamicPromoBanner;
  };
  promoCombos: {
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
  trendingSettings: {
    title: string;
    subtitle: string;
    viewAllHref: string;
  };
  updatedAt?: string;
}
