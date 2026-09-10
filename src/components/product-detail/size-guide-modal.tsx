"use client";

import * as React from "react";
import { X, Ruler, CheckCircle2, HelpCircle } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export function SizeGuideModal({ isOpen, onClose, categoryName = "Uniform" }: SizeGuideModalProps) {
  const [activeUnit, setActiveUnit] = React.useState<"inches" | "cm">("inches");
  const isFootwear = categoryName.toLowerCase().includes("shoe") || categoryName.toLowerCase().includes("footwear");

  if (!isOpen) return null;

  // Apparel Sizing Matrix
  const apparelSizesInches = [
    { size: "22 (4Y)", age: "4-5 Yrs", grade: "Nursery / LKG", chest: "22 - 23", waist: "20 - 21", length: "16" },
    { size: "24 (6Y)", age: "5-6 Yrs", grade: "UKG / Class 1", chest: "24 - 25", waist: "22 - 23", length: "18" },
    { size: "26 (8Y)", age: "7-8 Yrs", grade: "Class 2 - 3", chest: "26 - 27", waist: "24 - 25", length: "20" },
    { size: "28 (10Y)", age: "9-10 Yrs", grade: "Class 4 - 5", chest: "28 - 29", waist: "25 - 26", length: "22" },
    { size: "30 (12Y)", age: "11-12 Yrs", grade: "Class 6 - 7", chest: "30 - 31", waist: "26 - 27", length: "24" },
    { size: "32 (14Y)", age: "13-14 Yrs", grade: "Class 8 - 9", chest: "32 - 33", waist: "28 - 29", length: "26" },
    { size: "34 (S)", age: "15-16 Yrs", grade: "Class 10 - 11", chest: "34 - 36", waist: "30 - 31", length: "27" },
    { size: "36 (M)", age: "16+ Yrs", grade: "Class 11 - 12", chest: "36 - 38", waist: "32 - 33", length: "28" },
    { size: "38 (L)", age: "Senior", grade: "Class 12 / Adult", chest: "38 - 40", waist: "34 - 35", length: "29" },
    { size: "40 (XL)", age: "Senior", grade: "Adult", chest: "40 - 42", waist: "36 - 37", length: "30" },
  ];

  const apparelSizesCm = [
    { size: "22 (4Y)", age: "4-5 Yrs", grade: "Nursery / LKG", chest: "56 - 58", waist: "51 - 53", length: "41" },
    { size: "24 (6Y)", age: "5-6 Yrs", grade: "UKG / Class 1", chest: "61 - 63", waist: "56 - 58", length: "46" },
    { size: "26 (8Y)", age: "7-8 Yrs", grade: "Class 2 - 3", chest: "66 - 69", waist: "61 - 63", length: "51" },
    { size: "28 (10Y)", age: "9-10 Yrs", grade: "Class 4 - 5", chest: "71 - 74", waist: "64 - 66", length: "56" },
    { size: "30 (12Y)", age: "11-12 Yrs", grade: "Class 6 - 7", chest: "76 - 79", waist: "66 - 69", length: "61" },
    { size: "32 (14Y)", age: "13-14 Yrs", grade: "Class 8 - 9", chest: "81 - 84", waist: "71 - 74", length: "66" },
    { size: "34 (S)", age: "15-16 Yrs", grade: "Class 10 - 11", chest: "86 - 91", waist: "76 - 79", length: "69" },
    { size: "36 (M)", age: "16+ Yrs", grade: "Class 11 - 12", chest: "91 - 96", waist: "81 - 84", length: "71" },
    { size: "38 (L)", age: "Senior", grade: "Class 12 / Adult", chest: "96 - 101", waist: "86 - 89", length: "74" },
    { size: "40 (XL)", age: "Senior", grade: "Adult", chest: "101 - 106", waist: "91 - 94", length: "76" },
  ];

  const shoeSizes = [
    { uk: "UK 9 (Kids)", euro: "EU 27", footCm: "16.5 cm", grade: "Nursery" },
    { uk: "UK 10 (Kids)", euro: "EU 28", footCm: "17.3 cm", grade: "LKG" },
    { uk: "UK 11 (Kids)", euro: "EU 29", footCm: "18.1 cm", grade: "UKG" },
    { uk: "UK 12 (Kids)", euro: "EU 31", footCm: "19.0 cm", grade: "Class 1" },
    { uk: "UK 13 (Kids)", euro: "EU 32", footCm: "19.8 cm", grade: "Class 2" },
    { uk: "UK 1", euro: "EU 33", footCm: "20.6 cm", grade: "Class 3 - 4" },
    { uk: "UK 2", euro: "EU 34", footCm: "21.5 cm", grade: "Class 4 - 5" },
    { uk: "UK 3", euro: "EU 35", footCm: "22.3 cm", grade: "Class 6" },
    { uk: "UK 4", euro: "EU 37", footCm: "23.2 cm", grade: "Class 7 - 8" },
    { uk: "UK 5", euro: "EU 38", footCm: "24.0 cm", grade: "Class 8 - 9" },
    { uk: "UK 6", euro: "EU 39", footCm: "24.8 cm", grade: "Class 9 - 10" },
    { uk: "UK 7", euro: "EU 41", footCm: "25.7 cm", grade: "Class 10 - 11" },
    { uk: "UK 8", euro: "EU 42", footCm: "26.5 cm", grade: "Class 11 - 12" },
  ];

  const apparelData = activeUnit === "inches" ? apparelSizesInches : apparelSizesCm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-900">
              <Ruler className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Official Standard Size Guide</h3>
              <p className="text-xs text-slate-500">TirupatiBalajee Certified School Sizing Matrix</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Unit Toggle (Inches vs CM) */}
        {!isFootwear && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Select Unit:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveUnit("inches")}
                className={`rounded-md px-3 py-1 transition ${
                  activeUnit === "inches" ? "bg-white text-blue-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Inches (in)
              </button>
              <button
                onClick={() => setActiveUnit("cm")}
                className={`rounded-md px-3 py-1 transition ${
                  activeUnit === "cm" ? "bg-white text-blue-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>
        )}

        {/* Sizing Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          {!isFootwear ? (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">Size Tag</th>
                  <th className="px-3 py-2.5">Age Approx</th>
                  <th className="px-3 py-2.5">Standard Class</th>
                  <th className="px-3 py-2.5">Chest ({activeUnit === "inches" ? "in" : "cm"})</th>
                  <th className="px-3 py-2.5">Waist ({activeUnit === "inches" ? "in" : "cm"})</th>
                  <th className="px-3 py-2.5">Garment Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {apparelData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 py-2 font-bold text-blue-900">{row.size}</td>
                    <td className="px-3 py-2">{row.age}</td>
                    <td className="px-3 py-2">{row.grade}</td>
                    <td className="px-3 py-2">{row.chest}</td>
                    <td className="px-3 py-2">{row.waist}</td>
                    <td className="px-3 py-2">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">Indian / UK Size</th>
                  <th className="px-3 py-2.5">Euro Size</th>
                  <th className="px-3 py-2.5">Foot Length</th>
                  <th className="px-3 py-2.5">Recommended Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {shoeSizes.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-3 py-2 font-bold text-blue-900">{row.uk}</td>
                    <td className="px-3 py-2">{row.euro}</td>
                    <td className="px-3 py-2">{row.footCm}</td>
                    <td className="px-3 py-2">{row.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* How to Measure Tips */}
        <div className="mt-5 rounded-xl bg-blue-50/70 p-4 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <HelpCircle className="h-4 w-4 text-blue-900" />
            How to Measure for the Best Fit
          </div>
          <ul className="mt-2 space-y-1.5 text-slate-600">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span><strong>Chest:</strong> Measure horizontally around the fullest part of the child&apos;s chest with arms down.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span><strong>Waist:</strong> Measure around the natural waistline (above the navel) where trousers or skirts sit.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
              <span><strong>Growth Tip:</strong> For school uniforms, if between two sizes, we recommend picking the larger size to accommodate child growth during the academic year.</span>
            </li>
          </ul>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
          >
            Got It, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
