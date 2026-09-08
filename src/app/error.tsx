"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/feedback/error-state";
import { Container } from "@/components/layout/container";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error:", error);
  }, [error]);

  return (
    <div className="py-16">
      <Container size="md">
        <ErrorState
          title="Something went wrong"
          message={error.message || "An unexpected error occurred while loading this page."}
          onRetry={reset}
        />
      </Container>
    </div>
  );
}
