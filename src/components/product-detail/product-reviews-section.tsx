"use client";

import * as React from "react";
import { Star, CheckCircle2, MessageSquarePlus, X, Loader2, ThumbsUp, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface ReviewItem {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string | Date;
  user: {
    name: string;
    image?: string | null;
  };
}

interface ProductReviewsSectionProps {
  productId: string;
  productSlug: string;
  productName: string;
  initialRating: number;
  initialReviewCount: number;
  initialReviews?: ReviewItem[];
}

export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  initialRating,
  initialReviewCount,
  initialReviews = [],
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = React.useState<ReviewItem[]>(initialReviews);
  const [averageRating, setAverageRating] = React.useState<number>(initialRating);
  const [totalCount, setTotalCount] = React.useState<number>(initialReviewCount);
  const [selectedStarFilter, setSelectedStarFilter] = React.useState<number | null>(null);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newRating, setNewRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [newTitle, setNewTitle] = React.useState("");
  const [newComment, setNewComment] = React.useState("");

  // Calculate Rating Distribution
  const distribution = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });

    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: counts[star],
      percentage: Math.round((counts[star] / total) * 100),
    }));
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = selectedStarFilter
    ? reviews.filter((r) => r.rating === selectedStarFilter)
    : reviews;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim().length < 5) {
      toast.error("Please write at least 5 characters in your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: newRating,
          title: newTitle.trim() || undefined,
          comment: newComment.trim(),
        }),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Thank you! Your verified review has been submitted.");
        setIsModalOpen(false);
        setNewComment("");
        setNewTitle("");

        // Optimistically add to UI
        const createdReview: ReviewItem = {
          id: json.data?.id || `temp-${Date.now()}`,
          rating: newRating,
          title: newTitle || null,
          comment: newComment,
          isVerifiedPurchase: true,
          createdAt: new Date().toISOString(),
          user: {
            name: "Verified Parent",
          },
        };

        const updated = [createdReview, ...reviews];
        setReviews(updated);
        setTotalCount((prev) => prev + 1);
        const sum = updated.reduce((acc, r) => acc + r.rating, 0);
        setAverageRating(Number((sum / updated.length).toFixed(1)));
      } else {
        toast.error(json.message || "Failed to submit review.");
      }
    } catch {
      toast.error("Network error submitting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Customer Ratings & Reviews</h3>
          <p className="text-xs text-slate-500">
            Real feedback from verified parents and school students
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-blue-800"
        >
          <MessageSquarePlus className="h-4 w-4 text-yellow-400" />
          Write a Review
        </button>
      </div>

      {/* RATING BREAKDOWN GRID */}
      <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-center">
        {/* Left: Big Score Badge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-6 text-center">
          <div className="text-5xl font-extrabold text-blue-900">{averageRating.toFixed(1)}</div>
          <div className="mt-2 flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${
                  s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-600">
            Based on {totalCount} verified parent reviews
          </p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            100% Verified Purchases
          </div>
        </div>

        {/* Right: Star Bar Progress */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map((d) => (
            <button
              key={d.star}
              onClick={() => setSelectedStarFilter(selectedStarFilter === d.star ? null : d.star)}
              className={`flex w-full items-center gap-3 rounded-lg p-1.5 text-xs transition ${
                selectedStarFilter === d.star ? "bg-blue-50 ring-1 ring-blue-900/20" : "hover:bg-slate-50"
              }`}
            >
              <span className="w-12 text-left font-semibold text-slate-700">{d.star} Stars</span>
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-slate-400 font-mono text-[11px]">{d.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FILTER PILL */}
      {selectedStarFilter && (
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-slate-500">Filtered by:</span>
          <button
            onClick={() => setSelectedStarFilter(null)}
            className="inline-flex items-center gap-1 rounded-full bg-blue-900 px-3 py-1 text-xs font-bold text-white shadow-sm"
          >
            {selectedStarFilter} Stars Only <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="mt-6 space-y-4 divide-y divide-slate-100">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="pt-4 first:pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 font-bold text-xs text-blue-900">
                    {rev.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{rev.user.name}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Stars & Title */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                {rev.title && <span className="text-xs font-bold text-slate-800">{rev.title}</span>}
              </div>

              {/* Review Commentary */}
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-xs text-slate-500">
            No reviews match your selected filter.
          </p>
        )}
      </div>

      {/* WRITE REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
                <p className="text-xs text-slate-500">{productName}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="mt-4 space-y-4 text-xs">
              {/* Star Rating Picker */}
              <div>
                <label className="block font-bold text-slate-800">Overall Rating *</label>
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= (hoverRating || newRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-slate-700">
                    {hoverRating || newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800">Headline / Title (Optional)</label>
                <input
                  type="text"
                  maxLength={100}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Excellent fit and very durable stitch!"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800">Your Detailed Review *</label>
                <textarea
                  rows={4}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share details about the fabric quality, sizing accuracy, and how it holds up after washing..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-900 px-5 py-2 font-bold text-white shadow transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
