"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Star,
  ShieldCheck,
  ShoppingBag,
  Zap,
  Heart,
  Share2,
  ChevronRight,
  RotateCcw,
  Truck,
  Sparkles,
  Award,
  Minus,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ProductGallery } from "./product-gallery";
import { VariantSelector, VariantDTO, SchoolDTO } from "./variant-selector";
import { DeliveryPincodeChecker } from "./delivery-pincode-checker";
import { ProductInfoTabs } from "./product-info-tabs";
import { ProductReviewsSection } from "./product-reviews-section";
import { RelatedProductsSection, RelatedProductItem } from "./related-products-section";
import { MobileStickyActionBar } from "./mobile-sticky-action-bar";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

interface ReviewDTO {
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

export interface ProductDetailData {
  id: string;
  title: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  mrp: number;
  sellingPrice: number;
  discountPercentage: number;
  isFeatured: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  schools: SchoolDTO[];
  images: ProductImage[];
  variants: VariantDTO[];
  reviews: ReviewDTO[];
}

interface ProductDetailViewProps {
  product: ProductDetailData;
  relatedProducts: RelatedProductItem[];
}

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = React.useState<VariantDTO | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  // Dynamic price resolution based on active variant
  const currentPrice = selectedVariant?.sellingPrice ?? product.sellingPrice;
  const currentMrp = selectedVariant?.mrp ?? product.mrp;
  const discountPct =
    currentMrp > currentPrice ? Math.round(((currentMrp - currentPrice) / currentMrp) * 100) : 0;
  const isOutOfStock = selectedVariant ? !selectedVariant.isAvailable : false;

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    const maxStock = selectedVariant?.stockQuantity ?? 10;
    if (quantity >= maxStock) {
      toast.info(`Maximum available quantity is ${maxStock}`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Added to your wishlist!");
      } else {
        toast.info("Removed from your wishlist");
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(
        `Added ${quantity}x ${product.name} ${
          selectedVariant ? `(Size: ${selectedVariant.size})` : ""
        } to cart!`
      );
    }, 400);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      toast.error("This item is currently out of stock.");
      return;
    }
    toast.success("Proceeding to secure checkout...");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at TirupatiBalajee Dresses!`,
          url: window.location.href,
        });
      } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Product link copied to clipboard!");
    }
  };

  const scrollToReviews = () => {
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 pt-4 text-slate-900 lg:pb-16">
      <Container size="lg">
        {/* Dynamic Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"
        >
          <Link href="/" className="transition hover:text-blue-900">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link
            href={`/shop/${product.category.slug}`}
            className="transition hover:text-blue-900"
          >
            {product.category.name}
          </Link>
          {product.subcategory && (
            <>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <Link
                href={`/shop/${product.category.slug}/${product.subcategory.slug}`}
                className="transition hover:text-blue-900"
              >
                {product.subcategory.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="truncate max-w-[200px] sm:max-w-xs font-semibold text-slate-900">
            {product.name}
          </span>
        </nav>

        {/* TOP SECTION: GALLERY + PRODUCT INFO */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* LEFT: IMAGE GALLERY (5 Cols on Desktop) */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.images}
              productName={product.name}
              isBestseller={product.isBestseller}
              isFeatured={product.isFeatured}
              discountPercentage={discountPct}
            />
          </div>

          {/* RIGHT: PRODUCT INFO & VARIANTS (6 Cols on Desktop) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Brand & School Tags */}
              <div className="flex flex-wrap items-center gap-2">
                {product.brand && (
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-900">
                    {product.brand.name}
                  </span>
                )}
                {product.schools[0] && (
                  <Link
                    href={`/shop/school-uniforms?school=${product.schools[0].slug}`}
                    className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900 transition hover:bg-amber-100"
                  >
                    <Award className="h-3 w-3 text-amber-600" />
                    {product.schools[0].name}
                  </Link>
                )}
              </div>

              {/* Title & SKU */}
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {product.name}
              </h1>
              <p className="mt-1 font-mono text-[11px] text-slate-400">SKU: {selectedVariant?.sku || product.sku}</p>

              {/* Ratings & Share */}
              <div className="mt-3 flex items-center justify-between border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={scrollToReviews}
                  className="flex items-center gap-2 text-xs font-bold transition hover:opacity-80"
                >
                  <div className="flex items-center gap-1 rounded bg-amber-500 px-2 py-0.5 text-white shadow-sm">
                    <span>{Number(product.rating || 4.8).toFixed(1)}</span>
                    <Star className="h-3 w-3 fill-white" />
                  </div>
                  <span className="text-slate-500 underline font-normal">
                    {product.reviewCount || 12} Ratings & Reviews
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-900"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              </div>

              {/* Pricing Section */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{currentPrice}
                </span>

                {currentMrp > currentPrice && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ₹{currentMrp}
                    </span>
                    <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                      {discountPct}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                Inclusive of all taxes • Free Shipping on orders over ₹499
              </p>

              {/* Variant Matrix Selector */}
              <div className="mt-6 border-t border-slate-200 pt-5">
                <VariantSelector
                  variants={product.variants}
                  schools={product.schools}
                  categoryName={product.category.name}
                  onVariantChange={setSelectedVariant}
                />
              </div>

              {/* Quantity Picker */}
              <div className="mt-6 flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Quantity:
                </span>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    className="flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Desktop CTA Action Buttons */}
              <div className="mt-6 hidden lg:flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAddingToCart}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-blue-900 bg-white py-3.5 text-sm font-bold text-blue-900 shadow-sm transition hover:bg-blue-50 active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" />
                  ADD TO CART
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-yellow-400 py-3.5 text-sm font-extrabold text-blue-950 shadow transition hover:bg-yellow-300 active:scale-95 disabled:opacity-50"
                >
                  <Zap className="h-4 w-4 fill-blue-950" />
                  BUY NOW
                </button>

                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  aria-label="Wishlist"
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                    isWishlisted
                      ? "border-rose-300 bg-rose-50 text-rose-600"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-600" : ""}`} />
                </button>
              </div>

              {/* Pincode & Delivery Checker */}
              <div className="mt-6">
                <DeliveryPincodeChecker
                  productId={product.id}
                  variantId={selectedVariant?.id}
                  quantity={quantity}
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% Certified School Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-blue-900 shrink-0" />
                  <span>7-Day Easy Doorstep Exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-900 shrink-0" />
                  <span>Express Dispatch in 24 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cash on Delivery Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION 1: PRODUCT INFO TABS & SPECS */}
        <div className="mt-14">
          <ProductInfoTabs
            description={product.description}
            fabricDetails={product.fabricDetails}
            careInstructions={product.careInstructions}
            categoryName={product.category.name}
            brandName={product.brand?.name}
            sku={selectedVariant?.sku || product.sku}
            schools={product.schools}
          />
        </div>

        {/* BOTTOM SECTION 2: REVIEWS */}
        <div id="reviews-section" className="mt-14 scroll-mt-20">
          <ProductReviewsSection
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            initialRating={product.rating}
            initialReviewCount={product.reviewCount}
            initialReviews={product.reviews}
          />
        </div>

        {/* BOTTOM SECTION 3: RELATED PRODUCTS */}
        <div className="mt-14">
          <RelatedProductsSection
            currentProductId={product.id}
            currentProductSlug={product.slug}
            relatedProducts={relatedProducts}
          />
        </div>
      </Container>

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      <MobileStickyActionBar
        variant={selectedVariant}
        basePrice={product.sellingPrice}
        baseMrp={product.mrp}
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlistToggle}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isAddingToCart={isAddingToCart}
      />
    </div>
  );
}
