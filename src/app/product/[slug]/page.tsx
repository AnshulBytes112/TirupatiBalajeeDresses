import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { productService } from "@/services/product.service";
import { ProductDetailView } from "@/components/product-detail/product-detail-view";
import { NotFoundError } from "@/lib/errors";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await productService.getProductBySlug(params.slug);
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tirupatibalajee.com";
    const canonicalUrl = `${siteUrl}/product/${product.slug}`;
    const primaryImage = product.images[0]?.url || `${siteUrl}/images/products/${product.slug}.png`;

    return {
      title: product.seoTitle || `${product.name} | TirupatiBalajee Dresses`,
      description:
        product.seoDescription ||
        `Buy authentic ${product.name} online at TirupatiBalajee Dresses. Certified school uniform quality with fast dispatch and hassle-free returns.`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: product.seoTitle || `${product.name} | TirupatiBalajee Dresses`,
        description:
          product.seoDescription ||
          `Buy authentic ${product.name} online at TirupatiBalajee Dresses. Fast dispatch & doorstep size exchange.`,
        url: canonicalUrl,
        siteName: "TirupatiBalajee Dresses",
        images: [
          {
            url: primaryImage,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.seoTitle || `${product.name} | TirupatiBalajee Dresses`,
        description:
          product.seoDescription ||
          `Buy authentic ${product.name} online at TirupatiBalajee Dresses.`,
        images: [primaryImage],
      },
    };
  } catch (e) {
    return {
      title: "Product Not Found | TirupatiBalajee Dresses",
      description: "The requested school apparel item could not be found.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product;
  let relatedProducts = [];

  try {
    product = await productService.getProductBySlug(params.slug);
    relatedProducts = await productService.getRelatedProducts(params.slug, 8);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    // Any uncaught missing product leads to notFound
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tirupatibalajee.com";
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;

  // JSON-LD Product Schema for Google Search Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "TirupatiBalajee",
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.sellingPrice,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.variants.some((v) => v.isAvailable)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "TirupatiBalajee Dresses",
      },
    },
    ...(product.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(product.rating || 4.8).toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };

  return (
    <>
      {/* Product JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProductDetailView product={product} relatedProducts={relatedProducts} />
    </>
  );
}
