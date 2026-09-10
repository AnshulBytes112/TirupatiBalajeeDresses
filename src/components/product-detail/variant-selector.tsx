"use client";

import * as React from "react";
import { Check, Ruler, AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { SizeGuideModal } from "./size-guide-modal";

export interface VariantDTO {
  id: string;
  size: string;
  color?: string | null;
  sku: string;
  mrp: number;
  sellingPrice: number;
  price: number;
  discountPercentage: number;
  isAvailable: boolean;
  stockState: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface SchoolDTO {
  id: string;
  name: string;
  slug: string;
  season?: string;
  gender?: string;
  classGrade?: string | null;
}

interface VariantSelectorProps {
  variants: VariantDTO[];
  schools?: SchoolDTO[];
  categoryName?: string;
  onVariantChange: (variant: VariantDTO | null) => void;
}

export function VariantSelector({
  variants,
  schools = [],
  categoryName = "Apparel",
  onVariantChange,
}: VariantSelectorProps) {
  // Extract distinct attribute values present across variants
  const availableSizes = React.useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.size).filter(Boolean))).sort((a, b) => {
      const aNum = parseInt(a, 10);
      const bNum = parseInt(b, 10);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.localeCompare(b);
    });
  }, [variants]);

  const availableColors = React.useMemo(() => {
    return Array.from(new Set(variants.map((v) => v.color).filter(Boolean) as string[]));
  }, [variants]);

  // Initial selection: pick first in-stock variant or first available variant
  const [selectedSize, setSelectedSize] = React.useState<string>(() => {
    const firstInStock = variants.find((v) => v.isAvailable);
    return firstInStock?.size || availableSizes[0] || "";
  });

  const [selectedColor, setSelectedColor] = React.useState<string>(() => {
    const firstInStock = variants.find((v) => v.isAvailable);
    return firstInStock?.color || availableColors[0] || "";
  });

  const [isSizeGuideOpen, setIsSizeGuideOpen] = React.useState(false);

  // Color mapping utility for swatch representation
  const getColorHex = (colorName: string): string => {
    const lower = colorName.toLowerCase();
    if (lower.includes("navy")) return "#1E3A8A";
    if (lower.includes("sky") || lower.includes("light blue")) return "#38BDF8";
    if (lower.includes("blue")) return "#2563EB";
    if (lower.includes("white")) return "#FFFFFF";
    if (lower.includes("black")) return "#0F172A";
    if (lower.includes("grey") || lower.includes("gray")) return "#64748B";
    if (lower.includes("green") || lower.includes("bottle")) return "#15803D";
    if (lower.includes("maroon") || lower.includes("red")) return "#DC2626";
    if (lower.includes("yellow")) return "#EAB308";
    if (lower.includes("khaki") || lower.includes("beige")) return "#D4B996";
    return "#CBD5E1";
  };

  // Find exact active variant
  const activeVariant = React.useMemo(() => {
    return (
      variants.find((v) => {
        const sizeMatch = !availableSizes.length || v.size === selectedSize;
        const colorMatch = !availableColors.length || v.color === selectedColor;
        return sizeMatch && colorMatch;
      }) || null
    );
  }, [variants, selectedSize, selectedColor, availableSizes.length, availableColors.length]);

  // Notify parent on active variant change
  React.useEffect(() => {
    onVariantChange(activeVariant);
  }, [activeVariant, onVariantChange]);

  return (
    <div className="space-y-4">
      {/* 1. SIZE SELECTOR (If product has sizes) */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Select Size: <span className="font-semibold text-blue-900">{selectedSize}</span>
            </label>

            {/* Size Guide Trigger */}
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline"
            >
              <Ruler className="h-3.5 w-3.5" />
              Size Guide
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              // Check if any variant exists with this size that is in-stock
              const variantForSize = variants.find(
                (v) => v.size === size && (!selectedColor || v.color === selectedColor)
              );
              const isSelected = selectedSize === size;
              const isOutOfStock = !variantForSize || !variantForSize.isAvailable;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`relative min-w-[48px] rounded-lg border px-3.5 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? "border-blue-900 bg-blue-900 text-white shadow-sm ring-2 ring-blue-900/20"
                      : isOutOfStock
                      ? "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-300"
                      : "border-slate-300 bg-white text-slate-800 hover:border-blue-900 hover:text-blue-900"
                  }`}
                >
                  {size}
                  {isOutOfStock && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="h-full w-full rounded-full bg-rose-500 opacity-75" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. COLOR SWATCHES (If product has colors) */}
      {availableColors.length > 0 && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
            Select Color: <span className="font-semibold text-blue-900">{selectedColor}</span>
          </label>

          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {availableColors.map((col) => {
              const hex = getColorHex(col);
              const isSelected = selectedColor === col;
              const isWhite = hex === "#FFFFFF";

              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => setSelectedColor(col)}
                  title={col}
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    isSelected ? "ring-2 ring-blue-900 ring-offset-2 scale-110" : "hover:scale-105"
                  } ${isWhite ? "border border-slate-300" : ""}`}
                  style={{ backgroundColor: hex }}
                >
                  {isSelected && (
                    <Check
                      className={`h-4 w-4 stroke-[3] ${
                        isWhite ? "text-slate-900" : "text-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. REAL STOCK & AVAILABILITY BADGE */}
      <div className="pt-1">
        {activeVariant ? (
          activeVariant.stockState === "OUT_OF_STOCK" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              <XCircle className="h-4 w-4 text-rose-600" />
              <span>Out of Stock</span>
            </div>
          ) : activeVariant.stockState === "LOW_STOCK" ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>Only {activeVariant.stockQuantity} left in stock - order soon</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>In Stock • Ready for Fast Dispatch</span>
            </div>
          )
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            <span>Unavailable combination</span>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categoryName={categoryName}
      />
    </div>
  );
}
