"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, X, Link as LinkIcon } from "lucide-react";

export interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  adminKey?: string;
  placeholder?: string;
  helpText?: string;
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  adminKey,
  placeholder = "https://... or /images/sample.jpg",
  helpText,
  className = "",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getAdminKey = () => {
    if (adminKey) return adminKey;
    if (typeof window !== "undefined") {
      return localStorage.getItem("tirupati_admin_key") || "";
    }
    return "";
  };

  const uploadFile = async (file: File) => {
    const key = getAdminKey();
    if (!key) {
      toast.error("Super-Admin authentication key required to upload files.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/homepage/upload", {
        method: "POST",
        headers: {
          "x-admin-key": key,
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.url) {
          onChange(json.data.url);
          toast.success("Image uploaded successfully!");
        }
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.message || "Failed to upload image");
      }
    } catch (err) {
      toast.error("Network error during image upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="font-bold text-stone-700 flex items-center justify-between text-xs">
          <span>{label}</span>
          {value && (
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Image Selected
            </span>
          )}
        </label>
      )}

      {/* Upload and URL Input Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`flex items-center gap-2 rounded-2xl border p-1.5 transition-all ${
          isDragOver
            ? "border-[#1C1917] bg-[#EFE8E0]"
            : "border-[#E5DCD3] bg-[#FAF7F2] hover:border-stone-400"
        }`}
      >
        {/* Photo Thumbnail Preview */}
        <div className="relative h-10 w-10 shrink-0 rounded-xl border border-[#E5DCD3] bg-white overflow-hidden flex items-center justify-center shadow-xs">
          {value ? (
            <Image
              src={value}
              alt="Thumbnail"
              fill
              className="object-contain p-0.5"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="h-4 w-4 text-stone-400" />
          )}
        </div>

        {/* Text Input for Path / URL */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent px-2 py-1.5 text-xs text-[#1C1917] font-medium placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        {/* Clear Button if value present */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            title="Clear image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}

        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#E5DCD3] hover:bg-stone-50 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-xs transition-colors disabled:opacity-50 shrink-0"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-stone-600" />
          ) : (
            <Upload className="h-3.5 w-3.5 text-stone-600" />
          )}
          <span>{isUploading ? "Uploading..." : "Upload File"}</span>
        </button>
      </div>

      {helpText && (
        <p className="text-[10.5px] text-stone-500 font-medium">
          {helpText}
        </p>
      )}
    </div>
  );
}
