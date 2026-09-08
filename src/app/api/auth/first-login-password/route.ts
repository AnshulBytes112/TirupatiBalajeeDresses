import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, UnauthorizedError, NotFoundError } from "@/lib/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/user-onboarding";
import { logAuditEvent } from "@/lib/audit/audit-logger";

/**
 * POST /api/auth/first-login-password
 * Allows a user with mustChangePassword flag to set their permanent password on first login
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, currentPassword, newPassword, confirmPassword } = body;

    if (!identifier || !currentPassword || !newPassword) {
      throw new BadRequestError("Identifier, current temporary password, and new password are required");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("New password must be at least 6 characters long");
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      throw new BadRequestError("New password and confirm password do not match");
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.trim().toLowerCase() },
          { username: identifier.trim() },
          { phone: identifier.trim() },
        ],
      },
    });

    if (!user) {
      throw new NotFoundError("User account not found");
    }

    if (user.isSuspended) {
      await logAuditEvent({
        userId: user.id,
        userName: user.name || user.username || "User",
        userEmail: user.email || "",
        action: "SUSPENDED_USER_LOGIN_ATTEMPT",
        module: "AUTH",
        status: "DENIED",
        req,
      });
      throw new UnauthorizedError("Account is suspended. Please contact Super-Admin.");
    }

    if (user.isDeleted) {
      throw new UnauthorizedError("Account does not exist or has been deactivated.");
    }

    // Verify current temporary password
    const isCurrentValid = user.passwordHash
      ? verifyPassword(currentPassword, user.passwordHash)
      : false;

    if (!isCurrentValid) {
      await logAuditEvent({
        userId: user.id,
        userName: user.name || user.username || "User",
        userEmail: user.email || "",
        action: "PASSWORD_CHANGE_FAILED_INVALID_TEMP",
        module: "AUTH",
        status: "FAILED",
        req,
      });
      throw new BadRequestError("Current temporary password is incorrect");
    }

    // Set new permanent password
    const newPasswordHash = hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false, // Flag cleared!
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        permissions: true,
        mustChangePassword: true,
        isSuspended: true,
      },
    });

    // Record audit event
    await logAuditEvent({
      userId: updatedUser.id,
      userName: updatedUser.name || updatedUser.username || "User",
      userEmail: updatedUser.email || "",
      userRole: updatedUser.role,
      action: "FIRST_LOGIN_PASSWORD_CHANGE",
      module: "AUTH",
      feature: "PASSWORD_CHANGE",
      details: {
        message: "User successfully changed temporary password to permanent password on first login",
      },
      req,
    });

    return successResponse(
      {
        user: updatedUser,
        message: "Password changed successfully. You can now access your authorized modules.",
      },
      "Password updated successfully"
    );
  } catch (error) {
    return errorResponse(error);
  }
}
