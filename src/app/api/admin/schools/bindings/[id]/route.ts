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
 * PUT /api/admin/schools/bindings/[id]
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const updated = await schoolService.updateBinding(params.id, body);

    await logAuditEvent({
      action: "SCHOOL_BINDING_UPDATE",
      module: "CATALOG",
      feature: "SCHOOL_UNIFORM_BINDINGS",
      details: {
        bindingId: params.id,
        updatedFields: Object.keys(body),
      },
      req,
    });

    return successResponse(updated, "School binding updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/admin/schools/bindings/[id]
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const deleted = await schoolService.deleteBinding(params.id);

    await logAuditEvent({
      action: "SCHOOL_BINDING_DELETE",
      module: "CATALOG",
      feature: "SCHOOL_UNIFORM_BINDINGS",
      details: {
        bindingId: params.id,
      },
      req,
    });

    return successResponse(deleted, "School binding deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
