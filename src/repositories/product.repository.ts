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
      classGrade,
      size,
      color,
      search,
      q,
      isBestseller,
      isFeatured,
      inStock,
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

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      isDeleted: false,
      ...(categoryList && categoryList.length > 0
        ? {
            OR: [
              { category: { slug: { in: categoryList } } },
              { subcategory: { slug: { in: categoryList } } },
            ],
          }
        : {}),
      ...(subcategoryList && subcategoryList.length > 0
        ? { subcategory: { slug: { in: subcategoryList } } }
        : {}),
      ...(brandList && brandList.length > 0
        ? {
            brand: {
              OR: [
                { slug: { in: brandList } },
                ...brandList.map((b) => ({ name: { contains: b, mode: "insensitive" as const } })),
              ],
            },
          }
        : {}),
      ...(schoolList && schoolList.length > 0
        ? {
            schoolUniforms: {
              some: {
                school: {
                  OR: [
                    { slug: { in: schoolList } },
                    ...schoolList.map((s) => ({ name: { contains: s, mode: "insensitive" as const } })),
                  ],
                },
              },
            },
          }
        : {}),
      ...(genderList && genderList.length > 0
        ? {
            schoolUniforms: {
              some: {
                gender: { in: [...genderList, "UNISEX"] },
              },
            },
          }
        : {}),
      ...(seasonList && seasonList.length > 0
        ? {
            schoolUniforms: {
              some: {
                season: { in: [...seasonList, "ALL_SEASON"] },
              },
            },
          }
        : {}),
      ...(classList && classList.length > 0
        ? {
            schoolUniforms: {
              some: {
                OR: classList.map((c) => ({
                  classGrade: { contains: c, mode: "insensitive" as const },
                })),
              },
            },
          }
        : {}),
      ...(sizeList && sizeList.length > 0
        ? {
            variants: {
              some: {
                size: { in: sizeList },
                isDeleted: false,
              },
            },
          }
        : {}),
      ...(colorList && colorList.length > 0
        ? {
            variants: {
              some: {
                OR: colorList.map((c) => ({
                  color: { contains: c, mode: "insensitive" as const },
                })),
                isDeleted: false,
              },
            },
          }
        : {}),
      ...(inStock === true
        ? {
            variants: {
              some: {
                isAvailable: true,
                isDeleted: false,
                inventory: {
                  availableQuantity: { gt: 0 },
                },
              },
            },
          }
        : {}),
      ...(rating !== undefined
        ? {
            rating: { gte: new Prisma.Decimal(rating) },
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
      ...(searchTerm
        ? {
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

    // Apply in-memory filter for discount percentage or hasDiscount if requested
    let filteredProducts = products;
    if (hasDiscount === true) {
      filteredProducts = filteredProducts.filter(
        (p) => Number(p.mrp) > Number(p.sellingPrice)
      );
    }
    if (discount && discount > 0) {
      filteredProducts = filteredProducts.filter((p) => {
        const mrp = Number(p.mrp);
        const sell = Number(p.sellingPrice);
        if (mrp <= 0) return false;
        const discountPct = Math.round(((mrp - sell) / mrp) * 100);
        return discountPct >= discount;
      });
    }

    return {
      products: filteredProducts,
      total: discount || hasDiscount ? filteredProducts.length : total,
      page,
      limit,
      totalPages: Math.ceil((discount || hasDiscount ? filteredProducts.length : total) / limit) || 1,
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
}

export const productRepository = new ProductRepository();
