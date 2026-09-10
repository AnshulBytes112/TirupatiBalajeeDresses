import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All School Products & Uniforms | TirupatiBalajee Dresses",
  description:
    "Explore our complete collection of certified school uniforms, winter essentials, footwear, bags, and classroom supplies.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop All School Products & Uniforms | TirupatiBalajee Dresses",
    description:
      "Explore our complete collection of certified school uniforms, winter essentials, footwear, bags, and classroom supplies.",
    url: "https://tirupatibalajeedresses.com/shop",
    siteName: "TirupatiBalajee Dresses",
    locale: "en_IN",
    type: "website",
  },
};

export default async function ShopIndexPage({
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
      title="All School Products & Catalog"
      description="Browse our comprehensive selection of school uniforms, sports kits, and student essentials."
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Shop All" },
      ]}
      baseRoute="/shop"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
    />
  );
}
