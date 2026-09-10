import { NextRequest } from "next/server";
import { reviewService } from "@/services/review.service";
import { createReviewSchema, getReviewsQuerySchema } from "@/validations/review.schema";
import { successResponse, errorResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const query = getReviewsQuerySchema.parse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      rating: searchParams.get("rating"),
    });

    const result = await reviewService.getProductReviews(params.slug, query);
    return successResponse(result, "Product reviews retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Resolve or establish customer user
    let userId = request.headers.get("x-user-id");
    let user = null;

    if (userId) {
      user = await prisma.user.findUnique({ where: { id: userId } });
    }

    if (!user) {
      // Find first customer or create a default verified parent user
      user = await prisma.user.findFirst({
        where: { role: "CUSTOMER", isDeleted: false },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: "Verified Parent",
            email: "parent.reviewer@tirupatibalajee.com",
            role: "CUSTOMER",
            isActive: true,
          },
        });
      }
    }

    const review = await reviewService.submitProductReview(params.slug, validatedData, {
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return successResponse(review, "Review submitted successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
