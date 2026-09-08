import { brandRepository } from "@/repositories/brand.repository";
import { NotFoundError } from "@/lib/errors";

export class BrandService {
  async getBrands() {
    const brands = await brandRepository.findAll();
    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logoUrl: b.logoUrl,
      description: b.description,
      website: b.website,
      displayOrder: b.displayOrder,
      productsCount: b._count.products,
    }));
  }

  async getBrandBySlug(slug: string) {
    const brand = await brandRepository.findBySlug(slug);
    if (!brand) {
      throw new NotFoundError(`Brand with slug '${slug}'`);
    }
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl,
      description: brand.description,
      website: brand.website,
      products: brand.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        mrp: Number(p.mrp),
        sellingPrice: Number(p.sellingPrice),
        category: p.category.name,
        images: p.images,
      })),
    };
  }
}

export const brandService = new BrandService();
