import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Shirt, Layers } from "lucide-react";
import { categoryService } from "@/services/category.service";
import { Container } from "@/components/layout/container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Categories & School Departments | TirupatiBalajee Dresses",
  description:
    "Explore our complete catalog of certified school uniforms, winter thermals, footwear, backpacks, and classroom essentials.",
  alternates: {
    canonical: "/categories",
  },
  openGraph: {
    title: "All Categories & School Departments | TirupatiBalajee Dresses",
    description:
      "Explore our complete catalog of certified school uniforms, winter thermals, footwear, backpacks, and classroom essentials.",
    url: "https://tirupatibalajeedresses.com/categories",
    siteName: "TirupatiBalajee Dresses",
    locale: "en_IN",
    type: "website",
  },
};

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "school-uniforms": "/images/shirt.jpg",
  "summer-dress": "/images/shirt.jpg",
  "winter-dress": "/images/winter-flatlay.jpg",
  "thermals": "/images/thermal.jpg",
  "school-shoes": "/images/shoes.jpg",
  "school-bags": "/images/backpack.jpg",
  "stationery": "/images/stationery.jpg",
  "belts-accessories": "/images/belt.jpg",
  "socks-stockings": "/images/socks.jpg",
  "lunch-boxes-bottles": "/images/lunchbox.jpg",
  "combos": "/images/combo-kids.jpg",
};

export default async function CategoriesDiscoveryPage() {
  const categories = await categoryService.getCategories();

  return (
    <div className="min-h-screen bg-brand-cream-50/40 pb-20 pt-4 sm:pt-6">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-navy-950 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-navy-950 font-bold">Categories</span>
        </nav>

        {/* Discovery Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-yellow-50/50 to-brand-cream-50 p-6 sm:p-8 lg:p-10 mb-8 shadow-xs">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200/80 shadow-2xs mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Explore All School Departments</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 tracking-tight leading-tight">
              School Categories & Departments
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              Browse prescribed uniforms, winter sets, footwear, and classroom supplies across all grades and certified school boards.
            </p>
          </div>
        </div>

        {/* Dynamic Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const imageSrc = cat.imageUrl || DEFAULT_CATEGORY_IMAGES[cat.slug] || "/images/shirt.jpg";
            const shopUrl = `/shop/${cat.slug}`;

            return (
              <div
                key={cat.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs hover:shadow-card hover:border-brand-yellow-400/80 transition-all duration-300"
              >
                <div>
                  {/* Top Image & Count */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <Image
                      src={imageSrc}
                      alt={cat.name}
                      fill
                      unoptimized={Boolean(
                        imageSrc.startsWith("data:") || imageSrc.startsWith("http")
                      )}
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-brand-navy-950/90 text-white text-[10px] font-black px-2.5 py-1 backdrop-blur-xs">
                      {cat.productsCount} Products
                    </div>
                  </div>

                  {/* Title & Description */}
                  <Link href={shopUrl} className="block group-hover:text-brand-navy-700">
                    <h2 className="text-lg sm:text-xl font-black text-brand-navy-950 tracking-tight">
                      {cat.name}
                    </h2>
                  </Link>

                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.description || `Official quality ${cat.name} for school students.`}
                  </p>

                  {/* Subcategories / Child tags */}
                  {cat.children && cat.children.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/shop/${cat.slug}/${child.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-100/90 hover:bg-brand-yellow-100 hover:text-brand-navy-950 px-2 py-1 text-[11px] font-bold text-slate-700 transition-colors"
                        >
                          <span>{child.name}</span>
                          <span className="text-[10px] text-slate-400">({child.productsCount})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Explore Link */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {cat.children.length > 0 ? `${cat.children.length} Sub-departments` : "Direct Department"}
                  </span>
                  <Link
                    href={shopUrl}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy-950 text-white px-3.5 py-1.5 text-xs font-bold hover:bg-brand-yellow-400 hover:text-brand-navy-950 transition-colors shadow-2xs"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
