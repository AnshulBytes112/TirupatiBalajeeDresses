GLOBAL PROJECT RULES — MUST FOLLOW FOR EVERY PHASE

We are building a production-ready e-commerce website called:

TirupatiBalajee Dresses

Business:
An Indian school-uniform and school-essentials retailer.

Products include:
- Summer school uniforms
- Winter school uniforms
- Boys uniforms
- Girls uniforms
- Thermals
- School shoes
- School bags
- Socks
- Belts
- Stationery
- Water bottles
- Lunch boxes
- School accessories
- Complete school kits
- School-specific uniforms

DESIGN REFERENCE:

Use the provided TirupatiBalajee Dresses homepage UI as the MASTER DESIGN SYSTEM.

The visual language is:
- premium Indian D2C e-commerce
- inspired by the shopping experience of modern fashion marketplaces
- cream/off-white backgrounds
- buttery yellow accents
- dark navy/black typography
- pastel blue/pink/green promotional sections
- rounded cards
- subtle shadows
- bold modern typography
- playful Gen-Z doodles
- clean product photography
- dense but organized e-commerce layout

The website should feel like a real commercial shopping platform.

Do NOT copy another company's:
- logo
- branding
- proprietary assets
- exact text
- product imagery
- source code

Use the reference only for general UX inspiration, information hierarchy and e-commerce patterns.

==================================================
CRITICAL DEVELOPMENT RULE
==================================================

BUILD FRONTEND AND BACKEND TOGETHER.

DO NOT:
- create fake APIs
- hardcode production data
- create fake cart functionality
- create fake authentication
- store important business data only in React state
- postpone backend implementation
- create UI that cannot later connect to the database

Every feature implemented in the frontend must have the corresponding backend/database implementation in the SAME PHASE.

Use real database data.

Development seed data is allowed.

==================================================
MOBILE RESPONSIVENESS
==================================================

EVERY PHASE MUST BE RESPONSIVE.

Test and design for:

320px
375px
390px
414px
768px
1024px
1280px
1440px+
 
Do NOT simply shrink the desktop UI.

Create proper mobile UX.

Examples:
- mobile navigation drawer
- mobile filter drawer
- sticky mobile cart buttons
- horizontally scrollable categories
- mobile product grids
- touch-friendly controls
- responsive images
- appropriate typography
- mobile-friendly forms
- bottom navigation where appropriate

No horizontal overflow.

==================================================
PRODUCTION QUALITY
==================================================

Use:
- TypeScript
- strict typing
- reusable components
- reusable services
- validation
- proper error handling
- loading states
- skeleton states
- empty states
- authentication/authorization
- database transactions
- secure API design
- environment variables
- logging
- rate limiting where appropriate
- proper HTTP status codes
- SEO
- accessibility
- image optimization

Never expose secrets to the frontend.

Never trust client-provided:
- prices
- discounts
- inventory
- order totals
- payment status
- coupon validity

Recalculate sensitive values on the server.

==================================================
CODE QUALITY
==================================================

Before implementing anything:

1. Inspect the existing project.
2. Understand the current architecture.
3. Reuse existing components where appropriate.
4. Do not unnecessarily rewrite working code.
5. Maintain backward compatibility.
6. Keep components modular.
7. Avoid giant components.
8. Avoid duplicated business logic.
9. Keep business logic out of UI components.
10. Use services/repositories where appropriate.

==================================================
AFTER IMPLEMENTATION
==================================================

DO NOT immediately move to the next phase.

First:

1. Start the application.
2. Run the backend.
3. Run database migrations.
4. Test all new APIs.
5. Test all new frontend flows.
6. Test error cases.
7. Test mobile layouts.
8. Test desktop layouts.
9. Check browser console.
10. Check server logs.
11. Fix all errors.
12. Run production build.

Only consider the phase complete when the implemented functionality actually works end-to-end.

Do not implement future phases unless explicitly instructed.