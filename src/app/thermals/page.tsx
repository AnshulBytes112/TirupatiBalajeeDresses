import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Thermal Innerwear for Kids | Winter Warmers & Base Layers",
    description:
      "Ultra-soft, skin-friendly thermal top & bottom sets for school boys and girls. Non-itchy thermal fabric designed for seamless invisible layering under school uniforms.",
    alternates: {
      canonical: "/thermals",
    },
    openGraph: {
      title: "Kids Thermal Innerwear & Winter Base Layers | Tirupati Balajee Dresses",
      description: "Featherlight warmth and skin-soft thermal wear for school children.",
      url: "https://tirupatibalajeedresses.com/thermals",
      type: "website",
    },
  };
}

export default async function ThermalsPage({
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
    category: flatParams.category || "thermals",
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="Kids Thermals"
      description="Super Soft Multi-Stretch Thermal Innerwear for Everyday School."
      breadcrumbs={[{ label: "Thermals & Warmers" }]}
      baseRoute="/thermals"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "thermals" }}
      categorySlug="thermals"
    />
  );
}
