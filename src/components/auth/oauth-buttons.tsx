"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";

interface OAuthButtonsProps {
  returnUrl?: string;
  disabled?: boolean;
}

export function OAuthButtons({ returnUrl = "/account", disabled = false }: OAuthButtonsProps) {
  const { signInWithOAuth } = useAuth();
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signInWithOAuth("google", returnUrl);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={disabled || isLoadingGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-400 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 6.4 10.4 6.4z"
          />
        </svg>
        <span>{isLoadingGoogle ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}
