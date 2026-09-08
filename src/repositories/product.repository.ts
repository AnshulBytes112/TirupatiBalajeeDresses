import { BaseRepository } from "./base.repository";
import { GetProductsQuery } from "@/validations/product.schema";
import { Prisma } from "@prisma/client";

export class ProductRepository extends BaseRepository {
  async findMany(query: GetProductsQuery) {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      school,
      brand,
      gender,
      season,
      search,
      isBestseller,
      isFeatured,
      minPrice,
      maxPrice,
      sortBy = "popular",
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isDeleted: false,
      ...(category
        ? {
            OR: [
              { category: { slug: category } },
              { subcategory: { slug: category } },
            ],
          }
        : {}),
      ...(subcategory ? { subcategory: { slug: subcategory } } : {}),
      ...(brand ? { brand: { slug: brand } } : {}),
      ...(school
        ? {
            schoolUniforms: {
              some: {
                school: { slug: school },
              },
            },
          }
        : {}),
      ...(gender
        ? {
            schoolUniforms: {
              some: {
                gender: { in: [gender, "UNISEX"] },
              },
            },
          }
        : {}),
      ...(season
        ? {
            schoolUniforms: {
              some: {
                season: { in: [season, "ALL_SEASON"] },
              },
            },
          }
        : {}),
      ...(isBestseller !== undefined ? { isBestseller } : {}),
      ...(isFeatured !== undefined ? { isFeatured } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            sellingPrice: {
              ...(minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : {}),
              ...(maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { sellingPrice: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { sellingPrice: "desc" };
    } else if (sortBy === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sortBy === "popular") {
      orderBy = { isBestseller: "desc" };
    }

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: true,
          subcategory: true,
          brand: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: {
            where: { isDeleted: false },
            include: { inventory: true },
          },
          schoolUniforms: {
            include: {
              school: true,
            },
          },
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
      }),
      this.db.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string) {
    return this.db.product.findFirst({
      where: { slug, isActive: true, isDeleted: false },
      include: {
        category: true,
        subcategory: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: {
          where: { isDeleted: false },
          include: { inventory: true },
          orderBy: { createdAt: "asc" },
        },
        schoolUniforms: {
          include: {
            school: true,
          },
        },
        reviews: {
          where: { status: "APPROVED" },
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async findBestsellers(limit = 6) {
    return this.db.product.findMany({
      where: { isActive: true, isDeleted: false, isBestseller: true },
      take: limit,
      include: {
        category: true,
        subcategory: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isDeleted: false } },
        schoolUniforms: { include: { school: true } },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });
  }

  async findFeatured(limit = 6) {
    return this.db.product.findMany({
      where: { isActive: true, isDeleted: false, isFeatured: true },
      take: limit,
      include: {
        category: true,
        subcategory: true,
        brand: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isDeleted: false } },
        schoolUniforms: { include: { school: true } },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });
  }
}

export const productRepository = new ProductRepository();
