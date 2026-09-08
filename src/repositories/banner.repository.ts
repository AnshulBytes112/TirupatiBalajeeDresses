import { BaseRepository } from "./base.repository";
import { BannerPosition } from "@prisma/client";

export class BannerRepository extends BaseRepository {
  async findActive(position?: BannerPosition) {
    const now = new Date();
    return this.db.banner.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        ...(position ? { position } : {}),
        OR: [{ startAt: null }, { startAt: { lte: now } }],
        AND: [{ OR: [{ endAt: null }, { endAt: { gte: now } }] }],
      },
      orderBy: { displayOrder: "asc" },
    });
  }
}

export const bannerRepository = new BannerRepository();
