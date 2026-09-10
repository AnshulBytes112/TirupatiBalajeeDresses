"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, ShieldCheck } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  isBestseller?: boolean;
  isFeatured?: boolean;
  discountPercentage?: number;
}

export function ProductGallery({
  images,
  productName,
  isBestseller,
  isFeatured,
  discountPercentage,
}: ProductGalleryProps) {
  // Ensure at least one image exists
  const safeImages: ProductImage[] =
    images && images.length > 0
      ? images
      : [
          {
            id: "fallback-1",
            url: "/images/products/navy-blue-shorts.png",
            alt: productName,
            displayOrder: 0,
            isPrimary: true,
          },
        ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
  const [isZooming, setIsZooming] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 0, y: 0 });

  // Touch Swipe for Mobile
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < safeImages.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const activeImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="relative w-full">
      {/* DESKTOP LAYOUT (Thumbnails Left + Big Image Right) */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-4">
        {/* Left Thumbnails Column */}
        <div className="col-span-2 flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
          {safeImages.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`group relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-all ${
                activeIndex === idx
                  ? "border-blue-900 ring-2 ring-blue-900/20 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1 transition group-hover:scale-105"
              />
            </button>
          ))}
        </div>

        {/* Main Big Image Preview */}
        <div className="col-span-10">
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm cursor-crosshair group"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            {/* Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 pointer-events-none">
              {isBestseller && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  BESTSELLER
                </span>
              )}
              {discountPercentage !== undefined && discountPercentage > 0 && (
                <span className="inline-flex items-center rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Lightbox Expand Button */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur-sm transition hover:bg-white hover:text-blue-900"
              title="View full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Base Image */}
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              priority
              sizes="(max-width: 1200px) 50vw, 600px"
              className={`object-contain p-6 transition-opacity duration-200 ${
                isZooming ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Hover Zoom Magnifier Layer */}
            {isZooming && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${activeImage.url})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "240%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}
          </div>
          
          <p className="mt-2 text-center text-xs text-slate-400">
            Roll over image to zoom in • Click to expand
          </p>
        </div>
      </div>

      {/* MOBILE LAYOUT (Swipeable Carousel) */}
      <div className="lg:hidden">
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-white"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Badges */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {isBestseller && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                <Sparkles className="h-3 w-3" />
                BESTSELLER
              </span>
            )}
            {discountPercentage !== undefined && discountPercentage > 0 && (
              <span className="inline-flex items-center rounded-full bg-rose-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          <button
            onClick={() => setIsLightboxOpen(true)}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow-md backdrop-blur-sm"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          <Image
            src={activeImage.url}
            alt={activeImage.alt || productName}
            fill
            priority
            sizes="100vw"
            className="object-contain p-4"
          />

          {/* Navigation Arrows */}
          {safeImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-800 shadow backdrop-blur-sm disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => Math.min(safeImages.length - 1, prev + 1))}
                disabled={activeIndex === safeImages.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1.5 text-slate-800 shadow backdrop-blur-sm disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Pagination Counter Badge */}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {safeImages.length}
          </div>
        </div>

        {/* Mobile Dot Indicators */}
        {safeImages.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === idx ? "w-6 bg-blue-900" : "w-1.5 bg-slate-300"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative max-h-[85vh] max-w-[85vw] aspect-square w-full">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              className="object-contain"
            />
          </div>

          {safeImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => setActiveIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
