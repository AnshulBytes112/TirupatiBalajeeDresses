"use client";

import * as React from "react";
import { toast } from "sonner";
import { Lock, Key, ShieldCheck, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface FirstLoginModalProps {
  isOpen: boolean;
  userIdentifier: string;
  currentTempPassword?: string;
  onSuccess: (updatedUser: any) => void;
  onClose?: () => void;
}

export function FirstLoginModal({
  isOpen,
  userIdentifier,
  currentTempPassword = "",
  onSuccess,
  onClose,
}: FirstLoginModalProps) {
  const [currentPassword, setCurrentPassword] = React.useState(currentTempPassword);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (currentTempPassword) {
      setCurrentPassword(currentTempPassword);
    }
  }, [currentTempPassword]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from your temporary password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/first-login-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: userIdentifier,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully! You are now logged in.");
        onSuccess(json.data?.user);
      } else {
        toast.error(json.message || "Failed to update password");
      }
    } catch (e) {
      toast.error("Network error updating password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-300">
            <Key className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-[#1C1917]">
              First Login: Set New Password
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              You must replace your temporary password before proceeding.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            For account security, your temporary credentials expired upon initial access. Please choose a strong, permanent password.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">User Identifier</label>
            <input
              type="text"
              disabled
              value={userIdentifier}
              className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs font-mono font-bold text-stone-600"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Current Temporary Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter temporary password provided by Super-Admin"
              className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">New Password (Min 6 chars)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Choose new permanent password"
              className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new permanent password"
              className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#1C1917] py-3 text-xs font-black text-white hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                <span>Activate Account & Continue</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
