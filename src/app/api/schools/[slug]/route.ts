import { NextRequest } from "next/server";
import { schoolService } from "@/services/school.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const school = await schoolService.getSchoolBySlug(params.slug);
    return successResponse(school, "School details and uniforms retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
