"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Sparkles,
  BadgePercent,
  RefreshCw,
  Lock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Heart,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "./container";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-brand-cream-100 text-brand-navy-950 pt-12 pb-24 lg:pb-12 border-t border-slate-200/60 mt-16">
      <Container size="xl">
        {/* 1. Trust Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pb-12 border-b border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-subtle">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pastel-blue text-brand-pastel-blue-text">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy-950">Trusted by Parents</h4>
              <p className="text-[10px] text-slate-500">50,000+ Happy Families</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-subtle">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-yellow-100 text-brand-navy-900">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy-950">High Quality & Durable</h4>
              <p className="text-[10px] text-slate-500">Active School Wear</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-subtle">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pastel-green text-brand-pastel-green-text">
              <BadgePercent className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy-950">Affordable Prices</h4>
              <p className="text-[10px] text-slate-500">Direct From Manufacturer</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-subtle">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-pastel-pink text-brand-pastel-pink-text">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy-950">Easy Returns & Exchanges</h4>
              <p className="text-[10px] text-slate-500">7-Day Hassle Free</p>
            </div>
          </div>

          <div className="col-span-2 md:col-span-1 flex items-center gap-3 p-3 rounded-2xl bg-white/80 shadow-subtle">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-brand-navy-900">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-brand-navy-950">Secure Payments</h4>
              <p className="text-[10px] text-slate-500">100% Encrypted UPI & Cards</p>
            </div>
          </div>
        </div>

        {/* 2. Newsletter Banner */}
        <div className="my-10 rounded-3xl bg-brand-navy-950 p-6 sm:p-10 text-white relative overflow-hidden shadow-card">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Join Our Community</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Get exclusive offers, new school uniform arrivals and size guidance updates.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex w-full max-w-md items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="h-12 w-full rounded-full border border-slate-700 bg-brand-navy-900 px-5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:border-brand-yellow-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow-400/30"
                />
              </div>
              <Button type="submit" variant="yellow" size="lg" className="shrink-0">
                {isSubscribed ? "Subscribed! ✨" : "SUBSCRIBE"}
              </Button>
            </form>
          </div>
        </div>

        {/* 3. Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 py-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-2xl font-black tracking-tight text-brand-navy-950">
                Tirupati<span className="text-brand-navy-800">Balajee</span>
              </span>
              <span className="rounded bg-brand-yellow-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-brand-navy-950">
                Dresses
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              India&apos;s trusted platform for high quality school uniforms, thermals, school shoes, and
              academic accessories. Designed for comfort, durability, and a brighter tomorrow.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-subtle hover:bg-brand-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-subtle hover:bg-brand-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-subtle hover:bg-brand-yellow-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-subtle hover:bg-brand-yellow-400 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Shop</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/category/school-uniforms" className="hover:text-brand-navy-950 transition-colors">
                  School Uniforms
                </Link>
              </li>
              <li>
                <Link href="/category/thermals" className="hover:text-brand-navy-950 transition-colors">
                  Thermals
                </Link>
              </li>
              <li>
                <Link href="/category/school-shoes" className="hover:text-brand-navy-950 transition-colors">
                  School Shoes
                </Link>
              </li>
              <li>
                <Link href="/category/school-bags" className="hover:text-brand-navy-950 transition-colors">
                  School Bags
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-brand-navy-950 transition-colors">
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Help</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/track-order" className="hover:text-brand-navy-950 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-brand-navy-950 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-brand-navy-950 transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-brand-navy-950 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-navy-950 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">About</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/about" className="hover:text-brand-navy-950 transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-brand-navy-950 transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-brand-navy-950 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/schools-partnership" className="hover:text-brand-navy-950 transition-colors">
                  School Partnerships
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & App */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Legal</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-navy-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-navy-950 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-brand-navy-950 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="hover:text-brand-navy-950 transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 4. Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} TirupatiBalajee Dresses. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for a brighter tomorrow <Heart className="h-3.5 w-3.5 fill-brand-yellow-500 text-brand-yellow-500 inline" />
          </p>
        </div>
      </Container>
    </footer>
  );
}
