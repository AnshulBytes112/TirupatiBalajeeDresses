import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All School Products & Categories | TirupatiBalajee Dresses",
  description:
    "Explore our complete catalog of school uniforms, shoes, bags, thermals, and classroom essentials.",
  alternates: {
    canonical: "/category",
  },
  openGraph: {
    title: "All School Products & Categories | TirupatiBalajee Dresses",
    description:
      "Explore our complete catalog of school uniforms, shoes, bags, thermals, and classroom essentials.",
    url: "https://tirupatibalajeedresses.com/category",
    siteName: "TirupatiBalajee Dresses",
    locale: "en_IN",
    type: "website",
  },
};

export default async function AllCategoriesPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const flatParams: Record<string, string> = {};
  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (typeof v === "string") flatParams[k] = v;
    else if (Array.isArray(v) && v.length > 0) flatParams[k] = v[0];
  });

  const query = getProductsQuerySchema.parse({
    ...flatParams,
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="All School Products & Categories"
      description="Explore our complete catalog of certified school uniforms, footwear, and classroom accessories."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "All Categories" },
      ]}
      baseRoute="/category"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
    />
  );
}
