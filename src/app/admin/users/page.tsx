"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Shield,
  Key,
  Users,
  UserPlus,
  Lock,
  Unlock,
  Trash2,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Eye,
  Edit,
  Mail,
  Smartphone,
  Layers,
  Sparkles,
  Layout,
  Clock,
  Send,
  Loader2,
  X,
  Sliders,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  ALL_PERMISSIONS,
  RBAC_MODULES,
  getRoleDefaultPermissions,
} from "@/lib/auth/rbac-permissions";

export default function AdminUsersRBACPage() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [roleFilter, setRoleFilter] = React.useState<string>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  // Create User Modal State
  const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);
  const [isCreating, setIsCreating] = React.useState<boolean>(false);
  const [newName, setNewName] = React.useState<string>("");
  const [newEmail, setNewEmail] = React.useState<string>("");
  const [newPhone, setNewPhone] = React.useState<string>("");
  const [newRole, setNewRole] = React.useState<string>("STORE_STAFF");
  const [selectedPermissions, setSelectedPermissions] = React.useState<string[]>(
    getRoleDefaultPermissions("STORE_STAFF")
  );

  // Credentials Generated Modal
  const [createdCreds, setCreatedCreds] = React.useState<{
    user: any;
    username: string;
    password: string;
  } | null>(null);
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  // Edit Permissions Modal
  const [editingUser, setEditingUser] = React.useState<any | null>(null);
  const [editPermissionsList, setEditPermissionsList] = React.useState<string[]>([]);
  const [isUpdatingPerms, setIsUpdatingPerms] = React.useState<boolean>(false);

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchUsers(saved);
    }
  }, []);

  async function fetchUsers(keyToUse?: string) {
    const key = keyToUse || adminKey;
    if (!key) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (roleFilter !== "ALL") queryParams.set("role", roleFilter);
      if (statusFilter !== "all") queryParams.set("status", statusFilter);

      const res = await fetch(`/api/admin/users?${queryParams.toString()}`, {
        headers: { "x-admin-key": key },
      });

      if (res.ok) {
        const json = await res.json();
        setUsers(json.data?.users || []);
        setIsAuthorized(true);
        localStorage.setItem("tirupati_admin_key", key);
      } else {
        setIsAuthorized(false);
        toast.error("Access denied. Invalid Super-Admin key.");
      }
    } catch (e) {
      toast.error("Failed to connect to Users API");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRoleChange = (role: string) => {
    setNewRole(role);
    setSelectedPermissions(getRoleDefaultPermissions(role));
  };

  const togglePermission = (permKey: string) => {
    if (selectedPermissions.includes(permKey)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permKey));
    } else {
      setSelectedPermissions([...selectedPermissions, permKey]);
    }
  };

  const toggleEditPermission = (permKey: string) => {
    if (editPermissionsList.includes(permKey)) {
      setEditPermissionsList(editPermissionsList.filter((p) => p !== permKey));
    } else {
      setEditPermissionsList([...editPermissionsList, permKey]);
    }
  };

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail) {
      toast.error("Email is required");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          phone: newPhone,
          role: newRole,
          permissions: selectedPermissions,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        toast.success("User created with temporary credentials!");
        setShowCreateModal(false);
        setCreatedCreds({
          user: json.data?.user,
          username: json.data?.temporaryCredentials?.username,
          password: json.data?.temporaryCredentials?.password,
        });
        // Reset form
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setNewRole("STORE_STAFF");
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to create user");
      }
    } catch (e) {
      toast.error("Network error creating user");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUserAction(userId: string, action: "suspend" | "unsuspend" | "soft-delete" | "restore" | "reset-password") {
    let reason = "";
    if (action === "suspend") {
      reason = prompt("Enter suspension reason (optional):") || "Suspended by Super-Admin";
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ action, reason }),
      });

      if (res.ok) {
        const json = await res.json();
        toast.success(`User ${action} successful`);
        if (action === "reset-password" && json.data?.newTemporaryPassword) {
          alert(`New Temporary Password Generated:\n\n${json.data.newTemporaryPassword}\n\nEmail notification has been dispatched.`);
        }
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.message || `Failed to ${action} user`);
      }
    } catch (e) {
      toast.error("Error executing user action");
    }
  }

  async function handleSavePermissions() {
    if (!editingUser) return;
    setIsUpdatingPerms(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          permissions: editPermissionsList,
        }),
      });

      if (res.ok) {
        toast.success("User module permissions updated!");
        setEditingUser(null);
        fetchUsers();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update permissions");
      }
    } catch (e) {
      toast.error("Error saving permissions");
    } finally {
      setIsUpdatingPerms(false);
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Auth Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <div className="max-w-md w-full rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-sm text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C1917] text-white shadow-md">
            <Shield className="h-7 w-7 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-black text-[#1C1917]">
              User Management & RBAC
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Enter your Super-Admin Secret Key to manage staff access, module permissions, and credentials.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="password"
                placeholder="Enter Super-Admin Key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers(adminKey)}
                className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-sm text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => fetchUsers(adminKey)}
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-16">
      {/* Top Beige Admin Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-[#E5DCD3] bg-[#FAF7F2]/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1C1917] text-white font-black text-sm shadow-xs">
              TB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-black text-[#1C1917]">
                  TirupatiBalajee Admin
                </span>
                <span className="rounded-md bg-amber-100/90 border border-amber-300/60 px-1.5 py-0.5 text-[10px] font-black text-amber-900 uppercase">
                  RBAC & Users
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-semibold">
                Granular Module Permissions & User Security
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Navigation Between Admin Modules */}
            <Link
              href="/admin/homepage"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD3] bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-[#F5EFEB] transition-colors shadow-2xs"
            >
              <Layout className="h-3.5 w-3.5" />
              <span>Homepage CMS</span>
            </Link>

            <Link
              href="/admin/audit-logs"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD3] bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-[#F5EFEB] transition-colors shadow-2xs"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Audit Logs</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5DCD3] bg-white px-3 py-2 text-xs font-bold text-stone-700 hover:bg-[#F5EFEB] transition-colors shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Site</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <Container size="xl" className="mt-5 space-y-5">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E5DCD3] bg-white p-5 shadow-xs">
          <div>
            <h1 className="font-display text-xl font-black text-[#1C1917]">
              User Accounts & Feature Permissions
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Create staff users, assign granular module permissions, manage suspension, and view login security.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#1C1917] text-white px-4 py-2.5 text-xs font-black hover:bg-stone-800 transition-colors shadow-sm"
          >
            <UserPlus className="h-4 w-4 text-amber-400" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5DCD3] bg-[#F5EFEB] p-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by name, email, username, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                className="w-full rounded-xl border border-[#E5DCD3] bg-white pl-9 pr-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchUsers()}
              className="rounded-xl bg-white border border-[#E5DCD3] px-3 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2]"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setTimeout(() => fetchUsers(), 0);
                }}
                className="rounded-xl border border-[#E5DCD3] bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="STORE_STAFF">Store Staff</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setTimeout(() => fetchUsers(), 0);
                }}
                className="rounded-xl border border-[#E5DCD3] bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800"
              >
                <option value="all">Active & Suspended</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
                <option value="deleted">Soft-Deleted</option>
              </select>
            </div>

            <button
              onClick={() => fetchUsers()}
              className="p-1.5 rounded-xl bg-white border border-[#E5DCD3] text-stone-600 hover:text-[#1C1917]"
              title="Refresh users"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl border border-[#E5DCD3] bg-white overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center space-y-2">
              <Loader2 className="h-6 w-6 animate-spin text-stone-400 mx-auto" />
              <p className="text-xs text-stone-500 font-semibold">Loading users database...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="h-8 w-8 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">No users found</p>
              <p className="text-xs text-stone-500">Try adjusting your search query or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFEB] border-b border-[#E5DCD3] text-stone-600 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-3">Username</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Module Permissions</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Security</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DCD3]">
                  {users.map((u) => {
                    const isSuper = u.role === "SUPER_ADMIN";
                    const isSusp = u.isSuspended;
                    const isDel = u.isDeleted;
                    const permsCount = Array.isArray(u.permissions)
                      ? u.permissions.length
                      : isSuper
                      ? ALL_PERMISSIONS.length
                      : 0;

                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-[#FAF7F2] transition-colors ${
                          isSusp ? "bg-rose-50/40" : isDel ? "bg-stone-100 opacity-60" : ""
                        }`}
                      >
                        {/* User details */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1C1917] text-sm flex items-center gap-1.5">
                            <span>{u.name || "Unnamed User"}</span>
                            {u.id === users[0]?.id && (
                              <span className="text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded">
                                Newest
                              </span>
                            )}
                          </div>
                          <div className="text-stone-500 font-medium text-[11px] flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-stone-400" />
                              {u.email || "No email"}
                            </span>
                            {u.phone && (
                              <span className="flex items-center gap-1">
                                <Smartphone className="h-3 w-3 text-stone-400" />
                                {u.phone}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Username */}
                        <td className="py-3.5 px-3">
                          <span className="font-mono text-xs font-bold text-stone-800 bg-[#F5EFEB] px-2 py-0.5 rounded-lg border border-[#E5DCD3]">
                            {u.username || "—"}
                          </span>
                        </td>

                        {/* Role Badge */}
                        <td className="py-3.5 px-3">
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[10.5px] font-black uppercase tracking-tight ${
                              u.role === "SUPER_ADMIN"
                                ? "bg-[#1C1917] text-white"
                                : u.role === "ADMIN"
                                ? "bg-blue-100 text-blue-900 border border-blue-200"
                                : u.role === "STORE_STAFF"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {u.role.replace("_", " ")}
                          </span>
                        </td>

                        {/* Module Permissions */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-800">
                              {isSuper ? "All Features (★)" : `${permsCount} Features`}
                            </span>
                            {!isSuper && (
                              <button
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditPermissionsList(
                                    Array.isArray(u.permissions)
                                      ? u.permissions
                                      : getRoleDefaultPermissions(u.role)
                                  );
                                }}
                                className="text-[10px] text-blue-700 underline font-semibold hover:text-blue-900"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3">
                          {isDel ? (
                            <span className="rounded-md bg-stone-200 text-stone-700 px-2 py-0.5 text-[10px] font-bold">
                              Soft-Deleted
                            </span>
                          ) : isSusp ? (
                            <span className="rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-bold">
                              Suspended
                            </span>
                          ) : (
                            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Security Flag */}
                        <td className="py-3.5 px-3">
                          {u.mustChangePassword ? (
                            <span className="rounded-md bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Key className="h-3 w-3 text-amber-700" /> Temp Password
                            </span>
                          ) : (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Password Set
                            </span>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Reset Password */}
                            <button
                              onClick={() => {
                                if (confirm(`Reset temporary password for ${u.name || u.email}?`)) {
                                  handleUserAction(u.id, "reset-password");
                                }
                              }}
                              className="p-1.5 rounded-lg border border-[#E5DCD3] bg-white hover:bg-[#F5EFEB] text-stone-700"
                              title="Reset to temporary password"
                            >
                              <Key className="h-3.5 w-3.5" />
                            </button>

                            {/* Suspend / Unsuspend */}
                            {isSusp ? (
                              <button
                                onClick={() => handleUserAction(u.id, "unsuspend")}
                                className="p-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                title="Unsuspend user"
                              >
                                <Unlock className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(u.id, "suspend")}
                                className="p-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                                title="Suspend user"
                              >
                                <Lock className="h-3.5 w-3.5" />
                              </button>
                            )}

                            {/* Soft Delete / Restore */}
                            {isDel ? (
                              <button
                                onClick={() => handleUserAction(u.id, "restore")}
                                className="p-1.5 rounded-lg border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
                                title="Restore soft-deleted user"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to soft-delete user ${u.name || u.email}?`)) {
                                    handleUserAction(u.id, "soft-delete");
                                  }
                                }}
                                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                                title="Soft delete user"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>

      {/* CREATE NEW USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FAF7F2] text-[#1C1917]">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-black text-[#1C1917]">
                    Create User & Assign RBAC
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Auto-generates temporary username & password with forced first-login password reset.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-[#1C1917] hover:bg-[#FAF7F2]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Email Address (For Notification)</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh@tirupatibalajidresses.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Role Base</label>
                  <select
                    value={newRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full rounded-xl border border-[#E5DCD3] bg-[#FAF7F2] px-3 py-2 text-xs text-[#1C1917] font-bold focus:border-[#1C1917] focus:bg-white focus:outline-none"
                  >
                    <option value="STORE_STAFF">Store Staff</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin (All Capabilities)</option>
                  </select>
                </div>
              </div>

              {/* Module-Based Granular Permissions Picker */}
              <div className="space-y-2 pt-1 border-t border-[#E5DCD3]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-stone-700 tracking-wider">
                    Module & Feature Capabilities ({selectedPermissions.length} active)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPermissions(
                        selectedPermissions.length === ALL_PERMISSIONS.length
                          ? []
                          : ALL_PERMISSIONS.map((p) => p.key)
                      )
                    }
                    className="text-[11px] font-bold text-blue-700 hover:underline"
                  >
                    {selectedPermissions.length === ALL_PERMISSIONS.length
                      ? "Deselect All"
                      : "Select All Capabilities"}
                  </button>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-3 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-3 text-xs">
                  {RBAC_MODULES.map((mod) => {
                    const modulePerms = ALL_PERMISSIONS.filter((p) => p.module === mod.id);

                    return (
                      <div key={mod.id} className="space-y-1.5">
                        <span className="font-black text-[11px] text-[#1C1917] flex items-center gap-1.5">
                          <Layers className="h-3 w-3 text-stone-500" />
                          {mod.name}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4">
                          {modulePerms.map((p) => {
                            const isChecked = selectedPermissions.includes(p.key);
                            return (
                              <label
                                key={p.key}
                                className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(p.key)}
                                  className="mt-0.5 rounded text-[#1C1917]"
                                />
                                <div className="leading-tight">
                                  <div className="font-bold text-[11px] text-stone-900">{p.name}</div>
                                  <div className="text-[10px] text-stone-500">{p.description}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit & Cancel */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5DCD3]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-[#E5DCD3] px-4 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-xl bg-[#1C1917] text-white px-5 py-2 text-xs font-black hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5 text-amber-400" />
                      <span>Create User & Send Credentials</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS GENERATED DIALOG */}
      {createdCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-700">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-display text-base font-black text-[#1C1917]">
                  User Created Successfully!
                </h3>
                <p className="text-[11px] text-stone-500 font-semibold">
                  Temporary credentials generated & dispatched to email
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 leading-snug">
              ⚠️ <strong>First Login Rule:</strong> The user will be required to change this temporary password immediately upon their first login before access is granted.
            </div>

            <div className="space-y-2 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-500">
                  Temporary Username:
                </label>
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[#1C1917] bg-white p-2 rounded-xl border border-[#E5DCD3]">
                  <span>{createdCreds.username}</span>
                  <button
                    onClick={() => copyToClipboard(createdCreds.username, "Username")}
                    className="text-stone-500 hover:text-stone-900 p-1"
                  >
                    {copiedField === "Username" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-500">
                  Temporary Password:
                </label>
                <div className="flex items-center justify-between font-mono text-xs font-bold text-[#1C1917] bg-white p-2 rounded-xl border border-[#E5DCD3]">
                  <span>{createdCreds.password}</span>
                  <button
                    onClick={() => copyToClipboard(createdCreds.password, "Password")}
                    className="text-stone-500 hover:text-stone-900 p-1"
                  >
                    {copiedField === "Password" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCreatedCreds(null)}
              className="w-full rounded-2xl bg-[#1C1917] py-2.5 text-xs font-black text-white hover:bg-stone-800 transition-colors"
            >
              Done & Close
            </button>
          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-[#E5DCD3] bg-white p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] flex flex-col justify-between">
            <div className="border-b border-[#E5DCD3] pb-3">
              <h3 className="font-display text-base font-black text-[#1C1917]">
                Edit Feature Permissions: {editingUser.name || editingUser.username}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                Configure which modules and actions this user can perform.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-3 text-xs">
              {RBAC_MODULES.map((mod) => {
                const modulePerms = ALL_PERMISSIONS.filter((p) => p.module === mod.id);

                return (
                  <div key={mod.id} className="space-y-1.5">
                    <span className="font-black text-[11px] text-[#1C1917] flex items-center gap-1.5">
                      <Layers className="h-3 w-3 text-stone-500" />
                      {mod.name}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4">
                      {modulePerms.map((p) => {
                        const isChecked = editPermissionsList.includes(p.key);
                        return (
                          <label
                            key={p.key}
                            className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleEditPermission(p.key)}
                              className="mt-0.5 rounded text-[#1C1917]"
                            />
                            <div className="leading-tight">
                              <div className="font-bold text-[11px] text-stone-900">{p.name}</div>
                              <div className="text-[10px] text-stone-500">{p.description}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5DCD3]">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-xl border border-[#E5DCD3] px-4 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={isUpdatingPerms}
                className="rounded-xl bg-[#1C1917] text-white px-5 py-2 text-xs font-black hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUpdatingPerms ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Permissions</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
