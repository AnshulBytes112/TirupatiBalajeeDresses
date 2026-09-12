"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { EmailAuthForm } from "@/components/auth/email-auth-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import { getSafeReturnUrl } from "@/lib/auth/url-validator";

function LoginContent() {
  const searchParams = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl = getSafeReturnUrl(rawReturnUrl, "/account");

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-10 sm:py-16">
      <Container size="sm">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-navy-950 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl">
          <div className="text-center pb-6">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-950 text-amber-400 shadow-md">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy-950 tracking-tight">
              Login or Create Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
              Enter your email to receive a secure OTP verification code.
            </p>
          </div>

          <div className="space-y-4">
            <OAuthButtons returnUrl={returnUrl} />

            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-slate-200" />
              <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Or continue with email
              </span>
            </div>

            <EmailAuthForm returnUrl={returnUrl} />
          </div>

          <div className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">
            <p>100% Secure Authentication via Supabase</p>
            <p className="mt-0.5">TirupatiBalajee Dresses &copy; 2026</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-navy-950" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
