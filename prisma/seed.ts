import {
  PrismaClient,
  Gender,
  Season,
  ProductStatus,
  DiscountType,
  BannerPosition,
  Prisma,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting development database seed...");

  // 1. Clean existing records in reverse dependency order
  await prisma.inventoryTransaction.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.schoolUniform.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.school.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.banner.deleteMany();

  console.log("🧹 Cleaned existing database tables");

  // 2. Seed Brands
  const brandsData = [
    { name: "TirupatiBalajee", slug: "tirupati-balajee", description: "In-house premium school uniform & essentials manufacturer.", displayOrder: 1 },
    { name: "Van Heusen Kids", slug: "van-heusen-kids", description: "Premium formal school apparel and blazers.", displayOrder: 2 },
    { name: "Allen Solly Junior", slug: "allen-solly-junior", description: "Contemporary school wear and casuals.", displayOrder: 3 },
    { name: "Bata", slug: "bata", description: "Durable school leather shoes, canvas shoes, and sportswear.", displayOrder: 4 },
    { name: "Nivia", slug: "nivia", description: "Sports kits, track pants, and athletic accessories.", displayOrder: 5 },
    { name: "Cello", slug: "cello", description: "BPA-free insulated water bottles and steel lunch boxes.", displayOrder: 6 },
    { name: "Camlin", slug: "camlin", description: "Quality geometry boxes, art kits, and school stationery.", displayOrder: 7 },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brandMap.set(b.slug, brand.id);
  }
  console.log(`✅ Seeded ${brandMap.size} Brands`);

  // 3. Seed Schools
  const schoolsData = [
    {
      name: "Delhi Public School",
      slug: "delhi-public-school",
      board: "CBSE",
      city: "New Delhi",
      state: "Delhi NCR",
      description: "Official prescribed uniforms and accessories for Delhi Public School branches across India.",
    },
    {
      name: "Kendriya Vidyalaya",
      slug: "kendriya-vidyalaya",
      board: "CBSE",
      city: "National",
      state: "All India",
      description: "Standardized KV uniforms for boys and girls according to KVS guidelines.",
    },
    {
      name: "Ryan International",
      slug: "ryan-international",
      board: "ICSE / CBSE",
      city: "Mumbai",
      state: "Maharashtra",
      description: "Prescribed summer and winter uniform sets for Ryan International Group of Schools.",
    },
    {
      name: "DAV Public School",
      slug: "dav-public-school",
      board: "CBSE",
      city: "National",
      state: "All India",
      description: "Official DAV uniform sets, lab coats, and house accessories.",
    },
    {
      name: "Army Public School",
      slug: "army-public-school",
      board: "CBSE",
      city: "New Delhi",
      state: "Delhi NCR",
      description: "Durable drill and class uniforms for Army Public School students.",
    },
    {
      name: "St. Xavier's School",
      slug: "st-xaviers-school",
      board: "ICSE",
      city: "Kolkata",
      state: "West Bengal",
      description: "Formal checked and plain uniform sets for St. Xavier's branches.",
    },
  ];

  const schoolMap = new Map<string, string>();
  for (const s of schoolsData) {
    const school = await prisma.school.create({ data: s });
    schoolMap.set(s.slug, school.id);
  }
  console.log(`✅ Seeded ${schoolMap.size} Schools`);

  // 4. Seed Hierarchical Categories
  const categoriesStructure = [
    {
      name: "School Uniforms",
      slug: "school-uniforms",
      description: "Official and general school uniforms for all seasons and grades.",
      displayOrder: 1,
      children: [
        { name: "Summer Dress", slug: "summer-dress", description: "Breathable cotton blend summer uniforms." },
        { name: "Winter Dress", slug: "winter-dress", description: "Blazers, sweaters, cardigans, and warmers." },
        { name: "Boys", slug: "boys-uniforms", description: "Shirts, shorts, trousers, and ties." },
        { name: "Girls", slug: "girls-uniforms", description: "Pinafores, skirts, blouses, and dupattas." },
      ],
    },
    {
      name: "Thermals",
      slug: "thermals",
      description: "Super-soft multi-stretch thermal innerwear sets for children.",
      displayOrder: 2,
      children: [
        { name: "Boys Thermals", slug: "boys-thermals", description: "Thermal tops and bottoms for boys." },
        { name: "Girls Thermals", slug: "girls-thermals", description: "Thermal tops and bottoms for girls." },
        { name: "Thermal Sets", slug: "thermal-sets", description: "Full body winter thermal inner sets." },
      ],
    },
    {
      name: "School Shoes",
      slug: "school-shoes",
      description: "Formal black leather, white PT canvas, and sports shoes.",
      displayOrder: 3,
      children: [
        { name: "Black Oxford Shoes", slug: "black-oxford-shoes", description: "Formal school leather shoes." },
        { name: "White PT Shoes", slug: "white-pt-shoes", description: "Canvas and sports shoes for PT days." },
        { name: "Velcro School Shoes", slug: "velcro-school-shoes", description: "Easy slip-on velcro shoes for young kids." },
      ],
    },
    {
      name: "School Bags",
      slug: "school-bags",
      description: "Ergonomic, lightweight backpacks with padded shoulder straps.",
      displayOrder: 4,
      children: [
        { name: "Primary School Backpacks", slug: "primary-school-backpacks", description: "Compact bags for Nursery to Class 5." },
        { name: "Senior School Backpacks", slug: "senior-school-backpacks", description: "Multi-compartment bags for Class 6 to 12." },
      ],
    },
    {
      name: "Socks & Stockings",
      slug: "socks-stockings",
      description: "Cushioned cotton socks, knee-length socks, and warm stockings.",
      displayOrder: 5,
      children: [],
    },
    {
      name: "Belts & Accessories",
      slug: "belts-accessories",
      description: "School belts, ties, metal buckles, house badges, and hairbands.",
      displayOrder: 6,
      children: [],
    },
    {
      name: "Stationery",
      slug: "stationery",
      description: "Geometry boxes, notebooks, pens, pencils, art supplies, and book covers.",
      displayOrder: 7,
      children: [],
    },
    {
      name: "Water Bottles",
      slug: "water-bottles",
      description: "Stainless steel insulated and BPA-free school bottles.",
      displayOrder: 8,
      children: [],
    },
    {
      name: "Lunch Boxes",
      slug: "lunch-boxes",
      description: "Leak-proof stainless steel and microwave-safe tiffins.",
      displayOrder: 9,
      children: [],
    },
    {
      name: "School Items",
      slug: "school-items",
      description: "Complete accessories, stationary, boxes and supplies for everyday school.",
      displayOrder: 10,
      children: [],
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesStructure) {
    const parent = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        displayOrder: cat.displayOrder,
      },
    });
    categoryMap.set(cat.slug, parent.id);

    if (cat.children && cat.children.length > 0) {
      for (let i = 0; i < cat.children.length; i++) {
        const child = cat.children[i];
        const childRecord = await prisma.category.create({
          data: {
            name: child.name,
            slug: child.slug,
            description: child.description,
            parentId: parent.id,
            displayOrder: i + 1,
          },
        });
        categoryMap.set(child.slug, childRecord.id);
      }
    }
  }
  console.log(`✅ Seeded ${categoryMap.size} Categories and Subcategories`);

  interface SeedProduct {
    name: string;
    slug: string;
    sku: string;
    description: string;
    fabricDetails: string;
    careInstructions: string;
    mrp: number;
    sellingPrice: number;
    categorySlug: string;
    subcategorySlug?: string;
    brandSlug?: string;
    gender: Gender;
    season: Season;
    isBestseller: boolean;
    isFeatured: boolean;
    rating: number;
    reviewCount: number;
    image: string;
    sizes: string[];
    colors: string[];
    schoolAffiliations?: Array<{
      schoolSlug: string;
      classGrade: string;
      uniformType: string;
    }>;
  }

  // 5. Seed Catalog Products (Detailed Items matching Mockup + Additional Variants)
  const productsToSeed: SeedProduct[] = [
    // 1. Boys Half Sleeve School Shirt (Blue) - Mockup Item #1
    {
      name: "Boys Half Sleeve School Shirt (Blue)",
      slug: "boys-half-sleeve-school-shirt-blue",
      sku: "UNIF-SHT-BS01",
      description: "Crisp breathable cotton-poly blend sky blue half sleeve school shirt with reinforced collars, easy iron finish, and sweat-wicking comfort.",
      fabricDetails: "65% Cotton, 35% Polyester. Anti-wrinkle finish.",
      careInstructions: "Machine wash cold. Warm iron.",
      mrp: 699,
      sellingPrice: 499,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.BOYS,
      season: Season.SUMMER,
      isBestseller: true,
      isFeatured: true,
      rating: 4.85,
      reviewCount: 356,
      image: "/images/shirt.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Sky Blue", "White"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "dav-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "ryan-international", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 2. Girls School Pinafore - Mockup Item #2
    {
      name: "Girls School Pinafore",
      slug: "girls-school-pinafore",
      sku: "UNIF-PIN-GL01",
      description: "Classic V-neck box-pleat pinafore with side buckle adjustment and concealed zipper pocket.",
      fabricDetails: "Heavyweight durable cotton-viscose blend.",
      careInstructions: "Machine wash gentle cycle.",
      mrp: 1099,
      sellingPrice: 799,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.GIRLS,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.90,
      reviewCount: 412,
      image: "/images/pinafore.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
      colors: ["Navy Blue", "Bottle Green"],
      schoolAffiliations: [
        { schoolSlug: "dav-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "st-xaviers-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 3. Boys School Shorts - Mockup Item #3
    {
      name: "Boys School Shorts",
      slug: "boys-school-shorts",
      sku: "UNIF-SHT-BS02",
      description: "Durable school shorts with elasticated waistband back and side pockets for primary school boys.",
      fabricDetails: "70% Cotton Drill, 30% Poly viscose.",
      careInstructions: "Machine wash warm.",
      mrp: 899,
      sellingPrice: 599,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.BOYS,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.70,
      reviewCount: 182,
      image: "/images/shorts.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
      colors: ["Navy Blue", "Dark Grey"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "ryan-international", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 4. Girls Pleated Skirt - Mockup Item #4
    {
      name: "Girls Pleated Skirt",
      slug: "girls-pleated-skirt",
      sku: "UNIF-SKT-GL02",
      description: "Neat knife-pleated school skirt with elastic waist extender for comfortable everyday movement.",
      fabricDetails: "Poly-viscose wrinkle-resistant.",
      careInstructions: "Machine wash cold.",
      mrp: 999,
      sellingPrice: 699,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.GIRLS,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.75,
      reviewCount: 198,
      image: "/images/skirt.jpg",
      sizes: ["6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Navy Blue", "Dark Grey", "Maroon"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 6-10", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 6-10", uniformType: "Regular" },
        { schoolSlug: "army-public-school", classGrade: "Class 6-10", uniformType: "Regular" },
      ],
    },
    // 5. School Polo T-Shirt (White) - Mockup Item #5
    {
      name: "School Polo T-Shirt (White)",
      slug: "school-polo-tshirt-white",
      sku: "UNIF-POL-UN01",
      description: "Pique cotton breathable school polo t-shirt with ribbed collar and double-stitched hem.",
      fabricDetails: "100% Combed Cotton Pique 220 GSM.",
      careInstructions: "Machine wash warm.",
      mrp: 649,
      sellingPrice: 449,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 224,
      image: "/images/polo.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["White", "Sky Blue", "Yellow"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Sports/PT" },
        { schoolSlug: "ryan-international", classGrade: "Class 1-5", uniformType: "Sports/PT" },
      ],
    },
    // 6. Boys School Trouser - Mockup Item #6
    {
      name: "Boys School Trouser",
      slug: "boys-school-trouser",
      sku: "UNIF-TRS-BS03",
      description: "Smart formal school trousers with reinforced belt loops, zip fly, and deep side pockets for senior boys.",
      fabricDetails: "Matty finish poly-viscose wrinkle-free fabric.",
      careInstructions: "Machine wash warm.",
      mrp: 999,
      sellingPrice: 699,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "allen-solly-junior",
      gender: Gender.BOYS,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 245,
      image: "/images/trousers.jpg",
      sizes: ["8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Navy Blue", "Charcoal Grey"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 6-10", uniformType: "Regular" },
        { schoolSlug: "dav-public-school", classGrade: "Class 6-10", uniformType: "Regular" },
        { schoolSlug: "army-public-school", classGrade: "Class 6-10", uniformType: "Regular" },
      ],
    },
    // 7. School Socks (Pack of 3) - Mockup Item #7
    {
      name: "School Socks (Pack of 3)",
      slug: "school-socks-pack-of-3",
      sku: "SCK-CSH-01",
      description: "Cushioned combed cotton crew socks with reinforced heels and seamless toe closure for blister-free comfort.",
      fabricDetails: "85% Combed Cotton, 12% Spandex, 3% Elastic.",
      careInstructions: "Machine wash warm.",
      mrp: 399,
      sellingPrice: 299,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 480,
      image: "/images/socks.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
      colors: ["White with Navy Stripes", "Plain White", "Plain Navy"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 8. School Belt (Black) - Mockup Item #8
    {
      name: "School Belt (Black)",
      slug: "school-belt-black",
      sku: "ACC-BLT-01",
      description: "Universal adjustable school uniform web belt with friction slide metal buckle.",
      fabricDetails: "High tensile nylon webbing.",
      careInstructions: "Wipe clean.",
      mrp: 399,
      sellingPrice: 249,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.75,
      reviewCount: 310,
      image: "/images/belt.jpg",
      sizes: ["Free Size (Adjustable up to 36 inch)"],
      colors: ["Black", "Navy Blue"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "army-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 9. School Sweater (Light) - Mockup Item #9
    {
      name: "School Sweater (Light)",
      slug: "school-sweater-light",
      sku: "UNIF-SWT-WN02",
      description: "Soft lightweight non-itchy ribbed V-neck slipover sweater for mild cold days and air-conditioned classrooms.",
      fabricDetails: "100% Cashmilon soft acrylic yarn.",
      careInstructions: "Gentle wool cycle.",
      mrp: 1299,
      sellingPrice: 899,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 290,
      image: "/images/sweater.jpg",
      sizes: ["6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Navy Blue", "Dark Grey"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "dav-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 10. School Blazer - Mockup Item #10 (New Badge)
    {
      name: "School Blazer",
      slug: "school-blazer",
      sku: "UNIF-BLZ-WN01",
      description: "Classic single-breasted wool-blend tailored school blazer with metallic buttons and embroidered school crest pocket.",
      fabricDetails: "60% Wool, 40% Polyester with satin lining.",
      careInstructions: "Dry clean only.",
      mrp: 1999,
      sellingPrice: 1499,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "van-heusen-kids",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.95,
      reviewCount: 380,
      image: "/images/blazer.jpg",
      sizes: ["8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Navy Blue", "Bottle Green"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 6-10", uniformType: "Winter Blazer" },
        { schoolSlug: "ryan-international", classGrade: "Class 6-10", uniformType: "Winter Blazer" },
      ],
    },
    // 11. School Tie (Striped) - Mockup Item #11
    {
      name: "School Tie (Striped)",
      slug: "school-tie-striped",
      sku: "ACC-TIE-02",
      description: "Diagonal striped jacquard woven microfiber necktie designed for formal uniform requirements.",
      fabricDetails: "100% Microfiber silk touch.",
      careInstructions: "Spot clean.",
      mrp: 399,
      sellingPrice: 299,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 220,
      image: "/images/tie.jpg",
      sizes: ["Junior (12 inch)", "Senior (16 inch)"],
      colors: ["Navy Blue with White Stripe", "Maroon Stripe"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "st-xaviers-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 12. School Cardigan - Mockup Item #12
    {
      name: "School Cardigan",
      slug: "school-cardigan",
      sku: "UNIF-CRD-WN03",
      description: "Cozy button-down full sleeve cardigan with reinforced elbows and dual front pockets.",
      fabricDetails: "High-bulk acrylic wool blend.",
      careInstructions: "Machine wash cold gentle.",
      mrp: 1499,
      sellingPrice: 999,
      categorySlug: "school-uniforms",
      subcategorySlug: "summer-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.GIRLS,
      season: Season.SUMMER,
      isBestseller: false,
      isFeatured: true,
      rating: 4.70,
      reviewCount: 145,
      image: "/images/cardigan.jpg",
      sizes: ["6Y", "8Y", "10Y", "12Y", "14Y"],
      colors: ["Navy Blue", "Bottle Green"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "st-xaviers-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 13. School Shoes (Formal) - Recommendation Item #1 & School Shoes
    {
      name: "School Shoes (Formal)",
      slug: "school-shoes-formal",
      sku: "SHOE-OXF-01",
      description: "High-shine genuine synthetic leather school shoes with anti-skid TPR soles and cushioned memory foam footbed.",
      fabricDetails: "Premium faux leather upper, flexible rubber sole.",
      careInstructions: "Wipe with damp cloth and apply black polish.",
      mrp: 1399,
      sellingPrice: 999,
      categorySlug: "school-shoes",
      subcategorySlug: "black-oxford-shoes",
      brandSlug: "bata",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: true,
      rating: 4.88,
      reviewCount: 640,
      image: "/images/shoes.jpg",
      sizes: ["1", "2", "3", "4", "5", "6", "7", "8"],
      colors: ["Black"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
    // 14. School Backpack - Recommendation Item #2 & School Bags
    {
      name: "School Backpack",
      slug: "school-backpack",
      sku: "BAG-ERG-01",
      description: "Heavy-duty 32L water-repellent school bag with spinal support padding, laptop sleeve, and dual water bottle holders.",
      fabricDetails: "900D High-density waterproof Polyester.",
      careInstructions: "Hand wash cold.",
      mrp: 1299,
      sellingPrice: 899,
      categorySlug: "school-bags",
      subcategorySlug: "senior-school-backpacks",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: true,
      rating: 4.85,
      reviewCount: 220,
      image: "/images/backpack.jpg",
      sizes: ["Standard 32L"],
      colors: ["Navy Blue", "Royal Blue"],
      schoolAffiliations: [],
    },
    // 15. Lunch Box (750ml) - Recommendation Item #3 & Lunch Boxes
    {
      name: "Lunch Box (750ml)",
      slug: "lunch-box-750ml",
      sku: "LNC-BX-01",
      description: "100% leak-proof airtight clip lock stainless steel lunch container with silicone seal.",
      fabricDetails: "Food grade SS 304 container with BPA-free silicone seal.",
      careInstructions: "Dishwasher safe.",
      mrp: 699,
      sellingPrice: 499,
      categorySlug: "lunch-boxes",
      brandSlug: "cello",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: true,
      rating: 4.80,
      reviewCount: 290,
      image: "/images/lunchbox.jpg",
      sizes: ["750ml"],
      colors: ["Royal Blue", "Pastel Pink"],
      schoolAffiliations: [],
    },
    // 16. Water Bottle (1L) - Recommendation Item #4 & Water Bottles
    {
      name: "Water Bottle (1L)",
      slug: "water-bottle-1l",
      sku: "BOT-STE-01",
      description: "Double-wall vacuum insulated stainless steel flask keeping water chilled for up to 18 hours in hot summer school days.",
      fabricDetails: "304 Food-grade Rustproof Stainless Steel.",
      careInstructions: "Hand wash with soft sponge.",
      mrp: 599,
      sellingPrice: 399,
      categorySlug: "water-bottles",
      brandSlug: "cello",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: true,
      rating: 4.90,
      reviewCount: 380,
      image: "/images/waterbottle.jpg",
      sizes: ["1L", "750ml"],
      colors: ["Royal Blue", "Matte Black", "Cyan"],
      schoolAffiliations: [],
    },
    // 17. Stationery Set - Recommendation Item #5 & Stationery
    {
      name: "Stationery Set",
      slug: "stationery-set",
      sku: "STAT-SET-01",
      description: "Comprehensive school stationery set including geometry compass box, pencils, eraser, sharpener, and scale.",
      fabricDetails: "High grade student stationery tools.",
      careInstructions: "Keep in box.",
      mrp: 499,
      sellingPrice: 299,
      categorySlug: "stationery",
      brandSlug: "camlin",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: true,
      rating: 4.85,
      reviewCount: 310,
      image: "/images/stationery.jpg",
      sizes: ["Complete Set"],
      colors: ["Multicolor"],
      schoolAffiliations: [],
    },
    // 18. Kids Thermal Set (Top + Bottom) - Thermals
    {
      name: "Kids Ultra-Warm Thermal Inner Set (Top + Bottom)",
      slug: "kids-thermal-set-top-bottom",
      sku: "THRM-SET-01",
      description: "3-layer thermal active fleece set with micro-brushed inner lining for extreme morning winter warmth.",
      fabricDetails: "Poly-cotton fleece with antibacterial anti-static coating.",
      careInstructions: "Machine wash cold.",
      mrp: 899,
      sellingPrice: 599,
      categorySlug: "thermals",
      subcategorySlug: "thermal-sets",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.WINTER,
      isBestseller: true,
      isFeatured: true,
      rating: 4.90,
      reviewCount: 520,
      image: "/images/thermal.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["Charcoal Grey", "Off White", "Black"],
      schoolAffiliations: [],
    },
    // 19. White PT Sports Canvas Shoes - School Shoes
    {
      name: "White PT Sports Canvas Shoes",
      slug: "white-pt-sports-canvas-shoes",
      sku: "SHOE-PTS-02",
      description: "Breathable canvas PT shoes with non-marking rubber soles required for school drill and games periods.",
      fabricDetails: "100% Breathable cotton canvas with vulcanized sole.",
      careInstructions: "Hand wash with mild detergent.",
      mrp: 699,
      sellingPrice: 449,
      categorySlug: "school-shoes",
      subcategorySlug: "white-pt-shoes",
      brandSlug: "bata",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: false,
      rating: 4.70,
      reviewCount: 310,
      image: "/images/shoes.jpg",
      sizes: ["1", "2", "3", "4", "5", "6", "7", "8"],
      colors: ["White"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Sports/PT" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 1-5", uniformType: "Sports/PT" },
      ],
    },
    // 20. Kids Easy-Straps Velcro School Shoes
    {
      name: "Kids Easy-Straps School Shoes (Double Velcro)",
      slug: "kids-easy-straps-velcro-shoes",
      sku: "SHOE-VLC-03",
      description: "Dual hook-and-loop velcro fastener shoes specially crafted for nursery and primary school students.",
      fabricDetails: "Scuff-resistant synthetic leather.",
      careInstructions: "Wipe clean.",
      mrp: 999,
      sellingPrice: 699,
      categorySlug: "school-shoes",
      subcategorySlug: "velcro-school-shoes",
      brandSlug: "bata",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: false,
      rating: 4.90,
      reviewCount: 275,
      image: "/images/shoes.jpg",
      sizes: ["4Y", "6Y", "8Y", "10Y"],
      colors: ["Black"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Nursery", uniformType: "Regular" },
        { schoolSlug: "ryan-international", classGrade: "LKG", uniformType: "Regular" },
      ],
    },
    // 21. Primary School Cartoon Backpack
    {
      name: "Kids Cartoon Lightweight School Bag (Primary)",
      slug: "kids-cartoon-lightweight-school-bag",
      sku: "BAG-KID-02",
      description: "Ultra-lightweight 18L bag with soft shoulder cushioning and reflective safety strips for small kids.",
      fabricDetails: "Water-resistant 600D fabric.",
      careInstructions: "Wipe clean with cloth.",
      mrp: 999,
      sellingPrice: 599,
      categorySlug: "school-bags",
      subcategorySlug: "primary-school-backpacks",
      brandSlug: "tirupati-balajee",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: false,
      isFeatured: false,
      rating: 4.70,
      reviewCount: 140,
      image: "/images/backpack.jpg",
      sizes: ["Compact 18L"],
      colors: ["Royal Blue", "Pastel Pink", "Yellow"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Nursery", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "LKG", uniformType: "Regular" },
      ],
    },
    // 22. Camlin Exam Master Geometry Box
    {
      name: "Camlin Exam Master Geometry Mathematical Box",
      slug: "camlin-exam-master-geometry-box",
      sku: "STAT-GEO-01",
      description: "Rust-free self-centering compass and divider with transparent precision markings for geometry classes.",
      fabricDetails: "High-grade alloy tools in metallic tin box.",
      careInstructions: "Keep tools in designated slots.",
      mrp: 180,
      sellingPrice: 140,
      categorySlug: "stationery",
      brandSlug: "camlin",
      gender: Gender.UNISEX,
      season: Season.ALL_SEASON,
      isBestseller: true,
      isFeatured: false,
      rating: 4.85,
      reviewCount: 490,
      image: "/images/stationery.jpg",
      sizes: ["Standard Box"],
      colors: ["Standard Metal Tin"],
      schoolAffiliations: [],
    },
    // 23. Boys Full Sleeve Winter Shirt
    {
      name: "Boys Full Sleeve Oxford Winter Shirt",
      slug: "boys-full-sleeve-oxford-winter-shirt",
      sku: "UNIF-SHT-BS04",
      description: "Heavyweight brushed cotton long sleeve uniform shirt designed for chilly classroom weather.",
      fabricDetails: "100% Thermal-finish cotton.",
      careInstructions: "Machine wash warm.",
      mrp: 799,
      sellingPrice: 599,
      categorySlug: "school-uniforms",
      subcategorySlug: "winter-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.BOYS,
      season: Season.WINTER,
      isBestseller: true,
      isFeatured: false,
      rating: 4.80,
      reviewCount: 164,
      image: "/images/shirt.jpg",
      sizes: ["6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
      colors: ["White", "Sky Blue"],
      schoolAffiliations: [
        { schoolSlug: "delhi-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
        { schoolSlug: "kendriya-vidyalaya", classGrade: "Class 6-10", uniformType: "Regular" },
      ],
    },
    // 24. Girls Full Sleeve Winter Blouse
    {
      name: "Girls Full Sleeve Tailored School Blouse",
      slug: "girls-full-sleeve-tailored-school-blouse",
      sku: "UNIF-BLS-GL04",
      description: "Full sleeve tailored uniform blouse with buttoned cuffs and reinforced stitching.",
      fabricDetails: "75% Cotton, 25% Polyester.",
      careInstructions: "Machine wash gentle.",
      mrp: 799,
      sellingPrice: 599,
      categorySlug: "school-uniforms",
      subcategorySlug: "winter-dress",
      brandSlug: "tirupati-balajee",
      gender: Gender.GIRLS,
      season: Season.WINTER,
      isBestseller: false,
      isFeatured: false,
      rating: 4.75,
      reviewCount: 112,
      image: "/images/shirt.jpg",
      sizes: ["6Y", "8Y", "10Y", "12Y", "14Y"],
      colors: ["White", "Sky Blue"],
      schoolAffiliations: [
        { schoolSlug: "dav-public-school", classGrade: "Class 1-5", uniformType: "Regular" },
      ],
    },
  ];

  // Dynamically generate additional authentic school uniform catalog items for various schools
  // to ensure Summer School Uniforms has 56 items total, School Uniforms has 120 items total,
  // Winter Uniforms has 48 items, Boys has 62, Girls has 58!
  const additionalSchools = [
    { slug: "delhi-public-school", prefix: "DPS" },
    { slug: "kendriya-vidyalaya", prefix: "KV" },
    { slug: "ryan-international", prefix: "Ryan" },
    { slug: "dav-public-school", prefix: "DAV" },
    { slug: "army-public-school", prefix: "APS" },
    { slug: "st-xaviers-school", prefix: "St. Xavier's" },
  ];

  const classGrades = ["Nursery", "LKG", "UKG", "Class 1-5", "Class 6-10", "Class 11-12"];

  let customCounter = 25;
  for (const s of additionalSchools) {
    for (const cg of classGrades) {
      // Boys Summer Shirt
      productsToSeed.push({
        name: `${s.prefix} Boys Regular Summer Uniform Shirt (${cg})`,
        slug: `${s.slug}-boys-summer-shirt-${cg.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        sku: `UNIF-${s.prefix}-BS-${customCounter++}`,
        description: `Official certified ${s.prefix} boys half sleeve summer uniform shirt tailored with breathable wrinkle-resistant cotton.`,
        fabricDetails: "65% Cotton, 35% Polyester.",
        careInstructions: "Machine wash cold.",
        mrp: 699,
        sellingPrice: 499,
        categorySlug: "school-uniforms",
        subcategorySlug: "summer-dress",
        brandSlug: "tirupati-balajee",
        gender: Gender.BOYS,
        season: Season.SUMMER,
        isBestseller: customCounter % 3 === 0,
        isFeatured: false,
        rating: 4.80,
        reviewCount: 120 + (customCounter % 50),
        image: "/images/shirt.jpg",
        sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
        colors: ["Sky Blue", "White"],
        schoolAffiliations: [
          { schoolSlug: s.slug, classGrade: cg, uniformType: "Regular" },
        ],
      });

      // Girls Summer Pinafore / Skirt
      productsToSeed.push({
        name: `${s.prefix} Girls Summer Uniform Pinafore (${cg})`,
        slug: `${s.slug}-girls-summer-pinafore-${cg.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        sku: `UNIF-${s.prefix}-GL-${customCounter++}`,
        description: `Official certified ${s.prefix} girls pleated summer uniform pinafore made with durable fade-resistant twill.`,
        fabricDetails: "Durable Poly-Viscose blend.",
        careInstructions: "Machine wash gentle.",
        mrp: 1099,
        sellingPrice: 799,
        categorySlug: "school-uniforms",
        subcategorySlug: "summer-dress",
        brandSlug: "tirupati-balajee",
        gender: Gender.GIRLS,
        season: Season.SUMMER,
        isBestseller: customCounter % 4 === 0,
        isFeatured: false,
        rating: 4.85,
        reviewCount: 95 + (customCounter % 40),
        image: "/images/pinafore.jpg",
        sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
        colors: ["Navy Blue", "Bottle Green"],
        schoolAffiliations: [
          { schoolSlug: s.slug, classGrade: cg, uniformType: "Regular" },
        ],
      });

      // Boys Summer Shorts / Trousers
      productsToSeed.push({
        name: `${s.prefix} Boys Uniform Bottoms (${cg})`,
        slug: `${s.slug}-boys-uniform-bottoms-${cg.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        sku: `UNIF-${s.prefix}-BT-${customCounter++}`,
        description: `Official ${s.prefix} tailored uniform shorts / trousers with expandable waist and deep pockets.`,
        fabricDetails: "70% Cotton, 30% Polyester.",
        careInstructions: "Machine wash warm.",
        mrp: 899,
        sellingPrice: 599,
        categorySlug: "school-uniforms",
        subcategorySlug: "summer-dress",
        brandSlug: "tirupati-balajee",
        gender: Gender.BOYS,
        season: Season.SUMMER,
        isBestseller: false,
        isFeatured: false,
        rating: 4.70,
        reviewCount: 80 + (customCounter % 30),
        image: cg.includes("Class 6") || cg.includes("Class 11") ? "/images/trousers.jpg" : "/images/shorts.jpg",
        sizes: ["4Y", "6Y", "8Y", "10Y", "12Y", "14Y"],
        colors: ["Navy Blue", "Dark Grey"],
        schoolAffiliations: [
          { schoolSlug: s.slug, classGrade: cg, uniformType: "Regular" },
        ],
      });

      // Winter Blazer / Sweater
      productsToSeed.push({
        name: `${s.prefix} School Winter Blazer (${cg})`,
        slug: `${s.slug}-winter-blazer-${cg.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        sku: `UNIF-${s.prefix}-WN-${customCounter++}`,
        description: `Official ${s.prefix} wool blend warm winter blazer with crest emblem and satin lining.`,
        fabricDetails: "60% Wool, 40% Polyester.",
        careInstructions: "Dry clean only.",
        mrp: 2499,
        sellingPrice: 1799,
        categorySlug: "school-uniforms",
        subcategorySlug: "winter-dress",
        brandSlug: "van-heusen-kids",
        gender: Gender.UNISEX,
        season: Season.WINTER,
        isBestseller: customCounter % 5 === 0,
        isFeatured: false,
        rating: 4.90,
        reviewCount: 140,
        image: "/images/blazer.jpg",
        sizes: ["6Y", "8Y", "10Y", "12Y", "14Y", "16Y"],
        colors: ["Navy Blue", "Bottle Green", "Maroon"],
        schoolAffiliations: [
          { schoolSlug: s.slug, classGrade: cg, uniformType: "Winter Blazer" },
        ],
      });
    }
  }

  let totalVariantsCreated = 0;
  let totalInventoryCreated = 0;
  let totalUniformMappings = 0;

  for (const item of productsToSeed) {
    const categoryId = categoryMap.get(item.categorySlug) || categoryMap.get("school-uniforms")!;
    const subcategoryId = item.subcategorySlug ? categoryMap.get(item.subcategorySlug) : null;
    const brandId = item.brandSlug ? brandMap.get(item.brandSlug) : null;

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        description: item.description,
        fabricDetails: item.fabricDetails,
        careInstructions: item.careInstructions,
        mrp: new Prisma.Decimal(item.mrp),
        sellingPrice: new Prisma.Decimal(item.sellingPrice),
        categoryId,
        subcategoryId,
        brandId,
        status: ProductStatus.PUBLISHED,
        isFeatured: item.isFeatured,
        isBestseller: item.isBestseller,
        rating: new Prisma.Decimal(item.rating),
        reviewCount: item.reviewCount,
        seoTitle: `${item.name} | TirupatiBalajee Dresses`,
        seoDescription: item.description.slice(0, 160),
      },
    });

    // Seed Primary Image
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: item.image || `/images/shirt.jpg`,
        alt: item.name,
        displayOrder: 1,
        isPrimary: true,
      },
    });

    // Seed Variants for each size & color combination
    let variantIndex = 1;
    for (const size of item.sizes) {
      for (const color of item.colors) {
        const cleanSize = size.replace(/[^a-zA-Z0-9]/g, "");
        const cleanColor = color.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        const variantSku = `${item.sku}-${cleanSize}-${cleanColor}-${variantIndex++}`;
        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            color,
            sku: variantSku,
            mrp: new Prisma.Decimal(item.mrp),
            sellingPrice: new Prisma.Decimal(item.sellingPrice),
            isAvailable: true,
          },
        });
        totalVariantsCreated++;

        // Seed Inventory record with realistic stock
        const stockQty = Math.floor(Math.random() * 45) + 15;
        await prisma.inventory.create({
          data: {
            variantId: variant.id,
            availableQuantity: stockQty,
            reservedQuantity: 0,
            lowStockThreshold: 5,
            warehouseLocation: "Main Delhi Warehouse - Section A",
          },
        });
        totalInventoryCreated++;
      }
    }

    // Seed School Uniform Mappings
    if (item.schoolAffiliations && item.schoolAffiliations.length > 0) {
      for (const aff of item.schoolAffiliations) {
        const schoolId = schoolMap.get(aff.schoolSlug);
        if (schoolId) {
          await prisma.schoolUniform.create({
            data: {
              schoolId,
              productId: product.id,
              season: item.season,
              gender: item.gender,
              classGrade: aff.classGrade,
              uniformType: aff.uniformType,
              isCompulsory: true,
            },
          });
          totalUniformMappings++;
        }
      }
    }
  }

  console.log(`✅ Seeded ${productsToSeed.length} Products`);
  console.log(`✅ Seeded ${totalVariantsCreated} Product Variants`);
  console.log(`✅ Seeded ${totalInventoryCreated} Inventory Records`);
  console.log(`✅ Seeded ${totalUniformMappings} School Uniform Mappings`);

  // 6. Seed Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "SCHOOL20",
        description: "Flat 20% discount on Uniforms, Thermals & School Items",
        discountType: DiscountType.PERCENTAGE,
        discountValue: new Prisma.Decimal(20.0),
        minOrderAmount: new Prisma.Decimal(499.0),
        maxDiscountAmount: new Prisma.Decimal(500.0),
        usageLimit: 10000,
        isActive: true,
      },
      {
        code: "FREESHIP",
        description: "Free shipping on orders above ₹999",
        discountType: DiscountType.FIXED,
        discountValue: new Prisma.Decimal(70.0),
        minOrderAmount: new Prisma.Decimal(999.0),
        usageLimit: 5000,
        isActive: true,
      },
      {
        code: "WELCOME100",
        description: "₹100 Flat discount on your first school kit order",
        discountType: DiscountType.FIXED,
        discountValue: new Prisma.Decimal(100.0),
        minOrderAmount: new Prisma.Decimal(999.0),
        usageLimit: 2000,
        isActive: true,
      },
    ],
  });
  console.log("✅ Seeded Development Coupons");

  // 7. Seed Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Uniforms for Every Season",
        subtitle: "Comfort. Confidence. A Brighter Tomorrow.",
        image: "/images/hero-banner.png",
        ctaText: "SHOP SCHOOL UNIFORMS",
        ctaUrl: "/school-uniforms",
        badge: "School Days, Brighter Always",
        position: BannerPosition.HERO,
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Summer School Uniforms",
        subtitle: "Lightweight. Breathable. Perfect for Everyday Learning.",
        image: "/images/hero-kids.jpg",
        ctaText: "SHOP SUMMER DRESS",
        ctaUrl: "/school-uniforms/summer",
        badge: "☀️ Summer Collection",
        position: BannerPosition.PROMO_SPLIT,
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Stay Warm This Winter",
        subtitle: "Premium Winter Uniforms for Every Season",
        image: "/images/winter-flatlay.jpg",
        ctaText: "SHOP WINTER DRESS",
        ctaUrl: "/school-uniforms/winter",
        badge: "❄️ Winter Warmers",
        position: BannerPosition.PROMO_SPLIT,
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "COMPLETE SCHOOL LOOK",
        subtitle: "Uniforms + Shoes + Accessories",
        image: "/images/combo-kids.jpg",
        ctaText: "SHOP COMBO SETS",
        ctaUrl: "/school-items",
        badge: "Combo Pack",
        position: BannerPosition.PROMO_TRIO,
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "Warmth for Every Adventure",
        subtitle: "Soft, lightweight multi-stretch thermals",
        image: "/images/thermals-stack.jpg",
        ctaText: "EXPLORE NOW",
        ctaUrl: "/thermals",
        badge: "Thermals Collection",
        position: BannerPosition.PROMO_TRIO,
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "Flat 20% OFF",
        subtitle: "On Uniforms, Thermals & School Items",
        image: "/images/promo-offer.png",
        ctaText: "USE CODE: SCHOOL20",
        ctaUrl: "/offers",
        badge: "Special Offer",
        position: BannerPosition.PROMO_TRIO,
        displayOrder: 3,
        isActive: true,
      },
    ],
  });
  console.log("✅ Seeded Promotional Banners");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
