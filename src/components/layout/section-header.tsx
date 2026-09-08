import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  align?: "left" | "center" | "between";
}

export function SectionHeader({
  title,
  subtitle,
  badge,
  viewAllHref,
  viewAllLabel = "View All",
  className,
  align = "between",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4",
        align === "center" && "text-center sm:items-center sm:justify-center",
        className
      )}
    >
      <div>
        {badge && (
          <span className="mb-1.5 inline-block rounded-full bg-brand-yellow-200 px-3 py-0.5 text-xs font-bold text-brand-navy-900">
            {badge}
          </span>
        )}
        <h2 className="text-2xl font-extrabold tracking-tight text-brand-navy-950 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center text-sm font-bold text-brand-navy-900 hover:text-brand-yellow-600 transition-colors self-start sm:self-auto"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
