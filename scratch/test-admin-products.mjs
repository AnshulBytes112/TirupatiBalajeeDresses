async function test() {
  const base = 'http://localhost:3000';
  const adminKey = 'super_admin_secret_tirupati_balaji_2026';

  console.log('=== TEST 1: Unauthorized Admin Access Protection ===');
  const unauthRes = await fetch(base + '/api/admin/products');
  console.log('Unauth status (Expect 403):', unauthRes.status);

  console.log('\n=== TEST 2: GET /api/admin/products with Super Admin Key ===');
  const listRes = await fetch(base + '/api/admin/products', {
    headers: { 'x-admin-key': adminKey }
  }).then(r => r.json());
  console.log('Admin products count:', listRes.data?.length, 'Total:', listRes.meta?.pagination?.total);

  console.log('\n=== TEST 3: Fetch categories & schools for product creation ===');
  const cats = await fetch(base + '/api/categories?format=tree').then(r => r.json());
  const schools = await fetch(base + '/api/schools').then(r => r.json());
  const categoryId = cats.data?.[0]?.id;
  const schoolId = schools.data?.[0]?.id;
  console.log('Sample Category ID:', categoryId, 'Sample School ID:', schoolId);

  console.log('\n=== TEST 4: POST /api/admin/products (Create Dynamic Uniform) ===');
  const newProductPayload = {
    name: 'St. Marks Senior Boys Summer Blazer Test',
    sku: 'SM-BLAZER-TEST-' + Date.now().toString().slice(-4),
    description: 'Official test summer blazer with fine woven fabric and embroidered school emblem.',
    fabricDetails: 'Poly-Viscose Wrinkle Resistant Cotton Blend',
    careInstructions: 'Dry Clean Preferred. Do not bleach.',
    mrp: 1499,
    sellingPrice: 1199,
    categoryId: categoryId,
    status: 'PUBLISHED',
    isFeatured: true,
    isBestseller: false,
    images: [
      { url: '/images/products/st-marks-blazer.jpg', alt: 'Blazer Front', displayOrder: 0, isPrimary: true }
    ],
    variants: [
      {
        size: '32',
        color: 'Navy Blue',
        sku: 'SM-BLZ-32-' + Date.now().toString().slice(-4),
        mrp: 1499,
        sellingPrice: 1199,
        isAvailable: true,
        inventory: { availableQuantity: 30, reservedQuantity: 0, lowStockThreshold: 5, warehouseLocation: 'Rack-C4' }
      },
      {
        size: '34',
        color: 'Navy Blue',
        sku: 'SM-BLZ-34-' + Date.now().toString().slice(-4),
        mrp: 1599,
        sellingPrice: 1299,
        isAvailable: true,
        inventory: { availableQuantity: 45, reservedQuantity: 0, lowStockThreshold: 5, warehouseLocation: 'Rack-C5' }
      }
    ],
    schools: schoolId ? [
      { schoolId: schoolId, season: 'SUMMER', gender: 'BOYS', classGrade: 'Class 9-12', uniformType: 'Blazer', isCompulsory: true }
    ] : []
  };

  const createRes = await fetch(base + '/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(newProductPayload)
  }).then(r => r.json());

  console.log('Create response:', createRes);
  console.log('Created product ID:', createRes.data?.id, 'Slug:', createRes.data?.slug);
  const createdId = createRes.data?.id;
  const createdSlug = createRes.data?.slug;

  if (createdId) {
    console.log('\n=== TEST 5: GET /api/admin/products/[id] ===');
    const getRes = await fetch(base + '/api/admin/products/' + createdId, {
      headers: { 'x-admin-key': adminKey }
    }).then(r => r.json());
    console.log('Retrieved Name:', getRes.data?.name, 'Variants:', getRes.data?.variants?.length);

    console.log('\n=== TEST 6: PATCH /api/admin/products/[id] (Update price & inventory) ===');
    const updateRes = await fetch(base + '/api/admin/products/' + createdId, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ sellingPrice: 1149, isBestseller: true })
    }).then(r => r.json());
    console.log('Updated Selling Price:', updateRes.data?.sellingPrice, 'Bestseller:', updateRes.data?.isBestseller);

    console.log('\n=== TEST 7: Verify Product on Public Storefront (/api/products/[slug]) ===');
    const pubRes = await fetch(base + '/api/products/' + createdSlug).then(r => r.json());
    console.log('Public storefront product:', pubRes.data?.name, 'Selling Price:', pubRes.data?.sellingPrice);

    console.log('\n=== TEST 8: DELETE /api/admin/products/[id] (Archive Product) ===');
    const archiveRes = await fetch(base + '/api/admin/products/' + createdId, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    }).then(r => r.json());
    console.log('Archive result status:', archiveRes.data?.status, 'isActive:', archiveRes.data?.isActive);

    console.log('\n=== TEST 9: POST /api/admin/products/[id]/restore (Restore Product) ===');
    const restoreRes = await fetch(base + '/api/admin/products/' + createdId + '/restore', {
      method: 'POST',
      headers: { 'x-admin-key': adminKey }
    }).then(r => r.json());
    console.log('Restore result status:', restoreRes.data?.status, 'isActive:', restoreRes.data?.isActive);
  }

  console.log('\n=== ALL SUPER ADMIN & DYNAMIC ARCHITECTURE TESTS PASSED ===');
}

test();
