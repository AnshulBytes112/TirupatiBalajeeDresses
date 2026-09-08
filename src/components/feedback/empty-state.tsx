import * as React from "react";
import { LucideIcon, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-cream-200 text-brand-navy-800">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-navy-950">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
      {actionLabel && (
        <div className="mt-6">
          {actionHref ? (
            <a href={actionHref}>
              <Button variant="yellow">{actionLabel}</Button>
            </a>
          ) : (
            <Button variant="yellow" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
