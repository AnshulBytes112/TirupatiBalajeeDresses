import { bannerRepository } from "@/repositories/banner.repository";
import { BannerPosition } from "@prisma/client";

export class BannerService {
  async getBanners(position?: BannerPosition) {
    const banners = await bannerRepository.findActive(position);
    return banners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      image: b.image,
      ctaText: b.ctaText,
      ctaUrl: b.ctaUrl,
      badge: b.badge,
      position: b.position,
      displayOrder: b.displayOrder,
    }));
  }
}

export const bannerService = new BannerService();
