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

      // Extract school names from school uniforms mapping
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
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
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
      schools: p.schoolUniforms.map((su) => ({
        id: su.school.id,
        name: su.school.name,
        slug: su.school.slug,
        board: su.school.board,
        season: su.season,
        gender: su.gender,
        classGrade: su.classGrade,
        uniformType: su.uniformType,
        isCompulsory: su.isCompulsory,
      })),
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
        isAvailable: v.isAvailable,
        stock: v.inventory?.availableQuantity ?? 0,
      })),
      reviews: p.reviews.map((r) => ({
        rating: r.rating,
        user: r.user.name || "Verified Parent",
      })),
    };
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
}

export const productService = new ProductService();
