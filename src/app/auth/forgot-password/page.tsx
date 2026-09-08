"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, Loader2, Shield } from "lucide-react";
import { Container } from "@/components/layout/container";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [maskedEmail, setMaskedEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Please enter your email or username");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const json = await res.json();
      if (res.ok) {
        setIsSubmitted(true);
        setMaskedEmail(json.data?.email || identifier);
        toast.success("Password reset instructions dispatched!");
      } else {
        toast.error(json.message || "Failed to process request");
      }
    } catch (e) {
      toast.error("Network error submitting request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF7F2]">
      <div className="max-w-md w-full rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-sm">
            <KeyRound className="h-7 w-7 text-amber-400" />
          </div>
          <h1 className="font-display text-2xl font-black text-[#1C1917]">
            Forgot Password?
          </h1>
          <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
            Enter your registered email address or username to receive a secure password reset link.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900 space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <div className="font-bold text-sm">Reset Link Dispatched!</div>
              <p className="text-xs text-stone-600 leading-relaxed">
                If an account matches <strong>{maskedEmail}</strong>, an email with a secure reset link valid for <strong>1 hour</strong> has been sent.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-[#1C1917]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Storefront</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">
                Email Address or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. parent@gmail.com or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <span>Send Password Reset Link</span>
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#1C1917]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
