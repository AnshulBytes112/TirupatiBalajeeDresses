import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "School Items, Stationery & Accessories | Complete School Supplies",
    description:
      "One-stop store for school essentials: geometry boxes, notebook sets, insulated water bottles, lunch boxes, school belts, socks, hairbands and stationery kits.",
    alternates: {
      canonical: "/school-items",
    },
    openGraph: {
      title: "School Items & Stationery Supplies | Tirupati Balajee Dresses",
      description: "Everything your child needs for the school year in one place.",
      url: "https://tirupatibalajeedresses.com/school-items",
      type: "website",
    },
  };
}

export default async function SchoolItemsPage({
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
    category: flatParams.category,
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="School Items & Accessories"
      description="Quality stationery supplies, notebook bundles, stainless steel bottles, lunch boxes, belts, socks, and everyday student essentials."
      breadcrumbs={[{ label: "School Items & Accessories" }]}
      baseRoute="/school-items"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      categorySlug="school-items"
    />
  );
}
