"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { getSafeReturnUrl } from "@/lib/auth/url-validator";

export interface CustomerProfile {
  id: string;
  supabaseUserId?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "SUPER_ADMIN" | "ADMIN" | "STAFF";
  isActive: boolean;
  isSuspended: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  signInWithOtp: (email: string, isMagicLink?: boolean, returnUrl?: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: "google", returnUrl?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = React.useState(() => createClient());
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchProfile = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/profile");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setProfile(json.data);
          return;
        }
      }
      setProfile(null);
    } catch {
      setProfile(null);
    }
  }, []);

  // Initialize and listen to Supabase auth state changes
  React.useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile();
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (e) {
        console.error("Auth init error:", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Sync with database profile
          try {
            await fetch("/api/auth/sync", { method: "POST" });
          } catch {}
          await fetchProfile();
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  /**
   * Request Email OTP or Magic Link
   */
  const signInWithOtp = async (email: string, isMagicLink = false, returnUrl = "/account") => {
    try {
      const safeReturn = getSafeReturnUrl(returnUrl, "/account");
      const redirectUrl = `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(safeReturn)}`;

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: isMagicLink ? redirectUrl : undefined,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to send verification code");
        return { success: false, error: error.message };
      }

      toast.success(
        isMagicLink
          ? "Magic Link sent! Please check your email inbox."
          : "6-digit OTP code sent to your email!"
      );
      return { success: true };
    } catch (e: any) {
      const message = e.message || "An unexpected error occurred";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Verify 6-digit Email OTP
   */
  const verifyOtp = async (email: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: "email",
      });

      if (error || !data.session) {
        const errorMsg = error?.message || "Invalid or expired OTP code";
        toast.error(errorMsg);
        return { success: false, error: errorMsg };
      }

      setSession(data.session);
      setUser(data.user);

      // Sync user profile to Prisma
      try {
        await fetch("/api/auth/sync", { method: "POST" });
      } catch {}
      await fetchProfile();

      toast.success("Welcome! You are now securely logged in.");
      return { success: true };
    } catch (e: any) {
      const message = e.message || "OTP verification failed";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  /**
   * Sign In with Google OAuth
   */
  const signInWithOAuth = async (provider: "google", returnUrl = "/account") => {
    try {
      const safeReturn = getSafeReturnUrl(returnUrl, "/account");
      const redirectUrl = `${window.location.origin}/auth/callback?returnUrl=${encodeURIComponent(safeReturn)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        toast.error(error.message || "Failed to initialize Google login");
      }
    } catch (e: any) {
      toast.error(e.message || "Google login failed");
    }
  };

  /**
   * Sign Out securely
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.removeItem("tirupati_admin_key");
      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (e: any) {
      toast.error(e.message || "Error signing out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithOtp,
        verifyOtp,
        signInWithOAuth,
        signOut,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
