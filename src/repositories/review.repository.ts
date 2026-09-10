import { BaseRepository } from "./base.repository";
import { GetReviewsQuery } from "@/validations/review.schema";
import { Prisma, ReviewStatus } from "@prisma/client";

export class ReviewRepository extends BaseRepository {
  async findByProductId(productId: string, query: GetReviewsQuery) {
    const { page = 1, limit = 10, rating } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      productId,
      status: ReviewStatus.APPROVED,
      ...(rating ? { rating } : {}),
    };

    const [reviews, total, allApprovedReviews] = await Promise.all([
      this.db.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      this.db.review.count({ where }),
      this.db.review.findMany({
        where: { productId, status: ReviewStatus.APPROVED },
        select: { rating: true },
      }),
    ]);

    // Calculate rating distribution
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    for (const r of allApprovedReviews) {
      if (distribution[r.rating] !== undefined) {
        distribution[r.rating]++;
      }
      sum += r.rating;
    }

    const totalApproved = allApprovedReviews.length;
    const averageRating =
      totalApproved > 0 ? Number((sum / totalApproved).toFixed(1)) : 5.0;

    const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: distribution[stars] || 0,
      percentage: totalApproved > 0 ? Math.round(((distribution[stars] || 0) / totalApproved) * 100) : 0,
    }));

    return {
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        isVerifiedPurchase: r.isVerifiedPurchase,
        createdAt: r.createdAt,
        user: {
          name: r.user.name || "Verified Parent",
          image: r.user.image,
        },
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        averageRating,
        totalReviews: totalApproved,
        ratingBreakdown,
      },
    };
  }

  async findUserReview(userId: string, productId: string) {
    return this.db.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async checkUserVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    const purchasedItem = await this.db.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: {
            in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPED"],
          },
        },
      },
    });

    return !!purchasedItem;
  }

  async createReview(data: {
    productId: string;
    userId: string;
    rating: number;
    title?: string | null;
    comment: string;
    isVerifiedPurchase?: boolean;
    status?: ReviewStatus;
  }) {
    const review = await this.db.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
        isVerifiedPurchase: data.isVerifiedPurchase ?? false,
        status: data.status ?? ReviewStatus.APPROVED,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    // Recalculate product rating aggregate
    const approvedReviews = await this.db.review.findMany({
      where: { productId: data.productId, status: ReviewStatus.APPROVED },
      select: { rating: true },
    });

    if (approvedReviews.length > 0) {
      const sum = approvedReviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = Number((sum / approvedReviews.length).toFixed(2));

      await this.db.product.update({
        where: { id: data.productId },
        data: {
          rating: new Prisma.Decimal(avg),
          reviewCount: approvedReviews.length,
        },
      });
    }

    return review;
  }
}

export const reviewRepository = new ReviewRepository();
