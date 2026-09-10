"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  RotateCcw,
  ExternalLink,
  Shield,
  Key,
  Layers,
  Layout,
  Users,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  X,
  UploadCloud,
  ChevronRight,
  ChevronDown,
  Loader2,
  Sparkles,
  ArrowUpDown,
  Tag,
  GraduationCap,
  Image as ImageIcon,
  Check,
  Eye,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { BulkImportModal } from "@/components/admin/bulk-import-modal";

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  priceRange: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isActive: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  category: { id: string; name: string; slug: string };
  subcategory?: { id: string; name: string; slug: string } | null;
  brand?: { id: string; name: string; slug: string } | null;
  primaryImage: string;
  imagesCount: number;
  variantsCount: number;
  totalStock: number;
  isLowStock: boolean;
  schools: Array<{ id: string; name: string; slug: string }>;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: CategoryOption[];
}

interface SchoolOption {
  id: string;
  name: string;
  slug: string;
}

interface BrandOption {
  id: string;
  name: string;
  slug: string;
}

interface VariantFormData {
  id?: string;
  size: string;
  color?: string;
  sku: string;
  mrp?: number;
  sellingPrice: number;
  priceOverride?: number | null;
  isAvailable: boolean;
  inventory?: {
    availableQuantity: number;
    reservedQuantity: number;
    lowStockThreshold: number;
    warehouseLocation?: string | null;
  };
}

interface ImageFormData {
  id?: string;
  url: string;
  alt?: string;
  displayOrder: number;
  isPrimary: boolean;
}

interface SchoolUniformFormData {
  schoolId: string;
  season: "SUMMER" | "WINTER" | "ALL_SEASON";
  gender: "BOYS" | "GIRLS" | "UNISEX";
  classGrade?: string;
  uniformType?: string;
  isCompulsory: boolean;
}

