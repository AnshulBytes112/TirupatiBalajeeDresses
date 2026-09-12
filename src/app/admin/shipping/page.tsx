"use client";

import * as React from "react";
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
  UploadCloud,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Power,
  PowerOff,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";

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

  // Zone Modal State (Create & Edit)
  const [isZoneModalOpen, setIsZoneModalOpen] = React.useState(false);
  const [editingZoneId, setEditingZoneId] = React.useState<string | null>(null);
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

  // Pincode Modal State (Create & Edit)
  const [isPincodeModalOpen, setIsPincodeModalOpen] = React.useState(false);
  const [editingPincodeId, setEditingPincodeId] = React.useState<string | null>(null);
  const [pincodeFormData, setPincodeFormData] = React.useState({
    pincode: "",
    zoneId: "",
    city: "",
    state: "",
    isServiceable: true,
    isCodAvailable: true,
    minDeliveryDays: 2,
    maxDeliveryDays: 4,
    isActive: true,
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
    } catch {
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
    } catch {
      toast.error("Failed to load pincodes");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedZoneFilter]);

  React.useEffect(() => {
    fetchZones();
    fetchPincodes();
  }, [fetchZones, fetchPincodes]);

  // ZONE CRUD HANDLERS
  const handleOpenCreateZone = () => {
    setEditingZoneId(null);
    setZoneFormData({
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
    setIsZoneModalOpen(true);
  };

  const handleOpenEditZone = (zone: ShippingZone) => {
    setEditingZoneId(zone.id);
    setZoneFormData({
      name: zone.name,
      code: zone.code,
      description: zone.description || "",
      shippingCharge: Number(zone.shippingCharge),
      freeShippingThreshold: zone.freeShippingThreshold ? Number(zone.freeShippingThreshold) : 0,
      minDeliveryDays: zone.minDeliveryDays,
      maxDeliveryDays: zone.maxDeliveryDays,
      isCodAvailable: zone.isCodAvailable,
      dispatchSla: zone.dispatchSla || "Same Day Dispatch",
      isActive: zone.isActive,
    });
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingZoneId
        ? `/api/admin/shipping/zones/${editingZoneId}`
        : `/api/admin/shipping/zones`;
      const method = editingZoneId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneFormData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editingZoneId ? "Shipping Zone updated successfully!" : "Shipping Zone created successfully!");
        setIsZoneModalOpen(false);
        fetchZones();
      } else {
        toast.error(json.message || "Failed to save shipping zone");
      }
    } catch {
      toast.error("An error occurred while saving shipping zone");
    }
  };

  const handleToggleZoneActive = async (zone: ShippingZone) => {
    try {
      const res = await fetch(`/api/admin/shipping/zones/${zone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !zone.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Zone "${zone.name}" ${!zone.isActive ? "activated" : "deactivated"}`);
        fetchZones();
      } else {
        toast.error(json.message || "Failed to update zone status");
      }
    } catch {
      toast.error("Failed to update zone status");
    }
  };

  const handleDeleteZone = async (zone: ShippingZone) => {
    if (!confirm(`Are you sure you want to delete zone "${zone.name}"? All associated pincode bindings will also be removed.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/shipping/zones/${zone.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Zone "${zone.name}" deleted successfully`);
        fetchZones();
        fetchPincodes();
      } else {
        toast.error(json.message || "Failed to delete zone");
      }
    } catch {
      toast.error("Failed to delete zone");
    }
  };

  // PINCODE CRUD HANDLERS
  const handleOpenCreatePincode = () => {
    setEditingPincodeId(null);
    setPincodeFormData({
      pincode: "",
      zoneId: zones[0]?.id || "",
      city: "",
      state: "",
      isServiceable: true,
      isCodAvailable: true,
      minDeliveryDays: 2,
      maxDeliveryDays: 4,
      isActive: true,
    });
    setIsPincodeModalOpen(true);
  };

  const handleOpenEditPincode = (p: ShippingPincode) => {
    setEditingPincodeId(p.id);
    setPincodeFormData({
      pincode: p.pincode,
      zoneId: p.zoneId,
      city: p.city || "",
      state: p.state || "",
      isServiceable: p.isServiceable,
      isCodAvailable: p.isCodAvailable !== false,
      minDeliveryDays: p.minDeliveryDays || 2,
      maxDeliveryDays: p.maxDeliveryDays || 4,
      isActive: p.isActive,
    });
    setIsPincodeModalOpen(true);
  };

  const handleSavePincode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPincodeId
        ? `/api/admin/shipping/pincodes/${editingPincodeId}`
        : `/api/admin/shipping/pincodes`;
      const method = editingPincodeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pincodeFormData),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(editingPincodeId ? "Pincode rule updated successfully!" : "Pincode rule saved successfully!");
        setIsPincodeModalOpen(false);
        fetchPincodes();
      } else {
        toast.error(json.message || "Failed to save pincode rule");
      }
    } catch {
      toast.error("An error occurred while saving pincode rule");
    }
  };

  const handleTogglePincodeServiceable = async (p: ShippingPincode) => {
    try {
      const res = await fetch(`/api/admin/shipping/pincodes/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isServiceable: !p.isServiceable }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Pincode ${p.pincode} marked as ${!p.isServiceable ? "Serviceable" : "Unserviceable"}`);
        fetchPincodes();
      } else {
        toast.error(json.message || "Failed to update serviceability");
      }
    } catch {
      toast.error("Failed to update serviceability");
    }
  };

  const handleDeletePincode = async (id: string, pincode: string) => {
    if (!confirm(`Are you sure you want to delete rule for pincode ${pincode}?`)) return;
    try {
      const res = await fetch(`/api/admin/shipping/pincodes/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Pincode ${pincode} deleted`);
        fetchPincodes();
      } else {
        toast.error(json.message || "Failed to delete pincode");
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
    <div className="min-h-screen bg-[#FAF7F2] pb-16 text-[#1C1917]">
      <SuperAdminNav activeTab="shipping" />
      <Container size="lg" className="pt-6">

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
              onClick={handleOpenCreateZone}
              className="flex items-center gap-1.5 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 text-yellow-400" />
              Add Shipping Zone
            </button>
            <button
              onClick={handleOpenCreatePincode}
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
                    <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-900">
                      {zone.code}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleZoneActive(zone)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                          zone.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {zone.isActive ? (
                          <>
                            <Power className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <PowerOff className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">{zone.name}</h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{zone.description || "No description provided."}</p>

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
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditZone(zone)}
                      className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-900 hover:bg-blue-100"
                      title="Edit Zone"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteZone(zone)}
                      className="flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      title="Delete Zone"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
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
                        <button
                          onClick={() => handleTogglePincodeServiceable(pin)}
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                            pin.isServiceable ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                          }`}
                          title="Click to toggle serviceability"
                        >
                          {pin.isServiceable ? "Serviceable" : "Unserviceable"}
                        </button>
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
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditPincode(pin)}
                            className="rounded p-1.5 text-slate-500 hover:bg-blue-50 hover:text-blue-900"
                            title="Edit Pincode"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePincode(pin.id, pin.pincode)}
                            className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Pincode"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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

        {/* Modal: Create & Edit Zone */}
        {isZoneModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingZoneId ? "Edit Shipping Zone" : "Add New Shipping Zone"}
                </h3>
                <button
                  onClick={() => setIsZoneModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveZone} className="mt-4 space-y-4 text-sm">
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Description (Optional)</label>
                  <input
                    type="text"
                    value={zoneFormData.description}
                    onChange={(e) => setZoneFormData({ ...zoneFormData, description: e.target.value })}
                    placeholder="e.g. Same city and local region express delivery"
                    className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                  />
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

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCod"
                      checked={zoneFormData.isCodAvailable}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, isCodAvailable: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <label htmlFor="isCod" className="text-xs font-medium text-slate-700">
                      Enable COD
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActiveZone"
                      checked={zoneFormData.isActive}
                      onChange={(e) => setZoneFormData({ ...zoneFormData, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <label htmlFor="isActiveZone" className="text-xs font-medium text-slate-700">
                      Active Status
                    </label>
                  </div>
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
                    {editingZoneId ? "Update Zone" : "Save Zone"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Create & Edit Pincode */}
        {isPincodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingPincodeId ? "Edit Pincode Rule" : "Add Pincode Rule"}
                </h3>
                <button
                  onClick={() => setIsPincodeModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePincode} className="mt-4 space-y-4 text-sm">
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
                    required
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Min Delivery Days</label>
                    <input
                      type="number"
                      min={1}
                      value={pincodeFormData.minDeliveryDays}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, minDeliveryDays: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">Max Delivery Days</label>
                    <input
                      type="number"
                      min={1}
                      value={pincodeFormData.maxDeliveryDays}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, maxDeliveryDays: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isServiceablePin"
                      checked={pincodeFormData.isServiceable}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, isServiceable: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <label htmlFor="isServiceablePin" className="text-xs font-medium text-slate-700">
                      Serviceable
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isCodPin"
                      checked={pincodeFormData.isCodAvailable}
                      onChange={(e) => setPincodeFormData({ ...pincodeFormData, isCodAvailable: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <label htmlFor="isCodPin" className="text-xs font-medium text-slate-700">
                      COD Available
                    </label>
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
                    {editingPincodeId ? "Update Rule" : "Save Rule"}
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
