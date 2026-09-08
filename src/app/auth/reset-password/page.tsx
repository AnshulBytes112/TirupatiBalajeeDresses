"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link: Missing token");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        toast.error(json.message || "Failed to reset password");
      }
    } catch (e) {
      toast.error("Network error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="max-w-md w-full rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-sm">
            <ShieldCheck className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="font-display text-2xl font-black text-[#1C1917]">
            Set New Password
          </h1>
          <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
            Choose a secure permanent password for your TirupatiBalajee account.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Password Reset Complete!</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Your account password has been updated. A security alert email was sent for confirmation.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1C1917] py-3 text-xs font-black text-white hover:bg-stone-800 transition-colors shadow-sm"
              >
                <span>Continue to Website</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ) : !token ? (
          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 text-rose-900 text-center space-y-3">
            <AlertTriangle className="h-6 w-6 text-rose-600 mx-auto" />
            <div className="font-bold text-xs">Invalid Password Reset Link</div>
            <p className="text-[11px] text-stone-600">
              The reset token is missing or invalid. Please request a new password reset link.
            </p>
            <Link
              href="/auth/forgot-password"
              className="inline-block text-xs font-bold text-blue-700 underline"
            >
              Request New Reset Link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">New Password (Min 6 chars)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#1C1917] py-3 text-xs font-black text-white hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Confirm & Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-xs text-stone-500">Loading reset form...</div>}>
      <ResetPasswordForm />
    </React.Suspense>
  );
}
