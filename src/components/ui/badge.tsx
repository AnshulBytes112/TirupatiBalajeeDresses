import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-brand-navy text-white",
        yellow:
          "bg-brand-yellow-400 text-brand-navy-950",
        discount:
          "bg-emerald-600 text-white font-bold tracking-tight",
        bestseller:
          "bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 shadow-sm",
        school:
          "bg-slate-100 text-brand-navy-800 border border-slate-200 font-medium",
        pastelBlue:
          "bg-brand-pastel-blue text-brand-pastel-blue-text font-semibold border border-brand-pastel-blue-border",
        pastelPink:
          "bg-brand-pastel-pink text-brand-pastel-pink-text font-semibold border border-brand-pastel-pink-border",
        pastelGreen:
          "bg-brand-pastel-green text-brand-pastel-green-text font-semibold border border-brand-pastel-green-border",
        outline:
          "border border-slate-300 text-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
