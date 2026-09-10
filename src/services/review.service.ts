import { reviewRepository } from "@/repositories/review.repository";
import { productRepository } from "@/repositories/product.repository";
import { CreateReviewInput, GetReviewsQuery } from "@/validations/review.schema";
import { NotFoundError, BadRequestError } from "@/lib/errors";

export class ReviewService {
  async getProductReviews(slug: string, query: GetReviewsQuery) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}'`);
    }

    return reviewRepository.findByProductId(product.id, query);
  }

  async submitProductReview(
    slug: string,
    input: CreateReviewInput,
    user: { id: string; name?: string | null; email?: string | null }
  ) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}'`);
    }

    // Check if user already reviewed this product
    const existing = await reviewRepository.findUserReview(user.id, product.id);
    if (existing) {
      throw new BadRequestError("You have already submitted a review for this product.");
    }

    // Verify purchase
    const isVerifiedPurchase = await reviewRepository.checkUserVerifiedPurchase(user.id, product.id);

    const review = await reviewRepository.createReview({
      productId: product.id,
      userId: user.id,
      rating: input.rating,
      title: input.title,
      comment: input.comment,
      isVerifiedPurchase,
    });

    return review;
  }
}

export const reviewService = new ReviewService();