export default function AdminProductsPage() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Listing State
  const [products, setProducts] = React.useState<ProductListItem[]>([]);
  const [pagination, setPagination] = React.useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [search, setSearch] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>("newest");

  // Options State
  const [categoriesTree, setCategoriesTree] = React.useState<CategoryOption[]>([]);
  const [flatCategories, setFlatCategories] = React.useState<CategoryOption[]>([]);
  const [schools, setSchools] = React.useState<SchoolOption[]>([]);
  const [brands, setBrands] = React.useState<BrandOption[]>([]);

  // Modal / Form State
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = React.useState<"basic" | "variants" | "images" | "schools">("basic");

  // Form Field State
  const [formName, setFormName] = React.useState<string>("");
  const [formSlug, setFormSlug] = React.useState<string>("");
  const [formSku, setFormSku] = React.useState<string>("");
  const [formDescription, setFormDescription] = React.useState<string>("");
  const [formFabric, setFormFabric] = React.useState<string>("");
  const [formCare, setFormCare] = React.useState<string>("");
  const [formMrp, setFormMrp] = React.useState<number>(799);
  const [formSellingPrice, setFormSellingPrice] = React.useState<number>(499);
  const [formCategoryId, setFormCategoryId] = React.useState<string>("");
  const [formSubcategoryId, setFormSubcategoryId] = React.useState<string>("");
  const [formBrandId, setFormBrandId] = React.useState<string>("");
  const [formStatus, setFormStatus] = React.useState<"PUBLISHED" | "DRAFT" | "ARCHIVED">("PUBLISHED");
  const [formIsFeatured, setFormIsFeatured] = React.useState<boolean>(false);
  const [formIsBestseller, setFormIsBestseller] = React.useState<boolean>(false);
  const [formSeoTitle, setFormSeoTitle] = React.useState<string>("");
  const [formSeoDescription, setFormSeoDescription] = React.useState<string>("");

  // Relational Form State
  const [formImages, setFormImages] = React.useState<ImageFormData[]>([]);
  const [formVariants, setFormVariants] = React.useState<VariantFormData[]>([]);
  const [formSchools, setFormSchools] = React.useState<SchoolUniformFormData[]>([]);

  // New Image URL scratch input
  const [scratchImageUrl, setScratchImageUrl] = React.useState<string>("");

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      authenticateAndLoad(saved);
    }
  }, []);

  // Fetch when filters or page change
  React.useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [pagination.page, search, statusFilter, categoryFilter, sortBy, isAuthorized]);

  async function authenticateAndLoad(keyToUse?: string) {
    const key = keyToUse || adminKey;
    if (!key) return;

    setIsLoading(true);
    try {
      // 1. Test key via analytics route
      const authRes = await fetch("/api/admin/analytics?timeframe=7d", {
        headers: { "x-admin-key": key },
      });

      if (!authRes.ok) {
        setIsAuthorized(false);
        toast.error("Invalid Super-Admin credentials.");
        setIsLoading(false);
        return;
      }

      setIsAuthorized(true);
      localStorage.setItem("tirupati_admin_key", key);

      // 2. Load auxiliary dropdown data
      loadMetadata();
    } catch (err) {
      toast.error("Failed to authenticate with Super Admin API");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMetadata() {
    try {
      const [catsRes, schoolsRes, brandsRes] = await Promise.all([
        fetch("/api/categories?format=tree").then((r) => r.json()),
        fetch("/api/schools").then((r) => r.json()).catch(() => ({ data: [] })),
        fetch("/api/brands").then((r) => r.json()).catch(() => ({ data: [] })),
      ]);

      if (catsRes.success && Array.isArray(catsRes.data)) {
        setCategoriesTree(catsRes.data);
        const flats: CategoryOption[] = [];
        catsRes.data.forEach((parent: any) => {
          flats.push(parent);
          if (Array.isArray(parent.children)) {
            parent.children.forEach((child: any) => flats.push(child));
          }
        });
        setFlatCategories(flats);
      }

      if (schoolsRes.success && Array.isArray(schoolsRes.data)) {
        setSchools(schoolsRes.data);
      }

      if (brandsRes.success && Array.isArray(brandsRes.data)) {
        setBrands(brandsRes.data);
      }
    } catch (e) {
      console.error("Failed to load metadata:", e);
    }
  }

  async function fetchProducts() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        sortBy,
      });

      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("categoryId", categoryFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: { "x-admin-key": adminKey },
      });

      if (!res.ok) throw new Error("Failed to load products");
      const json = await res.json();

      if (json.success) {
        setProducts(json.data);
        if (json.meta?.pagination) {
          setPagination(json.meta.pagination);
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load products list");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenCreateModal() {
    setEditingProductId(null);
    setFormName("");
    setFormSlug("");
    setFormSku(`TB-${Date.now().toString().slice(-6)}`);
    setFormDescription("");
    setFormFabric("100% Breathable Combed Cotton (Official School Spec)");
    setFormCare("Machine wash warm with like colors. Warm iron if needed.");
    setFormMrp(699);
    setFormSellingPrice(499);
    setFormCategoryId(flatCategories[0]?.id || "");
    setFormSubcategoryId("");
    setFormBrandId("");
    setFormStatus("PUBLISHED");
    setFormIsFeatured(false);
    setFormIsBestseller(false);
    setFormSeoTitle("");
    setFormSeoDescription("");

    // Default Images
    setFormImages([
      {
        url: "/images/shirt.jpg",
        alt: "Front View",
        displayOrder: 0,
        isPrimary: true,
      },
    ]);

    // Default standard uniform variants
    const standardSizes = ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"];
    setFormVariants(
      standardSizes.map((sz, idx) => ({
        size: sz,
        color: "Navy Blue / White",
        sku: `SKU-${sz}-${Date.now().toString().slice(-4)}`,
        mrp: 699,
        sellingPrice: 499,
        isAvailable: true,
        inventory: {
          availableQuantity: 50,
          reservedQuantity: 0,
          lowStockThreshold: 10,
          warehouseLocation: `Rack-${String.fromCharCode(65 + idx)}-10`,
        },
      }))
    );

    // Default school assignment
    setFormSchools([]);

    setActiveFormTab("basic");
    setIsModalOpen(true);
  }

  async function handleOpenEditModal(productId: string) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("Failed to load product details");
      const json = await res.json();
      const p = json.data;

      setEditingProductId(p.id);
      setFormName(p.name);
      setFormSlug(p.slug);
      setFormSku(p.sku);
      setFormDescription(p.description);
      setFormFabric(p.fabricDetails || "");
      setFormCare(p.careInstructions || "");
      setFormMrp(p.mrp);
      setFormSellingPrice(p.sellingPrice);
      setFormCategoryId(p.categoryId);
      setFormSubcategoryId(p.subcategoryId || "");
      setFormBrandId(p.brandId || "");
      setFormStatus(p.status);
      setFormIsFeatured(p.isFeatured);
      setFormIsBestseller(p.isBestseller);
      setFormSeoTitle(p.seoTitle || "");
      setFormSeoDescription(p.seoDescription || "");

      setFormImages(p.images || []);
      setFormVariants(p.variants || []);
      setFormSchools(
        (p.schools || []).map((s: any) => ({
          schoolId: s.schoolId,
          season: s.season,
          gender: s.gender,
          classGrade: s.classGrade,
          uniformType: s.uniformType,
          isCompulsory: s.isCompulsory,
        }))
      );

      setActiveFormTab("basic");
      setIsModalOpen(true);
    } catch (e: any) {
      toast.error(e.message || "Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim() || !formCategoryId) {
      toast.error("Please fill in required fields (Name, SKU, Category)");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        sku: formSku.trim(),
        description: formDescription.trim(),
        fabricDetails: formFabric.trim() || undefined,
        careInstructions: formCare.trim() || undefined,
        mrp: Number(formMrp),
        sellingPrice: Number(formSellingPrice),
        categoryId: formCategoryId,
        subcategoryId: formSubcategoryId || null,
        brandId: formBrandId || null,
        status: formStatus,
        isFeatured: formIsFeatured,
        isBestseller: formIsBestseller,
        seoTitle: formSeoTitle.trim() || undefined,
        seoDescription: formSeoDescription.trim() || undefined,
        images: formImages,
        variants: formVariants,
        schools: formSchools,
      };

      const url = editingProductId
        ? `/api/admin/products/${editingProductId}`
        : `/api/admin/products`;
      const method = editingProductId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save product");
      }

      toast.success(
        editingProductId ? "Product updated successfully" : "Product created successfully"
      );
      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchiveProduct(productId: string, productName: string) {
    if (!confirm(`Are you sure you want to archive "${productName}"? It will no longer appear on the public store.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success(`"${productName}" has been archived.`);
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message || "Failed to archive product");
    }
  }

  async function handleRestoreProduct(productId: string, productName: string) {
    try {
      const res = await fetch(`/api/admin/products/${productId}/restore`, {
        method: "POST",
        headers: { "x-admin-key": adminKey },
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      toast.success(`"${productName}" restored to published state.`);
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message || "Failed to restore product");
    }
  }

  // --- Variant Handlers ---
  function handleAddVariant() {
    const size = prompt("Enter size (e.g. 6Y, 8Y, S, M, L, XL, 32):", "8Y");
    if (!size) return;

    setFormVariants((prev) => [
      ...prev,
      {
        size: size.trim(),
        color: "Navy Blue / White",
        sku: `SKU-${size.trim().toUpperCase()}-${Date.now().toString().slice(-4)}`,
        mrp: formMrp,
        sellingPrice: formSellingPrice,
        isAvailable: true,
        inventory: {
          availableQuantity: 25,
          reservedQuantity: 0,
          lowStockThreshold: 5,
          warehouseLocation: "Warehouse 1",
        },
      },
    ]);
  }

  function handleRemoveVariant(idx: number) {
    setFormVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  // --- Image Handlers ---
  function handleAddImage() {
    if (!scratchImageUrl.trim()) return;
    setFormImages((prev) => [
      ...prev,
      {
        url: scratchImageUrl.trim(),
        alt: formName || "Product photo",
        displayOrder: prev.length,
        isPrimary: prev.length === 0,
      },
    ]);
    setScratchImageUrl("");
  }

  function handleSetPrimaryImage(idx: number) {
    setFormImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isPrimary: i === idx,
      }))
    );
  }

  function handleRemoveImage(idx: number) {
    setFormImages((prev) => {
      const filtered = prev.filter((_, i) => i !== idx);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  }

  // --- School Binding Handlers ---
  function handleToggleSchool(schoolId: string) {
    setFormSchools((prev) => {
      const exists = prev.some((s) => s.schoolId === schoolId);
      if (exists) {
        return prev.filter((s) => s.schoolId !== schoolId);
      } else {
        return [
          ...prev,
          {
            schoolId,
            season: "ALL_SEASON",
            gender: "UNISEX",
            classGrade: "Nursery - Class 12",
            uniformType: "Official Uniform",
            isCompulsory: true,
          },
        ];
      }
    });
  }

  // Authentication Gate Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-md">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-black text-[#1C1917]">
              Product Catalog Super-Admin
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Enter your Super-Admin Secret Key to manage uniforms, variants, category hierarchies, inventory, and school bindings.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                placeholder="Enter Super-Admin Secret Key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && authenticateAndLoad(adminKey)}
                className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-sm text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => authenticateAndLoad(adminKey)}
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#1C1917] py-3 text-sm font-black text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 text-amber-400" />
                  <span>Authenticate &amp; Access Catalog</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-20">
      {/* Shared Super Admin Header & Navigation */}
      <SuperAdminNav activeTab="products" />

      {/* Main Container */}
      <Container size="xl" className="mt-5 space-y-6">
        {/* Actions Bar & Summary */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E5DCD3] bg-white p-5 shadow-xs">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
              Products &amp; Uniforms Catalog
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {pagination.total} Total Products listed across all school boards &amp; categories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#D6C7B2] bg-white px-4 py-2.5 text-xs font-bold text-stone-800 hover:bg-[#FAF7F2] shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-amber-600" />
              <span>Bulk CSV Import</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1C1917] px-4 py-2.5 text-xs font-black text-white hover:bg-stone-800 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Plus className="h-4 w-4 text-amber-400" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={fetchProducts}
              disabled={isLoading}
              className="p-2.5 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] text-stone-700 hover:bg-white transition-colors cursor-pointer"
              title="Refresh Products"
            >
              <RotateCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters & Search Control Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-3xl border border-[#E5DCD3] bg-white shadow-xs">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or school..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-3 py-2 text-xs text-[#1C1917] font-medium focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
          >
            <option value="">All Categories (Hierarchical)</option>
            {flatCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parentId ? `  ↳ ${cat.name}` : cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
          >
            <option value="">All Statuses (Active &amp; Archived)</option>
            <option value="PUBLISHED">Published (Live on Store)</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived / Deactivated</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Sort: Price (Low to High)</option>
            <option value="price_desc">Sort: Price (High to Low)</option>
            <option value="name_asc">Sort: Alphabetical (A-Z)</option>
            <option value="popular">Sort: Bestsellers</option>
          </select>
        </div>

        {/* Product Table */}
        <div className="rounded-3xl border border-[#E5DCD3] bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EFEB] border-b border-[#E5DCD3] text-stone-600 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Info</th>
                  <th className="py-3 px-4">Category &amp; School</th>
                  <th className="py-3 px-4">SKU / Variants</th>
                  <th className="py-3 px-4 text-right">Price Range</th>
                  <th className="py-3 px-4 text-center">Stock Status</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DCD3]">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-amber-500 mb-2" />
                      <p className="font-semibold text-xs">Loading Catalog Products...</p>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-stone-500">
                      <AlertCircle className="h-8 w-8 mx-auto text-stone-400 mb-2" />
                      <p className="font-black text-sm text-[#1C1917]">No products found</p>
                      <p className="text-xs text-stone-500 mt-0.5">Try adjusting your filters or create a new product.</p>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isArchived = p.status === "ARCHIVED";

                    return (
                      <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                        {/* Product Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 rounded-xl bg-stone-100 border border-[#E5DCD3] overflow-hidden shrink-0">
                              <Image
                                src={p.primaryImage}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-[#1C1917] hover:underline cursor-pointer" onClick={() => handleOpenEditModal(p.id)}>
                                  {p.name}
                                </span>
                                {p.isBestseller && (
                                  <span className="rounded bg-amber-100 text-amber-900 border border-amber-300 px-1 py-0.2 text-[9px] font-black">
                                    ★ Bestseller
                                  </span>
                                )}
                                {p.isFeatured && (
                                  <span className="rounded bg-purple-100 text-purple-900 border border-purple-300 px-1 py-0.2 text-[9px] font-black">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <span className="text-[10.5px] text-stone-400 block font-mono">
                                /{p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & School */}
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-800">
                            <Layers className="h-3 w-3 text-stone-400" />
                            <span>{p.category.name}</span>
                            {p.subcategory && (
                              <span className="text-stone-400 font-normal">↳ {p.subcategory.name}</span>
                            )}
                          </div>
                          {p.schools.length > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
                              <GraduationCap className="h-3 w-3 text-amber-600" />
                              <span>{p.schools.map((s) => s.name).join(", ")}</span>
                            </div>
                          )}
                        </td>

                        {/* SKU / Variants */}
                        <td className="py-3.5 px-4 space-y-0.5">
                          <div className="font-mono font-bold text-[#1C1917] text-[11px]">{p.sku}</div>
                          <div className="text-[10px] text-stone-500">
                            {p.variantsCount} {p.variantsCount === 1 ? "Variant" : "Variants"} ({p.imagesCount} Photos)
                          </div>
                        </td>

                        {/* Price Range */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="font-black text-[#1C1917] text-xs">{p.priceRange}</div>
                          <div className="text-[10px] text-stone-400 line-through">MRP ₹{p.mrp}</div>
                        </td>

                        {/* Stock Status */}
                        <td className="py-3.5 px-4 text-center">
                          {p.totalStock <= 0 ? (
                            <span className="inline-flex rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black text-rose-800">
                              Out of Stock
                            </span>
                          ) : p.isLowStock ? (
                            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-black text-amber-900 border border-amber-300">
                              Low ({p.totalStock} left)
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                              {p.totalStock} in stock
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                              p.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-800"
                                : p.status === "DRAFT"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(p.id)}
                              className="p-1.5 rounded-lg border border-[#E5DCD3] bg-white text-stone-700 hover:bg-[#FAF7F2] hover:text-[#1C1917] transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-[#E5DCD3] bg-white text-stone-700 hover:bg-[#FAF7F2] hover:text-[#1C1917] transition-colors"
                              title="View on Storefront"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {isArchived ? (
                              <button
                                onClick={() => handleRestoreProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                title="Restore Product"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleArchiveProduct(p.id, p.name)}
                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                title="Archive / Deactivate Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E5DCD3] p-4 bg-[#FAF7F2]">
              <span className="text-xs text-stone-500 font-medium">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} items)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page <= 1}
                  className="rounded-xl border border-[#E5DCD3] bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPagination((prev) => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-xl border border-[#E5DCD3] bg-white px-3 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* ==================================================== */}
      {/* PRODUCT CREATE / EDIT FULL DRAWER MODAL */}
      {/* ==================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="relative flex flex-col max-h-[92vh] w-full max-w-4xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-[#E5DCD3] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E5DCD3] bg-[#FAF7F2] px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C1917] text-white">
                  <Package className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-[#1C1917]">
                    {editingProductId ? `Edit Product: ${formName}` : "Create New Product"}
                  </h2>
                  <p className="text-[11px] text-stone-500 font-semibold">
                    Configure base specifications, variants, category hierarchies, and inventory.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-[#E5DCD3] px-6 gap-2 bg-white text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveFormTab("basic")}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeFormTab === "basic"
                    ? "border-[#1C1917] text-[#1C1917] font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Basic Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("variants")}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeFormTab === "variants"
                    ? "border-[#1C1917] text-[#1C1917] font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Variants &amp; Inventory ({formVariants.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("images")}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeFormTab === "images"
                    ? "border-[#1C1917] text-[#1C1917] font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Images ({formImages.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab("schools")}
                className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeFormTab === "schools"
                    ? "border-[#1C1917] text-[#1C1917] font-black"
                    : "border-transparent text-stone-500 hover:text-stone-800"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>School Bindings ({formSchools.length})</span>
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TAB 1: BASIC DETAILS */}
              {activeFormTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Delhi Public School Boys Summer Uniform Shirt"
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-bold focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Product SKU *
                      </label>
                      <input
                        type="text"
                        required
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        placeholder="e.g. DPS-BOYS-SHIRT-SS"
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-mono font-bold focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Category (Hierarchical) *
                      </label>
                      <select
                        required
                        value={formCategoryId}
                        onChange={(e) => setFormCategoryId(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
                      >
                        <option value="">Select Category...</option>
                        {categoriesTree.map((cat) => (
                          <optgroup key={cat.id} label={cat.name}>
                            <option value={cat.id}>{cat.name} (Direct)</option>
                            {cat.children?.map((child) => (
                              <option key={child.id} value={child.id}>
                                ↳ {child.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Brand / Manufacturer
                      </label>
                      <select
                        value={formBrandId}
                        onChange={(e) => setFormBrandId(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
                      >
                        <option value="">TirupatiBalajee (Default)</option>
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Lifecycle Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e: any) => setFormStatus(e.target.value)}
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-semibold focus:bg-white focus:outline-hidden"
                      >
                        <option value="PUBLISHED">Published (Live)</option>
                        <option value="DRAFT">Draft</option>
                        <option value="ARCHIVED">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Base MRP (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formMrp}
                        onChange={(e) => setFormMrp(Number(e.target.value))}
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-bold focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Base Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={formSellingPrice}
                        onChange={(e) => setFormSellingPrice(Number(e.target.value))}
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-bold focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                      Product Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Detailed uniform specifications, stitching quality, school pattern compliance..."
                      className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-3 text-xs text-[#1C1917] font-medium focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Fabric &amp; Material Details
                      </label>
                      <input
                        type="text"
                        value={formFabric}
                        onChange={(e) => setFormFabric(e.target.value)}
                        placeholder="e.g. 100% Breathable Combed Cotton, Anti-Sweat"
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-medium focus:bg-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black text-[#1C1917] uppercase mb-1">
                        Care Instructions
                      </label>
                      <input
                        type="text"
                        value={formCare}
                        onChange={(e) => setFormCare(e.target.value)}
                        placeholder="e.g. Machine wash warm with like colors"
                        className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-2.5 text-xs text-[#1C1917] font-medium focus:bg-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Badges Toggle */}
                  <div className="flex items-center gap-6 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E5DCD3]">
                    <label className="flex items-center gap-2 text-xs font-bold text-[#1C1917] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsBestseller}
                        onChange={(e) => setFormIsBestseller(e.target.checked)}
                        className="h-4 w-4 rounded-sm accent-[#1C1917]"
                      />
                      <span>Mark as Bestseller</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-[#1C1917] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="h-4 w-4 rounded-sm accent-[#1C1917]"
                      />
                      <span>Mark as Featured Product</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: VARIANTS & INVENTORY */}
              {activeFormTab === "variants" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-2">
                    <div>
                      <h3 className="text-xs font-black text-[#1C1917] uppercase">
                        Dynamic Variant &amp; Stock List
                      </h3>
                      <p className="text-[11px] text-stone-500 font-medium">
                        Configure size-specific SKUs, selling prices, and real-time inventory counts.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1C1917] text-white px-3 py-1.5 text-xs font-bold hover:bg-stone-800"
                    >
                      <Plus className="h-3.5 w-3.5 text-amber-400" />
                      <span>Add Size Variant</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formVariants.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] space-y-3"
                      >
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                          {/* Size */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-stone-500 block mb-0.5">
                              Size
                            </label>
                            <input
                              type="text"
                              required
                              value={v.size}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormVariants((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, size: val } : item))
                                );
                              }}
                              className="w-full rounded-xl border border-[#E5DCD3] bg-white p-2 text-xs font-bold"
                            />
                          </div>

                          {/* Color */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-stone-500 block mb-0.5">
                              Color
                            </label>
                            <input
                              type="text"
                              value={v.color || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormVariants((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, color: val } : item))
                                );
                              }}
                              className="w-full rounded-xl border border-[#E5DCD3] bg-white p-2 text-xs font-medium"
                            />
                          </div>

                          {/* Variant SKU */}
                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-black uppercase text-stone-500 block mb-0.5">
                              Variant SKU
                            </label>
                            <input
                              type="text"
                              required
                              value={v.sku}
                              onChange={(e) => {
                                const val = e.target.value;
                                setFormVariants((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                                );
                              }}
                              className="w-full rounded-xl border border-[#E5DCD3] bg-white p-2 text-xs font-mono font-bold"
                            />
                          </div>

                          {/* Selling Price */}
                          <div>
                            <label className="text-[10px] font-black uppercase text-stone-500 block mb-0.5">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              required
                              value={v.sellingPrice}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setFormVariants((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, sellingPrice: val } : item))
                                );
                              }}
                              className="w-full rounded-xl border border-[#E5DCD3] bg-white p-2 text-xs font-bold"
                            />
                          </div>

                          {/* Delete Variant */}
                          <div className="flex items-end justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(idx)}
                              className="p-2 rounded-xl text-red-600 hover:bg-red-50"
                              title="Remove Variant"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Inventory sub-row */}
                        <div className="pt-2 border-t border-[#E5DCD3] grid grid-cols-3 sm:grid-cols-4 gap-2 text-[11px]">
                          <div>
                            <label className="text-[10px] font-semibold text-stone-500 block">
                              Available Stock
                            </label>
                            <input
                              type="number"
                              value={v.inventory?.availableQuantity ?? 0}
                              onChange={(e) => {
                                const qty = Number(e.target.value);
                                setFormVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          inventory: {
                                            availableQuantity: qty,
                                            reservedQuantity: item.inventory?.reservedQuantity ?? 0,
                                            lowStockThreshold: item.inventory?.lowStockThreshold ?? 5,
                                            warehouseLocation: item.inventory?.warehouseLocation,
                                          },
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full rounded-lg border border-[#E5DCD3] bg-white p-1.5 text-xs font-bold text-emerald-800"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-stone-500 block">
                              Low Stock Alert
                            </label>
                            <input
                              type="number"
                              value={v.inventory?.lowStockThreshold ?? 5}
                              onChange={(e) => {
                                const th = Number(e.target.value);
                                setFormVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          inventory: {
                                            availableQuantity: item.inventory?.availableQuantity ?? 0,
                                            reservedQuantity: item.inventory?.reservedQuantity ?? 0,
                                            lowStockThreshold: th,
                                            warehouseLocation: item.inventory?.warehouseLocation,
                                          },
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full rounded-lg border border-[#E5DCD3] bg-white p-1.5 text-xs"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="text-[10px] font-semibold text-stone-500 block">
                              Warehouse Shelf / Location
                            </label>
                            <input
                              type="text"
                              value={v.inventory?.warehouseLocation ?? ""}
                              placeholder="e.g. Shelf B-12"
                              onChange={(e) => {
                                const loc = e.target.value;
                                setFormVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          inventory: {
                                            availableQuantity: item.inventory?.availableQuantity ?? 0,
                                            reservedQuantity: item.inventory?.reservedQuantity ?? 0,
                                            lowStockThreshold: item.inventory?.lowStockThreshold ?? 5,
                                            warehouseLocation: loc,
                                          },
                                        }
                                      : item
                                  )
                                );
                              }}
                              className="w-full rounded-lg border border-[#E5DCD3] bg-white p-1.5 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: IMAGES */}
              {activeFormTab === "images" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-4 space-y-3">
                    <p className="text-xs font-bold text-[#1C1917]">Upload or Add Product Photo</p>
                    <ImageUploadField
                      label=""
                      value={scratchImageUrl}
                      onChange={(val) => setScratchImageUrl(val)}
                      adminKey={adminKey}
                      placeholder="Upload file or enter image URL..."
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={!scratchImageUrl}
                        onClick={handleAddImage}
                        className="rounded-xl bg-[#1C1917] px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                      >
                        + Add To Gallery
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {formImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-2xl border p-2 flex flex-col items-center gap-2 ${
                          img.isPrimary ? "border-amber-400 bg-amber-50/50" : "border-[#E5DCD3] bg-[#FAF7F2]"
                        }`}
                      >
                        <div className="relative h-28 w-full rounded-xl bg-white overflow-hidden border border-[#E5DCD3]">
                          <Image
                            src={img.url}
                            alt={img.alt || "Product image"}
                            fill
                            className="object-cover"
                          />
                          {img.isPrimary && (
                            <span className="absolute top-1 left-1 rounded bg-amber-400 text-stone-950 px-1.5 py-0.5 text-[9px] font-black shadow-2xs">
                              Primary
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between w-full px-1 text-[11px]">
                          {!img.isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="text-stone-600 hover:text-black font-bold text-[10px]"
                            >
                              Set Primary
                            </button>
                          ) : (
                            <span className="text-amber-800 font-black text-[10px]">Main Photo</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-red-600 hover:text-red-800 font-bold text-[10px]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SCHOOL BINDINGS */}
              {activeFormTab === "schools" && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-500 font-medium">
                    Select affiliated schools where this uniform item is officially prescribed.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {schools.map((school) => {
                      const isSelected = formSchools.some((s) => s.schoolId === school.id);
                      return (
                        <div
                          key={school.id}
                          onClick={() => handleToggleSchool(school.id)}
                          className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? "border-[#1C1917] bg-[#FAF7F2]"
                              : "border-[#E5DCD3] bg-white hover:border-stone-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-amber-600" />
                            <span className="text-xs font-bold text-[#1C1917]">{school.name}</span>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                              isSelected ? "bg-[#1C1917] text-white border-[#1C1917]" : "border-stone-300"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form Footer Action Buttons */}
              <div className="pt-4 border-t border-[#E5DCD3] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl border border-[#E5DCD3] bg-white px-5 py-2.5 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-[#1C1917] px-6 py-2.5 text-xs font-black text-white hover:bg-stone-800 shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      <span>Saving Product...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      <span>{editingProductId ? "Update Product" : "Publish Product"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        type="products"
        adminKey={adminKey}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
