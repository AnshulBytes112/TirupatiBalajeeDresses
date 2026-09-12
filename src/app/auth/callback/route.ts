import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user.repository";
import { getSafeReturnUrl } from "@/lib/auth/url-validator";

export const dynamic = "force-dynamic";

/**
 * GET /auth/callback
 * Handles OAuth & email verification callbacks, exchanges auth codes for session tokens,
 * provisions the application profile idempotently, and redirects to a safe return URL.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawReturnUrl = searchParams.get("returnUrl") || searchParams.get("next");
  const safeReturnUrl = getSafeReturnUrl(rawReturnUrl, "/account");

  if (code) {
    const supabase = createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Idempotently create or retrieve the Prisma user profile
      try {
        await userRepository.findOrCreateFromSupabaseAuth({
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
          phone: data.user.phone,
        });
      } catch (err) {
        console.error("Error creating profile during auth callback:", err);
      }

      return NextResponse.redirect(`${origin}${safeReturnUrl}`);
    }
  }

  // If error or no code, redirect to login with error parameter
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
