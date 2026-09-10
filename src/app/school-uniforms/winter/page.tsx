import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Winter School Uniforms | Warm Blazers, Sweaters & Cardigans",
    description:
      "Keep students warm and stylish with official school blazers, woolen sweaters, fleece cardigans, full trousers and thermal tracksuits.",
    alternates: {
      canonical: "/school-uniforms/winter",
    },
    openGraph: {
      title: "Winter School Uniforms Collection | Tirupati Balajee Dresses",
      description: "Cozy school blazers, sweaters, tracksuits and winter wear for all schools.",
      url: "https://tirupatibalajeedresses.com/school-uniforms/winter",
      type: "website",
    },
  };
}

export default async function WinterSchoolUniformsPage({
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
    season: "WINTER",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="Winter School Uniforms"
      description="Insulated blazers, soft-knit sweaters, pullover cardigans, and tailored trousers to keep kids warm and comfortable all winter long."
      breadcrumbs={[
        { label: "School Uniforms", href: "/school-uniforms" },
        { label: "Winter Dress" },
      ]}
      baseRoute="/school-uniforms/winter"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "school-uniforms", season: "WINTER" }}
      categorySlug="school-uniforms"
      season="WINTER"
    />
  );
}
