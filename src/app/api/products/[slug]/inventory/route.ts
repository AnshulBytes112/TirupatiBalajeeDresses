import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const product = await productService.getProductBySlug(params.slug);
    
    // Controlled public inventory representation (never expose raw warehouse quantities directly)
    const inventorySummary = product.variants.map((v) => ({
      variantId: v.id,
      sku: v.sku,
      size: v.size,
      color: v.color,
      isAvailable: v.isAvailable,
      stockState: v.stockState,
      displayStock: v.stockState === "LOW_STOCK" ? `Only ${v.stockQuantity} left` : v.stockState === "IN_STOCK" ? "In Stock" : "Out of Stock",
    }));

    return successResponse(inventorySummary, "Inventory status retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
