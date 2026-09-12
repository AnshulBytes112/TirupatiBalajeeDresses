"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Shield,
  Key,
  Clock,
  Search,
  Filter,
  RotateCcw,
  ExternalLink,
  TrendingUp,
  Users,
  Layout,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Loader2,
  Calendar,
  Globe,
  Terminal,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";
import { DressLoadingBuffer } from "@/components/ui/dress-loading-buffer";

export default function AdminAuditLogsPage() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);
  const [logs, setLogs] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState<string>("");
  const [moduleFilter, setModuleFilter] = React.useState<string>("ALL");
  const [actionFilter, setActionFilter] = React.useState<string>("ALL");
  const [selectedLog, setSelectedLog] = React.useState<any | null>(null);

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchLogs(saved);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function fetchLogs(keyToUse?: string, retryCount = 0) {
    const key = (keyToUse || adminKey)?.trim();
    if (!key) {
      setIsCheckingAuth(false);
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (moduleFilter !== "ALL") queryParams.set("module", moduleFilter);
      if (actionFilter !== "ALL") queryParams.set("action", actionFilter);

      const res = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`, {
        headers: { "x-admin-key": key },
      });

      if (res.ok) {
        const json = await res.json();
        setLogs(json.data?.logs || []);
        setIsAuthorized(true);
        localStorage.setItem("tirupati_admin_key", key);
      } else if (res.status === 401 || res.status === 403) {
        setIsAuthorized(false);
        toast.error("Access denied. Invalid Super-Admin key.");
      } else {
        if (retryCount < 2) {
          setTimeout(() => fetchLogs(key, retryCount + 1), 1500);
          return;
        }
        setIsAuthorized(true);
        toast.error("Server is warming up. Please refresh in a moment.");
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchLogs(key, retryCount + 1), 1500);
        return;
      }
      toast.error("Failed to connect to Audit Logs API");
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  }

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes("CREATE") || action.includes("PUBLISH")) {
      return "bg-emerald-100 text-emerald-900 border-emerald-300";
    }
    if (action.includes("UPDATE") || action.includes("EDIT")) {
      return "bg-blue-100 text-blue-900 border-blue-300";
    }
    if (action.includes("SUSPEND") || action.includes("DELETE")) {
      return "bg-rose-100 text-rose-900 border-rose-300";
    }
    if (action.includes("PASSWORD")) {
      return "bg-amber-100 text-amber-900 border-amber-300";
    }
    if (action.includes("DENIED") || action.includes("FAILED")) {
      return "bg-red-100 text-red-900 border-red-300";
    }
    return "bg-stone-100 text-stone-800 border-stone-300";
  };

  // Auth Gate
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7F2]">
        <DressLoadingBuffer size="md" message="Verifying Super-Admin credentials..." />
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
            <h1 className="font-display text-2xl font-black text-[#1C1917]">
              Super-Admin Audit Trail
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Enter your Super-Admin Secret Key to inspect system operations, user activities, and timestamps.
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setIsCheckingAuth(true);
                    fetchLogs(adminKey);
                  }
                }}
                className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-sm text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => { setIsCheckingAuth(true); fetchLogs(adminKey); }}
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
      {/* Shared Super Admin Header & Navigation */}
      <SuperAdminNav activeTab="audit" />

      {/* Main Content */}
      <Container size="xl" className="mt-5 space-y-5">
        {/* Header Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E5DCD3] bg-white p-5 shadow-xs">
          <div>
            <h1 className="font-display text-xl font-black text-[#1C1917]">
              System Audit Trail & Operations Log
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Live chronological record of all user logins, page visits, content edits, and publishing actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLogs()}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-white border border-[#E5DCD3] px-3.5 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2] transition-colors shadow-2xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Refresh Trail</span>
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E5DCD3] bg-[#F5EFEB] p-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search by user, action, IP, module..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
                className="w-full rounded-xl border border-[#E5DCD3] bg-white pl-9 pr-3 py-2 text-xs text-[#1C1917] font-medium focus:border-[#1C1917] focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchLogs()}
              className="rounded-xl bg-white border border-[#E5DCD3] px-3 py-2 text-xs font-bold text-stone-700 hover:bg-[#FAF7F2]"
            >
              Search
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Module Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500">Module:</span>
              <select
                value={moduleFilter}
                onChange={(e) => {
                  setModuleFilter(e.target.value);
                  setTimeout(() => fetchLogs(), 0);
                }}
                className="rounded-xl border border-[#E5DCD3] bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800"
              >
                <option value="ALL">All Modules</option>
                <option value="HOMEPAGE">Homepage CMS</option>
                <option value="USERS">Users & RBAC</option>
                <option value="AUTH">Authentication</option>
                <option value="PRODUCTS">Products</option>
                <option value="ORDERS">Orders</option>
              </select>
            </div>

            {/* Action Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500">Action:</span>
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setTimeout(() => fetchLogs(), 0);
                }}
                className="rounded-xl border border-[#E5DCD3] bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-800"
              >
                <option value="ALL">All Actions</option>
                <option value="PAGE_VISIT">Page Visits</option>
                <option value="HOMEPAGE_UPDATE">Homepage Edits</option>
                <option value="HOMEPAGE_PUBLISH">Live Publish</option>
                <option value="USER_CREATE">User Creations</option>
                <option value="USER_SUSPEND">Suspensions</option>
                <option value="FIRST_LOGIN_PASSWORD_CHANGE">Password Resets</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="rounded-3xl border border-[#E5DCD3] bg-white overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-12 text-center">
              <DressLoadingBuffer size="sm" message="Loading activity audit logs..." />
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Clock className="h-8 w-8 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-stone-700">No activity logs found</p>
              <p className="text-xs text-stone-500">Operations and user visits will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFEB] border-b border-[#E5DCD3] text-stone-600 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Timestamp (IST)</th>
                    <th className="py-3 px-3">User & Initiator</th>
                    <th className="py-3 px-3">Module</th>
                    <th className="py-3 px-3">Operation / Action</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Client IP</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DCD3]">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FAF7F2] transition-colors">
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar className="h-3 w-3 text-stone-400" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </td>

                      {/* User */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#1C1917]">{log.userName || "System"}</div>
                        <div className="text-[10.5px] text-stone-500 font-medium">
                          {log.userEmail || "admin@tirupati.com"} •{" "}
                          <span className="font-semibold text-stone-700">{log.userRole || "ADMIN"}</span>
                        </div>
                      </td>

                      {/* Module */}
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] font-bold text-stone-800 bg-[#F5EFEB] px-2 py-0.5 rounded-md border border-[#E5DCD3]">
                          {log.module}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10.5px] font-black uppercase border ${getActionBadgeColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {log.status === "SUCCESS" ? (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> OK
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                            <XCircle className="h-3.5 w-3.5" /> {log.status}
                          </span>
                        )}
                      </td>

                      {/* IP */}
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-600">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-stone-400" />
                          <span>{log.ipAddress || "127.0.0.1"}</span>
                        </div>
                      </td>

                      {/* Details button */}
                      <td className="py-3 px-4 text-right">
                        {log.details ? (
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="p-1.5 rounded-lg border border-[#E5DCD3] bg-white hover:bg-[#F5EFEB] text-stone-700 text-[11px] font-bold"
                          >
                            Inspect Payload
                          </button>
                        ) : (
                          <span className="text-stone-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>

      {/* INSPECT LOG PAYLOAD MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[#E5DCD3] bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div>
                <h3 className="font-display text-base font-black text-[#1C1917]">
                  Audit Event Payload: {selectedLog.action}
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  {formatTimestamp(selectedLog.timestamp)} • User: {selectedLog.userName} ({selectedLog.userEmail})
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-[#1C1917]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-stone-900 text-amber-300 p-4 font-mono text-xs shadow-inner">
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-[#E5DCD3]">
              <span>Client Agent: {selectedLog.userAgent?.slice(0, 45)}...</span>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-[#1C1917] text-white px-4 py-1.5 font-bold hover:bg-stone-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
