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

  // State initialized from URL query parameters
  const [products, setProducts] = React.useState<PLPProductItem[]>(initialProducts);
  const [pagination, setPagination] = React.useState<PaginationInfo>(
    initialPagination || { total: 0, page: 1, limit: 12, totalPages: 1 }
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Extract filter state from searchParams
  const currentFilters: FilterState = React.useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      school: params.school || preFilters.school,
      season: params.season || preFilters.season,
      gender: params.gender || preFilters.gender,
      classGrade: params.classGrade || params.class || preFilters.classGrade,
      category: params.category || preFilters.category,
      size: params.size || preFilters.size,
      color: params.color || preFilters.color,
      brand: params.brand || preFilters.brand,
      minPrice: params.minPrice ? Number(params.minPrice) : preFilters.minPrice,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : preFilters.maxPrice,
      discount: params.discount ? Number(params.discount) : preFilters.discount,
      rating: params.rating ? Number(params.rating) : preFilters.rating,
      inStock: params.inStock === "true" || preFilters.inStock,
      outOfStock: params.outOfStock === "true" || preFilters.outOfStock,
    };
  }, [searchParams, preFilters]);

  const currentSort = searchParams.get("sort") || "popular";
  const currentPage = Number(searchParams.get("page") || "1");

  // Fetch updated products whenever searchParams change
  const fetchProducts = React.useCallback(
    async (paramsString: string, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      try {
        const url = `/api/products?${paramsString}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.success) {
          if (append) {
            setProducts((prev) => [...prev, ...data.data]);
          } else {
            setProducts(data.data);
          }
          if (data.meta?.pagination) {
            setPagination(data.meta.pagination);
          }
        } else {
          throw new Error(data.message || "Failed to load products");
        }
      } catch (err: any) {
        console.error("PLP Fetch error:", err);
        setError(err.message || "Something went wrong while fetching products.");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    []
  );

  const preFiltersRef = React.useRef(preFilters);
  preFiltersRef.current = preFilters;

  // Track previous search params string to prevent duplicate fetches & infinite loops
  const prevParamsStringRef = React.useRef(searchParams.toString());
  const isInitialMount = React.useRef(true);

  // Synchronize state when server component passes fresh initialProducts
  React.useEffect(() => {
    setProducts(initialProducts);
    setPagination(initialPagination || { total: 0, page: 1, limit: 12, totalPages: 1 });
    setIsLoading(false);
    setError(null);
  }, [initialProducts, initialPagination]);

  // Sync with client-side URL filter/sort/page changes
  React.useEffect(() => {
    const currentParamsString = searchParams.toString();

    // Skip on initial mount since server component already fetched initial data
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevParamsStringRef.current = currentParamsString;
      return;
    }

    // Only fetch if URL query parameters have genuinely changed
    if (prevParamsStringRef.current === currentParamsString) {
      return;
    }

    prevParamsStringRef.current = currentParamsString;

    const params = new URLSearchParams(currentParamsString);
    // Attach pre-filters if not present in URL
    Object.entries(preFiltersRef.current).forEach(([k, v]) => {
      if (v !== undefined && !params.has(k)) {
        params.set(k, String(v));
      }
    });

    fetchProducts(params.toString());
  }, [searchParams, fetchProducts]);

  // Update URL helper
  const updateURL = (newFilters: FilterState, sort?: string, page?: number) => {
    const params = new URLSearchParams();

    // Preserve search query if present
    const q = searchParams.get("q") || searchParams.get("search");
    if (q) params.set("q", q);

    // Apply filters
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== false) {
        // Skip setting URL param if it's identical to the base page's fixed preFilter
        if (preFilters[key as keyof FilterState] === val) return;
        params.set(key, String(val));
      }
    });

    const activeSort = sort !== undefined ? sort : currentSort;
    if (activeSort && activeSort !== "popular") {
      params.set("sort", activeSort);
    }

    const activePage = page !== undefined ? page : 1;
    if (activePage > 1) {
      params.set("page", String(activePage));
    }

    const queryStr = params.toString();
    const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    updateURL(newFilters, currentSort, 1);
  };

  const handleSortChange = (newSort: string) => {
    updateURL(currentFilters, newSort, 1);
  };

  const handlePageChange = (newPage: number) => {
    updateURL(currentFilters, currentSort, newPage);
    // Scroll to top of catalog smoothly
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleLoadMoreMobile = () => {
    if (pagination.page < pagination.totalPages) {
      const nextPage = pagination.page + 1;
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(preFilters).forEach(([k, v]) => {
        if (v !== undefined && !params.has(k)) {
          params.set(k, String(v));
        }
      });
      params.set("page", String(nextPage));
      fetchProducts(params.toString(), true);
    }
  };

  const handleClearAll = () => {
    const params = new URLSearchParams();
    const q = searchParams.get("q") || searchParams.get("search");
    if (q) params.set("q", q);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  const handleRemoveSingleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentParamVal = params.get(key);

    if (key === "minPrice" || key === "maxPrice") {
      params.delete("minPrice");
      params.delete("maxPrice");
    } else if (key === "inStock" || key === "outOfStock" || key === "discount" || key === "rating") {
      params.delete(key);
    } else if (currentParamVal) {
      const items = currentParamVal.split(",").map((s) => s.trim()).filter(Boolean);
      const filtered = items.filter(
        (s) => s.toLowerCase() !== value.toLowerCase()
      );
      if (filtered.length > 0) {
        params.set(key, filtered.join(","));
      } else {
        params.delete(key);
      }
    } else {
      params.delete(key);
    }

    params.delete("page");
    const queryStr = params.toString();
    const newUrl = queryStr ? `${pathname}?${queryStr}` : pathname;
    router.push(newUrl, { scroll: false });
  };

  // Build active filters list for pill tags
  const activeFilterList: ActiveFilter[] = React.useMemo(() => {
    const list: ActiveFilter[] = [];

    // School multi-select
    if (currentFilters.school && currentFilters.school !== preFilters.school) {
      currentFilters.school.split(",").forEach((slug) => {
        const cleanSlug = slug.trim();
        const sName =
          filterOptions.schools.find((s) => s.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "school", label: "School", value: sName, rawSlug: cleanSlug });
      });
    }

    // Brand multi-select
    if (currentFilters.brand && currentFilters.brand !== preFilters.brand) {
      currentFilters.brand.split(",").forEach((slug) => {
        const cleanSlug = slug.trim();
        const bName =
          filterOptions.brands.find((b) => b.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "brand", label: "Brand", value: bName, rawSlug: cleanSlug });
      });
    }

    // Season multi-select
    if (currentFilters.season && currentFilters.season !== preFilters.season) {
      currentFilters.season.split(",").forEach((s) => {
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
    if (currentFilters.gender && currentFilters.gender !== preFilters.gender) {
      currentFilters.gender.split(",").forEach((g) => {
        const clean = g.trim();
        list.push({ key: "gender", label: "Gender", value: clean, rawSlug: clean });
      });
    }

    // Class multi-select
    if (currentFilters.classGrade && currentFilters.classGrade !== preFilters.classGrade) {
      currentFilters.classGrade.split(",").forEach((c) => {
        const clean = c.trim();
        list.push({ key: "classGrade", label: "Grade", value: clean, rawSlug: clean });
      });
    }

    // Category multi-select
    if (currentFilters.category && currentFilters.category !== "school-uniforms" && currentFilters.category !== preFilters.category) {
      currentFilters.category.split(",").forEach((catSlug) => {
        const cleanSlug = catSlug.trim();
        const cName =
          filterOptions.categories.find((c) => c.slug === cleanSlug)?.name || cleanSlug;
        list.push({ key: "category", label: "Category", value: cName, rawSlug: cleanSlug });
      });
    }

    // Size multi-select
    if (currentFilters.size && currentFilters.size !== preFilters.size) {
      currentFilters.size.split(",").forEach((sz) => {
        const clean = sz.trim();
        list.push({ key: "size", label: "Size", value: clean, rawSlug: clean });
      });
    }

    // Color multi-select
    if (currentFilters.color && currentFilters.color !== preFilters.color) {
      currentFilters.color.split(",").forEach((col) => {
        const clean = col.trim();
        list.push({ key: "color", label: "Color", value: clean, rawSlug: clean });
      });
    }

    // Price
    if (currentFilters.minPrice || currentFilters.maxPrice) {
      const min = currentFilters.minPrice ? `₹${currentFilters.minPrice}` : "₹0";
      const max = currentFilters.maxPrice ? `₹${currentFilters.maxPrice}` : "above";
      list.push({ key: "minPrice", label: "Price", value: `${min} - ${max}`, rawSlug: "price" });
    }

    // Discount
    if (currentFilters.discount) {
      list.push({ key: "discount", label: "Discount", value: `${currentFilters.discount}%+`, rawSlug: String(currentFilters.discount) });
    }

    // Rating
    if (currentFilters.rating) {
      list.push({ key: "rating", label: "Rating", value: `${currentFilters.rating}★+`, rawSlug: String(currentFilters.rating) });
    }

    // In Stock
    if (currentFilters.inStock) {
      list.push({ key: "inStock", label: "Availability", value: "In Stock", rawSlug: "inStock" });
    }

    // Out of Stock
    if (currentFilters.outOfStock) {
      list.push({ key: "outOfStock", label: "Availability", value: "Out of Stock", rawSlug: "outOfStock" });
    }

    return list;
  }, [currentFilters, preFilters, filterOptions]);

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
          filters={currentFilters}
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
            filters={currentFilters}
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
                  onClick={() => fetchProducts(searchParams.toString())}
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

