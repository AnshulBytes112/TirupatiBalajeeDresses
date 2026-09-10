"use client";

import * as React from "react";
import Link from "next/link";
import { Search, GraduationCap, ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { cn } from "@/lib/utils";

import { usePreviewDevice } from "@/context/preview-device-context";

export interface SchoolItem {
  id: string;
  name: string;
  slug: string;
  board?: string | null;
  city: string;
  state: string;
  logoUrl?: string | null;
}

interface SchoolSelectorSectionProps {
  schools?: SchoolItem[];
  className?: string;
}

const DEFAULT_SCHOOLS: SchoolItem[] = [
  {
    id: "1",
    name: "Delhi Public School (DPS)",
    slug: "delhi-public-school",
    board: "CBSE",
    city: "New Delhi",
    state: "Delhi NCR",
  },
  {
    id: "2",
    name: "Kendriya Vidyalaya (KV)",
    slug: "kendriya-vidyalaya",
    board: "CBSE",
    city: "National",
    state: "All India",
  },
  {
    id: "3",
    name: "Ryan International School",
    slug: "ryan-international",
    board: "ICSE / CBSE",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    id: "4",
    name: "DAV Public School",
    slug: "dav-public-school",
    board: "CBSE",
    city: "National",
    state: "All India",
  },
  {
    id: "5",
    name: "Army Public School (APS)",
    slug: "army-public-school",
    board: "CBSE",
    city: "New Delhi",
    state: "Delhi NCR",
  },
  {
    id: "6",
    name: "St. Xavier's High School",
    slug: "st-xaviers-school",
    board: "ICSE",
    city: "Kolkata",
    state: "West Bengal",
  },
];

export function SchoolSelectorSection({
  schools = DEFAULT_SCHOOLS,
  className,
}: SchoolSelectorSectionProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const previewDevice = usePreviewDevice();

  const displaySchools = schools.length > 0 ? schools : DEFAULT_SCHOOLS;

  const filtered = displaySchools.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.board && s.board.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const gridClass =
    previewDevice === "mobile"
      ? "grid-cols-1 gap-3"
      : previewDevice === "tablet"
      ? "grid-cols-1 sm:grid-cols-2 gap-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4";

  return (
    <section className={cn("pt-6 sm:pt-10", className)}>
      <Container size="xl">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-brand-navy-950 to-slate-900 text-white p-6 sm:p-10 shadow-card relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-yellow-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />

          {/* Header & Search */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-yellow-400 mb-2">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Prescribed Uniforms</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                SHOP BY SCHOOL
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1 max-w-md">
                Select your school to view the official summer, winter, and sports uniform sets.
              </p>
            </div>

            {/* School Search Input */}
            <div className="w-full md:w-80 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search school name or city..."
                className="w-full rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2.5 pl-10 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-brand-yellow-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-brand-yellow-400/30"
              />
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Schools Grid */}
          <div className={cn("relative z-10 grid pt-6", gridClass)}>
            {filtered.slice(0, 6).map((school) => (
              <Link
                key={school.id}
                href={`/schools/${school.slug}`}
                className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow-400/50 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-brand-yellow-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-brand-navy-950">
                      {school.board || "CBSE"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {school.city}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-yellow-400 transition-colors">
                    {school.name}
                  </h3>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white group-hover:bg-brand-yellow-400 group-hover:text-brand-navy-950 transition-all shrink-0 ml-2">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          {/* View All Schools CTA */}
          <div className="relative z-10 flex justify-center pt-6">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow-400 px-6 py-2.5 text-xs font-black uppercase text-brand-navy-950 hover:bg-brand-yellow-300 transition-all shadow-button"
            >
              <span>Explore All Schools Across India</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
