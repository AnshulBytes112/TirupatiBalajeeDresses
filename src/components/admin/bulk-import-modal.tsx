"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Loader2,
  Table as TableIcon,
  HelpCircle,
  Sparkles,
  RefreshCw,
  Layers,
  Package,
} from "lucide-react";
import { parseCsv, downloadCsvFile, ParsedCsvRow } from "@/lib/csv-parser";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "categories" | "products";
  adminKey?: string;
  onSuccess?: () => void;
}

export function BulkImportModal({
  isOpen,
  onClose,
  type,
  adminKey,
  onSuccess,
}: BulkImportModalProps) {
  const [csvText, setCsvText] = React.useState<string>("");
  const [fileName, setFileName] = React.useState<string>("");
  const [parsedRows, setParsedRows] = React.useState<ParsedCsvRow[]>([]);
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [showGuide, setShowGuide] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<{
    success: boolean;
    totalRows: number;
    createdCount: number;
    updatedCount: number;
    errorCount: number;
    errors: Array<{ row: number; name?: string; sku?: string; error: string }>;
  } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Reset state on open/close
  React.useEffect(() => {
    if (!isOpen) {
      setCsvText("");
      setFileName("");
      setParsedRows([]);
      setResult(null);
      setShowGuide(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isCategory = type === "categories";
  const title = isCategory ? "Bulk Import Categories" : "Bulk Import Products";
  const sampleTemplateName = isCategory
    ? "sample_categories_import.csv"
    : "sample_products_import.csv";

  // Handle Textarea or File input parsing
  const handleTextChange = (text: string) => {
    setCsvText(text);
    setResult(null);
    try {
      const rows = parseCsv(text);
      setParsedRows(rows);
    } catch {
      setParsedRows([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleTextChange(content || "");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        handleTextChange(content || "");
      };
      reader.readAsText(file);
    }
  };

  // Sample CSV Download
  const handleDownloadSample = async () => {
    try {
      const res = await fetch(`/templates/${sampleTemplateName}`);
      if (res.ok) {
        const text = await res.text();
        downloadCsvFile(sampleTemplateName, text);
        toast.success(`Downloaded sample ${isCategory ? "categories" : "products"} CSV template`);
      } else {
        // Fallback static strings
        const fallback = isCategory
          ? `name,slug,parentSlug,description,imageUrl,displayOrder,isActive\nSchool Uniforms,school-uniforms,,Complete school uniforms for all boards,/images/categories/uniforms.jpg,1,true\nSummer Dress,summer-dress,school-uniforms,Breathable cotton regular summer uniforms,/images/categories/summer.jpg,1,true\nWinter Dress,winter-dress,school-uniforms,Warm blazers sweaters and cardigans,/images/categories/winter.jpg,2,true`
          : `name,sku,slug,categorySlug,mrp,sellingPrice,status,isFeatured,isBestseller,description,imageUrl,variants\nDPS Boys Regular Shirt,DPS-SHT-001,dps-boys-summer-shirt,school-uniforms,799,599,PUBLISHED,true,true,Official Delhi Public School uniform shirt,/images/products/shirt.jpg,"size:28,sku:DPS-28,price:599,stock:50;size:30,sku:DPS-30,price:599,stock:45"`;
        downloadCsvFile(sampleTemplateName, fallback);
        toast.success(`Downloaded sample CSV template`);
      }
    } catch {
      toast.error("Failed to download template");
    }
  };

  // Execute Import
  const handleExecuteImport = async () => {
    if (!csvText.trim() || parsedRows.length === 0) {
      toast.error("Please provide valid CSV content or upload a file first.");
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const endpoint = isCategory
        ? "/api/admin/categories/import"
        : "/api/admin/products/import";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminKey ? { "x-admin-key": adminKey } : {}),
        },
        body: JSON.stringify({ csvContent: csvText }),
      });

      const json = await res.json();

      if (json.success) {
        const stats = json.data;
        setResult({
          success: true,
          totalRows: stats.totalRows || parsedRows.length,
          createdCount: stats.createdCount || 0,
          updatedCount: stats.updatedCount || 0,
          errorCount: stats.errorCount || 0,
          errors: stats.errors || [],
        });

        toast.success(json.message || "Bulk import completed successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(json.message || "Bulk import encountered an error");
        setResult({
          success: false,
          totalRows: parsedRows.length,
          createdCount: 0,
          updatedCount: 0,
          errorCount: parsedRows.length,
          errors: [{ row: 0, error: json.message || "Failed to process import" }],
        });
      }
    } catch (err: any) {
      toast.error(err?.message || "Network error during bulk import");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-[#E5DCD3] bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E5DCD3] bg-[#FAF7F2] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-sm">
              {isCategory ? (
                <Layers className="h-5 w-5 text-amber-400" />
              ) : (
                <Package className="h-5 w-5 text-amber-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-black text-[#1C1917]">{title}</h2>
                <span className="rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-[10px] font-black text-amber-900 uppercase">
                  CSV Engine
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Upload or paste CSV data to batch insert and update {type} with hierarchy &amp; stock.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSample}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6C7B2] bg-white px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-[#F5EFEB] transition-colors shadow-2xs cursor-pointer"
              title="Download Sample CSV Template"
            >
              <Download className="h-3.5 w-3.5 text-amber-600" />
              <span>Download Sample CSV</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-stone-400 hover:bg-stone-200/60 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FAF7F2]/40">
          {/* Top Instructions / Guide Banner */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <HelpCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-950">
                    How to prepare your CSV file:
                  </p>
                  <p className="text-[11.5px] text-amber-900 leading-relaxed">
                    Download the sample template to see the required column headers. You can either drag &amp; drop your file or paste raw CSV text below. Existing records with matching slugs or SKUs will be automatically updated.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuide(!showGuide)}
                className="text-xs font-black text-amber-900 hover:underline shrink-0"
              >
                {showGuide ? "Hide Column Specs ▲" : "View Column Specs ▼"}
              </button>
            </div>

            {/* Expandable Guide Specs */}
            {showGuide && (
              <div className="mt-3 pt-3 border-t border-amber-200/60 text-xs text-stone-800 space-y-2">
                <p className="font-bold text-[11px] text-amber-950 uppercase tracking-wider">
                  Supported CSV Headers ({isCategory ? "Categories" : "Products"}):
                </p>
                {isCategory ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">name</span> <span className="text-red-600 font-bold">*Required</span>: Name of the category (e.g. &quot;Summer Dress&quot;)
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">slug</span>: URL slug (auto-generated if omitted)
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">parentSlug</span>: Slug of parent category to link child hierarchy
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">imageUrl</span>: Banner/Thumbnail URL or upload path
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">description</span>: Overview summary
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">displayOrder</span>: Integer display order (1, 2, 3...)
                    </li>
                  </ul>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">name, sku, categorySlug</span> <span className="text-red-600 font-bold">*Required</span>
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">mrp, sellingPrice</span>: Pricing in INR numbers
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">status</span>: <code className="text-stone-700 font-mono">PUBLISHED</code>, <code className="text-stone-700 font-mono">DRAFT</code>, or <code className="text-stone-700 font-mono">ARCHIVED</code>
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50">
                      <span className="font-mono font-bold text-stone-900">schoolSlug, season, gender</span>: School binding and uniforms tags
                    </li>
                    <li className="p-2 rounded-xl bg-white border border-amber-200/50 sm:col-span-2">
                      <span className="font-mono font-bold text-stone-900">variants</span>: Semicolon list of variant specs, e.g.:<br />
                      <code className="text-[10px] bg-stone-100 px-1 py-0.5 rounded text-stone-700 mt-1 block">
                        size:28,sku:DPS-28,price:599,stock:50;size:30,sku:DPS-30,price:599,stock:45
                      </code>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* File Upload Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D6C7B2] bg-white p-6 text-center transition-colors hover:border-stone-900 hover:bg-[#FAF7F2]/60"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <FileSpreadsheet className="h-10 w-10 text-stone-400 mb-2" />
            <p className="text-xs font-bold text-[#1C1917]">
              Drag and drop your CSV file here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-amber-800 hover:underline font-black cursor-pointer"
              >
                browse from computer
              </button>
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Supports .csv formatted spreadsheets with UTF-8 encoding
            </p>

            {fileName && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-stone-100 border border-stone-300 px-3 py-1 text-xs font-bold text-stone-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{fileName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFileName("");
                    handleTextChange("");
                  }}
                  className="text-stone-400 hover:text-stone-800 font-black ml-1 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Or Paste CSV Raw Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1C1917]">
                Or Paste Raw CSV Content:
              </label>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="text-[11px] font-bold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="h-3 w-3" />
                <span>Get Sample File</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={csvText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="name,sku,categorySlug,mrp,sellingPrice..."
              className="w-full rounded-2xl border border-[#E5DCD3] bg-white p-3 font-mono text-[11px] text-[#1C1917] focus:border-[#1C1917] focus:outline-hidden"
            />
          </div>

          {/* Live CSV Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2 rounded-2xl border border-[#E5DCD3] bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold text-[#1C1917]">
                    Parsed Preview ({parsedRows.length} Rows Ready)
                  </span>
                </div>
                <span className="rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">
                  Valid CSV Syntax
                </span>
              </div>

              <div className="max-h-48 overflow-x-auto overflow-y-auto rounded-xl border border-stone-200">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#FAF7F2] border-b border-stone-200 text-stone-600 font-bold sticky top-0">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      {Object.keys(parsedRows[0] || {})
                        .slice(0, 6)
                        .map((k) => (
                          <th key={k} className="py-2 px-3 uppercase font-mono text-[10px]">
                            {k}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono text-[10.5px]">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/40">
                        <td className="py-1.5 px-3 text-stone-400 font-sans">{idx + 1}</td>
                        {Object.values(row)
                          .slice(0, 6)
                          .map((val, cIdx) => (
                            <td key={cIdx} className="py-1.5 px-3 truncate max-w-[150px]">
                              {val || "-"}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 5 && (
                <p className="text-[10px] text-stone-400 italic text-right">
                  Showing first 5 of {parsedRows.length} rows
                </p>
              )}
            </div>
          )}

          {/* Import Result Summary Card */}
          {result && (
            <div
              className={`rounded-2xl border p-4 space-y-3 ${
                result.errorCount === 0
                  ? "border-emerald-300 bg-emerald-50/70"
                  : result.createdCount > 0 || result.updatedCount > 0
                  ? "border-amber-300 bg-amber-50/70"
                  : "border-red-300 bg-red-50/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {result.errorCount === 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : result.createdCount > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-bold text-xs text-stone-900">
                    Import Execution Summary
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold">
                  <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 border border-emerald-300">
                    +{result.createdCount} Created
                  </span>
                  <span className="rounded bg-blue-100 text-blue-900 px-2 py-0.5 border border-blue-300">
                    {result.updatedCount} Updated
                  </span>
                  {result.errorCount > 0 && (
                    <span className="rounded bg-red-100 text-red-900 px-2 py-0.5 border border-red-300">
                      {result.errorCount} Failed
                    </span>
                  )}
                </div>
              </div>

              {/* Error list if any */}
              {result.errors.length > 0 && (
                <div className="space-y-1.5 rounded-xl bg-white/80 p-3 border border-red-200">
                  <p className="text-[11px] font-bold text-red-800">Encountered Issues:</p>
                  <div className="max-h-28 overflow-y-auto space-y-1 text-[11px] text-red-700">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="font-mono font-bold">Row {err.row}:</span>
                        <span>{err.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-[#E5DCD3] bg-[#FAF7F2] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[#D6C7B2] bg-white px-4 py-2 text-xs font-bold text-stone-700 hover:bg-[#F5EFEB] transition-colors cursor-pointer"
          >
            Cancel / Close
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={isProcessing || parsedRows.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1C1917] px-6 py-2.5 text-xs font-black text-white hover:bg-stone-800 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                <span>Processing Bulk Import...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4 text-amber-400" />
                <span>Execute Bulk Import ({parsedRows.length} Rows)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
