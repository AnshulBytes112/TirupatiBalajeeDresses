import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySuperAdmin } from "@/lib/auth/admin-guard";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import {
  hashPassword,
  generateTemporaryPassword,
  sendTemporaryCredentialsEmail,
} from "@/lib/auth/user-onboarding";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/admin/users/[id]
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
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
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return successResponse(user, "User retrieved successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/admin/users/[id]
 * Updates user details & custom module permissions
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const { name, phone, role, permissions, username } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        username: username !== undefined ? username : existingUser.username,
        phone: phone !== undefined ? phone : existingUser.phone,
        role: role ? (role as Role) : existingUser.role,
        permissions: permissions !== undefined ? permissions : existingUser.permissions,
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
        isActive: true,
        isDeleted: true,
      },
    });

    await logAuditEvent({
      userId: updatedUser.id,
      userName: updatedUser.name || "User",
      userEmail: updatedUser.email || "",
      userRole: updatedUser.role,
      action: "USER_UPDATE",
      module: "USERS",
      feature: "PERMISSIONS_UPDATE",
      details: {
        updatedFields: { name, phone, role, permissionsCount: Array.isArray(permissions) ? permissions.length : 0 },
      },
      req,
    });

    return successResponse(updatedUser, "User updated successfully");
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Handles operations: "suspend", "unsuspend", "soft-delete", "restore", "reset-password"
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const body = await req.json();
    const { action, reason } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    let updateData: any = {};
    let auditAction = "";
    let responsePayload: any = {};

    switch (action) {
      case "suspend":
        updateData = {
          isSuspended: true,
          suspendedAt: new Date(),
          suspendedReason: reason || "Suspended by Super-Admin",
        };
        auditAction = "USER_SUSPEND";
        break;

      case "unsuspend":
        updateData = {
          isSuspended: false,
          suspendedAt: null,
          suspendedReason: null,
        };
        auditAction = "USER_UNSUSPEND";
        break;

      case "soft-delete":
        updateData = {
          isDeleted: true,
          deletedAt: new Date(),
          isActive: false,
        };
        auditAction = "USER_SOFT_DELETE";
        break;

      case "restore":
        updateData = {
          isDeleted: false,
          deletedAt: null,
          isActive: true,
        };
        auditAction = "USER_RESTORE";
        break;

      case "reset-password": {
        const tempPassword = generateTemporaryPassword();
        const passwordHash = hashPassword(tempPassword);
        updateData = {
          passwordHash,
          mustChangePassword: true,
        };
        auditAction = "USER_PASSWORD_RESET";

        if (existingUser.email) {
          await sendTemporaryCredentialsEmail({
            name: existingUser.name || "User",
            email: existingUser.email,
            username: existingUser.username || existingUser.email,
            tempPassword,
            role: existingUser.role,
          });
        }

        responsePayload.newTemporaryPassword = tempPassword;
        break;
      }

      default:
        throw new BadRequestError(`Invalid action: ${action}`);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isSuspended: true,
        suspendedReason: true,
        isDeleted: true,
        mustChangePassword: true,
      },
    });

    await logAuditEvent({
      userId: updatedUser.id,
      userName: updatedUser.name || "User",
      userEmail: updatedUser.email || "",
      userRole: updatedUser.role,
      action: auditAction,
      module: "USERS",
      feature: "ACCOUNT_STATUS",
      details: { action, reason, targetUserId: updatedUser.id },
      req,
    });

    return successResponse(
      { user: updatedUser, ...responsePayload },
      `User ${action} completed successfully`
    );
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Soft-deletes user
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    if (!verifySuperAdmin(req)) {
      throw new UnauthorizedError("Super-Admin authorization required");
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
      },
      select: { id: true, name: true, email: true, isDeleted: true },
    });

    await logAuditEvent({
      userId: user.id,
      userName: user.name || "User",
      userEmail: user.email || "",
      action: "USER_SOFT_DELETE",
      module: "USERS",
      feature: "SOFT_DELETE",
      details: { targetUserId: user.id },
      req,
    });

    return successResponse(user, "User soft-deleted successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
