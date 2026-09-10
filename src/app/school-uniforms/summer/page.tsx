import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Summer School Uniforms | Lightweight, Breathable & Anti-Sweat",
    description:
      "Explore summer school shirts, shorts, pinafores, skirts and sports kits. Lightweight 100% breathable fabrics to keep kids cool and active during school hours.",
    alternates: {
      canonical: "/school-uniforms/summer",
    },
    openGraph: {
      title: "Summer School Uniforms | Tirupati Balajee Dresses",
      description: "Lightweight, breathable summer school uniforms with sweat-wicking comfort.",
      url: "https://tirupatibalajeedresses.com/school-uniforms/summer",
      type: "website",
    },
  };
}

export default async function SummerSchoolUniformsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const flatParams: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (typeof v === "string") flatParams[k] = v;
    else if (Array.isArray(v) && v.length > 0) flatParams[k] = v[0];
  });

  const query = getProductsQuerySchema.parse({
    ...flatParams,
    category: flatParams.category || "school-uniforms",
    season: "SUMMER",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="Summer School Uniforms"
      description="Lightweight. Breathable. Perfect for Everyday Learning."
      breadcrumbs={[
        { label: "School Uniforms", href: "/school-uniforms" },
        { label: "Summer Dress" },
      ]}
      baseRoute="/school-uniforms/summer"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "school-uniforms", season: "SUMMER" }}
      categorySlug="school-uniforms"
      season="SUMMER"
    />
  );
}
