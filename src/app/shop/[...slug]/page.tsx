import { Metadata } from "next";
import { notFound, redirect, RedirectType } from "next/navigation";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { ProductListingView } from "@/components/products/product-listing-view";
import { getProductsQuerySchema } from "@/validations/product.schema";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    slug: string[];
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const context = await categoryService.resolveCategoryPath(params.slug);

  if (!context || context.redirectUrl) {
    return {
      title: "Shop School Essentials | TirupatiBalajee Dresses",
      description: "Explore our collection of certified school uniforms, footwear, and accessories.",
    };
  }

  const categoryPath = `/shop/${params.slug.join("/")}`;
  const seoTitle = `${context.category.name} | TirupatiBalajee Dresses`;
  const seoDesc =
    context.category.description ||
    `Explore premium quality ${context.category.name} for school students at TirupatiBalajee Dresses. Certified fabrics and guaranteed fit.`;

  return {
    title: seoTitle,
    description: seoDesc,
    alternates: {
      canonical: categoryPath,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://tirupatibalajeedresses.com${categoryPath}`,
      siteName: "TirupatiBalajee Dresses",
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function DynamicShopPLPPage({ params, searchParams }: PageProps) {
  const context = await categoryService.resolveCategoryPath(params.slug);

  if (!context) {
    notFound();
  }

  if (context.redirectUrl) {
    redirect(context.redirectUrl, RedirectType.replace);
  }

  const baseRoute = `/shop/${params.slug.join("/")}`;
  const resolvedParams = searchParams ? await searchParams : {};
  const flatParams: Record<string, string> = {};

  Object.entries(resolvedParams).forEach(([k, v]) => {
    if (typeof v === "string") flatParams[k] = v;
    else if (Array.isArray(v) && v.length > 0) flatParams[k] = v[0];
  });

  const query = getProductsQuerySchema.parse({
    ...flatParams,
    ...context.initialFilters,
    category: flatParams.category || context.initialFilters.category,
    subcategory: flatParams.subcategory || context.initialFilters.subcategory,
    season: (flatParams.season || context.initialFilters.season || "").toUpperCase() || undefined,
  });

  const [productsResult, filterOptions] = await Promise.all([
    productService.getProducts(query),
    productService.getFilterAggregations(),
  ]);

  return (
    <ProductListingView
      title={context.banner.title}
      description={context.banner.subtitle}
      breadcrumbs={context.breadcrumbs}
      baseRoute={baseRoute}
      initialProducts={productsResult.items}
      initialPagination={productsResult.pagination}
      filterOptions={filterOptions}
      preFilters={context.initialFilters}
      categorySlug={context.banner.categorySlug}
      season={context.banner.season}
    />
  );
}
