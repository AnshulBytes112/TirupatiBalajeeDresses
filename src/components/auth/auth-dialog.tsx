"use client";

import * as React from "react";
import { X, ShieldCheck, Sparkles } from "lucide-react";
import { EmailAuthForm } from "./email-auth-form";
import { OAuthButtons } from "./oauth-buttons";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl?: string;
  title?: string;
  subtitle?: string;
}

export function AuthDialog({
  isOpen,
  onClose,
  returnUrl = "/account",
  title = "Login or Create Account",
  subtitle = "Access your school dress orders, addresses, and wishlist instantly.",
}: AuthDialogProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-navy-950 text-amber-400 shadow-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* OAuth Section */}
        <div className="space-y-4">
          <OAuthButtons returnUrl={returnUrl} />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="bg-white px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Or with email
            </span>
          </div>

          {/* Email OTP / Magic Link Form */}
          <EmailAuthForm returnUrl={returnUrl} onSuccess={onClose} />
        </div>

        {/* Footer Note */}
        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">
          By continuing, you agree to TirupatiBalajee Dresses Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  );
}
