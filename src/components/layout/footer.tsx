"use client";

import * as React from "react";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Heart,
} from "lucide-react";
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
    <footer className="w-full bg-[#F4EFE6] text-brand-navy-950 pt-8 pb-16 lg:pb-8 border-t border-slate-200/60 mt-4 sm:mt-6">
      <Container size="xl">
        {/* 1. Newsletter Banner */}
        <div className="rounded-2xl bg-[#07142F] p-5 sm:p-7 text-white relative overflow-hidden shadow-sm mb-6">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">Join Our Community</h3>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-300">
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
                  className="h-10 w-full rounded-full border border-slate-700 bg-brand-navy-900 px-4 text-xs text-white placeholder:text-slate-400 focus:border-brand-yellow-400 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="yellow" size="sm" className="shrink-0 h-10 px-5">
                {isSubscribed ? "Subscribed! ✨" : "SUBSCRIBE"}
              </Button>
            </form>
          </div>
        </div>

        {/* 2. Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-6 border-b border-slate-200/80">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-black tracking-tight text-brand-navy-950">
                Tirupati<span className="text-brand-navy-800">Balajee</span>
              </span>
              <span className="rounded bg-brand-yellow-400 px-1 py-0.5 text-[8.5px] font-black uppercase text-brand-navy-950">
                Dresses
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              India&apos;s trusted platform for high quality school uniforms, thermals, school shoes, and
              academic accessories. Designed for comfort, durability, and a brighter tomorrow.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-xs hover:bg-brand-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-xs hover:bg-brand-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-xs hover:bg-brand-yellow-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-3.5 w-3.5" />
              </a>
              <a
                href="#"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-navy-800 shadow-xs hover:bg-brand-yellow-400 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Shop</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Help</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/track-order" className="hover:text-brand-navy-950 transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-brand-navy-950 transition-colors">
                  Returns &amp; Exchanges
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
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Company</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/about" className="hover:text-brand-navy-950 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-brand-navy-950 transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-brand-navy-950 transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-brand-navy-950 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy-950">Legal</h4>
            <ul className="space-y-1.5 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-navy-950 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-brand-navy-950 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-brand-navy-950 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-brand-navy-950 transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Copyright Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} TirupatiBalajee Dresses. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for a brighter tomorrow <Heart className="h-3 w-3 fill-brand-yellow-500 text-brand-yellow-500 inline" />
          </p>
        </div>
      </Container>
    </footer>
  );
}
