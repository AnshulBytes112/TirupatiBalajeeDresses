import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";
import { FilterState } from "@/components/products/filter-sidebar";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string[];
  };
  searchParams: Record<string, string | string[] | undefined>;
}

interface CategoryRouteConfig {
  title: string;
  subtitle: string;
  initialFilters: Partial<FilterState>;
  breadcrumbs: { label: string; href?: string }[];
  seoTitle: string;
  seoDescription: string;
}

function resolveCategoryContext(slugs: string[]): CategoryRouteConfig {
  const primarySlug = slugs[0]?.toLowerCase() || "all";
  const secondarySlug = slugs[1]?.toLowerCase();

  // 1. Summer Uniforms
  if (
    primarySlug === "summer-dress" ||
    primarySlug === "summer" ||
    (primarySlug === "school-uniforms" && secondarySlug === "summer")
  ) {
    return {
      title: "Summer School Uniforms",
      subtitle: "Lightweight. Breathable. Perfect for Everyday Learning.",
      initialFilters: {
        category: "school-uniforms",
        season: "summer",
      },
      breadcrumbs: [
        { label: "School Uniforms", href: "/category/school-uniforms" },
        { label: "Summer Dress" },
      ],
      seoTitle: "Summer School Uniforms | Lightweight, Breathable & Anti-Sweat",
      seoDescription:
        "Shop premium lightweight summer school uniforms, half sleeve shirts, pleated skirts, shorts, and cotton polos for Delhi Public School, KV, Ryan & DAV.",
    };
  }

  // 2. Winter Uniforms
  if (
    primarySlug === "winter-dress" ||
    primarySlug === "winter" ||
    (primarySlug === "school-uniforms" && secondarySlug === "winter")
  ) {
    return {
      title: "Winter School Uniforms",
      subtitle: "Warm. Cozy. Same Great Quality & Durable Stitching.",
      initialFilters: {
        category: "school-uniforms",
        season: "winter",
      },
      breadcrumbs: [
        { label: "School Uniforms", href: "/category/school-uniforms" },
        { label: "Winter Dress" },
      ],
      seoTitle: "Winter School Uniforms | Warm Blazers, Sweaters & Cardigans",
      seoDescription:
        "Official winter school uniforms, warm pure wool blazers, V-neck sweaters, pullovers, and trousers for top CBSE & ICSE schools.",
    };
  }

  // 3. School Uniforms (General / All)
  if (primarySlug === "school-uniforms") {
    return {
      title: "School Uniforms",
      subtitle: "Official Prescribed Uniforms for Top Indian Schools.",
      initialFilters: {
        category: "school-uniforms",
      },
      breadcrumbs: [{ label: "School Uniforms" }],
      seoTitle: "Official School Uniforms Online | DPS, KV, Ryan, DAV & St. Xavier's",
      seoDescription:
        "Buy certified school uniforms for boys and girls. High quality fabrics, double-stitched seams, and exact school board patterns.",
    };
  }

  // 4. Thermals
  if (primarySlug === "thermals") {
    return {
      title: "Kids Thermals & Innerwear",
      subtitle: "Ultra-Soft. Body-Hugging Warmth. Non-Bulky Under Uniforms.",
      initialFilters: {
        category: "thermals",
      },
      breadcrumbs: [{ label: "Thermals" }],
      seoTitle: "Kids School Thermals & Innerwear Sets | TirupatiBalajee Dresses",
      seoDescription:
        "Keep kids warm during morning assembly with breathable, ultra-soft thermal tops, bottoms, and sets for boys and girls.",
    };
  }

  // 5. School Shoes
  if (primarySlug === "school-shoes") {
    return {
      title: "School Shoes & Footwear",
      subtitle: "Durable. Anti-Skid Soles. All-Day Assembly & Playground Comfort.",
      initialFilters: {
        category: "school-shoes",
      },
      breadcrumbs: [{ label: "School Shoes" }],
      seoTitle: "School Shoes Online | Black Leather, White PT & Canvas Shoes",
      seoDescription:
        "Official school black oxford shoes, white sports PT shoes, and velcro slip-on shoes with cushioned insoles for everyday durability.",
    };
  }

  // 6. School Bags
  if (primarySlug === "school-bags") {
    return {
      title: "Ergonomic School Bags",
      subtitle: "Spacious. Water-Resistant. Padded Spine Support for Growing Kids.",
      initialFilters: {
        category: "school-bags",
      },
      breadcrumbs: [{ label: "School Bags" }],
      seoTitle: "Ergonomic School Backpacks & Bags for Boys & Girls",
      seoDescription:
        "Lightweight, orthopedic spine-support school backpacks with multi-compartments and bottle holders for primary and senior students.",
    };
  }

  // 7. Stationery
  if (primarySlug === "stationery" || primarySlug === "school-items") {
    return {
      title: "Stationery & Supplies",
      subtitle: "Geometry Boxes, Notebooks, Art Kits & School Supplies.",
      initialFilters: {
        category: primarySlug === "stationery" ? "stationery" : undefined,
      },
      breadcrumbs: [{ label: "Stationery & Supplies" }],
      seoTitle: "School Stationery, Art Supplies & Classroom Essentials",
      seoDescription:
        "Complete stationery supplies, geometry boxes, color pencils, notebooks, and exam boards at honest prices.",
    };
  }

  // 8. Socks & Stockings
  if (primarySlug === "socks-stockings" || primarySlug === "socks") {
    return {
      title: "School Socks & Stockings",
      subtitle: "Soft Combed Cotton. Elastic Grip. Breathable Everyday Fit.",
      initialFilters: {
        category: "socks-stockings",
      },
      breadcrumbs: [{ label: "Socks & Stockings" }],
      seoTitle: "School Socks & Stockings | White, Navy, Grey & House Colors",
      seoDescription:
        "Cotton cushioned ankle and knee-length school socks, winter thermal stockings, and house color socks.",
    };
  }

  // 9. Belts & Accessories
  if (primarySlug === "belts-accessories" || primarySlug === "accessories") {
    return {
      title: "Belts & Accessories",
      subtitle: "Official Uniform Belts, Metal Buckles, Ties & Identity Accessories.",
      initialFilters: {
        category: "belts-accessories",
      },
      breadcrumbs: [{ label: "Belts & Accessories" }],
      seoTitle: "School Uniform Belts, Ties & Accessories | TirupatiBalajee Dresses",
      seoDescription:
        "Official school ties, striped neckties, house badges, metal buckle belts, and hair accessories.",
    };
  }

  // 10. Lunch Boxes & Water Bottles
  if (
    primarySlug === "lunch-boxes-bottles" ||
    primarySlug === "lunch-boxes" ||
    primarySlug === "water-bottles"
  ) {
    return {
      title: "Lunch Boxes & Bottles",
      subtitle: "100% Food Grade. BPA-Free. Leakproof & Insulated for Fresh Food.",
      initialFilters: {
        category: "lunch-boxes-bottles",
      },
      breadcrumbs: [{ label: "Lunch Boxes & Bottles" }],
      seoTitle: "Kids Stainless Steel Lunch Boxes & Insulated Water Bottles",
      seoDescription:
        "BPA-free, leakproof stainless steel lunch boxes and vacuum insulated water bottles for school kids.",
    };
  }

  // 11. Combos
  if (primarySlug === "combos") {
    return {
      title: "Uniform Combos & Sets",
      subtitle: "Complete Back-to-School Bundles with Extra Savings.",
      initialFilters: {
        category: "combos",
      },
      breadcrumbs: [{ label: "Combos" }],
      seoTitle: "School Uniform Combos & Multi-Packs | TirupatiBalajee Dresses",
      seoDescription:
        "Save more with multi-pack shirts, complete uniform sets, and back-to-school essentials bundles.",
    };
  }

  // 12. Offers
  if (primarySlug === "offers") {
    return {
      title: "Special Offers & Deals",
      subtitle: "Up to 40% Off on Premium Uniforms, Combos & Accessories.",
      initialFilters: {
        discount: 20,
      },
      breadcrumbs: [{ label: "Special Offers" }],
      seoTitle: "Special Offers & Uniform Discounts | TirupatiBalajee Dresses",
      seoDescription:
        "Explore hot deals, season discounts, and combo offers on certified school uniforms and supplies.",
    };
  }

  // Default / Catch-All
  const formattedTitle = primarySlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: formattedTitle,
    subtitle: `Explore quality ${formattedTitle} for school students.`,
    initialFilters: {
      category: primarySlug === "all" ? undefined : primarySlug,
    },
    breadcrumbs: [{ label: formattedTitle }],
    seoTitle: `${formattedTitle} | TirupatiBalajee Dresses`,
    seoDescription: `Browse certified ${formattedTitle} online at TirupatiBalajee Dresses. Fast shipping and high durability.`,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const config = resolveCategoryContext(params.slug);
  const path = `/category/${params.slug.join("/")}`;

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      url: `https://tirupatibalajeedresses.com${path}`,
      siteName: "TirupatiBalajee Dresses",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function DynamicCategoryPage({ params, searchParams }: PageProps) {
  const config = resolveCategoryContext(params.slug);
  const baseRoute = `/category/${params.slug.join("/")}`;

  const resolvedParams = searchParams ? await searchParams : {};
  const flatParams: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (typeof v === "string") flatParams[k] = v;
    else if (Array.isArray(v) && v.length > 0) flatParams[k] = v[0];
  });

  const query = getProductsQuerySchema.parse({
    ...flatParams,
    ...config.initialFilters,
    category: flatParams.category || config.initialFilters.category,
    season: (flatParams.season || config.initialFilters.season || "").toUpperCase() || undefined,
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title={config.title}
      description={config.subtitle}
      breadcrumbs={config.breadcrumbs}
      baseRoute={baseRoute}
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={config.initialFilters}
      categorySlug={config.initialFilters.category}
      season={config.initialFilters.season}
    />
  );
}
