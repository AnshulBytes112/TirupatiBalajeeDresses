import { schoolRepository } from "@/repositories/school.repository";
import { NotFoundError } from "@/lib/errors";

export class SchoolService {
  async getSchools() {
    const schools = await schoolRepository.findAll();
    return schools.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      board: s.board,
      city: s.city,
      state: s.state,
      logoUrl: s.logoUrl,
      bannerUrl: s.bannerUrl,
      description: s.description,
      website: s.website,
      uniformsCount: s._count.uniforms,
    }));
  }

  async getSchoolBySlug(slug: string) {
    const school = await schoolRepository.findBySlug(slug);
    if (!school) {
      throw new NotFoundError(`School with slug '${slug}'`);
    }

    return {
      id: school.id,
      name: school.name,
      slug: school.slug,
      board: school.board,
      city: school.city,
      state: school.state,
      logoUrl: school.logoUrl,
      bannerUrl: school.bannerUrl,
      description: school.description,
      website: school.website,
      uniforms: school.uniforms.map((u) => ({
        id: u.id,
        season: u.season,
        gender: u.gender,
        classGrade: u.classGrade,
        uniformType: u.uniformType,
        isCompulsory: u.isCompulsory,
        product: {
          id: u.product.id,
          name: u.product.name,
          slug: u.product.slug,
          sku: u.product.sku,
          mrp: Number(u.product.mrp),
          sellingPrice: Number(u.product.sellingPrice),
          category: u.product.category.name,
          images: u.product.images,
          variants: u.product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            sellingPrice: Number(v.sellingPrice),
            isAvailable: v.isAvailable,
            stock: v.inventory?.availableQuantity ?? 0,
          })),
        },
      })),
    };
  }
}

export const schoolService = new SchoolService();
