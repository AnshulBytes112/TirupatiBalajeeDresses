import { BaseRepository } from "./base.repository";

export class SchoolRepository extends BaseRepository {
  async findAll() {
    return this.db.school.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findBySlug(slug: string) {
    return this.db.school.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          include: {
            images: { orderBy: { displayOrder: "asc" } },
            category: true,
          },
        },
      },
    });
  }
}

export const schoolRepository = new SchoolRepository();
