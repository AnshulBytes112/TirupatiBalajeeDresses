"use client";

import * as React from "react";
import { AccountLayout } from "@/components/account/account-layout";
import {
  HelpCircle,
  PhoneCall,
  Mail,
  Clock,
  ShieldCheck,
  ChevronDown,
  MessageCircle,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I determine the right school uniform size for my child?",
    a: "We provide comprehensive age and chest/waist measurement charts on each product page. If you are unsure between two sizes, we generally recommend choosing one size larger to accommodate growth during the academic school year.",
  },
  {
    q: "Are the uniforms aligned with our school's official dress code?",
    a: "Yes! All school-specific uniforms (CBSE, ICSE, DAV, DPS, Ryan, KV, etc.) strictly adhere to the official patterns, house colors, embroidery, and fabric specifications approved by the respective school administrations.",
  },
  {
    q: "What is the standard dispatch and delivery duration?",
    a: "Orders are dispatched within 24 hours. Delivery takes 1-2 business days for local/regional cities and 3-5 business days for pan-India deliveries.",
  },
  {
    q: "What is your return and size exchange policy?",
    a: "We offer hassle-free size exchanges within 7 days of delivery provided the item is unwashed, unworn, and has original tags intact.",
  },
];

export default function AccountSupportPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <AccountLayout
      title="Help & Support"
      description="Get in touch with our customer assistance team or read frequently asked uniform questions."
    >
      <div className="space-y-6">
        {/* Support Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">WhatsApp Assistance</h3>
                  <p className="text-xs text-slate-500">Quick sizing and order queries</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                Chat directly with our school uniform consultants for real-time sizing advice, bulk order quotes, or delivery tracking.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="https://wa.me/919876543210?text=Hi%20TirupatiBalajee%20Dresses%2C%20I%20need%20assistance%20with%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-brand-navy-950">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Phone Support</h3>
                  <p className="text-xs text-slate-500">Mon - Sat (9:00 AM - 7:00 PM)</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600">
                Speak with our central customer support desk for order revisions, urgent deliveries, or custom school bindings.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-brand-navy-950 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>Call Helpline (+91-9876543210)</span>
              </a>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <HelpCircle className="h-4 w-4 text-brand-navy-900" />
            <h3 className="text-sm font-black text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-brand-navy-900 transition cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
                        isOpen ? "rotate-180 text-brand-navy-900" : ""
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
