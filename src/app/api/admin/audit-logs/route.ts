import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";

/**
 * GET /api/admin/audit-logs
 * Returns paginated audit logs with search, user filter, module filter, and action filter
 */
export async function GET(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const moduleFilter = searchParams.get("module")?.trim();
    const actionFilter = searchParams.get("action")?.trim();
    const userId = searchParams.get("userId")?.trim();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const where: any = {};

    if (search) {
      where.OR = [
        { userName: { contains: search, mode: "insensitive" } },
        { userEmail: { contains: search, mode: "insensitive" } },
        { action: { contains: search, mode: "insensitive" } },
        { module: { contains: search, mode: "insensitive" } },
        { ipAddress: { contains: search } },
      ];
    }

    if (moduleFilter && moduleFilter !== "ALL") {
      where.module = moduleFilter;
    }

    if (actionFilter && actionFilter !== "ALL") {
      where.action = actionFilter;
    }

    if (userId) {
      where.userId = userId;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return successResponse(
      {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Audit logs retrieved successfully"
    );
  } catch (error) {
    return errorResponse(error);
  }
}
