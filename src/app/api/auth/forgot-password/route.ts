import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { BadRequestError, NotFoundError } from "@/lib/errors";
import { emailService } from "@/lib/email/email-service";
import { logAuditEvent } from "@/lib/audit/audit-logger";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/forgot-password
 * Generates secure 1-hour password reset token and dispatches reset email
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier } = body;

    if (!identifier) {
      throw new BadRequestError("Email or username is required");
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanIdentifier },
          { username: cleanIdentifier },
        ],
        isDeleted: false,
      },
    });

    if (!user || !user.email) {
      // For security, do not expose whether email exists or not
      return successResponse(
        { message: "If an account exists with this email/username, password reset instructions have been dispatched." },
        "Password reset instructions sent"
      );
    }

    if (user.isSuspended) {
      await logAuditEvent({
        userId: user.id,
        userName: user.name || user.username || "User",
        userEmail: user.email,
        action: "SUSPENDED_USER_RESET_ATTEMPT",
        module: "AUTH",
        status: "DENIED",
        req,
      });
      return successResponse(
        { message: "If an account exists with this email/username, password reset instructions have been dispatched." },
        "Password reset instructions sent"
      );
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600 * 1000); // 1 hour validity

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    // Dispatch email notification
    await emailService.sendPasswordReset({
      name: user.name || "User",
      email: user.email,
      resetToken,
    });

    await logAuditEvent({
      userId: user.id,
      userName: user.name || user.username || "User",
      userEmail: user.email,
      userRole: user.role,
      action: "PASSWORD_RESET_REQUESTED",
      module: "AUTH",
      feature: "FORGOT_PASSWORD",
      details: {
        recipientEmail: user.email,
        tokenExpiry: resetExpires.toISOString(),
      },
      req,
    });

    return successResponse(
      {
        message: `Password reset link has been dispatched to your email. Please check your inbox.`,
        email: user.email.replace(/(.{2})(.*)(?=@)/, "$1***"),
      },
      "Password reset email dispatched"
    );
  } catch (error) {
    return errorResponse(error);
  }
}
