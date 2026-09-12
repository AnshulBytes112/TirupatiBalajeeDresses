"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PLPHeader, BreadcrumbItem } from "./plp-header";
import { CategoryHeroBanner } from "./category-hero-banner";
import { FilterSidebar, FilterState, FilterOptionsData } from "./filter-sidebar";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { ActiveFilterPills, ActiveFilter } from "./active-filter-pills";
import { PLPProductCard, PLPProductItem } from "./plp-product-card";
import { PLPLoadingSkeleton } from "./plp-loading-skeleton";
import { PLPEmptyState } from "./plp-empty-state";
import { PLPPagination } from "./plp-pagination";
import { RecommendationCarousel } from "./recommendation-carousel";
import { TrustBadgesBar } from "./trust-badges";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ProductListingViewProps {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  baseRoute: string;
  initialProducts: PLPProductItem[];
  initialPagination: PaginationInfo;
  filterOptions: FilterOptionsData;
  preFilters?: Partial<FilterState>;
  categorySlug?: string;
  season?: string;
}

export function ProductListingView({
  title,
  description,
  breadcrumbs,
  baseRoute,
  initialProducts = [],
  initialPagination = { total: 0, page: 1, limit: 12, totalPages: 1 },
  filterOptions = {
    schools: [],
    genders: [],
    seasons: [],
    classes: [],
    categories: [],
    sizes: [],
    colors: [],
    brands: [],
    discounts: [],
    ratings: [],
    priceRange: { min: 0, max: 2000 },
  },
  preFilters = {},
  categorySlug,
  season,
}: ProductListingViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State initialized from URL query parameters & props
  const [filters, setFilters] = React.useState<FilterState>(() => ({
    school: searchParams.get("school") || preFilters.school,
    season: searchParams.get("season") || preFilters.season,
    gender: searchParams.get("gender") || preFilters.gender,
    classGrade: searchParams.get("classGrade") || searchParams.get("class") || preFilters.classGrade,
    category: searchParams.get("category") || preFilters.category,
    size: searchParams.get("size") || preFilters.size,
    color: searchParams.get("color") || preFilters.color,
    brand: searchParams.get("brand") || preFilters.brand,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : preFilters.minPrice,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : preFilters.maxPrice,
    discount: searchParams.get("discount") ? Number(searchParams.get("discount")) : preFilters.discount,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : preFilters.rating,
    inStock: searchParams.get("inStock") === "true" || preFilters.inStock,
    outOfStock: searchParams.get("outOfStock") === "true" || preFilters.outOfStock,
  }));

  const [currentSort, setCurrentSort] = React.useState<string>(
    () => searchParams.get("sort") || "popular"
  );
  const [currentPage, setCurrentPage] = React.useState<number>(
    () => Number(searchParams.get("page") || "1")
  );

  const [products, setProducts] = React.useState<PLPProductItem[]>(initialProducts);
  const [pagination, setPagination] = React.useState<PaginationInfo>(
    initialPagination || { total: 0, page: 1, limit: 12, totalPages: 1 }
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const abortControllerRef = React.useRef<AbortController | null>(null);
  const preFiltersRef = React.useRef(preFilters);
  preFiltersRef.current = preFilters;

  // Build query string helper without triggering Next.js router.push roundtrips
  const syncURL = React.useCallback(
    (newFilters: FilterState, sort: string, page: number) => {
      const params = new URLSearchParams();
      const q = searchParams.get("q") || searchParams.get("search");
      if (q) params.set("q", q);

      Object.entries(newFilters).forEach(([key, val]) => {
        if (val !== undefined && val !== "" && val !== false) {
          if (preFiltersRef.current[key as keyof FilterState] === val) return;
          params.set(key, String(val));
        }
      });

      if (sort && sort !== "popular") {
        params.set("sort", sort);
      }

      if (page > 1) {
        params.set("page", String(page));
      }

      const queryStr = params.toString();
      const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [pathname, searchParams]
  );

  // Fetch updated products with AbortController for zero lag
  const executeFilterFetch = React.useCallback(
    async (
      activeFilters: FilterState,
      activeSort: string,
      activePage: number,
      append = false
    ) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const params = new URLSearchParams();
        const q = searchParams.get("q") || searchParams.get("search");
        if (q) params.set("q", q);

        // Include pre-filters
        Object.entries(preFiltersRef.current).forEach(([k, v]) => {
          if (v !== undefined && v !== "" && v !== false) {
            params.set(k, String(v));
          }
        });

        // Include active filters
        Object.entries(activeFilters).forEach(([k, v]) => {
          if (valIsActive(v)) {
            params.set(k, String(v));
          }
        });

        if (activeSort && activeSort !== "popular") {
          params.set("sort", activeSort);
        }

        if (activePage > 1) {
          params.set("page", String(activePage));
        }

        const url = `/api/products?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          throw new Error(
            data?.error?.message ||
              data?.message ||
              `Failed to fetch products (${res.status}: ${res.statusText})`
          );
        }

        if (append) {
          setProducts((prev) => [...prev, ...data.data]);
        } else {
          setProducts(data.data);
        }

        if (data.meta?.pagination) {
          setPagination(data.meta.pagination);
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          return; // Request was aborted due to newer filter action
        }
        console.error("PLP Fetch error:", err);
        setError(err.message || "Something went wrong while fetching products.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchParams]
  );

  function valIsActive(v: any) {
    return v !== undefined && v !== "" && v !== false && v !== null;
  }

  // Synchronize state when server component passes fresh initialProducts
  React.useEffect(() => {
    setProducts(initialProducts);
    setPagination(initialPagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
    setIsLoading(false);
    setError(null);
  }, [initialProducts, initialPagination]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    syncURL(newFilters, currentSort, 1);
    executeFilterFetch(newFilters, currentSort, 1, false);
  };

  const handleSortChange = (newSort: string) => {
    setCurrentSort(newSort);
    setCurrentPage(1);
    syncURL(filters, newSort, 1);
    executeFilterFetch(filters, newSort, 1, false);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    syncURL(filters, currentSort, newPage);
    executeFilterFetch(filters, currentSort, newPage, false);
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleLoadMoreMobile = () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      setCurrentPage(nextPage);
      executeFilterFetch(filters, currentSort, nextPage, true);
    }
  };

  const handleClearAll = () => {
    const clearedFilters: FilterState = {
      school: preFilters.school,
      season: preFilters.season,
      gender: preFilters.gender,
      classGrade: preFilters.classGrade,
      category: preFilters.category,
      size: preFilters.size,
      color: preFilters.color,
      brand: preFilters.brand,
      minPrice: preFilters.minPrice,
      maxPrice: preFilters.maxPrice,
      discount: preFilters.discount,
      rating: preFilters.rating,
      inStock: preFilters.inStock,
      outOfStock: preFilters.outOfStock,
    };
    setFilters(clearedFilters);
    setCurrentPage(1);
    syncURL(clearedFilters, currentSort, 1);
    executeFilterFetch(clearedFilters, currentSort, 1, false);
  };

  const handleRemoveSingleFilter = (key: string, value: string) => {
    const nextFilters: FilterState = { ...filters };

    if (key === "minPrice" || key === "maxPrice") {
      delete nextFilters.minPrice;
      delete nextFilters.maxPrice;
    } else if (
      key === "inStock" ||
      key === "outOfStock" ||
      key === "discount" ||
      key === "rating"
    ) {
      delete (nextFilters as any)[key];
    } else {
      const currentParamVal = (nextFilters as any)[key] as string | undefined;
      if (currentParamVal) {
        const items = currentParamVal.split(",").map((s) => s.trim()).filter(Boolean);
        const filtered = items.filter(
          (s) => s.toLowerCase() !== value.toLowerCase()
        );
        if (filtered.length > 0) {
          (nextFilters as any)[key] = filtered.join(",");
        } else {
          delete (nextFilters as any)[key];
        }
      } else {
        delete (nextFilters as any)[key];
      }
    }

    setFilters(nextFilters);
    setCurrentPage(1);
    syncURL(nextFilters, currentSort, 1);
    executeFilterFetch(nextFilters, currentSort, 1, false);
  };

  // Build active filters list for pill tags
  const activeFilterList: ActiveFilter[] = React.useMemo(() => {
    const list: ActiveFilter[] = [];

    // School multi-select
    if (filters.school && filters.school !== preFilters.school) {
      filters.school.split(",").forEach((slug) => {
        const cleanSlug = slug.trim();
        const sName =
          filterOptions.schools.find((s) => s.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "school", label: "School", value: sName, rawSlug: cleanSlug });
      });
    }

    // Brand multi-select
    if (filters.brand && filters.brand !== preFilters.brand) {
      filters.brand.split(",").forEach((slug) => {
        const cleanSlug = slug.trim();
        const bName =
          filterOptions.brands.find((b) => b.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "brand", label: "Brand", value: bName, rawSlug: cleanSlug });
      });
    }

    // Season multi-select
    if (filters.season && filters.season !== preFilters.season) {
      filters.season.split(",").forEach((s) => {
        const clean = s.trim();
        list.push({
          key: "season",
          label: "Season",
          value: clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase(),
          rawSlug: clean,
        });
      });
    }

    // Gender multi-select
    if (filters.gender && filters.gender !== preFilters.gender) {
      filters.gender.split(",").forEach((g) => {
        const clean = g.trim();
        list.push({ key: "gender", label: "Gender", value: clean, rawSlug: clean });
      });
    }

    // Class multi-select
    if (filters.classGrade && filters.classGrade !== preFilters.classGrade) {
      filters.classGrade.split(",").forEach((c) => {
        const clean = c.trim();
        list.push({ key: "classGrade", label: "Grade", value: clean, rawSlug: clean });
      });
    }

    // Category multi-select
    if (filters.category && filters.category !== "school-uniforms" && filters.category !== preFilters.category) {
      filters.category.split(",").forEach((catSlug) => {
        const cleanSlug = catSlug.trim();
        const cName =
          filterOptions.categories.find((c) => c.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "category", label: "Category", value: cName, rawSlug: cleanSlug });
      });
    }

    // Size multi-select
    if (filters.size && filters.size !== preFilters.size) {
      filters.size.split(",").forEach((sz) => {
        const clean = sz.trim();
        list.push({ key: "size", label: "Size", value: clean, rawSlug: clean });
      });
    }

    // Color multi-select
    if (filters.color && filters.color !== preFilters.color) {
      filters.color.split(",").forEach((col) => {
        const clean = col.trim();
        list.push({ key: "color", label: "Color", value: clean, rawSlug: clean });
      });
    }

    // Price
    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? `₹${filters.minPrice}` : "₹0";
      const max = filters.maxPrice ? `₹${filters.maxPrice}` : "above";
      list.push({ key: "minPrice", label: "Price", value: `${min} - ${max}`, rawSlug: "price" });
    }

    // Discount
    if (filters.discount) {
      list.push({ key: "discount", label: "Discount", value: `${filters.discount}%+`, rawSlug: String(filters.discount) });
    }

    // Rating
    if (filters.rating) {
      list.push({ key: "rating", label: "Rating", value: `${filters.rating}★+`, rawSlug: String(filters.rating) });
    }

    // In Stock
    if (filters.inStock) {
      list.push({ key: "inStock", label: "Availability", value: "In Stock", rawSlug: "inStock" });
    }

    // Out of Stock
    if (filters.outOfStock) {
      list.push({ key: "outOfStock", label: "Availability", value: "Out of Stock", rawSlug: "outOfStock" });
    }

    return list;
  }, [filters, preFilters, filterOptions]);

  return (
    <div className="min-h-screen bg-brand-cream-50/30 pb-28 sm:pb-20 pt-2 sm:pt-4">
      <Container>
        {/* PLP Breadcrumbs, Category Pill Subnav & Top Products Count */}
        <PLPHeader
          title={title}
          description={description}
          breadcrumbs={breadcrumbs}
          totalProducts={pagination.total}
          currentSort={currentSort}
          onSortChange={handleSortChange}
          isLoading={isLoading}
        />

        {/* Category Hero Banner */}
        <CategoryHeroBanner
          categorySlug={categorySlug || preFilters.category}
          season={season || preFilters.season}
          title={title}
          subtitle={description}
        />

        {/* Mobile Filter & Sort Sticky Top Bar + Drawer */}
        <MobileFilterDrawer
          filters={filters}
          options={filterOptions}
          totalProducts={pagination.total}
          currentSort={currentSort}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
        />

        {/* Active Filter Pills */}
        <ActiveFilterPills
          filters={activeFilterList}
          onRemoveFilter={handleRemoveSingleFilter}
          onClearAll={handleClearAll}
        />

        {/* Main Content Layout: Desktop Sidebar + Product Grid */}
        <div className="flex gap-8 items-start">
          {/* Desktop Filter Sidebar (Hidden on Mobile) */}
          <FilterSidebar
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
            className="hidden lg:block"
          />

          {/* Product Grid / Loading / Empty / Error State */}
          <main className="flex-1 min-w-0" id="product-grid-main">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 my-6">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <h3 className="font-bold text-base">Error Loading Products</h3>
                <p className="text-xs mt-1 text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => executeFilterFetch(filters, currentSort, currentPage, false)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try Again
                </button>
              </div>
            ) : isLoading ? (
              <PLPLoadingSkeleton count={8} />
            ) : products.length === 0 ? (
              <PLPEmptyState onClearFilters={handleClearAll} />
            ) : (
              <>
                {/* 2-Column Mobile / 3-4 Column Desktop Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <PLPProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Mobile "Load More" Button */}
                {pagination.page < pagination.totalPages && (
                  <div className="mt-8 block lg:hidden">
                    <button
                      type="button"
                      disabled={isLoadingMore}
                      onClick={handleLoadMoreMobile}
                      className="w-full rounded-2xl bg-brand-yellow-400 py-3.5 text-center text-xs font-black uppercase tracking-wider text-brand-navy-950 shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      {isLoadingMore ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading more products...</span>
                        </>
                      ) : (
                        <span>Load More</span>
                      )}
                    </button>
                  </div>
                )}

                {/* Desktop Pagination */}
                <div className="hidden lg:block">
                  <PLPPagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </main>
        </div>

        {/* "You May Also Like" Recommendations Section */}
        <RecommendationCarousel />

        {/* Bottom Trust Badges Bar */}
        <TrustBadgesBar />
      </Container>
    </div>
  );
}

