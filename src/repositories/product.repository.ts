import { BaseRepository } from "./base.repository";
import { GetProductsQuery } from "@/validations/product.schema";
import {
  AdminProductsQuery,
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/admin-product.schema";
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
      classGrade,
      size,
      color,
      search,
      q,
      isBestseller,
      isFeatured,
      inStock,
      outOfStock,
      hasDiscount,
      minPrice,
      maxPrice,
      discount,
      rating,
      sortBy = "popular",
    } = query;

    const searchTerm = search || q;
    const skip = (page - 1) * limit;

    // Multi-select list parsers
    const sizeList = size ? size.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    const categoryList = category ? category.split(",").map((c) => c.trim()).filter(Boolean) : undefined;
    const subcategoryList = subcategory ? subcategory.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    const schoolList = school ? school.split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    const brandList = brand ? brand.split(",").map((b) => b.trim()).filter(Boolean) : undefined;
    const classList = classGrade ? classGrade.split(",").map((c) => c.trim()).filter(Boolean) : undefined;
    const colorList = color ? color.split(",").map((c) => c.trim()).filter(Boolean) : undefined;
    
    const genderList = gender
      ? (gender.split(",").map((g) => g.trim().toUpperCase()).filter((g) => ["BOYS", "GIRLS", "UNISEX"].includes(g)) as ("BOYS" | "GIRLS" | "UNISEX")[])
      : undefined;

    const seasonList = season
      ? (season.split(",").map((s) => s.trim().toUpperCase()).filter((s) => ["SUMMER", "WINTER", "ALL_SEASON"].includes(s)) as ("SUMMER" | "WINTER" | "ALL_SEASON")[])
      : undefined;

    const andConditions: Prisma.ProductWhereInput[] = [
      { isActive: true },
      { isDeleted: false },
    ];

    // Category filter: match direct category slug, direct category name, subcategory slug/name, or parent category slug
    if (categoryList && categoryList.length > 0) {
      andConditions.push({
        OR: [
          { category: { slug: { in: categoryList } } },
          { subcategory: { slug: { in: categoryList } } },
          { category: { parent: { slug: { in: categoryList } } } },
          { category: { name: { in: categoryList, mode: "insensitive" } } },
        ],
      });
    }

    // Subcategory filter
    if (subcategoryList && subcategoryList.length > 0) {
      andConditions.push({
        subcategory: {
          OR: [
            { slug: { in: subcategoryList } },
            { name: { in: subcategoryList, mode: "insensitive" } },
          ],
        },
      });
    }

    // Brand filter
    if (brandList && brandList.length > 0) {
      andConditions.push({
        brand: {
          OR: [
            { slug: { in: brandList } },
            ...brandList.map((b) => ({ name: { contains: b, mode: "insensitive" as const } })),
          ],
        },
      });
    }

    // School uniform criteria (school, gender, season, classGrade)
    const suConditions: Prisma.SchoolUniformWhereInput[] = [];
    if (schoolList && schoolList.length > 0) {
      suConditions.push({
        school: {
          OR: [
            { slug: { in: schoolList } },
            ...schoolList.map((s) => ({ name: { contains: s, mode: "insensitive" as const } })),
          ],
        },
      });
    }
    if (genderList && genderList.length > 0) {
      suConditions.push({
        gender: { in: [...genderList, "UNISEX"] },
      });
    }
    if (seasonList && seasonList.length > 0) {
      suConditions.push({
        season: { in: [...seasonList, "ALL_SEASON"] },
      });
    }
    if (classList && classList.length > 0) {
      suConditions.push({
        OR: classList.map((c) => ({
          classGrade: { contains: c, mode: "insensitive" as const },
        })),
      });
    }

    if (suConditions.length > 0) {
      andConditions.push({
        schoolUniforms: {
          some: {
            AND: suConditions,
          },
        },
      });
    }

    // Variant criteria (size, color, inStock)
    const variantConditions: Prisma.ProductVariantWhereInput[] = [{ isDeleted: false }];
    if (sizeList && sizeList.length > 0) {
      variantConditions.push({
        size: { in: sizeList, mode: "insensitive" },
      });
    }
    if (colorList && colorList.length > 0) {
      variantConditions.push({
        OR: colorList.map((c) => ({
          color: { contains: c, mode: "insensitive" as const },
        })),
      });
    }
    if (inStock === true) {
      variantConditions.push({
        isAvailable: true,
        inventory: {
          availableQuantity: { gt: 0 },
        },
      });
    }

    if (variantConditions.length > 1) {
      andConditions.push({
        variants: {
          some: {
            AND: variantConditions,
          },
        },
      });
    }

    if (outOfStock === true) {
      andConditions.push({
        OR: [
          { variants: { none: { isAvailable: true, isDeleted: false, inventory: { availableQuantity: { gt: 0 } } } } },
          { variants: { none: {} } },
        ],
      });
    }

    // Rating
    if (rating !== undefined && rating > 0) {
      andConditions.push({
        rating: { gte: new Prisma.Decimal(rating) },
      });
    }

    // Bestseller / Featured
    if (isBestseller !== undefined) {
      andConditions.push({ isBestseller });
    }
    if (isFeatured !== undefined) {
      andConditions.push({ isFeatured });
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      andConditions.push({
        sellingPrice: {
          ...(minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : {}),
          ...(maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : {}),
        },
      });
    }

    // Search term
    if (searchTerm) {
      andConditions.push({
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { sku: { contains: searchTerm, mode: "insensitive" } },
          {
            category: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
          {
            brand: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
          {
            schoolUniforms: {
              some: {
                school: {
                  name: { contains: searchTerm, mode: "insensitive" },
                },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.ProductWhereInput = {
      AND: andConditions,
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
    } else if (sortBy === "rating_desc") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "discount_desc") {
      orderBy = { sellingPrice: "asc" };
    }

    const hasDiscountFilter = hasDiscount === true || (discount !== undefined && discount > 0);

    let products: any[];
    let total: number;

    if (hasDiscountFilter) {
      const allMatching = await this.db.product.findMany({
        where,
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
      });

      const filtered = allMatching.filter((p) => {
        const mrp = Number(p.mrp);
        const sell = Number(p.sellingPrice);
        if (mrp <= sell) return false;
        if (discount && discount > 0) {
          const discountPct = Math.round(((mrp - sell) / mrp) * 100);
          return discountPct >= discount;
        }
        return true;
      });

      total = filtered.length;
      products = filtered.slice(skip, skip + limit);
    } else {
      [products, total] = await Promise.all([
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
    }

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getFilterAggregations() {
    const [
      schools,
      categories,
      brands,
      variants,
      priceStats,
      allProducts,
      schoolUniforms,
    ] = await Promise.all([
      this.db.school.findMany({
        where: { isActive: true, isDeleted: false },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      this.db.category.findMany({
        where: { isActive: true, isDeleted: false },
        select: { id: true, name: true, slug: true, parentId: true },
        orderBy: { displayOrder: "asc" },
      }),
      this.db.brand.findMany({
        where: { isActive: true, isDeleted: false },
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
      }),
      this.db.productVariant.findMany({
        where: { isDeleted: false },
        select: { size: true, color: true, isAvailable: true, productId: true },
      }),
      this.db.product.aggregate({
        where: { isActive: true, isDeleted: false },
        _min: { sellingPrice: true },
        _max: { sellingPrice: true },
        _count: { id: true },
      }),
      this.db.product.findMany({
        where: { isActive: true, isDeleted: false },
        select: {
          id: true,
          categoryId: true,
          subcategoryId: true,
          brandId: true,
          mrp: true,
          sellingPrice: true,
          rating: true,
        },
      }),
      this.db.schoolUniform.findMany({
        select: {
          productId: true,
          schoolId: true,
          gender: true,
          season: true,
          classGrade: true,
        },
      }),
    ]);

    // Compute Category counts
    const categoryCounts: Record<string, number> = {};
    for (const p of allProducts) {
      if (p.categoryId) {
        categoryCounts[p.categoryId] = (categoryCounts[p.categoryId] || 0) + 1;
      }
      if (p.subcategoryId) {
        categoryCounts[p.subcategoryId] = (categoryCounts[p.subcategoryId] || 0) + 1;
      }
    }

    const categoriesWithCount = categories.map((c) => ({
      ...c,
      count: categoryCounts[c.id] || 0,
    }));

    // Compute School counts
    const schoolProductMap: Record<string, Set<string>> = {};
    for (const su of schoolUniforms) {
      if (!schoolProductMap[su.schoolId]) {
        schoolProductMap[su.schoolId] = new Set();
      }
      schoolProductMap[su.schoolId].add(su.productId);
    }

    const schoolsWithCount = schools.map((s) => ({
      ...s,
      count: schoolProductMap[s.id]?.size || 0,
    }));

    // Compute Brand counts
    const brandCounts: Record<string, number> = {};
    for (const p of allProducts) {
      if (p.brandId) {
        brandCounts[p.brandId] = (brandCounts[p.brandId] || 0) + 1;
      }
    }
    const brandsWithCount = brands.map((b) => ({
      ...b,
      count: brandCounts[b.id] || 0,
    }));

    // Compute Size counts
    const sizeProductMap: Record<string, Set<string>> = {};
    const colorProductMap: Record<string, Set<string>> = {};
    const inStockProductIds = new Set<string>();

    for (const v of variants) {
      if (v.size) {
        if (!sizeProductMap[v.size]) sizeProductMap[v.size] = new Set();
        sizeProductMap[v.size].add(v.productId);
      }
      if (v.color) {
        if (!colorProductMap[v.color]) colorProductMap[v.color] = new Set();
        colorProductMap[v.color].add(v.productId);
      }
      if (v.isAvailable) {
        inStockProductIds.add(v.productId);
      }
    }
    const inStockCount = inStockProductIds.size;
    const outOfStockCount = Math.max(0, allProducts.length - inStockCount);

    const distinctSizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean))).sort(
      (a, b) => {
        const aNum = parseInt(a, 10);
        const bNum = parseInt(b, 10);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.localeCompare(b);
      }
    ).map((size) => ({
      label: size,
      value: size,
      count: sizeProductMap[size]?.size || 0,
    }));

    const distinctColors = [
      { name: "Yellow", hex: "#FACC15", bgClass: "bg-yellow-400" },
      { name: "Sky Blue", hex: "#38BDF8", bgClass: "bg-sky-400" },
      { name: "Navy Blue", hex: "#1E3A8A", bgClass: "bg-blue-900" },
      { name: "Black", hex: "#0F172A", bgClass: "bg-slate-900" },
      { name: "Bottle Green", hex: "#15803D", bgClass: "bg-emerald-700" },
      { name: "Maroon / Red", hex: "#DC2626", bgClass: "bg-red-600" },
      { name: "White", hex: "#FFFFFF", bgClass: "bg-white border-slate-300" },
    ];

    // Compute Gender counts
    const genderMap: Record<string, Set<string>> = {
      BOYS: new Set(),
      GIRLS: new Set(),
      UNISEX: new Set(),
    };
    for (const su of schoolUniforms) {
      if (genderMap[su.gender]) {
        genderMap[su.gender].add(su.productId);
      }
    }

    const genders = [
      { label: "Boys", value: "BOYS", count: genderMap.BOYS.size },
      { label: "Girls", value: "GIRLS", count: genderMap.GIRLS.size },
      { label: "Unisex", value: "UNISEX", count: genderMap.UNISEX.size },
    ];

    // Compute Class / Grade counts
    const classGradeMap: Record<string, Set<string>> = {
      Nursery: new Set(),
      LKG: new Set(),
      UKG: new Set(),
      "Class 1-5": new Set(),
      "Class 6-10": new Set(),
      "Class 11-12": new Set(),
    };

    for (const su of schoolUniforms) {
      if (su.classGrade) {
        Object.keys(classGradeMap).forEach((gradeKey) => {
          if (
            su.classGrade?.includes(gradeKey) ||
            (gradeKey === "Class 1-5" && (su.classGrade?.includes("1-5") || su.classGrade?.includes("1-8")))
          ) {
            classGradeMap[gradeKey].add(su.productId);
          }
        });
      }
    }

    const classes = Object.entries(classGradeMap).map(([label, set]) => ({
      label,
      value: label,
      count: set.size,
    }));

    // Compute Season counts
    const seasonMap: Record<string, Set<string>> = {
      SUMMER: new Set(),
      WINTER: new Set(),
      ALL_SEASON: new Set(),
    };
    for (const su of schoolUniforms) {
      if (seasonMap[su.season]) {
        seasonMap[su.season].add(su.productId);
      }
    }

    const seasons = [
      { label: "Summer", value: "SUMMER", count: seasonMap.SUMMER.size },
      { label: "Winter", value: "WINTER", count: seasonMap.WINTER.size },
      { label: "All Season", value: "ALL_SEASON", count: seasonMap.ALL_SEASON.size },
    ];

    // Compute Discount counts
    let d10 = 0;
    let d20 = 0;
    let d30 = 0;
    for (const p of allProducts) {
      const mrp = Number(p.mrp);
      const sell = Number(p.sellingPrice);
      if (mrp > sell) {
        const pct = Math.round(((mrp - sell) / mrp) * 100);
        if (pct >= 10) d10++;
        if (pct >= 20) d20++;
        if (pct >= 30) d30++;
      }
    }

    const discounts = [
      { label: "10% and above", value: 10, count: d10 },
      { label: "20% and above", value: 20, count: d20 },
      { label: "30% and above", value: 30, count: d30 },
    ];

    // Compute Rating counts
    let r5 = 0;
    let r4 = 0;
    let r3 = 0;
    let r2 = 0;
    let r1 = 0;
    for (const p of allProducts) {
      const rating = Number(p.rating);
      if (rating >= 4.8) r5++;
      if (rating >= 4.0) r4++;
      if (rating >= 3.0) r3++;
      if (rating >= 2.0) r2++;
      if (rating >= 1.0) r1++;
    }

    const ratings = [
      { label: "5★ & above", value: 5.0, count: r5 },
      { label: "4★ & above", value: 4.0, count: r4 },
      { label: "3★ & above", value: 3.0, count: r3 },
      { label: "2★ & above", value: 2.0, count: r2 },
      { label: "1★ & above", value: 1.0, count: r1 },
    ];

    return {
      schools: schoolsWithCount,
      categories: categoriesWithCount,
      brands: brandsWithCount,
      sizes: distinctSizes,
      colors: distinctColors,
      classes,
      seasons,
      genders,
      discounts,
      ratings,
      availability: {
        inStock: inStockCount,
        outOfStock: outOfStockCount,
      },
      priceRange: {
        min: Number(priceStats._min.sellingPrice || 100),
        max: Number(priceStats._max.sellingPrice || 5000),
      },
      totalProducts: priceStats._count.id,
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

  async findRelatedProducts(productId: string, categoryId: string, schoolId?: string | null, limit = 8) {
    const where: Prisma.ProductWhereInput = {
      id: { not: productId },
      isActive: true,
      isDeleted: false,
      OR: [
        { categoryId },
        { subcategoryId: categoryId },
        ...(schoolId
          ? [
              {
                schoolUniforms: {
                  some: { schoolId },
                },
              },
            ]
          : []),
      ],
    };

    const products = await this.db.product.findMany({
      where,
      take: limit,
      orderBy: [{ isBestseller: "desc" }, { rating: "desc" }],
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
          include: { school: true },
        },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });

    // If fewer than limit found, backfill with top bestsellers
    if (products.length < limit) {
      const existingIds = [productId, ...products.map((p) => p.id)];
      const backfill = await this.db.product.findMany({
        where: {
          id: { notIn: existingIds },
          isActive: true,
          isDeleted: false,
        },
        take: limit - products.length,
        orderBy: [{ isBestseller: "desc" }, { isFeatured: "desc" }],
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
            include: { school: true },
          },
          reviews: {
            where: { status: "APPROVED" },
            select: { rating: true },
          },
        },
      });

      return [...products, ...backfill];
    }

    return products;
  }

  async findRecentlyViewed(productIds: string[]) {
    if (!productIds || productIds.length === 0) return [];

    const products = await this.db.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
        isDeleted: false,
      },
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
          include: { school: true },
        },
        reviews: {
          where: { status: "APPROVED" },
          select: { rating: true },
        },
      },
    });

    // Preserve the order of requested IDs
    const map = new Map(products.map((p) => [p.id, p]));
    return productIds.map((id) => map.get(id)).filter(Boolean) as typeof products;
  }

  // ==========================================
  // SUPER ADMIN CRUD METHODS
  // ==========================================

  async adminFindMany(query: AdminProductsQuery) {
    const {
      page = 1,
      limit = 20,
      search,
      q,
      status,
      categoryId,
      schoolId,
      brandId,
      sortBy = "newest",
    } = query;

    const searchTerm = search || q;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      ...(status ? { status } : {}),
      ...(categoryId
        ? {
            OR: [
              { categoryId },
              { subcategoryId: categoryId },
            ],
          }
        : {}),
      ...(brandId ? { brandId } : {}),
      ...(schoolId
        ? {
            schoolUniforms: {
              some: { schoolId },
            },
          }
        : {}),
      ...(searchTerm
        ? {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { sku: { contains: searchTerm, mode: "insensitive" } },
              { slug: { contains: searchTerm, mode: "insensitive" } },
              {
                category: {
                  name: { contains: searchTerm, mode: "insensitive" },
                },
              },
              {
                schoolUniforms: {
                  some: {
                    school: {
                      name: { contains: searchTerm, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sortBy === "price_asc") orderBy = { sellingPrice: "asc" };
    else if (sortBy === "price_desc") orderBy = { sellingPrice: "desc" };
    else if (sortBy === "name_asc") orderBy = { name: "asc" };
    else if (sortBy === "popular") orderBy = { isBestseller: "desc" };

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
            include: { school: true },
          },
          _count: {
            select: {
              reviews: true,
              variants: { where: { isDeleted: false } },
            },
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
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async adminFindById(id: string) {
    return this.db.product.findUnique({
      where: { id },
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
          include: { school: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true, image: true } },
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.db.product.findUnique({
      where: { id },
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
          include: { school: true },
        },
      },
    });
  }

  async findBySku(sku: string) {
    return this.db.product.findUnique({
      where: { sku },
    });
  }

  async findVariantBySku(sku: string) {
    return this.db.productVariant.findUnique({
      where: { sku },
    });
  }

  async create(data: CreateProductInput & { slug: string }) {
    return this.db.$transaction(async (tx) => {
      // 1. Create product base
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          sku: data.sku,
          description: data.description,
          fabricDetails: data.fabricDetails,
          careInstructions: data.careInstructions,
          mrp: new Prisma.Decimal(data.mrp),
          sellingPrice: new Prisma.Decimal(data.sellingPrice),
          categoryId: data.categoryId,
          subcategoryId: data.subcategoryId || null,
          brandId: data.brandId || null,
          status: data.status,
          isFeatured: data.isFeatured ?? false,
          isBestseller: data.isBestseller ?? false,
          seoTitle: data.seoTitle || `${data.name} | TirupatiBalajee Dresses`,
          seoDescription: data.seoDescription || data.description.slice(0, 160),
          isActive: data.status === "PUBLISHED",
        },
      });

      // 2. Create product images
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((img, idx) => ({
            productId: product.id,
            url: img.url,
            alt: img.alt || data.name,
            displayOrder: img.displayOrder ?? idx,
            isPrimary: img.isPrimary ?? idx === 0,
          })),
        });
      }

      // 3. Create variants & inventories
      if (data.variants && data.variants.length > 0) {
        for (const v of data.variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              size: v.size,
              color: v.color || null,
              sku: v.sku,
              mrp: v.mrp ? new Prisma.Decimal(v.mrp) : new Prisma.Decimal(data.mrp),
              sellingPrice: new Prisma.Decimal(v.sellingPrice),
              priceOverride: v.priceOverride ? new Prisma.Decimal(v.priceOverride) : null,
              isAvailable: v.isAvailable ?? true,
            },
          });

          if (v.inventory) {
            await tx.inventory.create({
              data: {
                variantId: variant.id,
                availableQuantity: v.inventory.availableQuantity ?? 0,
                reservedQuantity: v.inventory.reservedQuantity ?? 0,
                lowStockThreshold: v.inventory.lowStockThreshold ?? 5,
                warehouseLocation: v.inventory.warehouseLocation || null,
              },
            });
          }
        }
      }

      // 4. Create school uniform associations
      if (data.schools && data.schools.length > 0) {
        for (const s of data.schools) {
          await tx.schoolUniform.create({
            data: {
              productId: product.id,
              schoolId: s.schoolId,
              season: s.season,
              gender: s.gender,
              classGrade: s.classGrade || null,
              uniformType: s.uniformType || null,
              isCompulsory: s.isCompulsory ?? true,
            },
          });
        }
      }

      return product;
    });
  }

  async update(id: string, data: UpdateProductInput) {
    return this.db.$transaction(async (tx) => {
      // 1. Update product scalars
      const updateData: Prisma.ProductUpdateInput = {};
      if (data.name !== undefined) updateData.name = data.name;
      if (data.slug !== undefined) updateData.slug = data.slug;
      if (data.sku !== undefined) updateData.sku = data.sku;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.fabricDetails !== undefined) updateData.fabricDetails = data.fabricDetails;
      if (data.careInstructions !== undefined) updateData.careInstructions = data.careInstructions;
      if (data.mrp !== undefined) updateData.mrp = new Prisma.Decimal(data.mrp);
      if (data.sellingPrice !== undefined) updateData.sellingPrice = new Prisma.Decimal(data.sellingPrice);
      if (data.categoryId !== undefined) {
        updateData.category = { connect: { id: data.categoryId } };
      }
      if (data.subcategoryId !== undefined) {
        updateData.subcategory = data.subcategoryId
          ? { connect: { id: data.subcategoryId } }
          : { disconnect: true };
      }
      if (data.brandId !== undefined) {
        updateData.brand = data.brandId
          ? { connect: { id: data.brandId } }
          : { disconnect: true };
      }
      if (data.status !== undefined) {
        updateData.status = data.status;
        updateData.isActive = data.status === "PUBLISHED";
      }
      if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;
      if (data.isBestseller !== undefined) updateData.isBestseller = data.isBestseller;
      if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
      if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;

      const product = await tx.product.update({
        where: { id },
        data: updateData,
      });

      // 2. Replace or update images if provided
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img, idx) => ({
              productId: id,
              url: img.url,
              alt: img.alt || product.name,
              displayOrder: img.displayOrder ?? idx,
              isPrimary: img.isPrimary ?? idx === 0,
            })),
          });
        }
      }

      // 3. Update variants & inventories if provided
      if (data.variants !== undefined) {
        // Collect provided variant IDs
        const providedIds = data.variants.map((v) => v.id).filter(Boolean) as string[];

        // Mark missing variants as deleted
        await tx.productVariant.updateMany({
          where: {
            productId: id,
            id: { notIn: providedIds },
          },
          data: { isDeleted: true, isAvailable: false },
        });

        for (const v of data.variants) {
          if (v.id) {
            // Update existing variant
            const updatedVar = await tx.productVariant.update({
              where: { id: v.id },
              data: {
                size: v.size,
                color: v.color || null,
                sku: v.sku,
                mrp: v.mrp ? new Prisma.Decimal(v.mrp) : undefined,
                sellingPrice: v.sellingPrice ? new Prisma.Decimal(v.sellingPrice) : undefined,
                priceOverride: v.priceOverride ? new Prisma.Decimal(v.priceOverride) : null,
                isAvailable: v.isAvailable ?? true,
                isDeleted: false,
              },
            });

            if (v.inventory) {
              await tx.inventory.upsert({
                where: { variantId: updatedVar.id },
                create: {
                  variantId: updatedVar.id,
                  availableQuantity: v.inventory.availableQuantity ?? 0,
                  reservedQuantity: v.inventory.reservedQuantity ?? 0,
                  lowStockThreshold: v.inventory.lowStockThreshold ?? 5,
                  warehouseLocation: v.inventory.warehouseLocation || null,
                },
                update: {
                  availableQuantity: v.inventory.availableQuantity,
                  reservedQuantity: v.inventory.reservedQuantity,
                  lowStockThreshold: v.inventory.lowStockThreshold,
                  warehouseLocation: v.inventory.warehouseLocation,
                },
              });
            }
          } else {
            // Create new variant
            const newVar = await tx.productVariant.create({
              data: {
                productId: id,
                size: v.size,
                color: v.color || null,
                sku: v.sku,
                mrp: v.mrp ? new Prisma.Decimal(v.mrp) : new Prisma.Decimal(product.mrp),
                sellingPrice: new Prisma.Decimal(v.sellingPrice),
                priceOverride: v.priceOverride ? new Prisma.Decimal(v.priceOverride) : null,
                isAvailable: v.isAvailable ?? true,
              },
            });

            if (v.inventory) {
              await tx.inventory.create({
                data: {
                  variantId: newVar.id,
                  availableQuantity: v.inventory.availableQuantity ?? 0,
                  reservedQuantity: v.inventory.reservedQuantity ?? 0,
                  lowStockThreshold: v.inventory.lowStockThreshold ?? 5,
                  warehouseLocation: v.inventory.warehouseLocation || null,
                },
              });
            }
          }
        }
      }

      // 4. Update school uniform links if provided
      if (data.schools !== undefined) {
        await tx.schoolUniform.deleteMany({ where: { productId: id } });
        for (const s of data.schools) {
          await tx.schoolUniform.create({
            data: {
              productId: id,
              schoolId: s.schoolId,
              season: s.season,
              gender: s.gender,
              classGrade: s.classGrade || null,
              uniformType: s.uniformType || null,
              isCompulsory: s.isCompulsory ?? true,
            },
          });
        }
      }

      return product;
    });
  }

  async archive(id: string) {
    return this.db.product.update({
      where: { id },
      data: {
        status: "ARCHIVED",
        isActive: false,
      },
    });
  }

  async restore(id: string) {
    return this.db.product.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        isActive: true,
        isDeleted: false,
      },
    });
  }

  async softDelete(id: string) {
    return this.db.product.update({
      where: { id },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  }
}

export const productRepository = new ProductRepository();

