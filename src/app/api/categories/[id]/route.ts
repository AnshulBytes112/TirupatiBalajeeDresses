import { NextRequest } from "next/server";
import { categoryService } from "@/services/category.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const category = await categoryService.updateCategory(params.id, body);
    return successResponse(category, "Category updated successfully");
  } catch (error: unknown) {
    console.error(`PUT /api/categories/${params.id} error:`, error);
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await categoryService.deleteCategory(params.id);
    return successResponse({ message: "Category archived successfully" });
  } catch (error: unknown) {
    console.error(`DELETE /api/categories/${params.id} error:`, error);
    return errorResponse(error);
  }
}

