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
  ArrowUp,
  ArrowDown,
  Tag,
  Star,
  Flame,
  Palette,
  Check,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  DynamicHomepageData,
  DynamicHeroSlide,
  DynamicCategoryCard,
  DynamicPromoSplitCard,
  DynamicPromoComboCard,
  DynamicTrendingProduct,
} from "@/types/homepage";
import {
  DEFAULT_HERO_SLIDES,
  DEFAULT_CATEGORY_CARDS,
  DEFAULT_PROMO_SPLIT_CARDS,
  DEFAULT_PROMO_COMBO_CARDS,
  DEFAULT_TRENDING_PRODUCTS,
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
  >("categories");
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
  const [promoSplitCards, setPromoSplitCards] =
    React.useState<DynamicPromoSplitCard[]>(DEFAULT_PROMO_SPLIT_CARDS);
  const [promoComboCards, setPromoComboCards] =
    React.useState<DynamicPromoComboCard[]>(DEFAULT_PROMO_COMBO_CARDS);
  const [trendingProducts, setTrendingProducts] =
    React.useState<DynamicTrendingProduct[]>(DEFAULT_TRENDING_PRODUCTS);
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
          if (json.data.promoSplitCards) setPromoSplitCards(json.data.promoSplitCards);
          if (json.data.promoComboCards) setPromoComboCards(json.data.promoComboCards);
          if (json.data.trendingProducts) setTrendingProducts(json.data.trendingProducts);
          if (json.data.trendingSettings) setTrendingSettings(json.data.trendingSettings);
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
        promoSplitCards,
        promoComboCards,
        trendingProducts,
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
        toast.error(err.message || "Failed to publish homepage changes");
      }
    } catch (e) {
      toast.error("Network error saving homepage");
    } finally {
      setIsSaving(false);
    }
  }

  function handleResetDefaults() {
    if (confirm("Reset all homepage sections to original master template defaults?")) {
      setHeroSlides(DEFAULT_HERO_SLIDES);
      setCategoryCards(DEFAULT_CATEGORY_CARDS);
      setPromoSplitCards(DEFAULT_PROMO_SPLIT_CARDS);
      setPromoComboCards(DEFAULT_PROMO_COMBO_CARDS);
      setTrendingProducts(DEFAULT_TRENDING_PRODUCTS);
      setTrendingSettings(DEFAULT_TRENDING_SETTINGS);
      toast.info("Reset to master defaults. Click 'Publish Live' to save.");
    }
  }

  // Generic Reorder Helpers
  function moveItemUp<T>(list: T[], index: number, setList: React.Dispatch<React.SetStateAction<T[]>>) {
    if (index === 0) return;
    const updated = [...list];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setList(updated);
  }

  function moveItemDown<T>(list: T[], index: number, setList: React.Dispatch<React.SetStateAction<T[]>>) {
    if (index === list.length - 1) return;
    const updated = [...list];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setList(updated);
  }

  // --- CRUD: HERO SLIDES ---
  const addHeroSlide = () => {
    const newSlide: DynamicHeroSlide = {
      id: `hero-${Date.now()}`,
      badge: "NEW SEASON 2026",
      titleLine1: "Smart Uniforms for",
      titleLine2: "Every School",
      subtitle: "Comfortable, wrinkle-resistant and certified quality.",
      ctaText: "EXPLORE NOW",
      ctaUrl: "/category/school-uniforms",
      imageSrc: "/images/hero-kids.jpg",
      imageAlt: "School student in uniform",
      doodleText: "Play Learn Grow",
      stickyNote: { text: "100% Genuine", subtext: "Best Quality ✨" },
    };
    setHeroSlides([...heroSlides, newSlide]);
    toast.success("New hero slide added");
  };

  const updateHeroSlide = (idx: number, patch: Partial<DynamicHeroSlide>) => {
    setHeroSlides(heroSlides.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const removeHeroSlide = (idx: number) => {
    if (heroSlides.length <= 1) {
      toast.error("You must have at least one hero slide");
      return;
    }
    setHeroSlides(heroSlides.filter((_, i) => i !== idx));
    toast.info("Hero slide removed");
  };

  // --- CRUD: CATEGORY CARDS ---
  const addCategoryCard = () => {
    const newCard: DynamicCategoryCard = {
      id: `cat-${Date.now()}`,
      name: "New Category",
      href: "/category/new-category",
      badgeEmoji: "✨",
      subtitleLine1: "Premium Quality.",
      subtitleLine2: "School Approved.",
      imageSrc: "/images/shirt.jpg",
      borderColor: "border-slate-200/80",
      hoverBorderColor: "hover:border-slate-400",
      isActive: true,
    };
    setCategoryCards([...categoryCards, newCard]);
    toast.success("New category card added");
  };

  const updateCategoryCard = (idx: number, patch: Partial<DynamicCategoryCard>) => {
    setCategoryCards(categoryCards.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const removeCategoryCard = (idx: number) => {
    if (categoryCards.length <= 1) {
      toast.error("You must have at least one category card");
      return;
    }
    setCategoryCards(categoryCards.filter((_, i) => i !== idx));
    toast.info("Category card removed");
  };

  // --- CRUD: PROMO SPLIT CARDS (Summer / Winter Promos) ---
  const addPromoSplitCard = () => {
    const newCard: DynamicPromoSplitCard = {
      id: `promo-split-${Date.now()}`,
      title: "New Seasonal Offer",
      subtitle: "Comfortable Uniforms for Active Days",
      ctaText: "SHOP COLLECTION",
      ctaUrl: "/category/school-uniforms",
      imageSrc: "/images/summer-flatlay.jpg",
      doodleText: "Limited Time ♡",
      iconEmoji: "☀️",
      bgColor: "#FEF4CE",
      borderColor: "#FBE39A",
      isActive: true,
    };
    setPromoSplitCards([...promoSplitCards, newCard]);
    toast.success("New promo split card added");
  };

  const updatePromoSplitCard = (idx: number, patch: Partial<DynamicPromoSplitCard>) => {
    setPromoSplitCards(promoSplitCards.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const removePromoSplitCard = (idx: number) => {
    if (promoSplitCards.length <= 1) {
      toast.error("You must keep at least 1 promo card");
      return;
    }
    setPromoSplitCards(promoSplitCards.filter((_, i) => i !== idx));
    toast.info("Promo card removed");
  };

  // --- CRUD: COMBOS & THERMALS CARDS ---
  const addPromoComboCard = () => {
    const newCard: DynamicPromoComboCard = {
      id: `combo-${Date.now()}`,
      tag: "SPECIAL COMBO",
      title: "COMPLETE SCHOOL SET",
      subtitle: "Uniforms + Shoes + Accessories in one kit",
      ctaText: "SHOP NOW",
      ctaUrl: "/combos",
      imageSrc: "/images/combo-kids.jpg",
      bgColor: "#E1F1FD",
      borderColor: "#C6E4FA",
      layout: "image-left",
      isActive: true,
    };
    setPromoComboCards([...promoComboCards, newCard]);
    toast.success("New combo card added");
  };

  const updatePromoComboCard = (idx: number, patch: Partial<DynamicPromoComboCard>) => {
    setPromoComboCards(promoComboCards.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };

  const removePromoComboCard = (idx: number) => {
    if (promoComboCards.length <= 1) {
      toast.error("You must keep at least 1 combo card");
      return;
    }
    setPromoComboCards(promoComboCards.filter((_, i) => i !== idx));
    toast.info("Combo card removed");
  };

  // --- CRUD: TRENDING PRODUCT CARDS ---
  const addTrendingProduct = () => {
    const newProduct: DynamicTrendingProduct = {
      id: `tp-${Date.now()}`,
      name: "New Uniform Product",
      subtitle: "100% Cotton • Durable Stitching",
      schoolName: "Universal School Uniform",
      categoryName: "Uniforms",
      mrp: 999,
      sellingPrice: 699,
      discountBadge: "30% OFF",
      rating: 4.8,
      reviewCount: 45,
      imageUrl: "/images/shirt.jpg",
      productUrl: "/products",
      isBestseller: true,
      isActive: true,
    };
    setTrendingProducts([...trendingProducts, newProduct]);
    toast.success("New trending product card added");
  };

  const updateTrendingProduct = (idx: number, patch: Partial<DynamicTrendingProduct>) => {
    setTrendingProducts(trendingProducts.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const removeTrendingProduct = (idx: number) => {
    if (trendingProducts.length <= 1) {
      toast.error("You must keep at least 1 trending product");
      return;
    }
    setTrendingProducts(trendingProducts.filter((_, i) => i !== idx));
    toast.info("Trending product removed");
  };

  // Auth Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy-950 text-white shadow-md">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-black text-brand-navy-950">
              Super-Admin CMS Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Enter your Super-Admin Secret Key to configure dynamic homepage content, upload photos, and manage live cards.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="Enter Super-Admin Key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && verifyAndLoad()}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-slate-900 font-medium focus:border-brand-navy-950 focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => verifyAndLoad()}
              disabled={isLoading}
              className="w-full rounded-2xl bg-brand-navy-950 py-3 text-sm font-black text-white hover:bg-brand-navy-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 text-amber-400" />
                  <span>Authenticate as Super-Admin</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy-950 text-white font-black text-sm">
              TB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-black text-brand-navy-950">
                  TirupatiBalajee CMS
                </span>
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">
                Dynamic Homepage & Full Live Preview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleResetDefaults}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-black text-white hover:bg-brand-navy-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5 text-amber-400" />
                  <span>Publish Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main CMS Layout */}
      <Container size="xl" className="mt-4 sm:mt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-black transition-all shrink-0 ${
              activeTab === "categories"
                ? "bg-brand-navy-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Layout className="h-3.5 w-3.5" />
            <span>Category Cards ({categoryCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-black transition-all shrink-0 ${
              activeTab === "hero"
                ? "bg-brand-navy-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Hero Slides ({heroSlides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("promos")}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-black transition-all shrink-0 ${
              activeTab === "promos"
                ? "bg-brand-navy-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Summer/Winter Promos ({promoSplitCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("combos")}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-black transition-all shrink-0 ${
              activeTab === "combos"
                ? "bg-brand-navy-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Combos & Thermals ({promoComboCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("trending")}
            className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-xs font-black transition-all shrink-0 ${
              activeTab === "trending"
                ? "bg-brand-navy-950 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Trending Products ({trendingProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("preview")}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition-all shrink-0 ml-auto ${
              activeTab === "preview"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>👁️ Live Multi-Device Preview</span>
          </button>
        </div>

        {/* Tab 1: Category Cards CRUD */}
        {activeTab === "categories" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-black text-brand-navy-950">
                  Shop By Category Cards (CRUD)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Create, edit, reorder, delete, and upload photos for category navigation cards.
                </p>
              </div>
              <button
                onClick={addCategoryCard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 text-white px-3.5 py-2 text-xs font-bold hover:bg-brand-navy-800 transition-colors shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Category Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-card space-y-4 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header with order and action buttons */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={card.name}
                          onChange={(e) =>
                            updateCategoryCard(idx, { name: e.target.value })
                          }
                          className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-brand-navy-950 focus:outline-none"
                          placeholder="Category Title"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItemUp(categoryCards, idx, setCategoryCards)}
                          disabled={idx === 0}
                          title="Move up"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveItemDown(categoryCards, idx, setCategoryCards)}
                          disabled={idx === categoryCards.length - 1}
                          title="Move down"
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeCategoryCard(idx)}
                          title="Delete card"
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image Upload / URL */}
                    <ImageUploadField
                      label="Card Photo (Upload or URL)"
                      value={card.imageSrc || ""}
                      onChange={(url) => updateCategoryCard(idx, { imageSrc: url })}
                      adminKey={adminKey}
                    />

                    {/* Badge Emoji and Link */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Emoji</label>
                        <input
                          type="text"
                          value={card.badgeEmoji || ""}
                          onChange={(e) =>
                            updateCategoryCard(idx, { badgeEmoji: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-center font-bold"
                          placeholder="☀️"
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Link URL</label>
                        <input
                          type="text"
                          value={card.href || ""}
                          onChange={(e) =>
                            updateCategoryCard(idx, { href: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                          placeholder="/category/..."
                        />
                      </div>
                    </div>

                    {/* Subtitle Lines */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-600">
                        Subtitle Text Lines
                      </label>
                      <input
                        type="text"
                        value={card.subtitleLine1 || ""}
                        onChange={(e) =>
                          updateCategoryCard(idx, { subtitleLine1: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                        placeholder="Line 1: Light. Breathable."
                      />
                      <input
                        type="text"
                        value={card.subtitleLine2 || ""}
                        onChange={(e) =>
                          updateCategoryCard(idx, { subtitleLine2: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                        placeholder="Line 2: All-Day Comfort."
                      />
                    </div>
                  </div>

                  {/* Active status */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={card.isActive !== false}
                        onChange={(e) =>
                          updateCategoryCard(idx, { isActive: e.target.checked })
                        }
                        className="rounded text-brand-navy-950"
                      />
                      <span className="font-bold text-slate-700">Card Active</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Hero Carousel CRUD */}
        {activeTab === "hero" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-black text-brand-navy-950">
                  Hero Slides Carousel (CRUD)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Add, edit, reorder, and upload photos for top hero slides.
                </p>
              </div>
              <button
                onClick={addHeroSlide}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 text-white px-3.5 py-2 text-xs font-bold hover:bg-brand-navy-800 transition-colors shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Hero Slide</span>
              </button>
            </div>

            <div className="space-y-4">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-brand-navy-950 text-white px-2.5 py-1 rounded-md">
                        Slide #{idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        {slide.titleLine1} {slide.titleLine2}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => moveItemUp(heroSlides, idx, setHeroSlides)}
                        disabled={idx === 0}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveItemDown(heroSlides, idx, setHeroSlides)}
                        disabled={idx === heroSlides.length - 1}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeHeroSlide(idx)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <ImageUploadField
                        label="Slide Background Photo (Upload or URL)"
                        value={slide.imageSrc}
                        onChange={(url) => updateHeroSlide(idx, { imageSrc: url })}
                        adminKey={adminKey}
                      />

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Badge Text</label>
                        <input
                          type="text"
                          value={slide.badge}
                          onChange={(e) => updateHeroSlide(idx, { badge: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-amber-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 1</label>
                          <input
                            type="text"
                            value={slide.titleLine1}
                            onChange={(e) => updateHeroSlide(idx, { titleLine1: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Title Line 2</label>
                          <input
                            type="text"
                            value={slide.titleLine2}
                            onChange={(e) => updateHeroSlide(idx, { titleLine2: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Subtitle</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => updateHeroSlide(idx, { subtitle: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">CTA Button Text</label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => updateHeroSlide(idx, { ctaText: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">CTA Button URL</label>
                          <input
                            type="text"
                            value={slide.ctaUrl}
                            onChange={(e) => updateHeroSlide(idx, { ctaUrl: e.target.value })}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Doodle Note Text</label>
                        <input
                          type="text"
                          value={slide.doodleText || ""}
                          onChange={(e) => updateHeroSlide(idx, { doodleText: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium font-handwriting"
                          placeholder="Same Values Every Season"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Sticky Note Text</label>
                          <input
                            type="text"
                            value={slide.stickyNote?.text || ""}
                            onChange={(e) =>
                              updateHeroSlide(idx, {
                                stickyNote: { ...slide.stickyNote, text: e.target.value },
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Sticky Subtext</label>
                          <input
                            type="text"
                            value={slide.stickyNote?.subtext || ""}
                            onChange={(e) =>
                              updateHeroSlide(idx, {
                                stickyNote: {
                                  text: slide.stickyNote?.text || "",
                                  subtext: e.target.value,
                                },
                              })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Summer & Winter Promos (Split Banners CRUD) */}
        {activeTab === "promos" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-black text-brand-navy-950">
                  Promotional Split Cards (CRUD)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Create, edit, reorder, delete, and upload photos for promotional split cards.
                </p>
              </div>
              <button
                onClick={addPromoSplitCard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 text-white px-3.5 py-2 text-xs font-bold hover:bg-brand-navy-800 transition-colors shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Promo Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promoSplitCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{card.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItemUp(promoSplitCards, idx, setPromoSplitCards)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveItemDown(promoSplitCards, idx, setPromoSplitCards)}
                        disabled={idx === promoSplitCards.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removePromoSplitCard(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <ImageUploadField
                    label="Promo Card Photo (Upload or URL)"
                    value={card.imageSrc}
                    onChange={(url) => updatePromoSplitCard(idx, { imageSrc: url })}
                    adminKey={adminKey}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updatePromoSplitCard(idx, { title: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div className="col-span-1 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Icon / Emoji</label>
                      <input
                        type="text"
                        value={card.iconEmoji || ""}
                        onChange={(e) => updatePromoSplitCard(idx, { iconEmoji: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-center font-bold"
                        placeholder="☀️"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Subtitle</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => updatePromoSplitCard(idx, { subtitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Button Text</label>
                      <input
                        type="text"
                        value={card.ctaText}
                        onChange={(e) => updatePromoSplitCard(idx, { ctaText: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Button URL</label>
                      <input
                        type="text"
                        value={card.ctaUrl}
                        onChange={(e) => updatePromoSplitCard(idx, { ctaUrl: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">BG Color (HEX)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={card.bgColor || "#FEF4CE"}
                          onChange={(e) => updatePromoSplitCard(idx, { bgColor: e.target.value })}
                          className="h-8 w-8 rounded-lg cursor-pointer border border-slate-200"
                        />
                        <input
                          type="text"
                          value={card.bgColor || "#FEF4CE"}
                          onChange={(e) => updatePromoSplitCard(idx, { bgColor: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Doodle Note</label>
                      <input
                        type="text"
                        value={card.doodleText || ""}
                        onChange={(e) => updatePromoSplitCard(idx, { doodleText: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium font-handwriting"
                        placeholder="Play Learn Grow ♡"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Combos & Thermals CRUD */}
        {activeTab === "combos" && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <h2 className="text-base font-black text-brand-navy-950">
                  Combos & Thermals Cards (CRUD)
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Create, edit, reorder, delete, and upload photos for combo promo sets.
                </p>
              </div>
              <button
                onClick={addPromoComboCard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 text-white px-3.5 py-2 text-xs font-bold hover:bg-brand-navy-800 transition-colors shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Combo Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {promoComboCards.map((card, idx) => (
                <div
                  key={card.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{card.title}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItemUp(promoComboCards, idx, setPromoComboCards)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveItemDown(promoComboCards, idx, setPromoComboCards)}
                        disabled={idx === promoComboCards.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removePromoComboCard(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <ImageUploadField
                    label="Combo Photo (Upload or URL)"
                    value={card.imageSrc}
                    onChange={(url) => updatePromoComboCard(idx, { imageSrc: url })}
                    adminKey={adminKey}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Tag / Badge</label>
                      <input
                        type="text"
                        value={card.tag || ""}
                        onChange={(e) => updatePromoComboCard(idx, { tag: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                        placeholder="BEST VALUE"
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Card Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updatePromoComboCard(idx, { title: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Subtitle</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => updatePromoComboCard(idx, { subtitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">CTA Text</label>
                      <input
                        type="text"
                        value={card.ctaText}
                        onChange={(e) => updatePromoComboCard(idx, { ctaText: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">CTA URL</label>
                      <input
                        type="text"
                        value={card.ctaUrl}
                        onChange={(e) => updatePromoComboCard(idx, { ctaUrl: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Card Tint</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={card.bgColor || "#E1F1FD"}
                          onChange={(e) => updatePromoComboCard(idx, { bgColor: e.target.value })}
                          className="h-8 w-8 rounded-lg cursor-pointer border border-slate-200"
                        />
                        <input
                          type="text"
                          value={card.bgColor || "#E1F1FD"}
                          onChange={(e) => updatePromoComboCard(idx, { bgColor: e.target.value })}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Photo Position</label>
                      <select
                        value={card.layout || "image-left"}
                        onChange={(e) =>
                          updatePromoComboCard(idx, {
                            layout: e.target.value as "image-left" | "image-right",
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold"
                      >
                        <option value="image-left">Photo Left, Text Right</option>
                        <option value="image-right">Text Left, Photo Right</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Trending Products CRUD */}
        {activeTab === "trending" && (
          <div className="mt-4 space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-black text-brand-navy-950">
                    Trending Section Settings
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure the section title, subtitle, and View All link.
                  </p>
                </div>
                <button
                  onClick={addTrendingProduct}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 text-white px-3.5 py-2 text-xs font-bold hover:bg-brand-navy-800 transition-colors shadow-2xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Product Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Title</label>
                  <input
                    type="text"
                    value={trendingSettings.title}
                    onChange={(e) =>
                      setTrendingSettings({ ...trendingSettings, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={trendingSettings.subtitle}
                    onChange={(e) =>
                      setTrendingSettings({ ...trendingSettings, subtitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">View All URL</label>
                  <input
                    type="text"
                    value={trendingSettings.viewAllHref}
                    onChange={(e) =>
                      setTrendingSettings({ ...trendingSettings, viewAllHref: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingProducts.map((product, idx) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-card space-y-3.5 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { name: e.target.value })
                          }
                          className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-brand-navy-950 focus:outline-none"
                          placeholder="Product Name"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItemUp(trendingProducts, idx, setTrendingProducts)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveItemDown(trendingProducts, idx, setTrendingProducts)}
                          disabled={idx === trendingProducts.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeTrendingProduct(idx)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <ImageUploadField
                      label="Product Photo (Upload or URL)"
                      value={product.imageUrl}
                      onChange={(url) => updateTrendingProduct(idx, { imageUrl: url })}
                      adminKey={adminKey}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Selling Price (₹)</label>
                        <input
                          type="number"
                          value={product.sellingPrice}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { sellingPrice: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-black text-slate-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">MRP (₹)</label>
                        <input
                          type="number"
                          value={product.mrp}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { mrp: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Discount Badge</label>
                        <input
                          type="text"
                          value={product.discountBadge || ""}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { discountBadge: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700"
                          placeholder="29% OFF"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">School / Tag</label>
                        <input
                          type="text"
                          value={product.schoolName || ""}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { schoolName: e.target.value })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                          placeholder="Universal School"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Rating ★</label>
                        <input
                          type="number"
                          step="0.1"
                          max="5"
                          min="1"
                          value={product.rating || 4.8}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { rating: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Reviews Count</label>
                        <input
                          type="number"
                          value={product.reviewCount || 100}
                          onChange={(e) =>
                            updateTrendingProduct(idx, { reviewCount: Number(e.target.value) })
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.isBestseller}
                        onChange={(e) =>
                          updateTrendingProduct(idx, { isBestseller: e.target.checked })
                        }
                        className="rounded text-brand-navy-950"
                      />
                      <span className="font-bold text-slate-700">Best Seller Badge</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.isActive !== false}
                        onChange={(e) =>
                          updateTrendingProduct(idx, { isActive: e.target.checked })
                        }
                        className="rounded text-brand-navy-950"
                      />
                      <span className="font-bold text-slate-700">Active</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: 👁️ LIVE MULTI-DEVICE PREVIEW BEFORE PUBLISHING */}
        {activeTab === "preview" && (
          <div className="mt-4 space-y-4">
            {/* Viewport Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-brand-navy-950 uppercase tracking-wide">
                  Live Viewport:
                </span>
                <div className="flex items-center rounded-2xl bg-slate-100 p-1">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      previewDevice === "desktop"
                        ? "bg-white text-brand-navy-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop (1440px)</span>
                  </button>

                  <button
                    onClick={() => setPreviewDevice("tablet")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      previewDevice === "tablet"
                        ? "bg-white text-brand-navy-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Tablet className="h-3.5 w-3.5" />
                    <span>Tablet (768px)</span>
                  </button>

                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      previewDevice === "mobile"
                        ? "bg-white text-brand-navy-950 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile (390px)</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  ⚡ Interactive Preview with In-Memory Draft Data
                </span>
                <button
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-black transition-colors shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>Approve & Publish Live</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Container */}
            <div className="flex justify-center p-2 sm:p-4 bg-slate-200/80 rounded-3xl overflow-x-auto">
              <div
                style={{
                  width:
                    previewDevice === "desktop"
                      ? "100%"
                      : previewDevice === "tablet"
                      ? "768px"
                      : "390px",
                  maxWidth: "100%",
                  transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-300"
              >
                {/* Simulated Browser Bar */}
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] text-slate-500 bg-white py-1 rounded-md border border-slate-200 mx-2">
                    https://tirupatibalajidresses.com (DRAFT PREVIEW)
                  </div>
                </div>

                {/* Rendered In-Memory Dynamic Components */}
                <div className="p-2 sm:p-4 space-y-4">
                  <HeroCarousel slides={heroSlides} />
                  <CategoryGrid cards={categoryCards} />
                  <PromoSplit cards={promoSplitCards} />
                  <ProductCarouselSection
                    title={trendingSettings.title}
                    subtitle={trendingSettings.subtitle}
                    viewAllHref={trendingSettings.viewAllHref}
                    dynamicProducts={trendingProducts}
                  />
                  <TrustBar />
                  <PromoCombos cards={promoComboCards} />
                  <TrustFooterBadges />
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
