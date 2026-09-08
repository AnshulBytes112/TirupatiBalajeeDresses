import { BaseRepository } from "./base.repository";

export class BrandRepository extends BaseRepository {
  async findAll() {
    return this.db.brand.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { displayOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        description: true,
        website: true,
        displayOrder: true,
        _count: {
          select: {
            products: {
              where: { isActive: true, isDeleted: false },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.db.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true, isDeleted: false },
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            category: true,
            variants: { where: { isDeleted: false } },
          },
        },
      },
    });
  }
}

export const brandRepository = new BrandRepository();
