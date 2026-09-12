import { NextRequest } from "next/server";
import { schoolService } from "@/services/school.service";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/schools
 * Fetch all schools for admin management
 */
export async function GET(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const board = searchParams.get("board") || undefined;
    const city = searchParams.get("city") || undefined;
    const state = searchParams.get("state") || undefined;
    const includeInactive = searchParams.get("includeInactive") === "true";

    const schools = await schoolService.getAdminSchools({
      search,
      board,
      city,
      state,
      includeInactive,
    });

    return successResponse(schools, "Schools retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/admin/schools
 * Create a new affiliated school
 */
export async function POST(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const newSchool = await schoolService.createSchool(body);

    await logAuditEvent({
      action: "SCHOOL_CREATE",
      module: "CATALOG",
      feature: "SCHOOLS",
      details: {
        schoolId: newSchool.id,
        name: newSchool.name,
        slug: newSchool.slug,
        city: newSchool.city,
        state: newSchool.state,
      },
      req,
    });

    return successResponse(newSchool, "School created successfully", undefined, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
