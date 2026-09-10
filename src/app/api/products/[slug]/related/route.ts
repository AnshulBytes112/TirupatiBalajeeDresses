import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 8);
    const related = await productService.getRelatedProducts(params.slug, limit);
    return successResponse(related, "Related products retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
