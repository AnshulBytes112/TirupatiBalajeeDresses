import { BaseRepository } from "./base.repository";
import { GetProductsQuery } from "@/validations/product.schema";
import { Prisma } from "@prisma/client";

export class ProductRepository extends BaseRepository {
  async findMany(query: GetProductsQuery) {
    const {
      page = 1,
      limit = 12,
      category,
      school,
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
      ...(category ? { category: { slug: category } } : {}),
      ...(school ? { school: { slug: school } } : {}),
      ...(gender ? { gender } : {}),
      ...(season ? { season } : {}),
      ...(isBestseller !== undefined ? { isBestseller } : {}),
      ...(isFeatured !== undefined ? { isFeatured } : {}),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            basePrice: {
              ...(minPrice !== undefined ? { gte: minPrice } : {}),
              ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") {
      orderBy = { basePrice: "asc" };
    } else if (sortBy === "price_desc") {
      orderBy = { basePrice: "desc" };
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
          school: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          reviews: { select: { rating: true } },
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
    return this.db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        school: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { orderBy: { size: "asc" } },
        reviews: {
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
      where: { isActive: true, isBestseller: true },
      take: limit,
      include: {
        category: true,
        school: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        reviews: { select: { rating: true } },
      },
    });
  }
}

export const productRepository = new ProductRepository();
