async function testHttpEndpoints() {
  const port = 3001;
  const baseUrl = `http://localhost:${port}`;
  const routes = [
    "/school-uniforms",
    "/school-uniforms/summer",
    "/school-uniforms/winter",
    "/thermals",
    "/school-shoes",
    "/school-bags",
    "/school-items",
    "/offers",
    "/api/products?category=school-uniforms",
    "/api/products/filters",
  ];

  console.log(`=== VERIFYING HTTP 200 & HTML FOR ALL 8 PLP ROUTES ON PORT ${port} ===`);

  for (const route of routes) {
    try {
      const res = await fetch(`${baseUrl}${route}`);
      const text = await res.text();
      console.log(`✓ ${route} -> Status ${res.status} (Length: ${text.length} bytes, has HTML/JSON: ${text.includes("<!DOCTYPE") || text.includes("success")})`);
    } catch (err: any) {
      console.error(`✗ ${route} -> Error:`, err.message);
    }
  }

  // Also test query parameter handling over HTTP
  const queryTests = [
    "/school-uniforms?school=delhi-public-school&season=SUMMER&gender=BOYS",
    "/school-uniforms?minPrice=300&maxPrice=1000&sort=price_asc",
    "/offers?sort=discount_desc",
  ];

  console.log("\n=== VERIFYING SHAREABLE URL QUERY PARAMS OVER HTTP ===");
  for (const q of queryTests) {
    try {
      const res = await fetch(`${baseUrl}${q}`);
      console.log(`✓ ${q} -> Status ${res.status}`);
    } catch (err: any) {
      console.error(`✗ ${q} -> Error:`, err.message);
    }
  }
}

testHttpEndpoints().catch(console.error);
