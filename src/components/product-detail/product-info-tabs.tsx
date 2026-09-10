"use client";

import * as React from "react";
import {
  FileText,
  Layers,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Info,
} from "lucide-react";

interface ProductInfoTabsProps {
  description: string;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  categoryName?: string;
  brandName?: string | null;
  sku: string;
  schools?: Array<{
    name: string;
    board?: string | null;
    season?: string;
    gender?: string;
    classGrade?: string | null;
    uniformType?: string | null;
    isCompulsory?: boolean;
  }>;
}

export function ProductInfoTabs({
  description,
  fabricDetails,
  careInstructions,
  categoryName = "Uniform",
  brandName,
  sku,
  schools = [],
}: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = React.useState<"desc" | "specs" | "fabric" | "delivery">("desc");

  // Mobile Collapsible Accordion State
  const [openAccordions, setOpenAccordions] = React.useState<Record<string, boolean>>({
    desc: true,
    specs: false,
    fabric: false,
    delivery: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const primarySchool = schools[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* DESKTOP TABS BAR */}
      <div className="hidden md:flex border-b border-slate-200 gap-8">
        <button
          onClick={() => setActiveTab("desc")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold transition-all border-b-2 ${
            activeTab === "desc"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <FileText className="h-4 w-4" />
          Product Description
        </button>

        <button
          onClick={() => setActiveTab("specs")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold transition-all border-b-2 ${
            activeTab === "specs"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Layers className="h-4 w-4" />
          Specifications
        </button>

        <button
          onClick={() => setActiveTab("fabric")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold transition-all border-b-2 ${
            activeTab === "fabric"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Fabric & Care
        </button>

        <button
          onClick={() => setActiveTab("delivery")}
          className={`flex items-center gap-2 pb-3.5 text-sm font-bold transition-all border-b-2 ${
            activeTab === "delivery"
              ? "border-blue-900 text-blue-900"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Truck className="h-4 w-4" />
          Delivery & Easy Returns
        </button>
      </div>

      {/* DESKTOP TAB CONTENT PANELS */}
      <div className="hidden md:block pt-6">
        {activeTab === "desc" && (
          <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed">
            <p>{description}</p>
            {primarySchool && (
              <div className="mt-4 rounded-xl bg-blue-50/70 p-4 text-xs text-blue-950">
                <span className="font-bold">Official School Affiliation: </span>
                This garment is specifically tailored and approved for students of{" "}
                <strong>{primarySchool.name}</strong> ({primarySchool.season} Uniform).
              </div>
            )}
          </div>
        )}

        {activeTab === "specs" && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-slate-500">Category:</span>
              <span className="font-semibold text-slate-900">{categoryName}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-slate-500">Brand / Maker:</span>
              <span className="font-semibold text-slate-900">{brandName || "TirupatiBalajee"}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-slate-50 p-3">
              <span className="text-slate-500">Base SKU:</span>
              <span className="font-mono font-semibold text-slate-900">{sku}</span>
            </div>
            {primarySchool && (
              <>
                <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500">School:</span>
                  <span className="font-semibold text-slate-900">{primarySchool.name}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500">Season:</span>
                  <span className="font-semibold text-slate-900">{primarySchool.season}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500">Gender:</span>
                  <span className="font-semibold text-slate-900">{primarySchool.gender}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-slate-50 p-3">
                  <span className="text-slate-500">Class / Grade:</span>
                  <span className="font-semibold text-slate-900">{primarySchool.classGrade || "All Grades"}</span>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "fabric" && (
          <div className="space-y-4 text-xs text-slate-700">
            <div>
              <h4 className="font-bold text-slate-900">Fabric & Material Composition</h4>
              <p className="mt-1 leading-relaxed text-slate-600">
                {fabricDetails ||
                  "65% Premium Cotton, 35% Durable Polyester blend. Engineered for high tear-resistance, breathable daily wear, and anti-shrink performance."}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h4 className="font-bold text-slate-900">Care & Laundering Instructions</h4>
              <p className="mt-1 leading-relaxed text-slate-600">
                {careInstructions ||
                  "Machine wash cold with similar colors. Use mild detergent. Do not bleach. Tumble dry on low or line dry in shade. Warm iron if required."}
              </p>
            </div>
          </div>
        )}

        {activeTab === "delivery" && (
          <div className="grid grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Truck className="h-4 w-4 text-blue-900" />
                Shipping & Dispatch Timeline
              </div>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Orders placed before 2:00 PM are dispatched same business day. Pan-India delivery within 2 to 5 business days via trusted couriers (BlueDart, Delhivery, DTDC).
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <RotateCcw className="h-4 w-4 text-emerald-600" />
                7-Day Hassle-Free Size Exchange
              </div>
              <p className="mt-2 text-slate-600 leading-relaxed">
                Fit not perfect? We provide instant size exchanges and easy doorstep return pickups within 7 days of delivery with original tags intact.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE COLLAPSIBLE ACCORDIONS */}
      <div className="md:hidden divide-y divide-slate-200">
        {/* Accordion 1: Description */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion("desc")}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900"
          >
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-900" />
              Description
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                openAccordions.desc ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.desc && (
            <div className="mt-3 text-xs text-slate-600 leading-relaxed">
              <p>{description}</p>
              {primarySchool && (
                <div className="mt-3 rounded-lg bg-blue-50 p-2.5 text-blue-950 font-medium">
                  Official Uniform for {primarySchool.name} ({primarySchool.season}).
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion 2: Specifications */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion("specs")}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900"
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-900" />
              Specifications
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                openAccordions.specs ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.specs && (
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-900">{categoryName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Brand:</span>
                <span className="font-semibold text-slate-900">{brandName || "TirupatiBalajee"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">SKU:</span>
                <span className="font-mono text-slate-900">{sku}</span>
              </div>
              {primarySchool && (
                <>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">School:</span>
                    <span className="font-semibold text-slate-900">{primarySchool.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Season:</span>
                    <span className="font-semibold text-slate-900">{primarySchool.season}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Accordion 3: Fabric & Care */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion("fabric")}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-900" />
              Fabric & Care
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                openAccordions.fabric ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.fabric && (
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p>
                <strong>Fabric:</strong>{" "}
                {fabricDetails || "65% Cotton, 35% Polyester durable breathable blend."}
              </p>
              <p>
                <strong>Care:</strong>{" "}
                {careInstructions || "Machine wash cold, do not bleach, warm iron."}
              </p>
            </div>
          )}
        </div>

        {/* Accordion 4: Delivery & Returns */}
        <div className="py-3">
          <button
            onClick={() => toggleAccordion("delivery")}
            className="flex w-full items-center justify-between text-left text-sm font-bold text-slate-900"
          >
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-blue-900" />
              Delivery & Returns
            </span>
            <ChevronDown
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                openAccordions.delivery ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordions.delivery && (
            <div className="mt-3 space-y-2 text-xs text-slate-600">
              <p>• Dispatched within 24 hours.</p>
              <p>• 7-Day Doorstep Size Exchange & Return Guarantee.</p>
              <p>• 100% Genuine Certified Quality Assurance.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
