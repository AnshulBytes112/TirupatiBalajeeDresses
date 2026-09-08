import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { getProductsQuerySchema } from "@/validations/product.schema";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = getProductsQuerySchema.parse(rawParams);
    const result = await productService.getProducts(validatedQuery);

    return successResponse(result.items, "Products retrieved successfully", {
      pagination: result.pagination,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
