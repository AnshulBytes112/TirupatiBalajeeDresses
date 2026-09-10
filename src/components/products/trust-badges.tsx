"use client";

import * as React from "react";
import { Users, Award, Tag, RefreshCcw, ShieldCheck } from "lucide-react";

export function TrustBadgesBar() {
  const BADGES = [
    {
      icon: <Users className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-brand-navy-950" strokeWidth={1.75} />,
      title: "Trusted by",
      subtitle: "Thousands of Parents",
    },
    {
      icon: <Award className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-brand-navy-950" strokeWidth={1.75} />,
      title: "High Quality",
      subtitle: "& Durable",
    },
    {
      icon: <Tag className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-brand-navy-950" strokeWidth={1.75} />,
      title: "Affordable",
      subtitle: "Prices",
    },
    {
      icon: <RefreshCcw className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-brand-navy-950" strokeWidth={1.75} />,
      title: "Easy Returns",
      subtitle: "& Exchanges",
    },
    {
      icon: <ShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-brand-navy-950" strokeWidth={1.75} />,
      title: "Secure",
      subtitle: "Payments",
    },
  ];

  return (
    <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 pb-4 border-t border-slate-200">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {BADGES.map((b, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100/80 shadow-2xs"
          >
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream-50 border border-slate-200/70">
              {b.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold text-brand-navy-950 leading-tight">
                {b.title}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-tight">
                {b.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
