import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "School Uniforms | Premium Certified Uniforms for All Schools",
    description:
      "Shop official school uniforms for Delhi Public School, Kendriya Vidyalaya, DAV, Ryan International and more. High durability, sweat-wicking fabrics and perfect fit guarantee.",
    alternates: {
      canonical: "/school-uniforms",
    },
    openGraph: {
      title: "Official School Uniforms Collection | Tirupati Balajee Dresses",
      description:
        "Premium quality school uniforms, blazers, shirts, skirts and accessories for top schools.",
      url: "https://tirupatibalajeedresses.com/school-uniforms",
      type: "website",
      siteName: "Tirupati Balajee Dresses",
    },
  };
}

export default async function SchoolUniformsPage({
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
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title="School Uniforms"
      description="Official certified uniforms for all affiliated schools. Durable cotton-poly blends, fade-resistant dyes, and reinforced seams for all-day comfort."
      breadcrumbs={[{ label: "School Uniforms" }]}
      baseRoute="/school-uniforms"
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={{ category: "school-uniforms" }}
      categorySlug="school-uniforms"
    />
  );
}
