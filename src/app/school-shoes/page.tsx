import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "School Shoes & Footwear | Bata & Premium Certified Shoes",
    description:
      "Durable black formal school shoes with Velcro/lace options, white canvas PT shoes, and breathable sports shoes with anti-slip cushioned soles for everyday school activities.",
    alternates: {
      canonical: "/school-shoes",
    },
    openGraph: {
      title: "School Shoes & Athletic Footwear | Tirupati Balajee Dresses",
      description: "Ergonomic, anti-slip school shoes and PT sneakers built for daily school comfort.",
      url: "https://tirupatibalajeedresses.com/school-shoes",
      type: "website",
    },
  };
}

export default async function SchoolShoesPage({
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
    category: flatParams.category || "school-shoes",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="School Shoes & Footwear"
      description="Orthopedic Comfort & Anti-Slip Soles for Daily Assembly and Sports."
      breadcrumbs={[{ label: "School Shoes" }]}
      baseRoute="/school-shoes"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "school-shoes" }}
      categorySlug="school-shoes"
    />
  );
}
