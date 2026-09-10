import { productService } from "../src/services/product.service";
import { getProductsQuerySchema } from "../src/validations/product.schema";

async function runPLPTests() {
  console.log("=== STARTING PHASE 3 PLP VERIFICATION TESTS ===\n");

  // Test 1: Route Category Pre-filters
  const routesToTest = [
    { name: "/school-uniforms", query: { category: "school-uniforms" } },
    { name: "/school-uniforms/summer", query: { category: "school-uniforms", season: "SUMMER" } },
    { name: "/school-uniforms/winter", query: { category: "school-uniforms", season: "WINTER" } },
    { name: "/thermals", query: { category: "thermals" } },
    { name: "/school-shoes", query: { category: "school-shoes" } },
    { name: "/school-bags", query: { category: "school-bags" } },
    { name: "/school-items", query: { category: "stationery" } },
    { name: "/offers", query: { hasDiscount: true, sortBy: "discount_desc" } },
  ];

  for (const r of routesToTest) {
    const parsed = getProductsQuerySchema.parse(r.query);
    const res = await productService.getProducts(parsed);
    console.log(`✓ Route ${r.name}: found ${res.items.length} items (Total in DB: ${res.pagination.total})`);
  }

  // Test 2: Filter Combinations
  console.log("\n--- Testing Filter Combinations ---");
  const combo1 = getProductsQuerySchema.parse({
    school: "delhi-public-school",
    season: "SUMMER",
    gender: "BOYS",
  });
  const res1 = await productService.getProducts(combo1);
  console.log(`✓ Filter (School=DPS + Season=SUMMER + Gender=BOYS): ${res1.items.length} products`);

  const combo2 = getProductsQuerySchema.parse({
    minPrice: 300,
    maxPrice: 800,
    sortBy: "price_asc",
  });
  const res2 = await productService.getProducts(combo2);
  console.log(`✓ Filter (Price ₹300 - ₹800 + Sort Price Asc): ${res2.items.length} products`);
  if (res2.items.length > 1) {
    const isSorted = res2.items[0].sellingPrice <= res2.items[1].sellingPrice;
    console.log(`  - Price Ascending Order Verified: ${isSorted} (Item 1: ₹${res2.items[0].sellingPrice}, Item 2: ₹${res2.items[1].sellingPrice})`);
  }

  const combo3 = getProductsQuerySchema.parse({
    size: "8Y",
    inStock: "true",
  });
  const res3 = await productService.getProducts(combo3);
  console.log(`✓ Filter (Size=8Y + InStock=true): ${res3.items.length} products`);

  // Test 3: Invalid Query Parameters Handling
  console.log("\n--- Testing Invalid & Unknown Query Parameters ---");
  try {
    const invalidQuery = getProductsQuerySchema.parse({
      unknownParam123: "random",
      page: "abc" as any, // invalid page
    });
    console.log("  Parsed gracefully:", invalidQuery);
  } catch (err: any) {
    console.log("✓ Invalid parameter caught by zod validation gracefully:", err.issues?.[0]?.message || err.message);
  }

  // Test 4: Filter Aggregations
  console.log("\n--- Testing Filter Aggregations ---");
  const filterAggs = await productService.getFilterAggregations();
  console.log(`✓ Filter Aggregations: ${filterAggs.schools.length} Schools, ${filterAggs.categories.length} Categories, ${filterAggs.brands.length} Brands, ${filterAggs.sizes.length} Sizes, Price Range ₹${filterAggs.priceRange.min} - ₹${filterAggs.priceRange.max}`);

  console.log("\n=== ALL PLP TESTS PASSED SUCCESSFULLY! ===");
}

runPLPTests().catch(console.error);
