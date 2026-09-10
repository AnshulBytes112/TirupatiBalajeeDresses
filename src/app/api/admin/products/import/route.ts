import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { assertSuperAdmin } from "@/lib/auth/admin-guard";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import { successResponse, errorResponse } from "@/lib/api-response";
import { parseCsv } from "@/lib/csv-parser";
import { Gender, Season, ProductStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

interface ParsedVariant {
  size: string;
  sku: string;
  color?: string;
  mrp?: number;
  sellingPrice: number;
  stock: number;
}

function parseVariantsString(
  variantStr: string,
  baseSku: string,
  defaultSellingPrice: number,
  defaultMrp: number
): ParsedVariant[] {
  if (!variantStr || !variantStr.trim()) {
    return [
      {
        size: "Standard",
        sku: `${baseSku}-STD`,
        sellingPrice: defaultSellingPrice,
        mrp: defaultMrp,
        stock: 50,
      },
    ];
  }

  const rawEntries = variantStr.split(";").map((s) => s.trim()).filter(Boolean);
  const variants: ParsedVariant[] = [];

  for (const entry of rawEntries) {
    if (entry.includes(":")) {
      // Key-value format: "size:28,sku:DPS-28,price:599,mrp:799,stock:50,color:Navy"
      const kvPairs = entry.split(",").map((k) => k.trim());
      let size = "Standard";
      let sku = "";
      let color = "";
      let sellingPrice = defaultSellingPrice;
      let mrp = defaultMrp;
      let stock = 20;

      for (const pair of kvPairs) {
        const [k, v] = pair.split(":").map((p) => p.trim());
        if (!k || !v) continue;
        const normKey = k.toLowerCase();
        if (normKey === "size") size = v;
        else if (normKey === "sku") sku = v;
        else if (normKey === "color" || normKey === "colour") color = v;
        else if (normKey === "price" || normKey === "sellingprice" || normKey === "sp") {
          sellingPrice = parseFloat(v) || defaultSellingPrice;
        } else if (normKey === "mrp") {
          mrp = parseFloat(v) || defaultMrp;
        } else if (normKey === "stock" || normKey === "qty" || normKey === "quantity") {
          stock = parseInt(v, 10) || 0;
        }
      }

      if (!sku) {
        sku = `${baseSku}-${size.replace(/[^a-zA-Z0-9]/g, "")}`;
      }

      variants.push({
        size,
        sku,
        color: color || undefined,
        sellingPrice,
        mrp,
        stock,
      });
    } else {
      // Simple comma/semicolon separated sizes: "28" or "S"
      const size = entry.replace(/[^a-zA-Z0-9]/g, "");
      if (size) {
        variants.push({
          size: entry,
          sku: `${baseSku}-${size}`,
          sellingPrice: defaultSellingPrice,
          mrp: defaultMrp,
          stock: 25,
        });
      }
    }
  }

  return variants.length > 0
    ? variants
    : [
        {
          size: "Standard",
          sku: `${baseSku}-STD`,
          sellingPrice: defaultSellingPrice,
          mrp: defaultMrp,
          stock: 50,
        },
      ];
}

export async function POST(req: NextRequest) {
  try {
    assertSuperAdmin(req);

    const body = await req.json();
    let rawRows: any[] = [];

    if (body.csvContent && typeof body.csvContent === "string") {
      rawRows = parseCsv(body.csvContent);
    } else if (Array.isArray(body.rows)) {
      rawRows = body.rows;
    } else {
      return errorResponse(new Error("Either 'csvContent' string or 'rows' array is required."));
    }

    if (rawRows.length === 0) {
      return errorResponse(new Error("No valid product rows found in CSV data."));
    }

    let createdCount = 0;
    let updatedCount = 0;
    const errors: Array<{ row: number; sku?: string; name?: string; error: string }> = [];
    const processed: Array<{ name: string; sku: string; action: "created" | "updated" }> = [];

    // Helper to get normalized value from row
    const getVal = (row: any, ...keys: string[]): string => {
      for (const k of keys) {
        const norm = k.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (row[norm] !== undefined && row[norm] !== "") {
          return String(row[norm]).trim();
        }
        if (row[k] !== undefined && row[k] !== "") {
          return String(row[k]).trim();
        }
      }
      return "";
    };

    // Pre-cache categories and schools
    const categories = await prisma.category.findMany();
    const schools = await prisma.school.findMany();

    const categoryMap = new Map<string, string>(); // slug or lowerName -> id
    for (const c of categories) {
      categoryMap.set(c.slug.toLowerCase(), c.id);
      categoryMap.set(c.name.toLowerCase(), c.id);
    }

    const schoolMap = new Map<string, string>(); // slug or lowerName -> id
    for (const s of schools) {
      schoolMap.set(s.slug.toLowerCase(), s.id);
      schoolMap.set(s.name.toLowerCase(), s.id);
    }

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNumber = i + 2;

      const name = getVal(row, "name", "productName", "title");
      const sku = getVal(row, "sku", "productSku", "code");
      const categoryIdent = getVal(row, "categorySlug", "category", "categoryName");
      const mrpRaw = getVal(row, "mrp", "basePrice", "originalPrice");
      const sellingPriceRaw = getVal(row, "sellingPrice", "price", "salePrice");

      if (!name) {
        errors.push({ row: rowNumber, sku, error: "Product 'name' is required." });
        continue;
      }
      if (!sku) {
        errors.push({ row: rowNumber, name, error: "Product 'sku' is required." });
        continue;
      }

      const mrp = parseFloat(mrpRaw) || parseFloat(sellingPriceRaw) || 999;
      const sellingPrice = parseFloat(sellingPriceRaw) || mrp;

      // Resolve category
      let categoryId: string | null = null;
      if (categoryIdent) {
        const normCat = categoryIdent.toLowerCase();
        categoryId = categoryMap.get(normCat) || categoryMap.get(slugify(categoryIdent)) || null;
      }

      if (!categoryId) {
        // Default to first category or create one if none exist
        if (categories.length > 0) {
          categoryId = categories[0].id;
        } else {
          const defaultCat = await prisma.category.create({
            data: { name: "General Uniforms", slug: "general-uniforms" },
          });
          categories.push(defaultCat);
          categoryId = defaultCat.id;
          categoryMap.set("general-uniforms", defaultCat.id);
        }
      }

      // Resolve optional subcategory
      const subcategoryIdent = getVal(row, "subcategorySlug", "subcategory", "subcategoryName");
      let subcategoryId: string | null = null;
      if (subcategoryIdent) {
        const normSub = subcategoryIdent.toLowerCase();
        subcategoryId = categoryMap.get(normSub) || categoryMap.get(slugify(subcategoryIdent)) || null;
      }

      // Other fields
      const slug = getVal(row, "slug", "productSlug") || slugify(name);
      const description = getVal(row, "description", "desc") || `${name} - High-quality school attire crafted for durability and comfort.`;
      const fabricDetails = getVal(row, "fabricDetails", "fabric", "material");
      const careInstructions = getVal(row, "careInstructions", "care");
      const statusRaw = getVal(row, "status", "productStatus").toUpperCase();
      const status: ProductStatus =
        statusRaw === "DRAFT" || statusRaw === "ARCHIVED" ? statusRaw : "PUBLISHED";
      const isFeaturedRaw = getVal(row, "isFeatured", "featured");
      const isFeatured = isFeaturedRaw.toLowerCase() === "true" || isFeaturedRaw === "1";
      const isBestsellerRaw = getVal(row, "isBestseller", "bestseller");
      const isBestseller = isBestsellerRaw.toLowerCase() === "true" || isBestsellerRaw === "1";

      // Images
      const imagesRaw = getVal(row, "imageUrl", "image", "images", "photos");
      const imageUrls = imagesRaw
        ? imagesRaw.split(",").map((u) => u.trim()).filter(Boolean)
        : ["/images/products/polo.jpg"];

      // School Binding
      const schoolIdent = getVal(row, "schoolSlug", "school", "schoolName");
      let schoolId: string | null = null;
      if (schoolIdent) {
        schoolId = schoolMap.get(schoolIdent.toLowerCase()) || schoolMap.get(slugify(schoolIdent)) || null;
      }

      const seasonRaw = getVal(row, "season").toUpperCase();
      const season: Season =
        seasonRaw === "SUMMER" || seasonRaw === "WINTER" ? seasonRaw : "ALL_SEASON";
      const genderRaw = getVal(row, "gender").toUpperCase();
      const gender: Gender =
        genderRaw === "BOYS" || genderRaw === "GIRLS" ? genderRaw : "UNISEX";
      const classGrade = getVal(row, "classGrade", "grade", "class");

      // Variants
      const variantsRaw = getVal(row, "variants", "sizes", "options");
      const parsedVariants = parseVariantsString(variantsRaw, sku, sellingPrice, mrp);

      try {
        // Check if product already exists by SKU or Slug
        const existingProduct = await prisma.product.findFirst({
          where: {
            OR: [{ sku }, { slug }],
          },
          include: { variants: true, images: true, schoolUniforms: true },
        });

        if (existingProduct) {
          // Update existing product
          await prisma.$transaction(async (tx) => {
            await tx.product.update({
              where: { id: existingProduct.id },
              data: {
                name,
                description,
                fabricDetails: fabricDetails || undefined,
                careInstructions: careInstructions || undefined,
                mrp,
                sellingPrice,
                categoryId,
                subcategoryId: subcategoryId || undefined,
                status,
                isFeatured,
                isBestseller,
              },
            });

            // Update images if provided
            if (imagesRaw) {
              await tx.productImage.deleteMany({ where: { productId: existingProduct.id } });
              await tx.productImage.createMany({
                data: imageUrls.map((url, idx) => ({
                  productId: existingProduct.id,
                  url,
                  alt: `${name} photo ${idx + 1}`,
                  displayOrder: idx,
                  isPrimary: idx === 0,
                })),
              });
            }

            // Upsert variants & inventories
            for (const v of parsedVariants) {
              const existingVar = existingProduct.variants.find(
                (ev) => ev.sku === v.sku || ev.size === v.size
              );

              if (existingVar) {
                await tx.productVariant.update({
                  where: { id: existingVar.id },
                  data: {
                    size: v.size,
                    color: v.color || undefined,
                    sellingPrice: v.sellingPrice,
                    mrp: v.mrp || mrp,
                  },
                });

                await tx.inventory.upsert({
                  where: { variantId: existingVar.id },
                  create: {
                    variantId: existingVar.id,
                    availableQuantity: v.stock,
                    lowStockThreshold: 5,
                  },
                  update: {
                    availableQuantity: v.stock,
                  },
                });
              } else {
                const createdVar = await tx.productVariant.create({
                  data: {
                    productId: existingProduct.id,
                    size: v.size,
                    sku: v.sku,
                    color: v.color || null,
                    sellingPrice: v.sellingPrice,
                    mrp: v.mrp || mrp,
                    isAvailable: true,
                  },
                });

                await tx.inventory.create({
                  data: {
                    variantId: createdVar.id,
                    availableQuantity: v.stock,
                    lowStockThreshold: 5,
                  },
                });
              }
            }

            // Bind school uniform if specified
            if (schoolId) {
              await tx.schoolUniform.upsert({
                where: {
                  schoolId_productId_season_gender_classGrade: {
                    schoolId,
                    productId: existingProduct.id,
                    season,
                    gender,
                    classGrade: classGrade || "",
                  },
                },
                create: {
                  schoolId,
                  productId: existingProduct.id,
                  season,
                  gender,
                  classGrade: classGrade || null,
                  uniformType: "Regular",
                  isCompulsory: true,
                },
                update: {
                  season,
                  gender,
                  classGrade: classGrade || null,
                },
              });
            }
          });

          updatedCount++;
          processed.push({ name, sku, action: "updated" });
        } else {
          // Create brand new product
          await prisma.$transaction(async (tx) => {
            const newProduct = await tx.product.create({
              data: {
                name,
                slug,
                sku,
                description,
                fabricDetails: fabricDetails || null,
                careInstructions: careInstructions || null,
                mrp,
                sellingPrice,
                categoryId,
                subcategoryId: subcategoryId || null,
                status,
                isFeatured,
                isBestseller,
                images: {
                  create: imageUrls.map((url, idx) => ({
                    url,
                    alt: `${name} photo ${idx + 1}`,
                    displayOrder: idx,
                    isPrimary: idx === 0,
                  })),
                },
              },
            });

            // Create variants & inventory
            for (const v of parsedVariants) {
              const createdVar = await tx.productVariant.create({
                data: {
                  productId: newProduct.id,
                  size: v.size,
                  sku: v.sku,
                  color: v.color || null,
                  sellingPrice: v.sellingPrice,
                  mrp: v.mrp || mrp,
                  isAvailable: true,
                },
              });

              await tx.inventory.create({
                data: {
                  variantId: createdVar.id,
                  availableQuantity: v.stock,
                  lowStockThreshold: 5,
                },
              });
            }

            // Bind school uniform if specified
            if (schoolId) {
              await tx.schoolUniform.create({
                data: {
                  schoolId,
                  productId: newProduct.id,
                  season,
                  gender,
                  classGrade: classGrade || null,
                  uniformType: "Regular",
                  isCompulsory: true,
                },
              });
            }
          });

          createdCount++;
          processed.push({ name, sku, action: "created" });
        }
      } catch (err: any) {
        errors.push({
          row: rowNumber,
          sku,
          name,
          error: err?.message || "Failed to process product row.",
        });
      }
    }

    // Audit Log
    await logAuditEvent({
      action: "PRODUCT_BULK_IMPORT",
      module: "PRODUCTS",
      feature: "BULK_IMPORT",
      details: {
        totalRows: rawRows.length,
        createdCount,
        updatedCount,
        errorCount: errors.length,
      },
      req,
    });

    return successResponse(
      {
        totalRows: rawRows.length,
        createdCount,
        updatedCount,
        errorCount: errors.length,
        errors,
        processed,
      },
      `Bulk product import completed: ${createdCount} created, ${updatedCount} updated, ${errors.length} failed.`
    );
  } catch (error) {
    return errorResponse(error);
  }
}
