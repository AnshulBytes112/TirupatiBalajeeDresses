import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Special Offers & Uniform Deals | Save Up to 50% Off",
    description:
      "Exclusive back-to-school discounts, bundle combo savings, and clearance offers on school uniforms, shoes, thermals, bags and school essentials.",
    alternates: {
      canonical: "/offers",
    },
    openGraph: {
      title: "Special Offers & Uniform Deals | Tirupati Balajee Dresses",
      description: "Grab limited-time discounts on school uniforms, shoes, thermals and accessories.",
      url: "https://tirupatibalajeedresses.com/offers",
      type: "website",
    },
  };
}

export default async function OffersPage({
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
    hasDiscount: "true",
    sortBy:
      flatParams.sort === "price_asc" ||
      flatParams.sort === "price_desc" ||
      flatParams.sort === "newest" ||
      flatParams.sort === "rating_desc" ||
      flatParams.sort === "discount_desc"
        ? flatParams.sort
        : "discount_desc",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="Offers & Special Deals"
      description="Flat Discounts & Combo Packs for Complete School Kits."
      breadcrumbs={[{ label: "Offers & Deals" }]}
      baseRoute="/offers"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ hasDiscount: true }}
      categorySlug="offers"
    />
  );
}
