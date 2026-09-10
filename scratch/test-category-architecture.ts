import { PrismaClient } from "@prisma/client";
import { categoryService } from "../src/services/category.service";

const prisma = new PrismaClient();

async function main() {
  console.log("=== STEP 1: Verify getNavigationCategories ===");
  const nav = await categoryService.getNavigationCategories();
  console.log(`Navigation root count: ${nav.length}`);
  nav.forEach((cat) => {
    console.log(` - [Root] ${cat.name} (${cat.slug}) -> children: ${cat.children?.length || 0}`);
  });

  console.log("\n=== STEP 2: Resolve standard category path ===");
  const resolvedSchool = await categoryService.resolveCategoryPath(["school-uniforms"]);
  console.log("Resolved school-uniforms:", {
    title: resolvedSchool?.category?.name,
    isRedirect: !!resolvedSchool?.redirectUrl,
    filters: resolvedSchool?.initialFilters,
  });

  console.log("\n=== STEP 3: Resolve subcategory path ===");
  const resolvedSummer = await categoryService.resolveCategoryPath(["school-uniforms", "summer-dress"]);
  console.log("Resolved summer-dress:", {
    title: resolvedSummer?.category?.name,
    filters: resolvedSummer?.initialFilters,
    breadcrumbs: resolvedSummer?.breadcrumbs,
  });

  console.log("\n=== STEP 4: Test Dynamic Category Creation ===");
  const testSlug = `lab-coats-test-${Date.now()}`;
  const newCat = await categoryService.createCategory({
    name: "Lab Coats & Aprons",
    slug: testSlug,
    description: "Certified chemistry and biology lab coats for students",
    displayOrder: 99,
  });
  console.log(`Created new category: ${newCat.name} (id: ${newCat.id}, slug: ${newCat.slug})`);

  // Verify resolution of the brand new category immediately without any code changes
  const resolvedNew = await categoryService.resolveCategoryPath([testSlug]);
  console.log(`Brand new category resolved immediately: ${resolvedNew?.category?.name} - matches: ${resolvedNew?.category?.id === newCat.id}`);

  console.log("\n=== STEP 5: Test Dynamic Slug Rename and Auto-Redirect ===");
  const renamedSlug = `${testSlug}-renamed`;
  const updatedCat = await categoryService.updateCategory(newCat.id, {
    slug: renamedSlug,
    name: "Student Lab Coats & Science Aprons",
  });
  console.log(`Renamed category to slug: ${updatedCat.slug}`);

  // Test resolving the OLD slug: should return redirectUrl to the new slug!
  const oldSlugResolution = await categoryService.resolveCategoryPath([testSlug]);
  console.log(`Old slug [${testSlug}] resolved redirect URL:`, oldSlugResolution?.redirectUrl);
  if (oldSlugResolution?.redirectUrl === `/shop/${renamedSlug}`) {
    console.log(" SUCCESS: Slug redirect correctly points to new slug!");
  } else {
    console.error(" FAILURE: Slug redirect did not match expected path!");
  }

  // Cleanup test category and redirects
  console.log("\n=== STEP 6: Clean up test category ===");
  await prisma.categoryRedirect.deleteMany({ where: { categoryId: newCat.id } });
  await prisma.category.delete({ where: { id: newCat.id } });
  console.log("Cleaned up test records successfully.");
}

main()
  .catch((e) => {
    console.error("Verification test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
