"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Truck,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X,
  Loader2,
  Search,
  ChevronRight,
  UploadCloud,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Package,
} from "lucide-react";
import { Container } from "@/components/layout/container";

interface ShippingZone {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  shippingCharge: number;
  freeShippingThreshold?: number | null;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  isCodAvailable: boolean;
  dispatchSla: string;
  isActive: boolean;
  _count?: { pincodes: number };
}

interface ShippingPincode {
  id: string;
  pincode: string;
  zoneId: string;
  isServiceable: boolean;
  isCodAvailable?: boolean | null;
  minDeliveryDays?: number | null;
  maxDeliveryDays?: number | null;
  city?: string | null;
  state?: string | null;
  isActive: boolean;
  zone: { name: string; code: string };
}

export default function AdminShippingPage() {
  const [activeTab, setActiveTab] = React.useState<"zones" | "pincodes" | "import">("zones");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [zones, setZones] = React.useState<ShippingZone[]>([]);
  const [pincodes, setPincodes] = React.useState<ShippingPincode[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [selectedZoneFilter, setSelectedZoneFilter] = React.useState<string>("");

  // Zone Modal
  const [isZoneModalOpen, setIsZoneModalOpen] = React.useState(false);
  const [zoneFormData, setZoneFormData] = React.useState({
    name: "",
    code: "",
    description: "",
    shippingCharge: 49,
    freeShippingThreshold: 499,
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    isCodAvailable: true,
    dispatchSla: "Same Day Dispatch",
    isActive: true,
  });

  // Pincode Modal
  const [isPincodeModalOpen, setIsPincodeModalOpen] = React.useState(false);
  const [pincodeFormData, setPincodeFormData] = React.useState({
    pincode: "",
    zoneId: "",
    city: "",
    state: "",
    isServiceable: true,
    isCodAvailable: true,
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
  });

  // CSV Import State
  const [csvContent, setCsvContent] = React.useState("");
  const [isImporting, setIsImporting] = React.useState(false);

  const fetchZones = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/shipping/zones");
      const json = await res.json();
      if (json.success) {
        setZones(json.data);
      }
    } catch (e) {
      toast.error("Failed to load shipping zones");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPincodes = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const url = new URL("/api/admin/shipping/pincodes", window.location.origin);
      if (searchQuery) url.searchParams.set("search", searchQuery);
      if (selectedZoneFilter) url.searchParams.set("zoneId", selectedZoneFilter);
      url.searchParams.set("limit", "100");

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setPincodes(json.data.pincodes);
      }
    } catch (e) {
      toast.error("Failed to load pincodes");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedZoneFilter]);

  React.useEffect(() => {
    fetchZones();
    fetchPincodes();
  }, [fetchZones, fetchPincodes]);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/shipping/zones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneFormData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Shipping Zone created successfully!");
        setIsZoneModalOpen(false);
        fetchZones();
      } else {
        toast.error(json.message || "Failed to create shipping zone");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleCreatePincode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/shipping/pincodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pincodeFormData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Pincode rule saved successfully!");
        setIsPincodeModalOpen(false);
        fetchPincodes();
      } else {
        toast.error(json.message || "Failed to save pincode rule");
      }
    } catch {
      toast.error("An error occurred");
    }
  };

  const handleDeletePincode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pincode override?")) return;
    try {
      const res = await fetch(`/api/admin/shipping/pincodes?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Pincode rule deleted");
        fetchPincodes();
      }
    } catch {
      toast.error("Failed to delete pincode");
    }
  };

  const handleBulkImport = async () => {
    if (!csvContent.trim()) {
      toast.error("Please paste CSV data first");
      return;
    }
    setIsImporting(true);
    try {
      const res = await fetch("/api/admin/shipping/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message);
        setCsvContent("");
        fetchPincodes();
        fetchZones();
        setActiveTab("pincodes");
      } else {
        toast.error(json.message || "Import failed");
      }
    } catch {
      toast.error("An error occurred during import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <Container size="lg">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/admin" className="hover:text-blue-900">
            Super Admin
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-semibold">Shipping & Delivery Management</span>
        </div>

        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-900 p-2 text-yellow-400">
                <Truck className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Shipping & Delivery Management
              </h1>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Configure shipping zones, courier SLAs, PIN code serviceability, delivery charges, and COD rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                fetchZones();
                fetchPincodes();
              }}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-blue-900" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsZoneModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 text-yellow-400" />
              Add Shipping Zone
            </button>
            <button
              onClick={() => {
                if (zones.length > 0) {
                  setPincodeFormData((prev) => ({ ...prev, zoneId: zones[0].id }));
                }
                setIsPincodeModalOpen(true);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
            >
              <MapPin className="h-4 w-4" />
              Add Pincode Rule
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("zones")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "zones"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Building className="h-4 w-4" />
            Shipping Zones ({zones.length})
          </button>
          <button
            onClick={() => setActiveTab("pincodes")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "pincodes"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <MapPin className="h-4 w-4" />
            Configured Pincodes ({pincodes.length})
          </button>
          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "import"
                ? "border-blue-900 text-blue-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            Bulk CSV Import
          </button>
        </div>

        {/* TAB 1: ZONES */}
        {activeTab === "zones" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-900">
                      {zone.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        zone.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {zone.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">{zone.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{zone.description || "No description provided."}</p>

                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping Charge:</span>
                      <span className="font-semibold text-slate-900">
                        {Number(zone.shippingCharge) === 0 ? "FREE" : `₹${zone.shippingCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Free Shipping Above:</span>
                      <span className="font-semibold text-emerald-700">
                        {zone.freeShippingThreshold ? `₹${zone.freeShippingThreshold}` : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Delivery SLA:</span>
                      <span className="font-semibold text-slate-900">
                        {zone.minDeliveryDays} - {zone.maxDeliveryDays} Business Days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">COD Available:</span>
                      <span
                        className={`font-semibold ${
                          zone.isCodAvailable ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {zone.isCodAvailable ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dispatch SLA:</span>
                      <span className="font-semibold text-blue-900">{zone.dispatchSla}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>{zone._count?.pincodes || 0} mapped pincodes</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PINCODES */}
        {activeTab === "pincodes" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by PIN, City, or State..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-4 text-sm focus:border-blue-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedZoneFilter}
                  onChange={(e) => setSelectedZoneFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-900 focus:outline-none"
                >
                  <option value="">All Zones</option>
                  {zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name} ({z.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">PIN Code</th>
                    <th className="px-4 py-3">Zone</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Serviceability</th>
                    <th className="px-4 py-3">COD</th>
                    <th className="px-4 py-3">Delivery SLA</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pincodes.map((pin) => (
                    <tr key={pin.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{pin.pincode}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900">
                          {pin.zone?.name || "Standard Zone"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {pin.city ? `${pin.city}, ${pin.state || ""}` : "Pan-India Fallback"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            pin.isServiceable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {pin.isServiceable ? "Serviceable" : "Unserviceable"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {pin.isCodAvailable === false ? (
                          <span className="font-semibold text-rose-600">Disabled</span>
                        ) : (
                          <span className="font-semibold text-emerald-600">Enabled</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {pin.minDeliveryDays ? `${pin.minDeliveryDays}-${pin.maxDeliveryDays} Days` : "Zone Default"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeletePincode(pin.id)}
                          className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Pincode"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pincodes.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No pincodes found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: BULK IMPORT */}
        {activeTab === "import" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">Bulk Pincode CSV Upload</h3>
            <p className="mt-1 text-sm text-slate-500">
              Paste standard comma-separated values (CSV) with the columns:
              <br />
              <code className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-blue-900">
                pincode,zone_code,serviceable,cod,min_days,max_days,city,state
              </code>
            </p>

            <div className="mt-4">
              <textarea
                rows={10}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder={`pincode,zone_code,serviceable,cod,min_days,max_days,city,state
110001,ZONE_LOCAL,true,true,1,2,New Delhi,Delhi
800001,ZONE_REGIONAL,true,true,2,3,Patna,Bihar
560001,ZONE_NATIONAL,true,true,3,5,Bengaluru,Karnataka`}
                className="w-full rounded-lg border border-slate-300 p-3 font-mono text-xs focus:border-blue-900 focus:outline-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Existing pincodes will be automatically updated, new pincodes created.
              </p>
              <button
                onClick={handleBulkImport}
                disabled={isImporting}
                className="flex items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-800 disabled:opacity-50"
              >
                {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                Process CSV Import
              </button>
            </div>
          </div>
        )}

        {/* Modal: Create Zone */}
        {isZoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Add New Shipping Zone</h3>
                <button
                  onClick={() => setIsZoneModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateZone} className="mt-4 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Zone Name</label>
                  <input
                    type="text"
                    required
                    value={zoneFormData.name}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, name: e.target.value })}
                    placeholder="e.g. Northern Metro Zone"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Zone Code (Unique)</label>
                    <input
                      type="text"
                      required
                      value={zoneFormData.code}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, code: e.target.value.toUpperCase() })}
                      placeholder="ZONE_NORTH"
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm font-mono focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Shipping Charge (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={zoneFormData.shippingCharge}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, shippingCharge: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Free Shipping Min (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={zoneFormData.freeShippingThreshold}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, freeShippingThreshold: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Dispatch SLA</label>
                    <input
                      type="text"
                      value={zoneFormData.dispatchSla}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, dispatchSla: e.target.value })}
                      placeholder="Same Day Dispatch"
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Min Delivery Days</label>
                    <input
                      type="number"
                      min={1}
                      value={zoneFormData.minDeliveryDays}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, minDeliveryDays: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Max Delivery Days</label>
                    <input
                      type="number"
                      min={1}
                      value={zoneFormData.maxDeliveryDays}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, maxDeliveryDays: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isCod"
                    checked={zoneFormData.isCodAvailable}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, isCodAvailable: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                  />
                  <label htmlFor="isCod" className="text-xs font-medium text-slate-700">
                    Enable Cash on Delivery (COD) for this zone
                  </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsZoneModalOpen(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Save Zone
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create Pincode */}
        {isPincodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Add / Edit Pincode Rule</h3>
                <button
                  onClick={() => setIsPincodeModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePincode} className="mt-4 space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">6-Digit PIN Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincodeFormData.pincode}
                    onChange={(e) => setPincodeFormData({ ...pincodeFormData, pincode: e.target.value })}
                    placeholder="110001"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 font-mono text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Associated Shipping Zone</label>
                  <select
                    value={pincodeFormData.zoneId}
                    onChange={(e) => setPincodeFormData({ ...pincodeFormData, zoneId: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    {zones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name} ({z.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">City (Optional)</label>
                    <input
                      type="text"
                      value={pincodeFormData.city}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, city: e.target.value })}
                      placeholder="New Delhi"
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">State (Optional)</label>
                    <input
                      type="text"
                      value={pincodeFormData.state}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, state: e.target.value })}
                      placeholder="Delhi"
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsPincodeModalOpen(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                  >
                    Save Rule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
