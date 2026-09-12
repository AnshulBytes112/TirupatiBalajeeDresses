import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
  submessage?: string;
}

export function LoadingSpinner({ size = "md", className, label, submessage }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <DressLoadingBuffer size={size} message={label} submessage={submessage} />
    </div>
  );
}
