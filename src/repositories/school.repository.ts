import { BaseRepository } from "./base.repository";

export class SchoolRepository extends BaseRepository {
  async findAll() {
    return this.db.school.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        board: true,
        city: true,
        state: true,
        logoUrl: true,
        bannerUrl: true,
        description: true,
        website: true,
        _count: {
          select: {
            uniforms: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.db.school.findFirst({
      where: { slug, isActive: true, isDeleted: false },
      include: {
        uniforms: {
          where: {
            product: {
              isActive: true,
              isDeleted: false,
            },
          },
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { displayOrder: "asc" } },
                variants: {
                  where: { isDeleted: false },
                  include: { inventory: true },
                },
              },
            },
          },
        },
      },
    });
  }
}

export const schoolRepository = new SchoolRepository();
