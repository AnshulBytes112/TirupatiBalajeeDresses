import { NextRequest } from "next/server";
import { schoolService } from "@/services/school.service";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/admin/schools/[id]
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const school = await schoolService.getSchoolById(params.id);
    return successResponse(school, "School details retrieved");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/admin/schools/[id]
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const updated = await schoolService.updateSchool(params.id, body);

    await logAuditEvent({
      action: "SCHOOL_UPDATE",
      module: "CATALOG",
      feature: "SCHOOLS",
      details: {
        schoolId: params.id,
        updatedFields: Object.keys(body),
      },
      req,
    });

    return successResponse(updated, "School updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/admin/schools/[id]
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const deleted = await schoolService.deleteSchool(params.id);

    await logAuditEvent({
      action: "SCHOOL_DELETE",
      module: "CATALOG",
      feature: "SCHOOLS",
      details: {
        schoolId: params.id,
      },
      req,
    });

    return successResponse(deleted, "School deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
