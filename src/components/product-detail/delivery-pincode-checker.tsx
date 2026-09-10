"use client";

import * as React from "react";
import { Truck, CheckCircle2, AlertCircle, Loader2, MapPin } from "lucide-react";
import { DeliveryCheckResult } from "@/services/delivery.service";

interface DeliveryPincodeCheckerProps {
  productId: string;
  variantId?: string;
  quantity?: number;
}

export function DeliveryPincodeChecker({
  productId,
  variantId,
  quantity = 1,
}: DeliveryPincodeCheckerProps) {
  const [pincode, setPincode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DeliveryCheckResult | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const checkPincodeServiceability = React.useCallback(
    async (pinToCheck: string) => {
      if (!/^[1-9][0-9]{5}$/.test(pinToCheck)) {
        setErrorMessage("Please enter a valid 6-digit PIN code.");
        setResult(null);
        return;
      }

      setErrorMessage(null);
      setIsLoading(true);

      try {
        const res = await fetch("/api/delivery/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pincode: pinToCheck,
            productId,
            variantId,
            quantity,
          }),
        });

        const json = await res.json();
        if (json.success) {
          setResult(json.data);
          try {
            localStorage.setItem("tbd_user_pincode", pinToCheck);
          } catch {}
        } else {
          setErrorMessage(json.message || "Failed to verify pincode.");
          setResult(null);
        }
      } catch {
        setErrorMessage("Network error checking delivery. Please try again.");
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    },
    [productId, variantId, quantity]
  );

  // Load previously checked pincode from localStorage
  React.useEffect(() => {
    try {
      const savedPin = localStorage.getItem("tbd_user_pincode");
      if (savedPin && /^[1-9][0-9]{5}$/.test(savedPin)) {
        setPincode(savedPin);
        checkPincodeServiceability(savedPin);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, [checkPincodeServiceability]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPincodeServiceability(pincode);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
        <Truck className="h-4 w-4 text-blue-900" />
        <span>Delivery Options & Pincode Checker</span>
      </div>

      <form onSubmit={handleFormSubmit} className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPincode(val);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Enter 6-digit PIN code (e.g. 110001)"
            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-xs font-mono text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || pincode.length !== 6}
          className="rounded-lg bg-blue-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check"}
        </button>
      </form>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Successful Check Results */}
      {result && result.isServiceable && (
        <div className="mt-3 space-y-2 border-t border-slate-200/80 pt-3 text-xs">
          <div className="flex items-start gap-2 text-slate-800">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-slate-900">
                {result.deliveryEstimate}
              </p>
              <p className="text-slate-500">
                {result.city ? `${result.city}, ${result.state} • ` : ""}
                {result.dispatchEstimate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {result.isFreeShipping ? (
              <span className="inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800">
                FREE Delivery
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 font-semibold text-slate-700">
                Shipping: ₹{result.shippingCharge}
              </span>
            )}

            {result.isCodAvailable ? (
              <span className="inline-flex items-center rounded-md bg-blue-100 px-2 py-0.5 font-semibold text-blue-800">
                Cash on Delivery Available
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 font-semibold text-amber-800">
                Prepaid Only
              </span>
            )}
          </div>
        </div>
      )}

      {/* Unserviceable Result */}
      {result && !result.isServiceable && (
        <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800">
          <p className="font-semibold">PIN code {result.pincode} is not currently serviceable.</p>
          <p className="mt-0.5 text-rose-600">Please try an alternate delivery address.</p>
        </div>
      )}
    </div>
  );
}
