"use client";

import * as React from "react";
import { AccountLayout } from "@/components/account/account-layout";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  ShieldCheck,
  Building,
} from "lucide-react";

interface CustomerAddress {
  id: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = React.useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Modal State (Create & Edit)
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });

  const fetchAddresses = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/addresses");
      const json = await res.json();
      if (json.success && json.data) {
        setAddresses(json.data);
      }
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleOpenCreateModal = () => {
    setEditingAddressId(null);
    setFormData({
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: CustomerAddress) => {
    setEditingAddressId(addr.id);
    setFormData({
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setIsModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim()) {
      toast.error("Please fill in all required address fields");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phoneNumber.trim())) {
      toast.error("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)");
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(formData.postalCode.trim())) {
      toast.error("Please enter a valid 6-digit Indian PIN code (e.g. 110001)");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingAddressId
        ? `/api/account/addresses/${editingAddressId}`
        : `/api/account/addresses`;
      const method = editingAddressId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phoneNumber: formData.phoneNumber.trim(),
          addressLine1: formData.addressLine1.trim(),
          addressLine2: formData.addressLine2.trim() || null,
          landmark: formData.landmark.trim() || null,
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          isDefault: formData.isDefault,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to save address");
      }

      toast.success(editingAddressId ? "Address updated successfully!" : "Address added successfully!");
      setIsModalOpen(false);
      fetchAddresses();
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}/default`, {
        method: "POST",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Default delivery address updated");
        fetchAddresses();
      } else {
        toast.error(json.message || "Failed to update default address");
      }
    } catch {
      toast.error("Failed to update default address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Address removed");
        fetchAddresses();
      } else {
        toast.error(json.message || "Failed to delete address");
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <AccountLayout
      title="Saved Addresses"
      description="Manage your delivery addresses for seamless school uniform checkouts."
    >
      <div className="space-y-6">
        {/* Top Header Action */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            {addresses.length} {addresses.length === 1 ? "address" : "addresses"} saved
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy-950 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-navy-800 transition cursor-pointer"
          >
            <Plus className="h-4 w-4 text-amber-400" />
            <span>Add New Address</span>
          </button>
        </div>

        {/* Addresses Grid */}
        {isLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-7 w-7 animate-spin mx-auto text-brand-navy-950" />
            <p className="mt-2 text-xs text-slate-500">Loading your addresses...</p>
          </div>
        ) : addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                  addr.isDefault ? "border-amber-400 ring-1 ring-amber-400/30" : "border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900">
                          DEFAULT
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-600">
                    <p className="font-medium text-slate-800">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                    {addr.landmark && <p className="text-slate-500">Landmark: {addr.landmark}</p>}
                    <p>
                      {addr.city}, {addr.state} -{" "}
                      <span className="font-mono font-bold text-slate-900">{addr.postalCode}</span>
                    </p>
                    <p className="text-slate-500 pt-1">Phone: {addr.phoneNumber}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    {!addr.isDefault ? (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="font-bold text-brand-navy-900 hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Default Address
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(addr)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                      title="Edit Address"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <MapPin className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-900">No addresses saved yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Add your home or school delivery address so you can place orders smoothly.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 mt-5 rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition cursor-pointer"
            >
              <Plus className="h-4 w-4 text-amber-400" />
              <span>Add Your First Address</span>
            </button>
          </div>
        )}

        {/* Modal: Add / Edit Address */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black text-brand-navy-950">
                  {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="mt-4 space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      10-Digit Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, "") })}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Flat, House No., Building, Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    placeholder="e.g. Flat 402, Sunshine Heights, Main Road"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Area / Sector / Colony (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      placeholder="e.g. Sector 14"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      placeholder="e.g. Near St. Xavier's Gate"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Delhi"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Delhi"
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      6-Digit PIN *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value.replace(/\D/g, "") })}
                      placeholder="110001"
                      className="w-full rounded-xl border border-slate-300 p-2.5 font-mono text-sm focus:border-brand-navy-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefaultCheckbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-brand-navy-950 focus:ring-brand-navy-950"
                  />
                  <label htmlFor="isDefaultCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                    Make this my default shipping address
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-navy-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-navy-800 transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : null}
                    <span>{editingAddressId ? "Update Address" : "Save Address"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
