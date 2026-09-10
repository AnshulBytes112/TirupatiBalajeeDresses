import { NextRequest } from "next/server";
import { productService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

export const dynamic = "force-dynamic";

const recentlyViewedSchema = z.object({
  ids: z.array(z.string()).max(20),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = recentlyViewedSchema.parse(body);

    const products = await productService.getRecentlyViewed(ids);
    return successResponse(products, "Recently viewed products retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
