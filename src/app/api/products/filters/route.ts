import { NextResponse } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filters = await productService.getFilterAggregations();
    return successResponse(filters, "Filter options retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
