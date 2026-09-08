import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository {
  async findAll() {
    return this.db.category.findMany({
      where: { isActive: true, isDeleted: false, parentId: null },
      orderBy: { displayOrder: "asc" },
      include: {
        children: {
          where: { isActive: true, isDeleted: false },
          orderBy: { displayOrder: "asc" },
          include: {
            _count: {
              select: {
                products: {
                  where: { isActive: true, isDeleted: false },
                },
              },
            },
          },
        },
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
    return this.db.category.findFirst({
      where: { slug, isActive: true, isDeleted: false },
      include: {
        parent: true,
        children: {
          where: { isActive: true, isDeleted: false },
          orderBy: { displayOrder: "asc" },
        },
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
}

export const categoryRepository = new CategoryRepository();
