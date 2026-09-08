"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Key,
  Layout,
  Layers,
  Sparkles,
  ShoppingBag,
  Image as ImageIcon,
  Upload,
  Eye,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  DynamicHomepageData,
  DynamicHeroSlide,
  DynamicCategoryCard,
} from "@/types/homepage";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_PROMO_SPLIT,
  DEFAULT_PROMO_COMBOS,
  DEFAULT_TRENDING_SETTINGS,
} from "@/repositories/homepage.repository";

// Live Preview Components
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromoSplit } from "@/components/home/promo-split";
import { ProductCarouselSection } from "@/components/home/product-carousel-section";
import { TrustBar } from "@/components/home/trust-bar";
import { PromoCombos } from "@/components/home/promo-combos";
import { TrustFooterBadges } from "@/components/home/trust-footer-badges";

// Dedicated Reusable Image Upload & Path Component
interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  adminKey: string;
  placeholder?: string;
}

function ImageUploadField({
  label,
  value,
  onChange,
  adminKey,
  placeholder = "/images/sample.jpg",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/homepage/upload", {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.url) {
          onChange(json.data.url);
          toast.success("Photo uploaded successfully!");
        }
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to upload photo");
      }
    } catch (err) {
      toast.error("Network error during photo upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="font-bold text-slate-700 flex items-center justify-between text-xs">
        <span>{label}</span>
        {value && (
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Photo Set
          </span>
        )}
      </label>

      <div className="flex items-center gap-2">
        {/* Photo Thumbnail Preview */}
        <div className="relative h-10 w-10 shrink-0 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden flex items-center justify-center">
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
            <ImageIcon className="h-4 w-4 text-slate-400" />
          )}
        </div>

        {/* Text Input for Path / URL */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-medium focus:border-brand-navy-900 focus:bg-white focus:outline-none"
        />

        {/* File Upload Button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 text-xs font-bold transition-colors shrink-0 disabled:opacity-50"
          title="Upload image from computer"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-navy-950" />
              <span className="hidden sm:inline">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Upload Photo</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminHomepageCMS() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<
    "hero" | "categories" | "promos" | "combos" | "trending" | "preview"
  >("hero");
  const [previewDevice, setPreviewDevice] = React.useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // Dynamic Data State
  const [heroSlides, setHeroSlides] =
    React.useState<DynamicHeroSlide[]>(DEFAULT_HERO_SLIDES);
  const [categoryCards, setCategoryCards] =
    React.useState<DynamicCategoryCard[]>(DEFAULT_CATEGORY_CARDS);
  const [promoSplit, setPromoSplit] = React.useState(DEFAULT_PROMO_SPLIT);
  const [promoCombos, setPromoCombos] = React.useState(DEFAULT_PROMO_COMBOS);
  const [trendingSettings, setTrendingSettings] = React.useState(
    DEFAULT_TRENDING_SETTINGS
  );

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      verifyAndLoad(saved);
    }
  }, []);

  async function verifyAndLoad(keyToTest?: string) {
    const key = keyToTest || adminKey;
    if (!key) {
      toast.error("Please enter the Super-Admin secret key");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/homepage", {
        headers: { "x-admin-key": key },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          if (json.data.heroSlides) setHeroSlides(json.data.heroSlides);
          if (json.data.categoryCards) setCategoryCards(json.data.categoryCards);
          if (json.data.promoSplit) setPromoSplit(json.data.promoSplit);
          if (json.data.promoCombos) setPromoCombos(json.data.promoCombos);
          if (json.data.trendingSettings)
            setTrendingSettings(json.data.trendingSettings);
        }
        setIsAuthorized(true);
        localStorage.setItem("tirupati_admin_key", key);
        toast.success("Super-Admin authorized successfully");
      } else {
        setIsAuthorized(false);
        toast.error("Invalid Super-Admin key. Access denied.");
      }
    } catch (e) {
      toast.error("Error connecting to Super-Admin CMS API");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveAll() {
    setIsSaving(true);
    try {
      const payload: Partial<DynamicHomepageData> = {
        heroSlides,
        categoryCards,
        promoSplit,
        promoCombos,
        trendingSettings,
      };

      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Homepage published and saved successfully!");
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to save homepage");
      }
    } catch (e) {
      toast.error("Network error while saving homepage");
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetDefaults() {
    if (
      confirm(
        "Are you sure you want to reset all homepage fields to default master layout?"
      )
    ) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
      setCategoryCards(DEFAULT_CATEGORY_CARDS);
      setPromoSplit(DEFAULT_PROMO_SPLIT);
      setPromoCombos(DEFAULT_PROMO_COMBOS);
      setTrendingSettings(DEFAULT_TRENDING_SETTINGS);
      toast.info("Fields reset to defaults. Click 'Save & Publish' to write to database.");
    }
  }

  // Hero Slide Helpers
  const updateSlide = (idx: number, field: keyof DynamicHeroSlide, value: any) => {
    setHeroSlides((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const addSlide = () => {
    const newSlide: DynamicHeroSlide = {
      id: `slide-${Date.now()}`,
      badge: "NEW ANNOUNCEMENT",
      titleLine1: "New Uniform",
      titleLine2: "Collection 2026",
      subtitle: "Comfortable, durable fabrics for school children.",
      ctaText: "EXPLORE NOW",
      ctaUrl: "/category/school-uniforms",
      imageSrc: "/images/hero-kids.jpg",
      imageAlt: "School uniforms",
      doodleText: "Always Ahead",
      stickyNote: { text: "Premium Quality", subtext: "Best Prices" },
    };
    setHeroSlides((prev) => [...prev, newSlide]);
    toast.success("New slide added");
  };

  const deleteSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      toast.error("Must keep at least 1 hero slide");
      return;
    }
    setHeroSlides((prev) => prev.filter((_, i) => i !== idx));
  };

  // Category Card Helpers
  const updateCategoryCard = (
    idx: number,
    field: keyof DynamicCategoryCard,
    value: any
  ) => {
    setCategoryCards((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // 1. LOGIN SCREEN IF NOT AUTHORIZED
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-950 text-white shadow-lg">
              <Shield className="h-7 w-7 text-brand-yellow-400" />
            </div>
            <h1 className="font-display text-2xl font-black text-slate-900">
              Super-Admin CMS Portal
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              TirupatiBalajee Dresses — Dynamic Homepage Control Center
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-brand-navy-800" />
                <span>Super-Admin Secret Key</span>
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyAndLoad()}
                placeholder="Enter secret key (e.g. superadmin_tirupati_2026)"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-brand-navy-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-navy-900/10"
              />
            </div>

            <button
              onClick={() => verifyAndLoad()}
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-navy-950 py-3 text-sm font-black uppercase text-white shadow-md hover:bg-brand-navy-800 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Shield className="h-4 w-4 text-brand-yellow-400" />
                  <span>Authenticate as Super-Admin</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              <span>← Return to Public Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. SUPER-ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Top Admin Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-[#0F172A] text-white border-b border-slate-800 shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-yellow-400 text-slate-950 font-black">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  TirupatiBalajee CMS
                </span>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/30">
                  SUPER-ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Dynamic Storefront Management &amp; Live Publisher
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab("preview")}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                activeTab === "preview"
                  ? "bg-brand-yellow-400 text-slate-950 font-black shadow-md"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Live Page Preview</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-200 px-3.5 py-2 text-xs font-bold text-slate-200 transition-colors"
              title="Reset fields to defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 sm:px-5 py-2 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md transition-all active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="border-t border-slate-800 bg-[#0B1120]">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 overflow-x-auto no-scrollbar py-1.5 text-xs font-bold">
            {[
              { id: "hero", label: "1. Hero Carousel Slides", icon: Sparkles },
              { id: "categories", label: "2. Category Cards (9)", icon: Layout },
              { id: "promos", label: "3. Summer & Winter Promos", icon: Layers },
              { id: "combos", label: "4. Combos & Thermals", icon: ShoppingBag },
              { id: "trending", label: "5. Trending Now Settings", icon: Sliders },
              { id: "preview", label: "👁️ Full Page Live Preview", icon: Eye },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-brand-yellow-400 text-slate-950 font-black shadow-xs"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Form & Preview Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: HERO CAROUSEL SLIDES */}
        {/* ========================================================================= */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Hero Carousel Management
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Edit headlines, seasonal buttons, photos (URL or local upload), sticky notes, and doodle copy.
                </p>
              </div>

              <button
                onClick={addSlide}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-3.5 py-2 text-xs font-black uppercase text-white hover:bg-brand-navy-800 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5 text-brand-yellow-400" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="flex items-center gap-2 text-xs font-black uppercase text-brand-navy-950">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-yellow-400 text-slate-950 text-xs">
                        {idx + 1}
                      </span>
                      Slide {idx + 1}: {slide.badge}
                    </span>

                    <button
                      onClick={() => deleteSlide(idx)}
                      className="text-rose-600 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    {/* Badge */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Top Badge</label>
                      <input
                        type="text"
                        value={slide.badge}
                        onChange={(e) => updateSlide(idx, "badge", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* Headline 1 */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Headline Line 1</label>
                      <input
                        type="text"
                        value={slide.titleLine1}
                        onChange={(e) =>
                          updateSlide(idx, "titleLine1", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* Headline 2 */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Headline Line 2</label>
                      <input
                        type="text"
                        value={slide.titleLine2}
                        onChange={(e) =>
                          updateSlide(idx, "titleLine2", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1 md:col-span-2">
                      <label className="font-bold text-slate-700">Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => updateSlide(idx, "subtitle", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* Image URL / Upload */}
                    <div className="md:col-span-3">
                      <ImageUploadField
                        label="Hero Kids Photo (URL or Upload)"
                        value={slide.imageSrc}
                        onChange={(url) => updateSlide(idx, "imageSrc", url)}
                        adminKey={adminKey}
                        placeholder="/images/hero-kids.jpg"
                      />
                    </div>

                    {/* CTA Text */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">CTA Button Text</label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => updateSlide(idx, "ctaText", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* CTA URL */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">CTA Destination Link</label>
                      <input
                        type="text"
                        value={slide.ctaUrl}
                        onChange={(e) => updateSlide(idx, "ctaUrl", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    {/* Doodle Text */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">
                        Doodle Text (Top Right)
                      </label>
                      <input
                        type="text"
                        value={slide.doodleText || ""}
                        onChange={(e) => updateSlide(idx, "doodleText", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORY CARDS (ALL 9) */}
        {/* ========================================================================= */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Shop School Uniforms Category Cards (9)
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Edit category title, 2-line subtitle value propositions, emoji badges, and upload/set photos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryCards.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <span className="text-xs font-black text-brand-navy-950 flex items-center gap-1.5">
                      <span className="text-base">{cat.badgeEmoji}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      Card #{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Category Title</label>
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          updateCategoryCard(idx, "name", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    {/* Subtitle Line 1 */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Subtitle Line 1</label>
                      <input
                        type="text"
                        value={cat.subtitleLine1}
                        onChange={(e) =>
                          updateCategoryCard(idx, "subtitleLine1", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                      />
                    </div>

                    {/* Subtitle Line 2 */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Subtitle Line 2</label>
                      <input
                        type="text"
                        value={cat.subtitleLine2}
                        onChange={(e) =>
                          updateCategoryCard(idx, "subtitleLine2", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                      />
                    </div>

                    {/* Badge Emoji */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Badge Emoji</label>
                      <input
                        type="text"
                        value={cat.badgeEmoji}
                        onChange={(e) =>
                          updateCategoryCard(idx, "badgeEmoji", e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                      />
                    </div>

                    {/* Image URL / Upload */}
                    <ImageUploadField
                      label="Card Photo (URL or Upload)"
                      value={cat.imageSrc || ""}
                      onChange={(url) => updateCategoryCard(idx, "imageSrc", url)}
                      adminKey={adminKey}
                      placeholder="/images/shoes.jpg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PROMO SPLIT (SUMMER & WINTER) */}
        {/* ========================================================================= */}
        {activeTab === "promos" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Seasonal Promotional Banners
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Configure "Stay Cool This Summer" &amp; "Stay Warm This Winter" cards with photos and copy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summer Banner Card */}
              <div className="rounded-3xl border border-amber-300/80 bg-[#FFFBEA] p-6 shadow-xs space-y-4">
                <h3 className="font-black text-base text-amber-950 flex items-center gap-1.5">
                  <span>☀️</span>
                  <span>Summer Promotional Banner</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Headline</label>
                    <input
                      type="text"
                      value={promoSplit.summerBanner.title}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          summerBanner: { ...p.summerBanner, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subtitle</label>
                    <input
                      type="text"
                      value={promoSplit.summerBanner.subtitle}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          summerBanner: {
                            ...p.summerBanner,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Button Text</label>
                    <input
                      type="text"
                      value={promoSplit.summerBanner.ctaText}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          summerBanner: { ...p.summerBanner, ctaText: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    />
                  </div>

                  <ImageUploadField
                    label="Summer Flatlay Photo"
                    value={promoSplit.summerBanner.imageSrc}
                    onChange={(url) =>
                      setPromoSplit((p) => ({
                        ...p,
                        summerBanner: { ...p.summerBanner, imageSrc: url },
                      }))
                    }
                    adminKey={adminKey}
                    placeholder="/images/summer-flatlay.jpg"
                  />
                </div>
              </div>

              {/* Winter Banner Card */}
              <div className="rounded-3xl border border-sky-300/80 bg-[#F0F9FF] p-6 shadow-xs space-y-4">
                <h3 className="font-black text-base text-sky-950 flex items-center gap-1.5">
                  <span>❄️</span>
                  <span>Winter Promotional Banner</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Headline</label>
                    <input
                      type="text"
                      value={promoSplit.winterBanner.title}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          winterBanner: { ...p.winterBanner, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subtitle</label>
                    <input
                      type="text"
                      value={promoSplit.winterBanner.subtitle}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          winterBanner: {
                            ...p.winterBanner,
                            subtitle: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Button Text</label>
                    <input
                      type="text"
                      value={promoSplit.winterBanner.ctaText}
                      onChange={(e) =>
                        setPromoSplit((p) => ({
                          ...p,
                          winterBanner: { ...p.winterBanner, ctaText: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900"
                    />
                  </div>

                  <ImageUploadField
                    label="Winter Flatlay Photo"
                    value={promoSplit.winterBanner.imageSrc}
                    onChange={(url) =>
                      setPromoSplit((p) => ({
                        ...p,
                        winterBanner: { ...p.winterBanner, imageSrc: url },
                      }))
                    }
                    adminKey={adminKey}
                    placeholder="/images/winter-flatlay.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COMBOS & THERMALS */}
        {/* ========================================================================= */}
        {activeTab === "combos" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Combos &amp; Thermals Collection
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Update banners for Complete School Look &amp; Thermals Collection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Combo Banner */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-black text-base text-slate-950">
                  Complete School Look Banner
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Title</label>
                    <input
                      type="text"
                      value={promoCombos.comboBanner.title}
                      onChange={(e) =>
                        setPromoCombos((c) => ({
                          ...c,
                          comboBanner: { ...c.comboBanner, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Subtitle</label>
                    <input
                      type="text"
                      value={promoCombos.comboBanner.subtitle}
                      onChange={(e) =>
                        setPromoCombos((c) => ({
                          ...c,
                          comboBanner: { ...c.comboBanner, subtitle: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                    />
                  </div>

                  <ImageUploadField
                    label="Combo Photo"
                    value={promoCombos.comboBanner.imageSrc}
                    onChange={(url) =>
                      setPromoCombos((c) => ({
                        ...c,
                        comboBanner: { ...c.comboBanner, imageSrc: url },
                      }))
                    }
                    adminKey={adminKey}
                    placeholder="/images/combo-kids.jpg"
                  />
                </div>
              </div>

              {/* Thermals Banner */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="font-black text-base text-slate-950">
                  Thermals Collection Banner
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Tagline</label>
                    <input
                      type="text"
                      value={promoCombos.thermalsBanner.tag}
                      onChange={(e) =>
                        setPromoCombos((c) => ({
                          ...c,
                          thermalsBanner: { ...c.thermalsBanner, tag: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Title</label>
                    <input
                      type="text"
                      value={promoCombos.thermalsBanner.title}
                      onChange={(e) =>
                        setPromoCombos((c) => ({
                          ...c,
                          thermalsBanner: { ...c.thermalsBanner, title: e.target.value },
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>

                  <ImageUploadField
                    label="Thermals Stack Photo"
                    value={promoCombos.thermalsBanner.imageSrc}
                    onChange={(url) =>
                      setPromoCombos((c) => ({
                        ...c,
                        thermalsBanner: {
                          ...c.thermalsBanner,
                          imageSrc: url,
                        },
                      }))
                    }
                    adminKey={adminKey}
                    placeholder="/images/thermals-stack.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TRENDING NOW SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === "trending" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xs space-y-5 max-w-2xl">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Trending Now Section Config
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Configure the section title, subtitle, and destination catalog link.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Section Title</label>
                <input
                  type="text"
                  value={trendingSettings.title}
                  onChange={(e) =>
                    setTrendingSettings((s) => ({ ...s, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Section Subtitle</label>
                <input
                  type="text"
                  value={trendingSettings.subtitle}
                  onChange={(e) =>
                    setTrendingSettings((s) => ({ ...s, subtitle: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">"View All" Link</label>
                <input
                  type="text"
                  value={trendingSettings.viewAllHref}
                  onChange={(e) =>
                    setTrendingSettings((s) => ({ ...s, viewAllHref: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FULL PAGE LIVE PREVIEW (BEFORE PUBLISHING) */}
        {/* ========================================================================= */}
        {activeTab === "preview" && (
          <div className="space-y-6">
            {/* Preview Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0F172A] p-4 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-black">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">
                    Interactive Live Storefront Preview
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Review your draft changes exactly as customers will see them before saving to live.
                  </p>
                </div>
              </div>

              {/* Viewport Device Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === "desktop"
                        ? "bg-brand-yellow-400 text-slate-950 font-black shadow-xs"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                  </button>

                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === "tablet"
                        ? "bg-brand-yellow-400 text-slate-950 font-black shadow-xs"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    <span>Tablet</span>
                  </button>

                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      previewDevice === "mobile"
                        ? "bg-brand-yellow-400 text-slate-950 font-black shadow-xs"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile (390px)</span>
                  </button>
                </div>

                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all active:scale-95"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? "Publishing..." : "Approve & Publish Live"}</span>
                </button>
              </div>
            </div>

            {/* Live Canvas Frame Container */}
            <div className="flex justify-center bg-slate-200/70 p-4 sm:p-8 rounded-3xl border border-slate-300 shadow-inner min-h-[700px] overflow-x-auto">
              <div
                className={`bg-[#FAF8F2] text-brand-navy-950 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-300 ${
                  previewDevice === "mobile"
                    ? "w-[390px] min-h-[844px] ring-8 ring-slate-800 rounded-[38px] p-1"
                    : previewDevice === "tablet"
                    ? "w-[768px] min-h-[900px] ring-4 ring-slate-700"
                    : "w-full max-w-[1440px]"
                }`}
              >
                {/* Mock Browser/App Header Strip in preview */}
                <div className="bg-[#13264F] text-white text-[10px] sm:text-xs py-1.5 px-4 flex items-center justify-between">
                  <span>Free Shipping on orders above ₹999</span>
                  <span className="hidden sm:inline">100% Genuine Products</span>
                  <span>Track Order | Help</span>
                </div>

                <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-navy-950 text-white">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-brand-yellow-400">
                        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z" />
                      </svg>
                    </div>
                    <span className="font-display font-black text-sm text-brand-navy-950">
                      TirupatiBalajee Dresses
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-brand-navy-900 bg-amber-100 px-2 py-0.5 rounded">
                    LIVE DRAFT PREVIEW
                  </span>
                </div>

                {/* 1. Live Rendered Hero Carousel */}
                <HeroCarousel slides={heroSlides} />

                {/* 2. Live Rendered Category Grid */}
                <CategoryGrid cards={categoryCards} />

                {/* 3. Live Rendered Promotional Split Cards */}
                <PromoSplit
                  summerBanner={promoSplit.summerBanner}
                  winterBanner={promoSplit.winterBanner}
                />

                {/* 4. Live Rendered Trending Section */}
                <ProductCarouselSection
                  title={trendingSettings.title}
                  subtitle={trendingSettings.subtitle}
                  viewAllHref={trendingSettings.viewAllHref}
                  products={DEFAULT_HERO_SLIDES as any}
                />

                {/* 5. Live Rendered Trust Bar */}
                <TrustBar />

                {/* 6. Live Rendered Promo Combos */}
                <PromoCombos
                  comboBanner={promoCombos.comboBanner}
                  thermalsBanner={promoCombos.thermalsBanner}
                />

                {/* 7. Live Rendered Trust Badges */}
                <TrustFooterBadges />

                {/* Footer preview note */}
                <div className="bg-slate-900 text-slate-400 text-center py-6 text-xs border-t border-slate-800">
                  <p className="font-bold text-white">
                    TirupatiBalajee Dresses — End of Live Page Preview
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Click "Approve &amp; Publish Live" at the top to commit all changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
