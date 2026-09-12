import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, UnauthorizedError } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import {
  hashPassword,
  generateTemporaryUsername,
  generateTemporaryPassword,
  sendTemporaryCredentialsEmail,
} from "@/lib/auth/user-onboarding";
import { getRoleDefaultPermissions } from "@/lib/auth/rbac-permissions";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/users
 * Returns list of users with search, role filter, status filter, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      await logAuditEvent({
        action: "UNAUTHORIZED_ACCESS_ATTEMPT",
        module: "USERS",
        feature: "USER_LIST",
        status: "DENIED",
        req,
      });
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const role = searchParams.get("role")?.trim();
    const status = searchParams.get("status")?.trim(); // "active", "suspended", "deleted", "all"
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const andConditions: any[] = [
      // Only show accounts created by Super-Admin (staff/admin/created accounts), never regular customer review/storefront accounts
      {
        OR: [
          { createdBy: "SUPER_ADMIN" },
          { createdBy: { not: null } },
          { role: { in: [Role.SUPER_ADMIN, Role.ADMIN, Role.STORE_STAFF] } },
        ],
      },
    ];

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { username: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
        ],
      });
    }

    if (role && role !== "ALL") {
      andConditions.push({ role: role as Role });
    }

    if (status === "suspended") {
      andConditions.push({ isSuspended: true, isDeleted: false });
    } else if (status === "deleted") {
      andConditions.push({ isDeleted: true });
    } else if (status === "active") {
      andConditions.push({ isActive: true, isSuspended: false, isDeleted: false });
    } else if (status !== "all") {
      andConditions.push({ isDeleted: false });
    } else {
      andConditions.push({ isDeleted: false });
    }

    const where = { AND: andConditions };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
          phone: true,
          role: true,
          permissions: true,
          mustChangePassword: true,
          isSuspended: true,
          suspendedAt: true,
          suspendedReason: true,
          isActive: true,
          isDeleted: true,
          deletedAt: true,
          lastLoginAt: true,
          createdBy: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Record visit audit log
    await logAuditEvent({
      action: "PAGE_VISIT",
      module: "USERS",
      feature: "USER_LIST",
      details: { total, search, role, status, page },
      req,
    });

    return successResponse(
      {
        users,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      "Users retrieved successfully"
    );
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/admin/users
 * Creates a new user with auto-generated temporary username, password, custom RBAC permissions, and email dispatch
 */
export async function POST(req: NextRequest) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required to create users");
    }

    const body = await req.json();
    const { name, email, phone, role, customUsername, customPassword, permissions } = body;

    if (!email) {
      throw new BadRequestError("User email is required");
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(customUsername ? [{ username: customUsername }] : [])],
      },
    });

    if (existingUser) {
      throw new BadRequestError("A user with this email or username already exists");
    }

    const assignedRole = (role as Role) || Role.STORE_STAFF;
    const finalUsername =
      customUsername?.trim() || generateTemporaryUsername(name, assignedRole);
    const tempPassword = customPassword?.trim() || generateTemporaryPassword();
    const passwordHash = hashPassword(tempPassword);

    const finalPermissions =
      Array.isArray(permissions) && permissions.length > 0
        ? permissions
        : getRoleDefaultPermissions(assignedRole);

    const newUser = await prisma.user.create({
      data: {
        name: name?.trim() || null,
        username: finalUsername,
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        role: assignedRole,
        permissions: finalPermissions,
        passwordHash,
        mustChangePassword: true, // Forces password change on first login
        isSuspended: false,
        isActive: true,
        createdBy: "SUPER_ADMIN",
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        permissions: true,
        mustChangePassword: true,
        isSuspended: true,
        createdAt: true,
      },
    });

    // Dispatch email notification simulation
    const emailDispatch = await sendTemporaryCredentialsEmail({
      name: newUser.name || "Staff Member",
      email: newUser.email || email,
      username: finalUsername,
      tempPassword,
      role: newUser.role,
    });

    // Record audit log
    await logAuditEvent({
      userId: newUser.id,
      userName: newUser.name || newUser.username || "Staff User",
      userEmail: newUser.email || "",
      userRole: newUser.role,
      action: "USER_CREATE",
      module: "USERS",
      feature: "USER_ONBOARDING",
      details: {
        createdUserId: newUser.id,
        username: finalUsername,
        role: newUser.role,
        permissionsCount: finalPermissions.length,
        mustChangePassword: true,
        emailDispatchedTo: email,
      },
      req,
    });

    return successResponse(
      {
        user: newUser,
        temporaryCredentials: {
          username: finalUsername,
          password: tempPassword,
          mustChangePassword: true,
          emailDispatchStatus: emailDispatch.status,
        },
      },
      "User created successfully with temporary credentials",
      undefined,
      201
    );
  } catch (error) {
    return errorResponse(error);
  }
}
