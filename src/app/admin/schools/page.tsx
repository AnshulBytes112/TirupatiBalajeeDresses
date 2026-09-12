"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  GraduationCap,
  Plus,
  Search,
  Building2,
  MapPin,
  Globe,
  Trash2,
  Edit2,
  ExternalLink,
  Shield,
  Key,
  Layers,
  Sparkles,
  Shirt,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";
import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";

interface SchoolItem {
  id: string;
  name: string;
  slug: string;
  board?: string | null;
  city: string;
  state: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  description?: string | null;
  website?: string | null;
  isActive: boolean;
  uniformsCount: number;
  createdAt: string;
}

interface SchoolBindingItem {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolSlug: string;
  productId: string;
  productName: string;
  productSku: string;
  productSlug: string;
  categoryName: string;
  productImage: string;
  season: "SUMMER" | "WINTER" | "ALL_SEASON";
  gender: "BOYS" | "GIRLS" | "UNISEX";
  classGrade?: string | null;
  uniformType?: string | null;
  isCompulsory: boolean;
  createdAt: string;
}

interface ProductOption {
  id: string;
  name: string;
  sku: string;
  imageUrl?: string;
  categoryName?: string;
}

export default function AdminSchoolsAndBindingsPage() {
  const [adminKey, setAdminKey] = React.useState("");
  const [isAuthorized, setIsAuthorized] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);

  // Tab: "schools" | "bindings"
  const [activeTab, setActiveTab] = React.useState<"schools" | "bindings">("schools");

  // Schools list state
  const [schools, setSchools] = React.useState<SchoolItem[]>([]);
  const [schoolSearch, setSchoolSearch] = React.useState("");
  const [boardFilter, setBoardFilter] = React.useState("ALL");

  // Bindings list state
  const [bindings, setBindings] = React.useState<SchoolBindingItem[]>([]);
  const [bindingSchoolFilter, setBindingSchoolFilter] = React.useState("ALL");
  const [bindingSeasonFilter, setBindingSeasonFilter] = React.useState("ALL");
  const [bindingGenderFilter, setBindingGenderFilter] = React.useState("ALL");
  const [bindingSearch, setBindingSearch] = React.useState("");

  // Product options for binding creation
  const [productOptions, setProductOptions] = React.useState<ProductOption[]>([]);

  // Modals state
  const [schoolModalOpen, setSchoolModalOpen] = React.useState(false);
  const [editingSchool, setEditingSchool] = React.useState<SchoolItem | null>(null);
  const [schoolForm, setSchoolForm] = React.useState({
    name: "",
    slug: "",
    board: "CBSE",
    city: "Jaipur",
    state: "Rajasthan",
    logoUrl: "",
    bannerUrl: "",
    website: "",
    description: "",
    isActive: true,
  });

  const [bindingModalOpen, setBindingModalOpen] = React.useState(false);
  const [editingBinding, setEditingBinding] = React.useState<SchoolBindingItem | null>(null);
  const [bindingForm, setBindingForm] = React.useState({
    schoolId: "",
    productId: "",
    season: "ALL_SEASON",
    gender: "UNISEX",
    classGrade: "All Classes (Nursery - 12th)",
    uniformType: "Regular Uniform",
    isCompulsory: true,
  });

  const [productSearchInput, setProductSearchInput] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Check super-admin key
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      loadAllData(saved);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function loadAllData(key: string) {
    setIsLoading(true);
    try {
      const [schoolsRes, bindingsRes, prodsRes] = await Promise.all([
        fetch("/api/admin/schools?includeInactive=true", {
          headers: { "x-admin-key": key },
        }).then((r) => r.json()),
        fetch("/api/admin/schools/bindings", {
          headers: { "x-admin-key": key },
        }).then((r) => r.json()),
        fetch("/api/products?limit=100").then((r) => r.json()),
      ]);

      if (schoolsRes.success) {
        setSchools(schoolsRes.data);
        setIsAuthorized(true);
        localStorage.setItem("tirupati_admin_key", key);
      } else {
        setIsAuthorized(false);
      }

      if (bindingsRes.success) {
        setBindings(bindingsRes.data);
      }

      if (prodsRes.success && Array.isArray(prodsRes.data)) {
        setProductOptions(
          prodsRes.data.map((p: any) => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            imageUrl: p.primaryImage || p.images?.[0]?.url || "/images/placeholder.png",
            categoryName: p.categoryName || p.category?.name,
          }))
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load school management data");
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  }

  function handleAuthorize(e: React.FormEvent) {
    e.preventDefault();
    if (!adminKey.trim()) return;
    loadAllData(adminKey.trim());
  }

  // --- School CRUD Handlers ---
  function openCreateSchoolModal() {
    setEditingSchool(null);
    setSchoolForm({
      name: "",
      slug: "",
      board: "CBSE",
      city: "Jaipur",
      state: "Rajasthan",
      logoUrl: "",
      bannerUrl: "",
      website: "",
      description: "",
      isActive: true,
    });
    setSchoolModalOpen(true);
  }

  function openEditSchoolModal(school: SchoolItem) {
    setEditingSchool(school);
    setSchoolForm({
      name: school.name,
      slug: school.slug,
      board: school.board || "CBSE",
      city: school.city,
      state: school.state,
      logoUrl: school.logoUrl || "",
      bannerUrl: school.bannerUrl || "",
      website: school.website || "",
      description: school.description || "",
      isActive: school.isActive,
    });
    setSchoolModalOpen(true);
  }

  async function handleSaveSchool(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolForm.name.trim()) {
      toast.error("School name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingSchool
        ? `/api/admin/schools/${editingSchool.id}`
        : `/api/admin/schools`;
      const method = editingSchool ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(schoolForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error?.message || "Operation failed");
      }

      toast.success(
        editingSchool ? "School updated successfully" : "New school created successfully"
      );
      setSchoolModalOpen(false);
      loadAllData(adminKey);
    } catch (err: any) {
      toast.error(err.message || "Failed to save school");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteSchool(school: SchoolItem) {
    if (
      !confirm(
        `Are you sure you want to delete "${school.name}"? All associated school uniforms will be archived.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/schools/${school.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");

      toast.success(`School "${school.name}" deleted`);
      loadAllData(adminKey);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete school");
    }
  }

  // --- Binding CRUD Handlers ---
  function openCreateBindingModal(preselectedSchoolId?: string) {
    setEditingBinding(null);
    setProductSearchInput("");
    setBindingForm({
      schoolId: preselectedSchoolId || (schools[0]?.id ?? ""),
      productId: productOptions[0]?.id ?? "",
      season: "ALL_SEASON",
      gender: "UNISEX",
      classGrade: "All Classes (Nursery - 12th)",
      uniformType: "Regular Uniform",
      isCompulsory: true,
    });
    setBindingModalOpen(true);
  }

  function openEditBindingModal(binding: SchoolBindingItem) {
    setEditingBinding(binding);
    setProductSearchInput("");
    setBindingForm({
      schoolId: binding.schoolId,
      productId: binding.productId,
      season: binding.season,
      gender: binding.gender,
      classGrade: binding.classGrade || "All Classes",
      uniformType: binding.uniformType || "Regular Uniform",
      isCompulsory: binding.isCompulsory,
    });
    setBindingModalOpen(true);
  }

  async function handleSaveBinding(e: React.FormEvent) {
    e.preventDefault();
    if (!bindingForm.schoolId) {
      toast.error("Please select a school");
      return;
    }
    if (!bindingForm.productId) {
      toast.error("Please select a product");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingBinding
        ? `/api/admin/schools/bindings/${editingBinding.id}`
        : `/api/admin/schools/bindings`;
      const method = editingBinding ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify(bindingForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error?.message || "Operation failed");
      }

      toast.success(
        editingBinding
          ? "School uniform binding updated"
          : "Uniform successfully bound to school!"
      );
      setBindingModalOpen(false);
      loadAllData(adminKey);
    } catch (err: any) {
      toast.error(err.message || "Failed to save binding");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteBinding(binding: SchoolBindingItem) {
    if (
      !confirm(
        `Remove binding for "${binding.productName}" from "${binding.schoolName}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/schools/bindings/${binding.id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete");

      toast.success("Uniform binding removed");
      loadAllData(adminKey);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete binding");
    }
  }

  // Filtered Schools
  const filteredSchools = React.useMemo(() => {
    return schools.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
        s.city.toLowerCase().includes(schoolSearch.toLowerCase()) ||
        (s.board && s.board.toLowerCase().includes(schoolSearch.toLowerCase()));
      const matchesBoard =
        boardFilter === "ALL" || (s.board && s.board.toUpperCase() === boardFilter);
      return matchesSearch && matchesBoard;
    });
  }, [schools, schoolSearch, boardFilter]);

  // Filtered Bindings
  const filteredBindings = React.useMemo(() => {
    return bindings.filter((b) => {
      const matchesSchool =
        bindingSchoolFilter === "ALL" || b.schoolId === bindingSchoolFilter;
      const matchesSeason =
        bindingSeasonFilter === "ALL" || b.season === bindingSeasonFilter;
      const matchesGender =
        bindingGenderFilter === "ALL" || b.gender === bindingGenderFilter;
      const matchesSearch =
        b.productName.toLowerCase().includes(bindingSearch.toLowerCase()) ||
        b.productSku.toLowerCase().includes(bindingSearch.toLowerCase()) ||
        b.schoolName.toLowerCase().includes(bindingSearch.toLowerCase());
      return matchesSchool && matchesSeason && matchesGender && matchesSearch;
    });
  }, [bindings, bindingSchoolFilter, bindingSeasonFilter, bindingGenderFilter, bindingSearch]);

  // Filtered products for dropdown selection in binding modal
  const filteredProductOptions = React.useMemo(() => {
    if (!productSearchInput.trim()) return productOptions;
    const q = productSearchInput.toLowerCase();
    return productOptions.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    );
  }, [productOptions, productSearchInput]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <DressLoadingBuffer size="lg" message="Verifying Super-Admin Credentials..." />
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-[#E5DCD3] bg-white p-8 shadow-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy-950 text-amber-400 mb-6 shadow-md">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-brand-navy-950 uppercase tracking-wide">
            Super-Admin Gate
          </h2>
          <p className="text-xs text-stone-500 mt-2">
            Enter your secret key to manage affiliated schools, uniform bindings, and pattern specifications.
          </p>
          <form onSubmit={handleAuthorize} className="mt-6 space-y-4">
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
              <input
                type="password"
                placeholder="Enter Super-Admin Key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full rounded-xl border border-stone-200 py-3 pl-10 pr-4 text-xs font-mono font-bold focus:border-brand-navy-950 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-brand-navy-950 py-3.5 text-xs font-black uppercase tracking-wider text-amber-400 shadow-md hover:bg-stone-900 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Access School Management</span>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      {/* Super Admin Top Navigation */}
      <SuperAdminNav
        subtitle="Affiliated Schools & Official Uniform Bindings CMS"
        actions={
          <button
            onClick={() => loadAllData(adminKey)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD3] bg-white px-3 py-1.5 text-xs font-bold text-stone-700 shadow-xs hover:bg-stone-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        }
      />

      <Container className="pt-6">
        {/* Header Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Total Affiliated Schools
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-brand-navy-950">{schools.length}</span>
              <GraduationCap className="h-5 w-5 text-amber-500" />
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Active Uniform Bindings
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-brand-navy-950">{bindings.length}</span>
              <Shirt className="h-5 w-5 text-sky-600" />
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Boards Covered
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-brand-navy-950">CBSE / ICSE / RBSE</span>
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Prescribed Uniforms
            </span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-brand-navy-950">100% Certified</span>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Tab Selector & Main Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("schools")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "schools"
                  ? "bg-brand-navy-950 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Affiliated Schools ({schools.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("bindings")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "bindings"
                  ? "bg-brand-navy-950 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Uniform Bindings ({bindings.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "schools" ? (
              <button
                onClick={openCreateSchoolModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow-400 hover:bg-yellow-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand-navy-950 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Affiliated School</span>
              </button>
            ) : (
              <button
                onClick={() => openCreateBindingModal()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-yellow-400 hover:bg-yellow-300 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-brand-navy-950 shadow-xs active:scale-98 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Bind Uniform to School</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. TAB 1: AFFILIATED SCHOOLS */}
        {activeTab === "schools" && (
          <div className="space-y-4">
            {/* Search & Board Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by school name, city, or board..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-stone-400 shrink-0" />
                <select
                  value={boardFilter}
                  onChange={(e) => setBoardFilter(e.target.value)}
                  className="w-full sm:w-44 rounded-xl border border-stone-200 bg-white py-2.5 px-3 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Boards</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="RBSE">RBSE / State Board</option>
                  <option value="IB">IB / International</option>
                </select>
              </div>
            </div>

            {/* Schools Grid Cards */}
            {isLoading ? (
              <DressLoadingBuffer size="md" message="Loading Affiliated Schools..." />
            ) : filteredSchools.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-stone-300 mb-3" />
                <h3 className="text-base font-bold text-stone-700">No schools found</h3>
                <p className="text-xs text-stone-400 mt-1">Try adjusting your search or add a new school.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSchools.map((school) => (
                  <div
                    key={school.id}
                    className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden shrink-0">
                            {school.logoUrl ? (
                              <Image
                                src={school.logoUrl}
                                alt={school.name}
                                width={48}
                                height={48}
                                className="object-cover h-full w-full"
                              />
                            ) : (
                              <Building2 className="h-6 w-6 text-brand-navy-900" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-brand-navy-950 leading-tight">
                              {school.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {school.board && (
                                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[10px] font-black uppercase text-stone-700">
                                  {school.board}
                                </span>
                              )}
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  school.isActive
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {school.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                          <span>
                            {school.city}, {school.state}
                          </span>
                        </div>
                        {school.website && (
                          <div className="flex items-center gap-2">
                            <Globe className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                            <a
                              href={school.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sky-600 hover:underline truncate"
                            >
                              {school.website.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Shirt className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="font-bold text-brand-navy-950">
                            {school.uniformsCount} Uniforms Bound
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setBindingSchoolFilter(school.id);
                            setActiveTab("bindings");
                          }}
                          className="rounded-lg bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 text-[11px] font-bold text-brand-navy-950 transition-colors cursor-pointer"
                        >
                          View Bindings ({school.uniformsCount})
                        </button>
                        <button
                          onClick={() => openCreateBindingModal(school.id)}
                          title="Bind new uniform"
                          className="rounded-lg bg-amber-50 hover:bg-amber-100 p-1.5 text-amber-800 transition-colors cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditSchoolModal(school)}
                          className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
                          title="Edit School"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchool(school)}
                          className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete School"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. TAB 2: UNIFORM BINDINGS */}
        {activeTab === "bindings" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search uniform or SKU..."
                  value={bindingSearch}
                  onChange={(e) => setBindingSearch(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-1.5 pl-9 pr-3 text-xs font-medium focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div>
                <select
                  value={bindingSchoolFilter}
                  onChange={(e) => setBindingSchoolFilter(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Schools</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={bindingSeasonFilter}
                  onChange={(e) => setBindingSeasonFilter(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Seasons</option>
                  <option value="SUMMER">Summer Season</option>
                  <option value="WINTER">Winter Season</option>
                  <option value="ALL_SEASON">All-Season / Year-Round</option>
                </select>
              </div>

              <div>
                <select
                  value={bindingGenderFilter}
                  onChange={(e) => setBindingGenderFilter(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50/50 py-1.5 px-3 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden cursor-pointer"
                >
                  <option value="ALL">All Genders</option>
                  <option value="BOYS">Boys Uniform</option>
                  <option value="GIRLS">Girls Uniform</option>
                  <option value="UNISEX">Unisex Uniform</option>
                </select>
              </div>
            </div>

            {/* Bindings Table */}
            {isLoading ? (
              <DressLoadingBuffer size="md" message="Loading Uniform Bindings..." />
            ) : filteredBindings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-12 text-center">
                <Shirt className="h-12 w-12 mx-auto text-stone-300 mb-3" />
                <h3 className="text-base font-bold text-stone-700">No uniform bindings found</h3>
                <p className="text-xs text-stone-400 mt-1">
                  Bind products to schools to ensure correct pattern compliance on student orders.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-stone-200 bg-stone-50 text-[11px] font-black uppercase tracking-wider text-stone-500">
                      <tr>
                        <th className="py-3.5 px-4">Product / Uniform</th>
                        <th className="py-3.5 px-4">Affiliated School</th>
                        <th className="py-3.5 px-4">Season</th>
                        <th className="py-3.5 px-4">Gender</th>
                        <th className="py-3.5 px-4">Grade / Class</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Prescribed</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredBindings.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden shrink-0 relative">
                                <Image
                                  src={b.productImage}
                                  alt={b.productName}
                                  width={40}
                                  height={40}
                                  className="object-cover h-full w-full"
                                />
                              </div>
                              <div>
                                <div className="font-bold text-brand-navy-950 line-clamp-1">
                                  {b.productName}
                                </div>
                                <div className="text-[10px] text-stone-400 font-mono">
                                  SKU: {b.productSku} • {b.categoryName}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{b.schoolName}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                b.season === "SUMMER"
                                  ? "bg-amber-50 text-amber-700"
                                  : b.season === "WINTER"
                                  ? "bg-indigo-50 text-indigo-700"
                                  : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              {b.season}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-semibold text-stone-700">{b.gender}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-stone-600">{b.classGrade || "All"}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="text-stone-600">{b.uniformType || "Regular"}</span>
                          </td>

                          <td className="py-3 px-4">
                            {b.isCompulsory ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Mandatory
                              </span>
                            ) : (
                              <span className="text-stone-400 text-[11px]">Optional</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => openEditBindingModal(b)}
                                className="rounded-lg p-1.5 text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
                                title="Edit Binding"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBinding(b)}
                                className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete Binding"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>

      {/* MODAL 1: CREATE / EDIT SCHOOL */}
      {schoolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50">
              <h3 className="text-base font-black text-brand-navy-950 uppercase tracking-wide flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-amber-500" />
                {editingSchool ? "Edit Affiliated School" : "Add New Affiliated School"}
              </h3>
              <button
                type="button"
                onClick={() => setSchoolModalOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchool} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi Public School (DPS Jaipur)"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Affiliation Board
                  </label>
                  <select
                    value={schoolForm.board}
                    onChange={(e) => setSchoolForm({ ...schoolForm, board: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold focus:border-brand-navy-950 focus:outline-hidden"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="RBSE">RBSE (Rajasthan Board)</option>
                    <option value="State Board">State Board</option>
                    <option value="IB">IB / Cambridge</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Custom Slug (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. dps-jaipur"
                    value={schoolForm.slug}
                    onChange={(e) => setSchoolForm({ ...schoolForm, slug: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-mono focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur"
                    value={schoolForm.city}
                    onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan"
                    value={schoolForm.state}
                    onChange={(e) => setSchoolForm({ ...schoolForm, state: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-semibold focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Logo / Crest URL
                </label>
                <input
                  type="url"
                  placeholder="https://... or /images/schools/..."
                  value={schoolForm.logoUrl}
                  onChange={(e) => setSchoolForm({ ...schoolForm, logoUrl: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Official Website
                </label>
                <input
                  type="url"
                  placeholder="https://www.dpsjaipur.com"
                  value={schoolForm.website}
                  onChange={(e) => setSchoolForm({ ...schoolForm, website: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Description / Uniform Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Official dress code guidelines, house colors, assembly days..."
                  value={schoolForm.description}
                  onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs focus:border-brand-navy-950 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="school-is-active"
                  checked={schoolForm.isActive}
                  onChange={(e) => setSchoolForm({ ...schoolForm, isActive: e.target.checked })}
                  className="h-4 w-4 rounded-sm accent-brand-navy-950"
                />
                <label htmlFor="school-is-active" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Affiliation Active on Storefront
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchoolModalOpen(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-400 shadow-sm hover:bg-stone-900 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingSchool ? "Update School" : "Save School"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BIND PRODUCT TO SCHOOL */}
      {bindingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50">
              <h3 className="text-base font-black text-brand-navy-950 uppercase tracking-wide flex items-center gap-2">
                <Shirt className="h-5 w-5 text-amber-500" />
                {editingBinding ? "Edit School Uniform Binding" : "Bind Uniform to School"}
              </h3>
              <button
                type="button"
                onClick={() => setBindingModalOpen(false)}
                className="rounded-full p-1 text-stone-400 hover:bg-stone-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBinding} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Target School *
                </label>
                <select
                  required
                  value={bindingForm.schoolId}
                  onChange={(e) => setBindingForm({ ...bindingForm, schoolId: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden"
                >
                  <option value="">Select School...</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.city}, {s.board})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                  Uniform Product *
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search product by title or SKU..."
                    value={productSearchInput}
                    onChange={(e) => setProductSearchInput(e.target.value)}
                    className="w-full rounded-xl border border-stone-200 p-2 text-xs focus:border-brand-navy-950 focus:outline-hidden"
                  />
                  <select
                    required
                    value={bindingForm.productId}
                    onChange={(e) => setBindingForm({ ...bindingForm, productId: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden"
                  >
                    <option value="">Select Uniform Product...</option>
                    {filteredProductOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} [{p.sku}]
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Season
                  </label>
                  <select
                    value={bindingForm.season}
                    onChange={(e) => setBindingForm({ ...bindingForm, season: e.target.value as any })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden"
                  >
                    <option value="ALL_SEASON">All Season / Year Round</option>
                    <option value="SUMMER">Summer Wear</option>
                    <option value="WINTER">Winter Wear</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Gender Specification
                  </label>
                  <select
                    value={bindingForm.gender}
                    onChange={(e) => setBindingForm({ ...bindingForm, gender: e.target.value as any })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-bold text-brand-navy-950 focus:border-brand-navy-950 focus:outline-hidden"
                  >
                    <option value="UNISEX">Unisex (Both)</option>
                    <option value="BOYS">Boys Specific</option>
                    <option value="GIRLS">Girls Specific</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Class / Grade Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nursery - UKG or Class 1 to 5"
                    value={bindingForm.classGrade || ""}
                    onChange={(e) => setBindingForm({ ...bindingForm, classGrade: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-medium focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                    Uniform Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Regular, Sports/PT, House Dress, Blazer"
                    value={bindingForm.uniformType || ""}
                    onChange={(e) => setBindingForm({ ...bindingForm, uniformType: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs font-medium focus:border-brand-navy-950 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="binding-is-compulsory"
                  checked={bindingForm.isCompulsory}
                  onChange={(e) => setBindingForm({ ...bindingForm, isCompulsory: e.target.checked })}
                  className="h-4 w-4 rounded-sm accent-brand-navy-950"
                />
                <label htmlFor="binding-is-compulsory" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Officially Prescribed / Mandatory School Wear
                </label>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBindingModalOpen(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-amber-400 shadow-sm hover:bg-stone-900 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingBinding ? "Update Binding" : "Create Binding"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
