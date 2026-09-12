import { categoryRepository } from "@/repositories/category.repository";
import { NotFoundError } from "@/lib/errors";

export interface ResolvedCategoryContext {
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    parentId: string | null;
  };
  breadcrumbs: Array<{ label: string; href?: string }>;
  banner: {
    title: string;
    subtitle: string;
    imageUrl?: string;
    categorySlug: string;
    season?: string;
  };
  initialFilters: Record<string, any>;
  redirectUrl?: string;
}

export interface NavigationCategoryItem {
  id: string;
  name: string;
  label: string;
  slug: string;
  href: string;
  displayOrder: number;
  productsCount: number;
  isSpecial?: boolean;
  children: Array<{
    id: string;
    name: string;
    label: string;
    slug: string;
    href: string;
    productsCount: number;
  }>;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export class CategoryService {
  async getCategories(includeInactive = false) {
    const categories = await categoryRepository.findAll(includeInactive);
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      productsCount: cat._count.products + cat._count.subProducts,
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        imageUrl: child.imageUrl,
        isActive: child.isActive,
        productsCount: child._count.products + child._count.subProducts,
      })),
    }));
  }

  async getAllCategoriesFlat(includeInactive = false) {
    const categories = await categoryRepository.findAllFlat(includeInactive);
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parentId: cat.parentId,
      parentName: cat.parent?.name || null,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      productsCount: cat._count.products + cat._count.subProducts,
    }));
  }

  async getNavigationCategories(): Promise<NavigationCategoryItem[]> {
    const categories = await categoryRepository.findAll();

    const items: NavigationCategoryItem[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      label: cat.name.toUpperCase(),
      slug: cat.slug,
      href: `/shop/${cat.slug}`,
      displayOrder: cat.displayOrder,
      productsCount: cat._count.products + cat._count.subProducts,
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        label: child.name.toUpperCase(),
        slug: child.slug,
        href: `/shop/${cat.slug}/${child.slug}`,
        productsCount: child._count.products + child._count.subProducts,
      })),
    }));

    return items;
  }

  async getCategoryBySlug(slug: string) {
    const cat = await categoryRepository.findBySlug(slug);
    if (!cat) {
      throw new NotFoundError(`Category with slug '${slug}'`);
    }
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      parent: cat.parent ? { id: cat.parent.id, name: cat.parent.name, slug: cat.parent.slug } : null,
      children: cat.children.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        productsCount: c._count.products,
      })),
      productsCount: cat._count.products + cat._count.subProducts,
    };
  }

  async resolveCategoryPath(slugs: string[]): Promise<ResolvedCategoryContext | null> {
    if (!slugs || slugs.length === 0) {
      return null;
    }

    const primarySlug = slugs[0].toLowerCase();
    const secondarySlug = slugs[1]?.toLowerCase();
    const targetSlug = secondarySlug || primarySlug;

    // 1. Check for slug redirect in database
    const redirect = await categoryRepository.findRedirect(targetSlug);
    if (redirect) {
      return {
        redirectUrl: `/shop/${redirect.newSlug}`,
      } as ResolvedCategoryContext;
    }

    // Also check redirect for full path joined
    const fullPathRedirect = await categoryRepository.findRedirect(slugs.join("/"));
    if (fullPathRedirect) {
      return {
        redirectUrl: `/shop/${fullPathRedirect.newSlug}`,
      } as ResolvedCategoryContext;
    }

    // 2. Fetch category from database
    let category = await categoryRepository.findBySlug(targetSlug);

    // If target not found directly, check primarySlug
    if (!category && secondarySlug) {
      category = await categoryRepository.findBySlug(primarySlug);
    }

    if (!category) {
      return null;
    }

    // 3. Build dynamic breadcrumbs from category hierarchy
    const breadcrumbs: Array<{ label: string; href?: string }> = [
      { label: "Home", href: "/" },
      { label: "All Categories", href: "/categories" },
    ];

    if (category.parent) {
      if (category.parent.parent) {
        breadcrumbs.push({
          label: category.parent.parent.name,
          href: `/shop/${category.parent.parent.slug}`,
        });
      }
      breadcrumbs.push({
        label: category.parent.name,
        href: `/shop/${category.parent.slug}`,
      });
      breadcrumbs.push({
        label: category.name,
      });
    } else {
      breadcrumbs.push({
        label: category.name,
      });
    }

    // 4. Construct initial filters based on category relation
    const initialFilters: Record<string, any> = {};
    if (category.parentId && category.parent) {
      initialFilters.category = category.parent.slug;
      initialFilters.subcategory = category.slug;
    } else {
      initialFilters.category = category.slug;
    }

    // Handle season sub-filters if category relates to summer/winter uniforms
    let detectedSeason: string | undefined = undefined;
    if (
      category.slug.includes("summer") ||
      category.name.toLowerCase().includes("summer")
    ) {
      detectedSeason = "SUMMER";
      initialFilters.season = "SUMMER";
    } else if (
      category.slug.includes("winter") ||
      category.name.toLowerCase().includes("winter")
    ) {
      detectedSeason = "WINTER";
      initialFilters.season = "WINTER";
    }

    // 5. Build dynamic campaign banner data
    const banner = {
      title: category.name.toUpperCase(),
      subtitle:
        category.description ||
        `Official & Prescribed ${category.name} for School Students across India.`,
      imageUrl: category.imageUrl || undefined,
      categorySlug: category.slug,
      season: detectedSeason,
    };

    return {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        imageUrl: category.imageUrl,
        parentId: category.parentId,
      },
      breadcrumbs,
      banner,
      initialFilters,
    };
  }

  // --- Admin Methods ---
  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    parentId?: string | null;
    displayOrder?: number;
    isActive?: boolean;
  }) {
    const generatedSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Ensure slug uniqueness
    const existing = await categoryRepository.findBySlug(generatedSlug);
    if (existing) {
      throw new Error(`Category with slug '${generatedSlug}' already exists.`);
    }

    return categoryRepository.create({
      name: data.name,
      slug: generatedSlug,
      description: data.description,
      imageUrl: data.imageUrl,
      parentId: data.parentId || null,
      displayOrder: data.displayOrder ?? 0,
      isActive: data.isActive ?? true,
    });
  }

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      imageUrl?: string;
      parentId?: string | null;
      displayOrder?: number;
      isActive?: boolean;
    }
  ) {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}'`);
    }

    let nextSlug = data.slug ? slugify(data.slug) : undefined;
    if (nextSlug && nextSlug !== existing.slug) {
      const slugConflict = await categoryRepository.findBySlug(nextSlug);
      if (slugConflict && slugConflict.id !== id) {
        throw new Error(`Slug '${nextSlug}' is already in use by another category.`);
      }
    }

    return categoryRepository.update(id, {
      ...data,
      slug: nextSlug,
    });
  }

  async deleteCategory(id: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Category with ID '${id}'`);
    }
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
