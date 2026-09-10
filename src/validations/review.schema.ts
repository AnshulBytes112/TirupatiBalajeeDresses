import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  title: z.string().trim().max(100, "Title cannot exceed 100 characters").optional().nullable(),
  comment: z.string().trim().min(5, "Comment must be at least 5 characters").max(1000, "Comment cannot exceed 1000 characters"),
  productId: z.string().uuid("Invalid Product ID"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const getReviewsQuerySchema = z.object({
  page: z.preprocess((val) => (val ? Number(val) : 1), z.number().int().min(1)).default(1),
  limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().int().min(1).max(50)).default(10),
  rating: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().min(1).max(5).optional()),
});

export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>;
