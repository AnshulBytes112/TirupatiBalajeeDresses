import { z } from "zod";

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  school: z.string().optional(),
  brand: z.string().optional(),
  gender: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const upper = val.toUpperCase();
      return upper === "BOYS" || upper === "GIRLS" || upper === "UNISEX"
        ? (upper as "BOYS" | "GIRLS" | "UNISEX")
        : undefined;
    }),
  season: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      const upper = val.toUpperCase();
      return upper === "SUMMER" || upper === "WINTER" || upper === "ALL_SEASON"
        ? (upper as "SUMMER" | "WINTER" | "ALL_SEASON")
        : undefined;
    }),
  classGrade: z.string().optional(),
  class: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  search: z.string().optional(),
  q: z.string().optional(),
  isBestseller: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      typeof val === "boolean" ? val : val === "true" ? true : val === "false" ? false : undefined
    ),
  isFeatured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      typeof val === "boolean" ? val : val === "true" ? true : val === "false" ? false : undefined
    ),
  inStock: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      typeof val === "boolean" ? val : val === "true" ? true : val === "false" ? false : undefined
    ),
  outOfStock: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      typeof val === "boolean" ? val : val === "true" ? true : val === "false" ? false : undefined
    ),
  hasDiscount: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) =>
      typeof val === "boolean" ? val : val === "true" ? true : val === "false" ? false : undefined
    ),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  sort: z.string().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "popular", "discount_desc", "rating_desc"])
    .default("popular"),
}).transform((data) => {
  // If sort was passed instead of sortBy, map it
  const sortParam = (data.sort || data.sortBy) as
    | "price_asc"
    | "price_desc"
    | "newest"
    | "popular"
    | "discount_desc"
    | "rating_desc";

  return {
    ...data,
    classGrade: data.classGrade || data.class,
    sortBy:
      sortParam === "price_asc" ||
      sortParam === "price_desc" ||
      sortParam === "newest" ||
      sortParam === "discount_desc" ||
      sortParam === "rating_desc"
        ? sortParam
        : "popular",
  };
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
