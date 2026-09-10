import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "School Bags & Ergonomic Backpacks | Water-Resistant & Spine Care",
    description:
      "Shop ergonomic school backpacks with padded shoulder straps, heavy-duty zippers, water-resistant fabrics and multi-compartment organizers for books and laptops.",
    alternates: {
      canonical: "/school-bags",
    },
    openGraph: {
      title: "School Bags & Backpacks Collection | Tirupati Balajee Dresses",
      description: "Spine-care padded school bags and durable backpacks for students.",
      url: "https://tirupatibalajeedresses.com/school-bags",
      type: "website",
    },
  };
}

export default async function SchoolBagsPage({
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
    category: flatParams.category || "school-bags",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="Ergonomic School Bags"
      description="Spinal Support Cushioning & Durable Water-Repellent Fabric."
      breadcrumbs={[{ label: "School Bags" }]}
      baseRoute="/school-bags"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "school-bags" }}
      categorySlug="school-bags"
    />
  );
}
