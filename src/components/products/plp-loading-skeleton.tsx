"use client";

import * as React from "react";
import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";

export function PLPLoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="relative min-h-[400px]">
      {/* Animated Dress Centerpiece Buffer */}
      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-3xl">
        <DressLoadingBuffer size="md" message="Updating dresses catalog..." />
      </div>

      {/* Grid Skeleton Background */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4 opacity-40">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-100 bg-white p-2.5 sm:p-4 animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="aspect-[4/4.3] w-full rounded-xl sm:rounded-2xl bg-slate-200/70" />

            {/* Text Placeholders */}
            <div className="mt-3 space-y-2">
              <div className="h-3 w-1/3 rounded-md bg-slate-200" />
              <div className="h-4 w-4/5 rounded-md bg-slate-200" />
              <div className="h-3 w-1/2 rounded-md bg-slate-200" />

              <div className="flex items-center gap-2 pt-1">
                <div className="h-5 w-16 rounded-md bg-slate-200" />
                <div className="h-4 w-12 rounded-md bg-slate-200" />
              </div>

              <div className="h-8 w-full rounded-xl bg-slate-200/80 mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
