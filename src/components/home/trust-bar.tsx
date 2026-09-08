"use client";

import * as React from "react";
import {
  User,
  ShieldCheck,
  Tag,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const TRUST_PILLARS = [
  {
    icon: <User className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Trusted by Thousands",
    subtitle: "of Parents",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "High Quality",
    subtitle: "& Durable",
  },
  {
    icon: <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Affordable",
    subtitle: "Prices",
  },
  {
    icon: <RefreshCw className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Easy Returns",
    subtitle: "& Exchanges",
  },
  {
    icon: <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Secure",
    subtitle: "Payments",
  },
];

export function TrustBar({ className }: { className?: string }) {
  return (
    <section className={cn("pt-4 sm:pt-6", className)}>
      <Container size="xl">
        <div className="rounded-2xl bg-white border border-slate-100/90 py-3 sm:py-4 px-4 sm:px-6 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 items-center">
            {TRUST_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 sm:gap-3 py-1"
              >
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
                  {pillar.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-black text-brand-navy-950 leading-tight">
                    {pillar.title}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-tight">
                    {pillar.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
