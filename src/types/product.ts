import { GenderType, SeasonType } from "./common";

export interface ProductImageDTO {
  id: string;
  url: string;
  alt?: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariantDTO {
  id: string;
  size: string;
  color?: string | null;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  stockQuantity: number;
}

export interface SchoolDTO {
  id: string;
  name: string;
  slug: string;
  board?: string | null;
  city: string;
  state: string;
  logoUrl?: string | null;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface ProductSummaryDTO {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  basePrice: number;
  salePrice?: number | null;
  gender: GenderType;
  season: SeasonType;
  isBestseller: boolean;
  isFeatured: boolean;
  category: CategoryDTO;
  school?: SchoolDTO | null;
  images: ProductImageDTO[];
  variants: ProductVariantDTO[];
  rating?: number;
  reviewsCount?: number;
}
