"use client";

import * as React from "react";
import { Truck, Banknote, RefreshCcw, Headset, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const FOOTER_TRUST_ITEMS = [
  {
    icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Free Shipping",
    subtitle: "above ₹999",
  },
  {
    icon: <Banknote className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "COD Available",
    subtitle: "",
  },
  {
    icon: <RefreshCcw className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Easy Returns",
    subtitle: "within 7 days",
  },
  {
    icon: <Headset className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "Dedicated",
    subtitle: "Customer Support",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-brand-navy-950" strokeWidth={1.5} />,
    title: "100% Genuine",
    subtitle: "Products",
  },
];

export function TrustFooterBadges({ className }: { className?: string }) {
  return (
    <section className={cn("pt-6 sm:pt-8 pb-4", className)}>
      <Container size="xl">
        <div className="border-t border-b border-slate-200/70 py-4 sm:py-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {FOOTER_TRUST_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-1"
              >
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs font-black text-brand-navy-950 leading-tight">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 leading-tight">
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
