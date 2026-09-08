import { NextRequest } from "next/server";
import { schoolService } from "@/services/school.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const schools = await schoolService.getSchools();
    return successResponse(schools, "Schools retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
