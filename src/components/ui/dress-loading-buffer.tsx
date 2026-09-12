"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export interface DressLoadingBufferProps {
  size?: "sm" | "md" | "lg" | "fullscreen";
  message?: string;
  submessage?: string;
  className?: string;
  showTips?: boolean;
}

const DEFAULT_MESSAGES = [
  "Stitching your school uniforms to perfection...",
  "Ironing out the pleats for a crisp look...",
  "Finding the certified perfect fit...",
  "Preparing classroom-ready dresses...",
  "Matching school colors & badges...",
];

export function DressLoadingBuffer({
  size = "md",
  message,
  submessage,
  className,
  showTips = true,
}: DressLoadingBufferProps) {
  const [activeMessageIndex, setActiveMessageIndex] = React.useState(0);
  const [activeGarment, setActiveGarment] = React.useState<"dress" | "shirt" | "blazer">("dress");

  React.useEffect(() => {
    const msgInterval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
    }, 2400);

    const garmentInterval = setInterval(() => {
      setActiveGarment((prev) => (prev === "dress" ? "shirt" : prev === "shirt" ? "blazer" : "dress"));
    }, 2800);

    return () => {
      clearInterval(msgInterval);
      clearInterval(garmentInterval);
    };
  }, []);

  const currentMessage = message || DEFAULT_MESSAGES[activeMessageIndex];

  if (size === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2]/90 backdrop-blur-md px-4 select-none animate-in fade-in duration-200">
        <DressIllustration activeGarment={activeGarment} size="lg" />
        <div className="mt-6 text-center max-w-sm space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-navy-950">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
            <span>TirupatiBalajee Dresses</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <h3 className="text-base font-extrabold text-brand-navy-950 transition-all duration-300">
            {currentMessage}
          </h3>
          {submessage ? (
            <p className="text-xs text-slate-500 font-medium">{submessage}</p>
          ) : showTips ? (
            <p className="text-xs text-slate-400 font-medium animate-pulse">
              100% Quality Guaranteed • Fast School Delivery
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center select-none",
        isSmall ? "py-4 px-2 space-y-2" : isLarge ? "py-12 px-4 space-y-5" : "py-8 px-4 space-y-3",
        className
      )}
    >
      <DressIllustration activeGarment={activeGarment} size={size} />

      <div className="text-center max-w-xs space-y-1">
        <p
          className={cn(
            "font-extrabold text-brand-navy-950 transition-all duration-300",
            isSmall ? "text-xs" : isLarge ? "text-base" : "text-sm"
          )}
        >
          {currentMessage}
        </p>
        {submessage && (
          <p className={cn("text-slate-500 font-medium", isSmall ? "text-[10px]" : "text-xs")}>
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
}

interface DressIllustrationProps {
  activeGarment: "dress" | "shirt" | "blazer";
  size: "sm" | "md" | "lg" | "fullscreen";
}

function DressIllustration({ activeGarment, size }: DressIllustrationProps) {
  const scale = size === "sm" ? "w-16 h-16" : size === "lg" || size === "fullscreen" ? "w-28 h-28" : "w-20 h-20";

  return (
    <div className={cn("relative flex items-center justify-center", scale)}>
      {/* Outer Rotating Stitch Orbital Ring */}
      <svg
        className="absolute inset-0 w-full h-full animate-spin text-amber-400/80"
        style={{ animationDuration: "8s" }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
          strokeLinecap="round"
        />
        {/* Floating Golden Stitch Needle / Bead */}
        <circle cx="50" cy="4" r="3.5" fill="#F59E0B" />
      </svg>

      {/* Background Soft Glow */}
      <div className="absolute inset-2 rounded-full bg-amber-100/60 blur-xs animate-pulse" />

      {/* Floating Animated Hanger with Swaying Garment */}
      <div
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-500"
        style={{
          animation: "dressSway 2.4s ease-in-out infinite alternate",
          transformOrigin: "top center",
        }}
      >
        {/* Golden Hanger Top Hook */}
        <svg
          className="w-10 h-5 text-amber-600 drop-shadow-2xs -mb-1"
          viewBox="0 0 40 20"
          fill="none"
        >
          {/* Hook loop */}
          <path
            d="M20 18 C20 12, 23 8, 23 5 C23 2.5, 20.5 1, 18.5 2 C16.5 3, 16 5.5, 17 6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Triangular wire */}
          <path
            d="M6 18 L20 11 L34 18 Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>

        {/* Dynamic Swapping Garment */}
        <div className="relative w-12 h-14 transition-all duration-300 flex items-center justify-center">
          {activeGarment === "dress" && <SchoolDressSVG />}
          {activeGarment === "shirt" && <SchoolShirtSVG />}
          {activeGarment === "blazer" && <SchoolBlazerSVG />}

          {/* Sparkle Glint */}
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* 1. School Uniform Pleated Dress */
function SchoolDressSVG() {
  return (
    <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-md animate-in zoom-in-90 duration-300" fill="none">
      {/* Dress Body / Navy Blue */}
      <path
        d="M20 8 L14 18 L19 28 L10 64 L50 64 L41 28 L46 18 L40 8 L33 13 C31 15, 29 15, 27 13 Z"
        fill="#1E293B"
      />
      {/* White Peter Pan Collar */}
      <path
        d="M20 8 C23 14, 28 14, 30 11 C32 14, 37 14, 40 8 C35 7, 25 7, 20 8 Z"
        fill="#FFFFFF"
        stroke="#CBD5E1"
        strokeWidth="1"
      />
      {/* Red/Gold Tie or Plaid Neck Tie */}
      <path d="M29 11 L31 11 L32 24 L30 27 L28 24 Z" fill="#DC2626" />
      <path d="M28 11 L32 11 L31 13 L29 13 Z" fill="#F59E0B" />
      {/* Waistband */}
      <rect x="18" y="27" width="24" height="3" rx="1" fill="#F59E0B" />
      {/* Pleat Lines */}
      <line x1="20" y1="30" x2="16" y2="64" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="27" y1="30" x2="25" y2="64" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="33" y1="30" x2="35" y2="64" stroke="#0F172A" strokeWidth="1.2" />
      <line x1="40" y1="30" x2="44" y2="64" stroke="#0F172A" strokeWidth="1.2" />
      {/* School Crest / Badge */}
      <circle cx="23" cy="20" r="2.5" fill="#F59E0B" />
      <circle cx="23" cy="20" r="1.5" fill="#DC2626" />
    </svg>
  );
}

/* 2. School Shirt with Collar and Tie */
function SchoolShirtSVG() {
  return (
    <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-md animate-in zoom-in-90 duration-300" fill="none">
      {/* White / Sky Blue Oxford Shirt */}
      <path
        d="M18 10 L10 20 L16 26 L18 58 L42 58 L44 26 L50 20 L42 10 L34 14 C32 15, 28 15, 26 14 Z"
        fill="#F0F9FF"
        stroke="#BAE6FD"
        strokeWidth="1"
      />
      {/* Short Sleeves Accent */}
      <path d="M10 20 L16 26 L18 23 L13 18 Z" fill="#E0F2FE" />
      <path d="M50 20 L44 26 L42 23 L47 18 Z" fill="#E0F2FE" />
      {/* Crisp White Pointed Collar */}
      <path d="M18 10 L28 16 L25 8 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
      <path d="M42 10 L32 16 L35 8 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
      {/* Striped School Necktie */}
      <path d="M28 14 L32 14 L34 38 L30 43 L26 38 Z" fill="#1E3A8A" />
      <path d="M28.5 20 L31.5 22" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M27.5 27 L32.5 29" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M26.5 34 L33.5 36" stroke="#F59E0B" strokeWidth="1.2" strokeLinecap="round" />
      {/* Pocket & Logo */}
      <rect x="34" y="24" width="6" height="7" rx="1" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="0.8" />
      <circle cx="37" cy="27.5" r="1.2" fill="#F59E0B" />
      {/* Buttons */}
      <circle cx="30" cy="48" r="1" fill="#64748B" />
      <circle cx="30" cy="54" r="1" fill="#64748B" />
    </svg>
  );
}

/* 3. Formal School Blazer with Golden Crest */
function SchoolBlazerSVG() {
  return (
    <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-md animate-in zoom-in-90 duration-300" fill="none">
      {/* Royal Navy Blazer */}
      <path
        d="M18 8 L8 22 L15 30 L16 62 L44 62 L45 30 L52 22 L42 8 L30 14 Z"
        fill="#0F172A"
      />
      {/* Inner White Shirt V-cut */}
      <path d="M25 12 L35 12 L30 28 Z" fill="#FFFFFF" />
      {/* Maroon School Tie Inside Blazer */}
      <path d="M29 12 L31 12 L32 26 L30 29 L28 26 Z" fill="#991B1B" />
      {/* Blazer Lapels */}
      <path d="M18 8 L24 24 L19 28 L16 12 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
      <path d="M42 8 L36 24 L41 28 L44 12 Z" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
      {/* Embroidered School Crest on Breast Pocket */}
      <rect x="18" y="28" width="7" height="8" rx="1.5" fill="#1E293B" stroke="#334155" strokeWidth="0.8" />
      <path d="M20 30 L23 30 L23 34 L21.5 35 L20 34 Z" fill="#F59E0B" />
      <circle cx="21.5" cy="32" r="0.8" fill="#DC2626" />
      {/* Golden Brass Buttons */}
      <circle cx="30" cy="36" r="1.5" fill="#F59E0B" />
      <circle cx="30" cy="44" r="1.5" fill="#F59E0B" />
      <circle cx="30" cy="52" r="1.5" fill="#F59E0B" />
      {/* Pocket Flaps */}
      <rect x="36" y="44" width="7" height="2" rx="0.5" fill="#1E293B" />
      <rect x="17" y="44" width="7" height="2" rx="0.5" fill="#1E293B" />
    </svg>
  );
}
