# EMBER BITE image provenance

Created on 18 October 2026 specifically for this demonstration with the built-in OpenAI image generation tool. No Cheezious photographs, logos, packaging, or reference-site visual assets were used. These are original AI-generated illustrative food images, not photographs of food sold by a real business. No third-party stock-photo license is involved. No claim is made about exclusive rights or trademark clearance.

## Current website imagery (v3)

- `products/<product-slug>.webp`: 24 independently generated square food photographs, each matching its named menu product. They include separate burger and pizza recipes, three wraps, four sides, three desserts, three drinks, and three deals. No product file is reused by another seeded product.
- `hero-burger-v3.webp` and `hero-burger-v3-mobile.webp`: responsive versions of one newly generated transparent burger hero, 1000 × 1039 and 600 × 623 respectively.
- `category-burgers-v3.webp`, `category-pizza-v3.webp`, `category-wraps-v3.webp`, and `category-sides-v3.webp`: four separately generated category scenes at 800 × 600, separate from the product photographs.
- `story-table-v3.webp`: original food-sharing scene, 1600 × 1050.
- `about-kitchen-v3.webp`: original chef preparation scene, 1600 × 1050.

Generation prompts and per-group provenance are included in `assets/image-provenance-v3/` in the project source. Final WebP files are locally optimized derivatives of those generation results. Large working PNG masters are excluded from the source archive. Product photographs are 800 × 800 and approximately 30–182 KiB each. The asset check in `scripts/check-image-assets.mjs` rejects duplicated product bytes and oversized product files.

Older retained WebP/SVG files are original demonstration assets from earlier iterations; current pages and seeded products use the v3 photographs above. Existing saved catalog data is upgraded only when it points at one of the known old shared category images. Custom photographs are preserved.

The procedural Three.js hero is original repository-native geometry and does not use external GLB models or textures. The display font license is supplied separately in `public/fonts/LICENSE.txt`.
