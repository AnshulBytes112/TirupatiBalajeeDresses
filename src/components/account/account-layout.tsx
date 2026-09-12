"use client";

import * as React from "react";
import { Container } from "@/components/layout/container";
import { AccountSidebar } from "./account-sidebar";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface AccountLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AccountLayout({ children, title, description }: AccountLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?returnUrl=/account");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-navy-950" />
          <p className="text-xs font-bold text-slate-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-6 sm:py-10">
      <Container size="xl">
        {title && (
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <AccountSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </Container>
    </div>
  );
}
