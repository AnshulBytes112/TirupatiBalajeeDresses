import { NextRequest } from "next/server";
import { brandService } from "@/services/brand.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const brand = await brandService.getBrandBySlug(slug);
      return successResponse(brand, "Brand details retrieved successfully");
    }

    const brands = await brandService.getBrands();
    return successResponse(brands, "Brands retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
