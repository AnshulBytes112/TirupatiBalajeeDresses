"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Shield,
  Key,
  Layers,
  Layout,
  RefreshCw,
  Eye,
  CheckCircle2,
  X,
  Loader2,
  ArrowUpDown,
  Tag,
  Search,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";
import { BulkImportModal } from "@/components/admin/bulk-import-modal";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  displayOrder: number;
  isActive: boolean;
  children?: CategoryItem[];
  _count?: {
    products?: number;
    subProducts?: number;
  };
}

export default function AdminCategoriesPage() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isBulkImportOpen, setIsBulkImportOpen] = React.useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [editingCategory, setEditingCategory] = React.useState<CategoryItem | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    parentId: "",
    displayOrder: 0,
    isActive: true,
  });
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  // Auto-slug generator
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchCategories(saved);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function fetchCategories(keyToUse?: string, retryCount = 0) {
    const key = (keyToUse || adminKey)?.trim();
    if (!key) {
      setIsCheckingAuth(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/categories?admin=true", {
        headers: { "x-admin-key": key },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCategories(json.data || []);
          setIsAuthorized(true);
          localStorage.setItem("tirupati_admin_key", key);
        }
      } else if (res.status === 401 || res.status === 403) {
        setIsAuthorized(false);
        toast.error("Access denied. Invalid Super-Admin key.");
      } else {
        // 5xx / database connecting on cold start
        if (retryCount < 2) {
          setTimeout(() => fetchCategories(key, retryCount + 1), 1500);
          return;
        }
        setIsAuthorized(true);
        toast.error("Database is warming up. Retrying automatically...");
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchCategories(key, retryCount + 1), 1500);
        return;
      }
      toast.error("Connecting to server...");
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  }

  const handleOpenCreateModal = (parentCategory?: CategoryItem) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: parentCategory ? parentCategory.id : "",
      displayOrder: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryItem) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      parentId: category.parentId || "",
      displayOrder: category.displayOrder,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const parentId =
      formData.parentId && formData.parentId.trim() !== ""
        ? formData.parentId.trim()
        : null;

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || slugify(formData.name),
      description: formData.description.trim() || null,
      imageUrl: formData.imageUrl.trim() || null,
      parentId,
      displayOrder: Number(formData.displayOrder) || 0,
      isActive: Boolean(formData.isActive),
    };

    setIsSaving(true);
    try {
      let res;
      if (editingCategory) {
        res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey,
          },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        toast.success(
          editingCategory
            ? `Category "${payload.name}" updated successfully!`
            : `Category "${payload.name}" created successfully!`
        );
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toast.error(json.error?.message || json.message || "Failed to save category");
      }
    } catch (e) {
      toast.error("An error occurred while saving category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (category: CategoryItem) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${category.name}"? Subcategories and products will be detached or archived.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Category "${category.name}" deleted successfully.`);
        fetchCategories();
      } else {
        toast.error(json.message || "Failed to delete category");
      }
    } catch (e) {
      toast.error("Failed to delete category.");
    }
  };

  // Filter categories by search
  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesName = c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
    const matchesChild = c.children?.some(
      (ch) => ch.name.toLowerCase().includes(q) || ch.slug.toLowerCase().includes(q)
    );
    return matchesName || matchesChild;
  });

  const totalRootCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (acc, cat) => acc + (cat.children?.length || 0),
    0
  );

  // Auth Gate
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1C1917]" />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-md">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#1C1917]">Super Admin Verification</h1>
            <p className="text-xs text-[#78716C]">
              Enter your master administrative key to manage categories &amp; taxonomy.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsCheckingAuth(true);
              fetchCategories(adminKey);
            }}
            className="space-y-4 pt-2"
          >
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter Super-Admin Master Key..."
                className="w-full rounded-xl border border-[#D6C7B2] bg-[#FAF7F2] py-2.5 pl-10 pr-4 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:border-[#1C1917] focus:bg-white focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !adminKey}
              className="w-full rounded-xl bg-[#1C1917] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#292524] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-amber-400" />}
              <span>Verify &amp; Enter Dashboard</span>
            </button>
          </form>

          <div className="border-t border-[#E5DCD3] pt-4 text-[11px] text-[#A8A29E]">
            Default Dev Key: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#1C1917]">super_admin_secret_tirupati_balaji_2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-24">
      {/* Super-Admin Header & Navigation */}
      <SuperAdminNav
        subtitle="Dynamic Category & Taxonomy Architecture Manager"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6C7B2] bg-white px-3 py-1.5 text-xs font-bold text-stone-800 hover:bg-[#F5EFEB] transition-colors shadow-2xs cursor-pointer"
            >
              <UploadCloud className="h-3.5 w-3.5 text-amber-600" />
              <span>Bulk CSV Import</span>
            </button>
            <button
              onClick={() => handleOpenCreateModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-3.5 py-1.5 text-xs font-black text-white hover:bg-brand-navy-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-brand-yellow-400" />
              <span>New Category</span>
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <Container className="pt-6 sm:pt-8 max-w-7xl">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="rounded-2xl border border-[#E5DCD3] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Root Categories
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-navy-50 text-brand-navy-950">
                <FolderTree className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#1C1917]">{totalRootCategories}</div>
            <p className="text-[11px] text-[#78716C] mt-1">Directly accessible via top navigation</p>
          </div>

          <div className="rounded-2xl border border-[#E5DCD3] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Subcategories
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-black text-[#1C1917]">{totalSubcategories}</div>
            <p className="text-[11px] text-[#78716C] mt-1">Nested under parent departments</p>
          </div>

          <div className="rounded-2xl border border-[#E5DCD3] bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                Dynamic Route Pipeline
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-base font-black text-emerald-700">100% Database Driven</div>
            <p className="text-[11px] text-[#78716C] mt-1">
              Changes reflect immediately on <code className="bg-slate-100 px-1 rounded">/shop/[...slug]</code>
            </p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category name or slug..."
              className="w-full rounded-xl border border-[#D6C7B2] bg-white py-2 pl-10 pr-4 text-xs text-[#1C1917] placeholder-slate-400 focus:border-[#1C1917] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => fetchCategories()}
              className="flex items-center gap-1.5 rounded-xl border border-[#D6C7B2] bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/categories"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-[#D6C7B2] bg-white px-3 py-2 text-xs font-bold text-brand-navy-950 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>View Discovery Hub</span>
            </Link>
          </div>
        </div>

        {/* Category Hierarchy List */}
        <div className="rounded-3xl border border-[#E5DCD3] bg-white shadow-xs overflow-hidden">
          <div className="bg-[#FAF7F2] border-b border-[#E5DCD3] px-6 py-3.5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#78716C]">
            <span>Category Hierarchy &amp; Route Mapping</span>
            <span>Actions &amp; Storefront Links</span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-brand-navy-900" />
              <p className="text-xs font-medium">Loading category hierarchy...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-3">
              <FolderTree className="h-10 w-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No categories found</p>
              <button
                onClick={() => handleOpenCreateModal()}
                className="rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Create First Category
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E5DCD3]">
              {filteredCategories.map((cat, index) => (
                <div key={cat.id} className="p-5 hover:bg-[#FAF7F2]/40 transition-colors">
                  {/* Root Category Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-navy-950 text-white font-black text-xs shadow-2xs overflow-hidden">
                        {cat.imageUrl ? (
                          <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-sm sm:text-base font-black text-brand-navy-950">
                            {cat.name}
                          </h3>
                          <code className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                            /shop/{cat.slug}
                          </code>
                          {!cat.isActive && (
                            <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                              Inactive
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-400">
                            (Order: {cat.displayOrder})
                          </span>
                        </div>
                        {cat.description && (
                          <p className="text-xs text-slate-500 mt-0.5 max-w-xl line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenCreateModal(cat)}
                        className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                        title="Add child subcategory"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Child</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(cat)}
                        className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-white transition-colors"
                        title="Edit category & slug"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>

                      <Link
                        href={`/shop/${cat.slug}`}
                        target="_blank"
                        className="flex items-center gap-1 rounded-lg bg-brand-yellow-400/90 hover:bg-brand-yellow-400 px-2.5 py-1.5 text-xs font-black text-brand-navy-950 transition-colors shadow-2xs"
                        title="Preview dynamic PLP"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </Link>

                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories Tree */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-3.5 ml-4 sm:ml-12 pl-4 border-l-2 border-slate-200 space-y-2.5 pt-1">
                      {cat.children.map((child) => (
                        <div
                          key={child.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-900">{child.name}</span>
                            <code className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                              /shop/{cat.slug}/{child.slug}
                            </code>
                            {!child.isActive && (
                              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={() => handleOpenEditModal(child)}
                              className="rounded-lg p-1 text-slate-500 hover:bg-white hover:text-brand-navy-950 transition-colors"
                              title="Edit subcategory"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <Link
                              href={`/shop/${cat.slug}/${child.slug}`}
                              target="_blank"
                              className="rounded-lg p-1 text-brand-navy-950 hover:bg-white transition-colors"
                              title="Preview subcategory PLP"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteCategory(child)}
                              className="rounded-lg p-1 text-slate-400 hover:text-rose-600 transition-colors"
                              title="Delete subcategory"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="max-w-xl w-full rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <FolderTree className="h-5 w-5 text-brand-navy-950" />
                <h3 className="text-base sm:text-lg font-black text-brand-navy-950">
                  {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      slug: editingCategory ? prev.slug : slugify(name),
                    }));
                  }}
                  placeholder="e.g. Lab Coats & Aprons"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-navy-900 focus:outline-hidden"
                />
              </div>

              {/* URL Slug */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  URL Slug (Live Route) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    /shop/
                  </span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                    }
                    placeholder="lab-coats-aprons"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-16 pr-4 text-sm font-mono text-slate-900 focus:border-brand-navy-900 focus:outline-hidden"
                  />
                </div>
                {editingCategory && formData.slug !== editingCategory.slug && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                    <Info className="h-3 w-3" />
                    Slug rename detected: Old slug <code className="bg-amber-100 px-1 rounded">/shop/{editingCategory.slug}</code> will automatically 308 redirect to <code className="bg-amber-100 px-1 rounded">/shop/{formData.slug}</code>!
                  </p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Parent Category (Hierarchy)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parentId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-navy-900 focus:outline-hidden bg-white"
                >
                  <option value="">None (Top-Level Root Category)</option>
                  {categories
                    .filter((c) => !editingCategory || c.id !== editingCategory.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        Parent: {cat.name} (/shop/{cat.slug})
                      </option>
                    ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Description / SEO Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Official certified lab wear and aprons for biology & chemistry laboratories..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-navy-900 focus:outline-hidden"
                />
              </div>

              {/* Image Upload & URL */}
              <ImageUploadField
                label="Category Photo / Thumbnail (Upload or URL)"
                value={formData.imageUrl}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                adminKey={adminKey}
                placeholder="Upload photo file or paste image URL..."
                helpText="Upload a category photo (JPG, PNG, WebP) or paste an image URL. Shows instant preview thumbnail."
              />

              {/* Display Order & Is Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, displayOrder: Number(e.target.value) }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-slate-900 focus:border-brand-navy-900 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="h-4 w-4 rounded-sm accent-brand-navy-900"
                    />
                    <span>Active &amp; Published</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-black text-white hover:bg-brand-navy-800 transition-all shadow-xs flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin text-brand-yellow-400" />}
                  <span>{editingCategory ? "Save Changes" : "Create Category"}</span>
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
        type="categories"
        adminKey={adminKey}
        onSuccess={fetchCategories}
      />
    </div>
  );
}
