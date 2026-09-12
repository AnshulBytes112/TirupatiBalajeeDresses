import { z } from "zod";
import { Gender, Season, ProductStatus } from "@prisma/client";

export const variantInputSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  color: z.string().optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  mrp: z.coerce.number().positive("MRP must be greater than 0").optional().nullable(),
  sellingPrice: z.coerce.number().positive("Selling price must be greater than 0"),
  priceOverride: z.coerce.number().positive().optional().nullable(),
  isAvailable: z.boolean().default(true),
  inventory: z
    .object({
      availableQuantity: z.coerce.number().int().min(0, "Quantity cannot be negative").default(0),
      reservedQuantity: z.coerce.number().int().min(0).default(0),
      lowStockThreshold: z.coerce.number().int().min(0).default(5),
      warehouseLocation: z.string().optional().nullable(),
    })
    .optional(),
});

export const imageInputSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1, "Image URL is required"),
  alt: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  isPrimary: z.boolean().default(false),
});

export const schoolUniformInputSchema = z.object({
  schoolId: z.string().min(1, "School ID is required"),
  season: z.nativeEnum(Season).default(Season.ALL_SEASON),
  gender: z.nativeEnum(Gender).default(Gender.UNISEX),
  classGrade: z.string().optional().nullable(),
  uniformType: z.string().optional().nullable(),
  isCompulsory: z.boolean().default(true),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
  sku: z.string().min(2, "Product SKU is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  fabricDetails: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  mrp: z.coerce.number().positive("MRP must be greater than 0"),
  sellingPrice: z.coerce.number().positive("Selling price must be greater than 0"),
  categoryId: z.string().min(1, "Category ID is required"),
  subcategoryId: z.string().optional().nullable().transform((val) => (val && val.trim() ? val.trim() : null)),
  brandId: z.string().optional().nullable().transform((val) => (val && val.trim() ? val.trim() : null)),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.PUBLISHED),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z.array(imageInputSchema).optional().default([]),
  variants: z.array(variantInputSchema).optional().default([]),
  schools: z.array(schoolUniformInputSchema).optional().default([]),
});

export const updateProductSchema = createProductSchema.partial();

export const adminProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  q: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  categoryId: z.string().optional(),
  schoolId: z.string().optional(),
  brandId: z.string().optional(),
  sortBy: z.enum(["newest", "price_asc", "price_desc", "name_asc", "popular", "stock_asc"]).default("newest"),
});

export type VariantInput = z.infer<typeof variantInputSchema>;
export type ImageInput = z.infer<typeof imageInputSchema>;
export type SchoolUniformInput = z.infer<typeof schoolUniformInputSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AdminProductsQuery = z.infer<typeof adminProductsQuerySchema>;
