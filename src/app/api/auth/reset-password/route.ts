import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@/lib/errors";
import { hashPassword } from "@/lib/auth/user-onboarding";
import { emailService } from "@/lib/email/email-service";
import { logAuditEvent } from "@/lib/audit/audit-logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset-password
 * Verifies 1-hour reset token and sets new permanent password
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, email, newPassword, confirmPassword } = body;

    if (!token || !newPassword) {
      throw new BadRequestError("Reset token and new password are required");
    }

    if (newPassword.length < 6) {
      throw new BadRequestError("Password must be at least 6 characters long");
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        ...(email ? { email: email.trim().toLowerCase() } : {}),
        isDeleted: false,
      },
    });

    if (!user) {
      throw new BadRequestError("Invalid or expired password reset link");
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestError("Password reset link has expired. Please request a new one.");
    }

    if (user.isSuspended) {
      throw new UnauthorizedError("Account is suspended. Please contact Super-Admin.");
    }

    const passwordHash = hashPassword(newPassword);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        mustChangePassword: false,
        lastLoginAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
      },
    });

    // Send confirmation security notification
    if (user.email) {
      await emailService.sendSecurityAlert({
        name: user.name || "User",
        email: user.email,
        title: "Your Account Password Was Changed",
        message: "Your TirupatiBalajee Dresses account password was successfully reset. If this was not you, please contact administration immediately.",
      });
    }

    await logAuditEvent({
      userId: updatedUser.id,
      userName: updatedUser.name || updatedUser.username || "User",
      userEmail: updatedUser.email || "",
      userRole: updatedUser.role,
      action: "PASSWORD_RESET_COMPLETED",
      module: "AUTH",
      feature: "FORGOT_PASSWORD",
      details: {
        message: "Password reset completed via token verification",
      },
      req,
    });

    return successResponse(
      {
        user: updatedUser,
        message: "Password reset completed successfully. You can now login with your new password.",
      },
      "Password reset successfully"
    );
  } catch (error) {
    return errorResponse(error);
  }
}
