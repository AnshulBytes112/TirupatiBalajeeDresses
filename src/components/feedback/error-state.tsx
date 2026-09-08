import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  resetError?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected issue while loading this content. Please try again.",
  onRetry,
  resetError,
}: ErrorStateProps) {
  const handleAction = onRetry || resetError;

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-navy-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-600">{message}</p>
      {handleAction && (
        <div className="mt-6">
          <Button
            variant="default"
            onClick={handleAction}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
