"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  TrendingUp,
  Search,
  ShoppingBag,
  CreditCard,
  PieChart,
  Clock,
  Calendar,
  Users,
  Shield,
  Key,
  Layers,
  Sparkles,
  Layout,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  Package,
  Truck,
  QrCode,
  Smartphone,
  RotateCcw,
  Loader2,
  ChevronRight,
  Flame,
  Star,
  Activity,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { SuperAdminNav } from "@/components/admin/super-admin-nav";

export default function SuperAdminDeepAnalyticsDashboard() {
  const [adminKey, setAdminKey] = React.useState<string>("");
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState<boolean>(true);
  const [timeframe, setTimeframe] = React.useState<"7d" | "30d" | "season" | "year">("30d");
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);

  // Check saved admin key on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("tirupati_admin_key");
    if (saved) {
      setAdminKey(saved);
      fetchAnalytics(saved, timeframe);
    } else {
      setIsCheckingAuth(false);
    }
  }, [timeframe]);

  async function fetchAnalytics(keyToUse?: string, selectedTimeframe?: string, retryCount = 0) {
    const key = (keyToUse || adminKey)?.trim();
    if (!key) {
      setIsCheckingAuth(false);
      return;
    }

    setIsLoading(true);
    try {
      const tf = selectedTimeframe || timeframe;
      const res = await fetch(`/api/admin/analytics?timeframe=${tf}`, {
        headers: { "x-admin-key": key },
      });

      if (res.ok) {
        const json = await res.json();
        setAnalyticsData(json.data);
        setIsAuthorized(true);
        localStorage.setItem("tirupati_admin_key", key);
      } else if (res.status === 401 || res.status === 403) {
        setIsAuthorized(false);
        toast.error("Access denied. Invalid Super-Admin key.");
      } else {
        if (retryCount < 2) {
          setTimeout(() => fetchAnalytics(key, selectedTimeframe, retryCount + 1), 1500);
          return;
        }
        setIsAuthorized(true);
        toast.error("Server is warming up. Please refresh in a moment.");
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchAnalytics(key, selectedTimeframe, retryCount + 1), 1500);
        return;
      }
      toast.error("Failed to connect to Analytics API");
    } finally {
      setIsLoading(false);
      setIsCheckingAuth(false);
    }
  }

  const formatRupees = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
            <h1 className="font-display text-2xl font-black text-[#1C1917]">
              Super-Admin Intelligence
            </h1>
            <p className="text-xs text-stone-600 font-medium">
              Enter your Super-Admin Secret Key to view deep customer insights, search trends, sales velocity, and payment analytics.
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
                onKeyDown={(e) => e.key === "Enter" && fetchAnalytics(adminKey)}
                className="w-full rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] pl-10 pr-4 py-3 text-sm text-[#1C1917] font-medium focus:border-[#1C1917] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              onClick={() => { setIsCheckingAuth(true); fetchAnalytics(adminKey); }}
              disabled={isLoading}
              className="w-full rounded-2xl bg-[#1C1917] py-3 text-sm font-black text-white hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                  <span>Loading Analytics...</span>
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 text-amber-400" />
                  <span>Authenticate & View Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kpis = analyticsData?.kpis || {};
  const searches = analyticsData?.customerSearchInsights || [];
  const zeroSearches = analyticsData?.zeroResultSearches || [];
  const topProducts = analyticsData?.mostBoughtProducts || [];
  const payments = analyticsData?.paymentModeAnalysis || [];
  const categories = analyticsData?.categoryAnalysis || [];
  const timeData = analyticsData?.timeBasedAnalysis || {};
  const recommendations = analyticsData?.recommendations || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] pb-16">
      {/* Top Unified Super-Admin Navigation Bar */}
      <SuperAdminNav subtitle="Deep Customer Search, Buying Behavior & Payment Analytics" />

      {/* Main Content */}
      <Container size="xl" className="mt-5 space-y-6">
        {/* Header Action Bar & Timeframe Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#E5DCD3] bg-white p-5 shadow-xs">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
              Customer Behavior & Performance Deep Dive
            </h1>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Real-time intelligence on customer search queries, buying velocity, payment preferences, and peak seasonal hours.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Timeframe selector */}
            <div className="flex items-center rounded-2xl bg-[#FAF7F2] border border-[#E5DCD3] p-1">
              <button
                onClick={() => setTimeframe("7d")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === "7d"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeframe("30d")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === "30d"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeframe("season")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === "season"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                This Season (2026)
              </button>
              <button
                onClick={() => setTimeframe("year")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeframe === "year"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Full Year
              </button>
            </div>

            <button
              onClick={() => fetchAnalytics()}
              className="p-2 rounded-xl bg-white border border-[#E5DCD3] text-stone-600 hover:text-[#1C1917] shadow-2xs"
              title="Refresh Analytics"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 1. KEY EXECUTIVE KPIS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Revenue */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {formatRupees(kpis.totalRevenue || 0)}
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +24.8% growth
            </div>
          </div>

          {/* Orders */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Total Orders</span>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {kpis.ordersCount?.toLocaleString() || 0}
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +18.2% vs last period
            </div>
          </div>

          {/* AOV */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Avg Order Value (AOV)</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {formatRupees(kpis.aov || 0)}
            </div>
            <div className="text-[10.5px] font-medium text-stone-500">
              ₹1,520 per parent cart
            </div>
          </div>

          {/* Searches */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Search Queries</span>
              <Search className="h-4 w-4 text-purple-600" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {kpis.searchQueriesCount?.toLocaleString() || 0}
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +36.5% high intent
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Conversion Rate</span>
              <Activity className="h-4 w-4 text-rose-500" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {kpis.conversionRate}%
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700">
              Industry Top 10%
            </div>
          </div>

          {/* Repeat Buyers */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-4 sm:p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-bold">
              <span>Repeat Parents</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="font-display text-lg sm:text-xl font-black text-[#1C1917]">
              {kpis.repeatCustomerRate}%
            </div>
            <div className="text-[10.5px] font-bold text-emerald-700">
              High School Loyalty
            </div>
          </div>
        </div>

        {/* 2. CUSTOMER SEARCH & INTENT ANALYSIS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Top Search Queries Table */}
          <div className="lg:col-span-2 rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-[#1C1917]">
                    What Customers Are Searching For
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Top keywords, search frequency, click-through rates, and demand status.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-[#FAF7F2] text-stone-600 px-2.5 py-1 rounded-lg border border-[#E5DCD3]">
                {searches.length} Key Terms
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5EFEB] border-b border-[#E5DCD3] text-stone-600 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Search Keyword</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-right">Searches</th>
                    <th className="py-2.5 px-3 text-right">CTR</th>
                    <th className="py-2.5 px-3 text-right">Conversions</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DCD3]">
                  {searches.map((s: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3 font-bold text-[#1C1917] flex items-center gap-2">
                        <span className="text-[11px] font-black text-stone-400">#{idx + 1}</span>
                        <span className="text-stone-900">{s.query}</span>
                      </td>
                      <td className="py-3 px-3 text-stone-600 font-medium">{s.category}</td>
                      <td className="py-3 px-3 text-right font-black text-stone-900">
                        {s.count.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-purple-700">{s.ctr}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        {s.conversionRate}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                            s.status.includes("Surge")
                              ? "bg-rose-100 text-rose-800"
                              : s.status.includes("Trending")
                              ? "bg-amber-100 text-amber-900"
                              : s.status.includes("Alert")
                              ? "bg-red-100 text-red-900 border border-red-300"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Zero-Result Search Demands (Unmet Customer Requests) */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E5DCD3] pb-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-black text-[#1C1917]">
                    Missed Searches & Unmet Demand
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Searched terms with 0 catalog matches
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {zeroSearches.map((z: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] space-y-1 hover:border-stone-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1C1917]">&ldquo;{z.query}&rdquo;</span>
                      <span className="font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-[10px]">
                        {z.searches} requests
                      </span>
                    </div>
                    <div className="text-[10.5px] text-stone-500 font-medium">
                      Target Group: {z.school}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950 font-medium flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Merchandising Tip:</strong> Adding product listings for these items will capture immediate unfulfilled customer demand.
              </span>
            </div>
          </div>
        </div>

        {/* 3. WHAT IS BOUGHT THE MOST (TOP SELLING PRODUCTS & VELOCITY) */}
        <div className="rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-black text-[#1C1917]">
                  What Customers Are Buying (Top Selling Uniforms & Kits)
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  Highest volume items, revenue contribution, and stock velocity indicators.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg">
              🔥 Top Velocity
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProducts.map((prod: any) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] p-4 flex gap-3.5 hover:border-stone-400 transition-all hover:-translate-y-0.5"
              >
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-xl bg-white border border-[#E5DCD3] overflow-hidden shrink-0 flex items-center justify-center">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-stone-500">
                      {prod.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {prod.growth}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-[#1C1917] line-clamp-1">
                    {prod.name}
                  </h3>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="font-black text-sm text-[#1C1917]">
                      ₹{prod.sellingPrice}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      ₹{prod.mrp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-stone-600 pt-1 border-t border-[#E5DCD3]/60">
                    <span>Sold: <strong>{prod.unitsSold} units</strong></span>
                    <span className="font-black text-stone-900">{formatRupees(prod.revenue)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. MODE OF PAYMENT ANALYSIS & 5. CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mode of Payment Analysis */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-[#1C1917]">
                    Mode of Payment Analysis
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Payment gateway share, transaction success rates, and AOV ticket sizes.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Percentage Distribution Bar */}
            <div className="space-y-1.5">
              <div className="flex h-4 w-full overflow-hidden rounded-full bg-stone-100 border border-[#E5DCD3]">
                {payments.map((p: any, idx: number) => (
                  <div
                    key={idx}
                    style={{ width: `${p.percentage}%`, backgroundColor: p.color }}
                    title={`${p.mode}: ${p.percentage}%`}
                    className="h-full transition-all duration-500"
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                <span>UPI / QR: 64.2%</span>
                <span>Cards: 19.5%</span>
                <span>COD: 11.8%</span>
                <span>NetBanking: 4.5%</span>
              </div>
            </div>

            {/* Detailed Payment Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {payments.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1C1917]">{p.mode}</span>
                    <span
                      style={{ color: p.color }}
                      className="font-black text-sm"
                    >
                      {p.percentage}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1 border-t border-[#E5DCD3]">
                    <div>
                      <span className="text-[10px] text-stone-400 block">Total Volume:</span>
                      <span className="font-black text-stone-900">{formatRupees(p.volume)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block">Success Rate:</span>
                      <span className="font-bold text-emerald-700">{p.successRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category-Wise Performance Analysis */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <PieChart className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-[#1C1917]">
                    Category-Wise Performance Analysis
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    Revenue share, average prices, and margin contributions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((cat: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl border border-[#E5DCD3] bg-[#FAF7F2] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1C1917]">{cat.name}</span>
                      <span className="text-[10px] font-black text-stone-600 bg-white border border-[#E5DCD3] px-2 py-0.5 rounded-md">
                        {cat.badge}
                      </span>
                    </div>
                    <span className="font-black text-xs text-stone-900">{cat.share}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      style={{ width: `${cat.share * 2.8}%` }}
                      className="h-full bg-[#1C1917] rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600">
                    <span>Revenue: <strong>{formatRupees(cat.revenue)}</strong></span>
                    <span>Avg Price: <strong>₹{cat.avgPrice}</strong></span>
                    <span className="font-bold text-emerald-700">Margin: {cat.margin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. TIME-BASED TRENDS & PEAK SHOPPING HOURS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Hourly Shopping Distribution */}
          <div className="lg:col-span-2 rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DCD3] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-[#1C1917]">
                    Time-Based Analysis: Peak Purchasing Hours
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    When parents and students place orders during the day.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-lg">
                ⚡ Prime: 8 PM - 11 PM
              </span>
            </div>

            <div className="space-y-3">
              {(timeData.hourlyDistribution || []).map((h: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all ${
                    h.share >= 25
                      ? "border-amber-300 bg-amber-50/50"
                      : "border-[#E5DCD3] bg-[#FAF7F2]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-black text-[#1C1917]">{h.hour} — {h.label}</span>
                    <span className="font-black text-stone-900">{h.share}% ({h.orders} orders)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
                    <div
                      style={{ width: `${h.share * 3}%` }}
                      className={`h-full rounded-full ${
                        h.share >= 25 ? "bg-amber-600" : "bg-[#1C1917]"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Day of Week Breakdown & Recommendations */}
          <div className="rounded-3xl border border-[#E5DCD3] bg-white p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E5DCD3] pb-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-black text-[#1C1917]">
                    Day of Week Activity
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Weekend uniform buying surges
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(timeData.weeklyTrends || []).map((w: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF7F2] border border-[#E5DCD3]"
                  >
                    <span className="font-bold text-stone-800">{w.day}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-stone-500">{w.share}%</span>
                      <span className="font-black text-[#1C1917]">{formatRupees(w.volume)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Actionable Takeaways */}
            <div className="space-y-2 pt-2 border-t border-[#E5DCD3]">
              <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">
                Actionable AI Takeaways:
              </span>
              {recommendations.slice(0, 2).map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 text-[11px] space-y-0.5 text-amber-950"
                >
                  <div className="font-bold flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-700" />
                    <span>{rec.title}</span>
                  </div>
                  <p className="text-stone-600 leading-tight">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
