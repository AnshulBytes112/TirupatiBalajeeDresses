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
                subProducts: {
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
            subProducts: {
              where: { isActive: true, isDeleted: false },
            },
          },
        },
      },
    });
  }

  async findAllFlat() {
    return this.db.category.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { displayOrder: "asc" },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: {
            products: {
              where: { isActive: true, isDeleted: false },
            },
            subProducts: {
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
        parent: {
          include: {
            parent: true,
          },
        },
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
            subProducts: {
              where: { isActive: true, isDeleted: false },
            },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.db.category.findFirst({
      where: { id, isDeleted: false },
      include: {
        parent: true,
        children: {
          where: { isDeleted: false },
          orderBy: { displayOrder: "asc" },
        },
      },
    });
  }

  async findRedirect(oldSlug: string) {
    return this.db.categoryRedirect.findUnique({
      where: { oldSlug },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parentId: true },
        },
      },
    });
  }

  async createRedirect(oldSlug: string, newSlug: string, categoryId: string) {
    return this.db.categoryRedirect.upsert({
      where: { oldSlug },
      create: {
        oldSlug,
        newSlug,
        categoryId,
      },
      update: {
        newSlug,
        categoryId,
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    parentId?: string | null;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    return this.db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        imageUrl: data.imageUrl,
        parentId: data.parentId || null,
        displayOrder: data.displayOrder ?? 0,
        isActive: data.isActive ?? true,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      imageUrl?: string;
      parentId?: string | null;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await this.db.category.findUnique({ where: { id } });
    if (existing && data.slug && data.slug !== existing.slug) {
      await this.createRedirect(existing.slug, data.slug, id);
    }

    return this.db.category.update({
      where: { id },
      data: {
        ...data,
        parentId: data.parentId !== undefined ? data.parentId : undefined,
      },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async delete(id: string) {
    return this.db.category.update({
      where: { id },
      data: { isDeleted: true, isActive: false },
    });
  }
}

export const categoryRepository = new CategoryRepository();
