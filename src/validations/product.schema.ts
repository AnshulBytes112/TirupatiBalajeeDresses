import { z } from "zod";

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  school: z.string().optional(),
  brand: z.string().optional(),
  gender: z.enum(["BOYS", "GIRLS", "UNISEX"]).optional(),
  season: z.enum(["SUMMER", "WINTER", "ALL_SEASON"]).optional(),
  search: z.string().optional(),
  isBestseller: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  isFeatured: z
    .string()
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["price_asc", "price_desc", "newest", "popular"]).default("popular"),
});

export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
