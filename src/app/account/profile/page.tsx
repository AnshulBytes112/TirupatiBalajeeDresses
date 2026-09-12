"use client";

import * as React from "react";
import { AccountLayout } from "@/components/account/account-layout";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { User, Mail, Phone, ShieldCheck, Loader2, Save, CheckCircle2 } from "lucide-react";

export default function AccountProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (phone.trim() && !/^[6-9]\d{9}$/.test(phone.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update profile");
      }

      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AccountLayout
      title="My Profile"
      description="View and update your personal information and contact details."
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
            {/* Verified Email Field (Read Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Verified Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={profile?.email || ""}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
                <span>Managed securely by Supabase Auth</span>
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="profileName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="profileName"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-navy-900/10 focus:outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="profilePhone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="profilePhone"
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="9876543210"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 focus:border-brand-navy-900 focus:ring-2 focus:ring-brand-navy-900/10 focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Used for delivery updates, tracking notifications, and WhatsApp support.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-navy-950 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-navy-800 disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-amber-400" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Metadata Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h3 className="text-sm font-black text-slate-900 pb-3 border-b border-slate-100">
            Account Security & Status
          </h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Account Type:</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {profile?.role === "SUPER_ADMIN" ? "Super Administrator" : "Customer Account"}
              </p>
            </div>
            <div>
              <span className="text-slate-500">Member Since:</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Active"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
