"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] text-[#0F172A] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-100">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-[#0F172A]">Critical Application Error</h2>
          <p className="mt-2 text-xs text-slate-600">
            A critical system error occurred. We apologize for the inconvenience.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="default" onClick={() => reset()}>
              Reload Application
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
