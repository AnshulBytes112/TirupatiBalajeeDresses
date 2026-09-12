import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user.repository";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import { User, Role } from "@prisma/client";

/**
 * Derives the authenticated application user from verified Supabase session cookies.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<User | null> {
  try {
    const supabase = createClient();
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return null;
    }

    // Idempotently sync or find the Prisma application user profile
    const appUser = await userRepository.findOrCreateFromSupabaseAuth({
      id: supabaseUser.id,
      email: supabaseUser.email,
      user_metadata: supabaseUser.user_metadata,
      phone: supabaseUser.phone,
    });

    if (appUser.isSuspended || !appUser.isActive || appUser.isDeleted) {
      return null;
    }

    return appUser;
  } catch (err) {
    console.error("Error obtaining authenticated user:", err);
    return null;
  }
}

/**
 * Strict server guard that requires a valid authenticated customer session.
 * Throws UnauthorizedError if unauthenticated or suspended.
 */
export async function requireCustomer(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new UnauthorizedError("Please log in to access your customer account.");
  }
  return user;
}

/**
 * Strict server guard for Super-Admin actions requiring SUPER_ADMIN role.
 */
export async function requireSuperAdmin(): Promise<User> {
  const user = await requireCustomer();
  if (user.role !== Role.SUPER_ADMIN) {
    throw new ForbiddenError("Administrative privileges required.");
  }
  return user;
}
