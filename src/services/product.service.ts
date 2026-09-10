import { productRepository } from "@/repositories/product.repository";
import { GetProductsQuery } from "@/validations/product.schema";
import { NotFoundError } from "@/lib/errors";
import { Prisma } from "@prisma/client";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    subcategory: true;
    brand: true;
    images: true;
    variants: {
      include: { inventory: true };
    };
    schoolUniforms: {
      include: {
        school: true;
      };
    };
    reviews: {
      select: { rating: true };
    };
  };
}>;

export class ProductService {
  async getProducts(query: GetProductsQuery) {
    const result = await productRepository.findMany(query);

    const items = (result.products as ProductWithRelations[]).map((p) => {
      const avgRating =
        p.reviews.length > 0
          ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
          : Number(p.rating);

      const reviewCount = p.reviews.length > 0 ? p.reviews.length : p.reviewCount;

      const schools = p.schoolUniforms.map((su) => ({
        id: su.school.id,
        name: su.school.name,
        slug: su.school.slug,
        season: su.season,
        gender: su.gender,
        classGrade: su.classGrade,
      }));

      const primarySchool = schools.length > 0 ? schools[0] : null;

      return {
        id: p.id,
        title: p.name,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        fabricDetails: p.fabricDetails,
        careInstructions: p.careInstructions,
        mrp: Number(p.mrp),
        sellingPrice: Number(p.sellingPrice),
        basePrice: Number(p.mrp),
        salePrice: Number(p.sellingPrice),
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        rating: avgRating,
        reviewCount,
        category: {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
        },
        subcategory: p.subcategory
          ? {
              id: p.subcategory.id,
              name: p.subcategory.name,
              slug: p.subcategory.slug,
            }
          : null,
        brand: p.brand
          ? {
              id: p.brand.id,
              name: p.brand.name,
              slug: p.brand.slug,
            }
          : null,
        school: primarySchool,
        schools,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          displayOrder: img.displayOrder,
          isPrimary: img.isPrimary,
        })),
        variants: p.variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          sku: v.sku,
          mrp: v.mrp ? Number(v.mrp) : Number(p.mrp),
          sellingPrice: Number(v.sellingPrice),
          price: Number(v.sellingPrice),
          isAvailable: v.isAvailable,
          stock: v.inventory?.availableQuantity ?? 0,
        })),
      };
    });

    return {
      items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.page < result.totalPages,
        hasPrevPage: result.page > 1,
      },
    };
  }

  async getProductBySlug(slug: string) {
    const p = await productRepository.findBySlug(slug);
    if (!p) {
      throw new NotFoundError(`Product with slug '${slug}'`);
    }

    const avgRating =
      p.reviews.length > 0
        ? Number((p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
        : Number(p.rating);

    const reviewCount = p.reviews.length > 0 ? p.reviews.length : p.reviewCount;

    // Process and enrich variants
    const variants = p.variants.map((v) => {
      const mrpVal = v.mrp ? Number(v.mrp) : Number(p.mrp);
      const sellVal = Number(v.sellingPrice || p.sellingPrice);
      const discountPct = mrpVal > sellVal ? Math.round(((mrpVal - sellVal) / mrpVal) * 100) : 0;
      const availableQty = v.inventory?.availableQuantity ?? 0;
      const lowThreshold = v.inventory?.lowStockThreshold ?? 5;

      let stockState: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" = "IN_STOCK";
      if (!v.isAvailable || availableQty <= 0) {
        stockState = "OUT_OF_STOCK";
      } else if (availableQty <= lowThreshold) {
        stockState = "LOW_STOCK";
      }

      return {
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        mrp: mrpVal,
        sellingPrice: sellVal,
        price: sellVal,
        discountPercentage: discountPct,
        isAvailable: v.isAvailable && availableQty > 0,
        stockState,
        stockQuantity: availableQty,
        lowStockThreshold: lowThreshold,
      };
    });

    // Detect distinct available attributes
    const distinctSizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
    const distinctColors = Array.from(new Set(variants.map((v) => v.color).filter(Boolean) as string[]));

    const schools = p.schoolUniforms.map((su) => ({
      id: su.school.id,
      name: su.school.name,
      slug: su.school.slug,
      board: su.school.board,
      season: su.season,
      gender: su.gender,
      classGrade: su.classGrade,
      uniformType: su.uniformType,
      isCompulsory: su.isCompulsory,
    }));

    const mrp = Number(p.mrp);
    const sellingPrice = Number(p.sellingPrice);
    const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

    return {
      id: p.id,
      title: p.name,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      fabricDetails: p.fabricDetails,
      careInstructions: p.careInstructions,
      mrp,
      sellingPrice,
      basePrice: mrp,
      salePrice: sellingPrice,
      discountPercentage,
      isFeatured: p.isFeatured,
      isBestseller: p.isBestseller,
      rating: avgRating,
      reviewCount,
      seoTitle: p.seoTitle || `${p.name} | TirupatiBalajee Dresses`,
      seoDescription: p.seoDescription || p.description.slice(0, 160),
      category: {
        id: p.category.id,
        name: p.category.name,
        slug: p.category.slug,
      },
      subcategory: p.subcategory
        ? {
            id: p.subcategory.id,
            name: p.subcategory.name,
            slug: p.subcategory.slug,
          }
        : null,
      brand: p.brand
        ? {
            id: p.brand.id,
            name: p.brand.name,
            slug: p.brand.slug,
          }
        : null,
      schools,
      images: p.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || p.name,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
      })),
      variants,
      attributes: {
        hasSizes: distinctSizes.length > 0,
        sizes: distinctSizes,
        hasColors: distinctColors.length > 0,
        colors: distinctColors,
        hasSchools: schools.length > 0,
        seasons: Array.from(new Set(schools.map((s) => s.season))),
        genders: Array.from(new Set(schools.map((s) => s.gender))),
      },
      reviews: p.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt,
        user: {
          name: r.user.name || "Verified Parent",
          image: r.user.image,
        },
      })),
    };
  }

  async getRelatedProducts(slug: string, limit = 8) {
    const p = await productRepository.findBySlug(slug);
    if (!p) return [];

    const schoolId = p.schoolUniforms[0]?.schoolId || null;
    const related = await productRepository.findRelatedProducts(p.id, p.categoryId, schoolId, limit);

    return related.map((item) => {
      const mrp = Number(item.mrp);
      const sellingPrice = Number(item.sellingPrice);
      const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
      return {
        id: item.id,
        title: item.name,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        description: item.description,
        mrp,
        sellingPrice,
        discountPercentage,
        isBestseller: item.isBestseller,
        isFeatured: item.isFeatured,
        rating: Number(item.rating),
        reviewCount: item.reviewCount,
        category: {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug,
        },
        school: item.schoolUniforms[0]?.school.name || null,
        imageUrl: item.images[0]?.url || `/images/products/${item.slug}.png`,
      };
    });
  }

  async getRecentlyViewed(productIds: string[]) {
    if (!productIds || productIds.length === 0) return [];
    const products = await productRepository.findRecentlyViewed(productIds);

    return products.map((item) => {
      const mrp = Number(item.mrp);
      const sellingPrice = Number(item.sellingPrice);
      const discountPercentage = mrp > sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
      return {
        id: item.id,
        title: item.name,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        description: item.description,
        mrp,
        sellingPrice,
        discountPercentage,
        isBestseller: item.isBestseller,
        isFeatured: item.isFeatured,
        rating: Number(item.rating),
        reviewCount: item.reviewCount,
        category: {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug,
        },
        school: item.schoolUniforms[0]?.school.name || null,
        imageUrl: item.images[0]?.url || `/images/products/${item.slug}.png`,
      };
    });
  }

  async getBestsellers(limit = 6) {
    const products = await productRepository.findBestsellers(limit);
    return products.map((p) => ({
      id: p.id,
      title: p.name,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      mrp: Number(p.mrp),
      sellingPrice: Number(p.sellingPrice),
      basePrice: Number(p.mrp),
      salePrice: Number(p.sellingPrice),
      isBestseller: p.isBestseller,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      categoryName: p.category.name,
      schoolName: p.schoolUniforms[0]?.school.name || null,
      imageUrl: p.images[0]?.url || `/images/products/${p.slug}.png`,
    }));
  }

  async getFeatured(limit = 6) {
    const products = await productRepository.findFeatured(limit);
    return products.map((p) => ({
      id: p.id,
      title: p.name,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      mrp: Number(p.mrp),
      sellingPrice: Number(p.sellingPrice),
      basePrice: Number(p.mrp),
      salePrice: Number(p.sellingPrice),
      isFeatured: p.isFeatured,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      categoryName: p.category.name,
      schoolName: p.schoolUniforms[0]?.school.name || null,
      imageUrl: p.images[0]?.url || `/images/products/${p.slug}.png`,
    }));
  }

  async getFilterAggregations() {
    return productRepository.getFilterAggregations();
  }
}

export const productService = new ProductService();
