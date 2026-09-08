import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export interface LogAuditParams {
  userId?: string | null;
  userName?: string | null;
  userEmail?: string | null;
  userRole?: string | null;
  action: string;
  module: string;
  feature?: string | null;
  details?: Record<string, any> | null;
  status?: "SUCCESS" | "DENIED" | "FAILED";
  req?: NextRequest | Request | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export async function logAuditEvent(params: LogAuditParams) {
  try {
    let ip = params.ipAddress;
    let userAgent = params.userAgent;

    if (params.req) {
      const headers = params.req.headers;
      ip =
        ip ||
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headers.get("x-real-ip") ||
        "127.0.0.1";
      userAgent = userAgent || headers.get("user-agent") || "Unknown Client";
    }

    const entry = await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || "Super-Admin / System",
        userEmail: params.userEmail || "admin@tirupatibalajidresses.com",
        userRole: params.userRole || "SUPER_ADMIN",
        action: params.action,
        module: params.module,
        feature: params.feature || null,
        details: params.details ? (params.details as Prisma.InputJsonValue) : Prisma.JsonNull,
        status: params.status || "SUCCESS",
        ipAddress: ip || "127.0.0.1",
        userAgent: userAgent || "Browser / API",
        timestamp: new Date(),
      },
    });

    return entry;
  } catch (error) {
    // Non-blocking: ensure audit log failures do not break critical operations
    console.error("Failed to write audit log entry:", error);
    return null;
  }
}
