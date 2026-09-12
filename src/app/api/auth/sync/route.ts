import { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/server-auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { UnauthorizedError } from "@/lib/errors";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/sync
 * Synchronizes the verified Supabase session user into Prisma and returns the customer profile.
 */
export async function POST(_req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      throw new UnauthorizedError("Session expired or unauthenticated");
    }

    return successResponse(user, "User profile synchronized successfully");
  } catch (error) {
    return errorResponse(error);
  }
}
