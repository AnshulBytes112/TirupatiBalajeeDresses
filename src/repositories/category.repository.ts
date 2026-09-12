import { BaseRepository } from "./base.repository";

export class CategoryRepository extends BaseRepository {
  async findAll(includeInactive = false) {
    const whereClause = includeInactive 
      ? { isDeleted: false, parentId: null } 
      : { isActive: true, isDeleted: false, parentId: null };
      
    const childrenWhereClause = includeInactive
      ? { isDeleted: false }
      : { isActive: true, isDeleted: false };

    return this.db.category.findMany({
      where: whereClause,
      orderBy: { displayOrder: "asc" },
      include: {
        children: {
          where: childrenWhereClause,
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

  async findAllFlat(includeInactive = false) {
    const whereClause = includeInactive
      ? { isDeleted: false }
      : { isActive: true, isDeleted: false };

    return this.db.category.findMany({
      where: whereClause,
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
    description?: string | null;
    imageUrl?: string | null;
    parentId?: string | null;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    const parentId = data.parentId && data.parentId.trim() !== "" ? data.parentId : null;
    return this.db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        parentId,
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
      description?: string | null;
      imageUrl?: string | null;
      parentId?: string | null;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await this.db.category.findUnique({ where: { id } });
    if (existing && data.slug && data.slug !== existing.slug) {
      await this.createRedirect(existing.slug, data.slug, id);
    }

    const parentId =
      data.parentId !== undefined
        ? data.parentId && data.parentId.trim() !== ""
          ? data.parentId
          : null
        : undefined;

    return this.db.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(parentId !== undefined && { parentId }),
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
