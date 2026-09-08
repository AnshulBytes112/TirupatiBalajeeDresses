"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "left",
  className,
}: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sideClasses = {
    left: "inset-y-0 left-0 w-full max-w-xs md:max-w-sm border-r",
    right: "inset-y-0 right-0 w-full max-w-xs md:max-w-sm border-l",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl border-t",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-navy-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed bg-white shadow-2xl transition-transform ease-in-out duration-300 z-10 flex flex-col",
          sideClasses[side],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <h3 className="text-lg font-bold text-brand-navy-950">{title || "Menu"}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
