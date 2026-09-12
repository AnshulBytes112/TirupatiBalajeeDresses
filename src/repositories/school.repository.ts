import { BaseRepository } from "./base.repository";
import { Prisma, Gender, Season } from "@prisma/client";

export class SchoolRepository extends BaseRepository {
  async findAll() {
    return this.db.school.findMany({
      where: { isActive: true, isDeleted: false },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        board: true,
        city: true,
        state: true,
        logoUrl: true,
        bannerUrl: true,
        description: true,
        website: true,
        _count: {
          select: {
            uniforms: true,
          },
        },
      },
    });
  }

  async findAdminAll(params?: {
    search?: string;
    board?: string;
    city?: string;
    state?: string;
    includeInactive?: boolean;
  }) {
    const where: Prisma.SchoolWhereInput = {
      isDeleted: false,
      ...(params?.includeInactive ? {} : { isActive: true }),
    };

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { board: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
      ];
    }

    if (params?.board) {
      where.board = { equals: params.board, mode: "insensitive" };
    }

    if (params?.city) {
      where.city = { equals: params.city, mode: "insensitive" };
    }

    if (params?.state) {
      where.state = { equals: params.state, mode: "insensitive" };
    }

    return this.db.school.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            uniforms: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.db.school.findUnique({
      where: { id },
      include: {
        uniforms: {
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { displayOrder: "asc" } },
              },
            },
          },
        },
        _count: {
          select: {
            uniforms: true,
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.db.school.findFirst({
      where: { slug, isActive: true, isDeleted: false },
      include: {
        uniforms: {
          where: {
            product: {
              isActive: true,
              isDeleted: false,
            },
          },
          include: {
            product: {
              include: {
                category: true,
                images: { orderBy: { displayOrder: "asc" } },
                variants: {
                  where: { isDeleted: false },
                  include: { inventory: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async create(data: Prisma.SchoolCreateInput) {
    return this.db.school.create({
      data,
    });
  }

  async update(id: string, data: Prisma.SchoolUpdateInput) {
    return this.db.school.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.db.school.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }

  // --- School Uniform Bindings ---
  async findBindings(filters?: {
    schoolId?: string;
    productId?: string;
    season?: Season;
    gender?: Gender;
  }) {
    const where: Prisma.SchoolUniformWhereInput = {
      product: {
        isDeleted: false,
      },
      school: {
        isDeleted: false,
      },
    };

    if (filters?.schoolId) where.schoolId = filters.schoolId;
    if (filters?.productId) where.productId = filters.productId;
    if (filters?.season) where.season = filters.season;
    if (filters?.gender) where.gender = filters.gender;

    return this.db.schoolUniform.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        school: true,
        product: {
          include: {
            category: true,
            images: { orderBy: { displayOrder: "asc" } },
          },
        },
      },
    });
  }

  async findBindingById(id: string) {
    return this.db.schoolUniform.findUnique({
      where: { id },
      include: {
        school: true,
        product: {
          include: {
            category: true,
            images: true,
          },
        },
      },
    });
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
    const season = data.season || Season.ALL_SEASON;
    const gender = data.gender || Gender.UNISEX;
    const classGrade = data.classGrade || null;

    // Check if duplicate binding exists
    const existing = await this.db.schoolUniform.findFirst({
      where: {
        schoolId: data.schoolId,
        productId: data.productId,
        season,
        gender,
        classGrade,
      },
    });

    if (existing) {
      return this.db.schoolUniform.update({
        where: { id: existing.id },
        data: {
          uniformType: data.uniformType ?? existing.uniformType,
          isCompulsory: data.isCompulsory !== undefined ? data.isCompulsory : existing.isCompulsory,
        },
        include: {
          school: true,
          product: true,
        },
      });
    }

    return this.db.schoolUniform.create({
      data: {
        schoolId: data.schoolId,
        productId: data.productId,
        season,
        gender,
        classGrade,
        uniformType: data.uniformType || "Regular",
        isCompulsory: data.isCompulsory !== undefined ? data.isCompulsory : true,
      },
      include: {
        school: true,
        product: true,
      },
    });
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
    return this.db.schoolUniform.update({
      where: { id },
      data: {
        ...(data.season && { season: data.season }),
        ...(data.gender && { gender: data.gender }),
        ...(data.classGrade !== undefined && { classGrade: data.classGrade }),
        ...(data.uniformType !== undefined && { uniformType: data.uniformType }),
        ...(data.isCompulsory !== undefined && { isCompulsory: data.isCompulsory }),
      },
      include: {
        school: true,
        product: true,
      },
    });
  }

  async deleteBinding(id: string) {
    return this.db.schoolUniform.delete({
      where: { id },
    });
  }
}

export const schoolRepository = new SchoolRepository();
