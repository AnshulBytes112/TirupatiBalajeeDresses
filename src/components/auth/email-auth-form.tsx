"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Mail, KeyRound, Loader2, ArrowRight, Sparkles, RotateCcw, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getSafeReturnUrl } from "@/lib/auth/url-validator";

interface EmailAuthFormProps {
  returnUrl?: string;
  onSuccess?: () => void;
}

export function EmailAuthForm({ returnUrl = "/account", onSuccess }: EmailAuthFormProps) {
  const router = useRouter();
  const { signInWithOtp, verifyOtp } = useAuth();

  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const [otpToken, setOtpToken] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [authMode, setAuthMode] = React.useState<"otp" | "magic_link">("otp");

  // Cooldown countdown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      const isMagicLink = authMode === "magic_link";
      const res = await signInWithOtp(cleanEmail, isMagicLink, returnUrl);
      if (res.success) {
        if (isMagicLink) {
          // Magic link sent message handled by auth provider
        } else {
          setStep("otp");
          setResendCooldown(30);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = otpToken.trim();
    if (!cleanToken || cleanToken.length < 6) {
      toast.error("Please enter the 6-digit OTP received in your email");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyOtp(email.trim().toLowerCase(), cleanToken);
      if (res.success) {
        if (onSuccess) onSuccess();
        const safeUrl = getSafeReturnUrl(returnUrl, "/account");
        router.push(safeUrl);
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsSubmitting(true);
    try {
      const res = await signInWithOtp(email.trim().toLowerCase(), false, returnUrl);
      if (res.success) {
        setResendCooldown(45);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label htmlFor="emailInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="emailInput"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-navy-900/10 focus:outline-none"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              We&apos;ll email you a one-time verification code to securely sign in.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "otp" ? "magic_link" : "otp")}
              className="text-xs font-semibold text-brand-navy-900 hover:underline cursor-pointer"
            >
              {authMode === "otp" ? "Or send a direct Magic Link instead" : "Or use 6-digit OTP code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy-950 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-navy-800 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>{authMode === "magic_link" ? "Email Me a Magic Link" : "Continue with Email Code"}</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div className="rounded-xl bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900">
            <p className="font-semibold">Code sent to: <span className="font-bold">{email}</span></p>
            <p className="text-slate-600 mt-0.5">Please check your inbox (and spam/promotions folder).</p>
          </div>

          <div>
            <label htmlFor="otpInput" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter 6-Digit OTP
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                id="otpInput"
                type="text"
                required
                autoFocus
                maxLength={8}
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value.replace(/\s+/g, ""))}
                placeholder="123456"
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-center text-lg font-mono font-black tracking-widest text-slate-900 placeholder:text-slate-300 focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-navy-900/10 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtpToken("");
              }}
              className="text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
            >
              Change Email
            </button>

            <button
              type="button"
              disabled={resendCooldown > 0 || isSubmitting}
              onClick={handleResend}
              className="font-bold text-brand-navy-900 hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
            >
              {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend Code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otpToken.trim().length < 6}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-navy-950 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-navy-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Verify & Sign In</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
