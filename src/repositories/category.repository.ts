import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository {
  async findAll() {
    return this.db.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.db.category.findUnique({
      where: { slug },
      include: {
        children: true,
      },
    });
  }
}

export const categoryRepository = new CategoryRepository();
