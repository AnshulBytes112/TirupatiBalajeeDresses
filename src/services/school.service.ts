import { schoolRepository } from "@/repositories/school.repository";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BadRequestError } from "@/lib/errors";
import { Gender, Season } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

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

  async getAdminSchools(params?: {
    search?: string;
    board?: string;
    city?: string;
    state?: string;
    includeInactive?: boolean;
  }) {
    const schools = await schoolRepository.findAdminAll(params);
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
      isActive: s.isActive,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      uniformsCount: s._count.uniforms,
    }));
  }

  async getSchoolById(id: string) {
    const school = await schoolRepository.findById(id);
    if (!school || school.isDeleted) {
      throw new NotFoundError(`School with ID '${id}'`);
    }
    return school;
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

  async createSchool(data: {
    name: string;
    slug?: string;
    board?: string;
    city: string;
    state: string;
    logoUrl?: string;
    bannerUrl?: string;
    description?: string;
    website?: string;
    isActive?: boolean;
  }) {
    if (!data.name || !data.name.trim()) {
      throw new BadRequestError("School name is required.");
    }
    if (!data.city || !data.city.trim()) {
      throw new BadRequestError("City is required.");
    }
    if (!data.state || !data.state.trim()) {
      throw new BadRequestError("State is required.");
    }

    const generatedSlug = data.slug && data.slug.trim() ? slugify(data.slug) : slugify(data.name);

    // Check slug uniqueness
    const existing = await prisma.school.findUnique({
      where: { slug: generatedSlug },
    });

    if (existing) {
      if (existing.isDeleted) {
        return schoolRepository.update(existing.id, {
          name: data.name.trim(),
          board: data.board?.trim() || null,
          city: data.city.trim(),
          state: data.state.trim(),
          logoUrl: data.logoUrl?.trim() || null,
          bannerUrl: data.bannerUrl?.trim() || null,
          description: data.description?.trim() || null,
          website: data.website?.trim() || null,
          isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
          isDeleted: false,
        });
      }
      throw new BadRequestError(`School with slug '${generatedSlug}' already exists.`);
    }

    return schoolRepository.create({
      name: data.name.trim(),
      slug: generatedSlug,
      board: data.board?.trim() || null,
      city: data.city.trim(),
      state: data.state.trim(),
      logoUrl: data.logoUrl?.trim() || null,
      bannerUrl: data.bannerUrl?.trim() || null,
      description: data.description?.trim() || null,
      website: data.website?.trim() || null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
    });
  }

  async updateSchool(
    id: string,
    data: {
      name?: string;
      slug?: string;
      board?: string;
      city?: string;
      state?: string;
      logoUrl?: string;
      bannerUrl?: string;
      description?: string;
      website?: string;
      isActive?: boolean;
    }
  ) {
    const existing = await schoolRepository.findById(id);
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`School with ID '${id}'`);
    }

    let nextSlug: string | undefined;
    if (data.slug && data.slug.trim()) {
      nextSlug = slugify(data.slug);
      if (nextSlug !== existing.slug) {
        const conflict = await prisma.school.findUnique({ where: { slug: nextSlug } });
        if (conflict && conflict.id !== id) {
          throw new BadRequestError(`School with slug '${nextSlug}' already exists.`);
        }
      }
    }

    return schoolRepository.update(id, {
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(nextSlug !== undefined && { slug: nextSlug }),
      ...(data.board !== undefined && { board: data.board?.trim() || null }),
      ...(data.city !== undefined && { city: data.city.trim() }),
      ...(data.state !== undefined && { state: data.state.trim() }),
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl?.trim() || null }),
      ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl?.trim() || null }),
      ...(data.description !== undefined && { description: data.description?.trim() || null }),
      ...(data.website !== undefined && { website: data.website?.trim() || null }),
      ...(data.isActive !== undefined && { isActive: Boolean(data.isActive) }),
    });
  }

  async deleteSchool(id: string) {
    const existing = await schoolRepository.findById(id);
    if (!existing || existing.isDeleted) {
      throw new NotFoundError(`School with ID '${id}'`);
    }
    return schoolRepository.delete(id);
  }

  // --- Bindings Service Methods ---
  async getBindings(filters?: {
    schoolId?: string;
    productId?: string;
    season?: Season;
    gender?: Gender;
  }) {
    const bindings = await schoolRepository.findBindings(filters);
    return bindings.map((b) => ({
      id: b.id,
      schoolId: b.schoolId,
      schoolName: b.school.name,
      schoolSlug: b.school.slug,
      productId: b.productId,
      productName: b.product.name,
      productSku: b.product.sku,
      productSlug: b.product.slug,
      categoryName: b.product.category?.name || "General",
      productImage: b.product.images?.[0]?.url || "/images/placeholder.png",
      season: b.season,
      gender: b.gender,
      classGrade: b.classGrade,
      uniformType: b.uniformType,
      isCompulsory: b.isCompulsory,
      createdAt: b.createdAt,
    }));
  }

  async createBinding(data: {
    schoolId: string;
    productId: string;
    season?: Season;
    gender?: Gender;
    classGrade?: string;
    uniformType?: string;
    isCompulsory?: boolean;
  }) {
    if (!data.schoolId) throw new BadRequestError("School ID is required.");
    if (!data.productId) throw new BadRequestError("Product ID is required.");

    const [schoolExists, productExists] = await Promise.all([
      prisma.school.findUnique({ where: { id: data.schoolId } }),
      prisma.product.findUnique({ where: { id: data.productId } }),
    ]);

    if (!schoolExists || schoolExists.isDeleted) {
      throw new NotFoundError("Selected School was not found.");
    }
    if (!productExists || productExists.isDeleted) {
      throw new NotFoundError("Selected Product was not found.");
    }

    return schoolRepository.createBinding(data);
  }

  async updateBinding(
    id: string,
    data: {
      season?: Season;
      gender?: Gender;
      classGrade?: string | null;
      uniformType?: string | null;
      isCompulsory?: boolean;
    }
  ) {
    const existing = await schoolRepository.findBindingById(id);
    if (!existing) {
      throw new NotFoundError(`School binding with ID '${id}'`);
    }
    return schoolRepository.updateBinding(id, data);
  }

  async deleteBinding(id: string) {
    const existing = await schoolRepository.findBindingById(id);
    if (!existing) {
      throw new NotFoundError(`School binding with ID '${id}'`);
    }
    return schoolRepository.deleteBinding(id);
  }
}

export const schoolService = new SchoolService();
