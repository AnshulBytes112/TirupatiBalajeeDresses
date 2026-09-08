import { NextRequest } from "next/server";
import { categoryService } from "@/services/category.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const category = await categoryService.getCategoryBySlug(slug);
      return successResponse(category, "Category details retrieved successfully");
    }

    const categories = await categoryService.getCategories();
    return successResponse(categories, "Categories retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
