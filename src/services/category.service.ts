import { categoryRepository } from "@/repositories/category.repository";
import { NotFoundError } from "@/lib/errors";

export class CategoryService {
  async getCategories() {
    const categories = await categoryRepository.findAll();
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      displayOrder: cat.displayOrder,
      productsCount: cat._count.products,
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        description: child.description,
        imageUrl: child.imageUrl,
        productsCount: child._count.products,
      })),
    }));
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
      })),
      productsCount: cat._count.products,
    };
  }
}

export const categoryService = new CategoryService();
