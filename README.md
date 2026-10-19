# EMBER BITE

An original restaurant ordering demonstration with a server-rendered storefront, an optional interactive 3D burger, 24 sample menu items, three fictional kitchens, guest checkout, persistent orders and protected administration.

## Architecture

This repository uses Next.js App Router conventions and React 19, running through the supplied Vinext/Vite adapter for Cloudflare Workers hosting. Tailwind CSS provides the base pipeline; the original design lives in `app/globals.css`. The isolated 3D view uses Three.js, React Three Fiber 9 and Drei. Zustand persists public cart choices; Zod validates requests. Durable SQLite data uses Cloudflare D1 with Drizzle schema migrations.

The hosted platform supports D1 rather than a local Prisma filesystem database. D1 keeps orders persistent across Worker requests. Admin access uses the platform's secure ChatGPT sign-in plus an explicit server-side email allowlist instead of a separate password system. The deployed website is owner-private. No credentials are hardcoded in source.

## Requirements and setup

Node.js 22.13+ and pnpm 11.25 are recommended. The lockfile contains tested compatible dependencies.

```sh
corepack enable
pnpm install --frozen-lockfile
cp .env.example .dev.vars
pnpm build
```

Local data must be migrated before opening the application:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_zippy_forge.sql
pnpm db:seed
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file work/seed.sql
pnpm dev
```

Run from the project root. For a standalone portable checkout, development normally runs on port 5173. In the managed ChatGPT environment use its supported preview supervisor instead of starting an independent browser preview. `pnpm start` runs the built Worker locally; it does not deploy.

The catalog has a deterministic seed fallback before the first saved edit. The seed command creates an explicit insert script and preserves existing edits. Apply each SQL migration only once to the same database.

Portable loopback development supports `/signin-with-chatgpt?return_to=/admin` using the starter's local mock identity `seedy@sites.test`; include that email in local `ADMIN_EMAILS`. Managed environments do not enable mock sign-in. Production identity is owned by the hosting platform.

## Environment

Use `.env.example` as a key reference. Local Worker values go in untracked `.dev.vars`; do not commit secrets. Hosted values are configured through the Sites runtime settings and applied by deployment:

- `SITE_URL`: canonical production origin.
- `ENABLE_INDEXING`: defaults to false. Keep false for fictional/staging data.
- `ADMIN_EMAILS`: comma-separated explicitly authorized sign-in email addresses. Fails closed when absent.

## Test the customer flow

1. Open Menu, choose a kitchen/service area and Delivery or Pickup.
2. Customize a burger or pizza and add it to the cart.
3. Change quantities and refresh to verify cart persistence.
4. Use sample code `EMBER10`: 10% off with Rs. 1,000 minimum, maximum Rs. 500 discount, valid through 31 December 2027 in Pakistan time.
5. Checkout using fictional contact information, e.g. Demo Guest and 03001234567. Delivery requires a full sample address.
6. Submit once. The database saves the order before returning confirmation.
7. Save the private tracking link. Visit Admin with the authorized account and update the order using allowed transitions. Tracking reflects the persisted status, with a manual refresh and a 30-second polling interval.

Sample kitchen hours are 11:00–02:00 Asia/Karachi. Closed kitchens reject orders. Pickup does not charge delivery fees or require an address. Additional sample tax is 0%; this is not legal tax advice.

Every quote is calculated server-side from the catalog. Order submission uses unique idempotency keys, immutable item snapshots and atomic database insertion. Retrying identical data with the same key returns the existing order; changing the data requires a new attempt.

## Administration

The authorized owner can manage products, categories, sizes/add-ons, kitchen availability, service zones, opening hours, delivery fees, coupon rules and actual order statuses. Unsaved catalog edits are kept in the form until Save. Version checks prevent stale edits from overwriting newer changes. Product and branch IDs referenced elsewhere must remain consistent. No customer sees implementation controls.

Contact submissions appear in the private kitchen inbox. Newsletter opt-ins are deduplicated and saved. Neither form claims external email delivery.

## Checks

```sh
pnpm typecheck
pnpm exec eslint app components lib db middleware.ts --ignore-pattern components/ui
pnpm test
pnpm build
node scripts/smoke-built.mjs
node scripts/check-image-assets.mjs
```

`pnpm test` runs business-rule tests and API workflows against a real local D1 emulator, including concurrent duplicate submissions, tracking privacy, admin authorization, coupons, schema validation, persistence and rate limiting.

Playwright acceptance scenarios are included in `tests/browser/ordering.spec.ts`. They require an approved running QA environment and an available Chromium installation:

```sh
QA_BASE_URL=http://127.0.0.1:5173 pnpm test:e2e
```

Do not aim these mutation tests at a real customer database. The browser suite does not start a server, bypass sign-in or contain production credentials. DOM interaction regression tests cover customization, cart readiness, service selection without accidental form submission, keyboard dialog dismissal, filters and corrupt/denied storage. Browser QA and Lighthouse were not executable in the creation environment; see `VERIFICATION.md` for the exact completed checks and limitations.

## 3D and performance

The homepage renders original optimized food art immediately. The genuine procedural 3D burger is dynamically imported only when the visitor chooses “Take it for a 3D spin.” It has a static fallback, capped pixel ratio, on-demand rendering, visibility handling and keyboard-operable rotation. No external model, texture or rendering engine is fetched. The product list never creates WebGL canvases.

Each of the 24 menu products has its own independently generated 800 × 800 WebP photograph (about 30–182 KiB each). The four category scenes and the story and kitchen photographs are also separate originals. The responsive transparent hero is about 130 KiB on mobile and 324 KiB on desktop. Explicit image dimensions reserve space; product images below the fold load lazily. These images illustrate the fictional recipes and are not photographs of a real restaurant's food. The application self-hosts a 20 KB subset of Nimbus Sans Narrow for display typography, uses system body fonts and includes no marketing trackers. Font attribution is in `public/fonts/LICENSE.txt`.

Targets remain mobile Lighthouse Performance 90+ and Accessibility/SEO/Best Practices 95+, with production field goals LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 at the 75th percentile. These targets are not measured scores. Run Lighthouse on home, menu and checkout in the production build, then real-user monitoring after launch. No numeric score or field metric is fabricated.

## SEO and public launch

Unique metadata, canonical URLs, Open Graph/Twitter previews, breadcrumb JSON-LD, robots rules and sitemap generation are included. Server-rendered product/branch pages use descriptive slugs. Search filters are client-local, with the menu canonical. The demo deliberately uses noindex and an empty sitemap. Private order tokens and admin pages remain excluded.

Before enabling indexing, replace sample business/menu data with verified content and complete the operational review. Add verified Restaurant/Menu structured data only after real identity, locations, menu and hours are confirmed. Then set `ENABLE_INDEXING=true` and the correct `SITE_URL`, deploy, verify domain ownership in Search Console, inspect representative URLs and submit `/sitemap.xml`. No search ranking is promised.

## Deployment and production requirements

The tracked `.openai/hosting.json` binds `DB` to durable D1. The Sites workflow builds, pushes source, packages the Worker and applies schema-only migrations before publishing. The source repository and deployment versions are linked. Preserve the maintained Sites/Vinext build integration.

For other Cloudflare deployments, provision a real D1 database, configure its binding and runtime environment, apply migrations, build and deploy the Worker plus static assets. Local preview D1 and hosted D1 are separate databases; copying browser state does not migrate data.

Moving to PostgreSQL requires a supported HTTP-accessible server adapter, revised Drizzle schema/dialect, new migration history, an explicit data export/import and ID/constraint verification, plus transaction/idempotency and deployment regression tests. Replacing a database URL alone does not migrate D1 data. Filesystem SQLite is inappropriate for ephemeral multi-instance hosting.

Payments are intentionally disabled except for demo cash/pickup choices. Before integrating a real gateway, implement its server-side payment intent/session flow, amount/currency validation, signed webhook verification, unique provider event IDs, idempotent state transitions, retries, reconciliation, refunds and failure tests. Never mark paid based on a client redirect. No card data is stored.

Email requires a configured provider, verified sending identity, opt-in handling, delivery retries and verified responses before claiming an email was sent. No payment or email credentials are required for this self-contained demo.

Before real commerce, replace fictional locations and illustrative recipes, verify allergies/pricing/taxes, finalize policies and support identity, establish customer-data retention/deletion, monitor reliability and database cost, and complete browser accessibility/performance testing. Shared database request counters provide cross-instance rate limits; validate edge IP handling and tune retention/abuse controls for the selected host. Admin history is timestamped. A saved order and audit log update are separate operations, so audit logging may require stronger transactional guarantees for compliance-sensitive use.

## Assets and reference

Cheezious was used for restaurant-ordering inspiration only. Its indexed reference content exposed delivery/pickup, menu and cart concepts; the full interactive reference could not be verified. EMBER BITE is an original fictional brand. No Cheezious logo, photography or marketing claims are copied. Every current menu photograph, including drinks and desserts, is a distinct original AI-generated image. Provenance and prompt records are described in `public/images/ASSET_PROVENANCE.md` and `assets/image-provenance-v3/`. Optimized final assets are included in source; large working PNG masters are excluded.

`lib/image-assets.ts` upgrades known old shared image paths when reading an existing saved catalog, preserving business settings, prices and independently assigned custom photographs. The admin image selector offers the new individual menu photographs. `node scripts/check-image-assets.mjs` verifies that all 24 menu files exist, have unique file hashes and stay within the per-product byte budget.

## Interaction reliability update

All service-selection, dialog, customization and admin controls declare non-submit button types. Dialogs render in a portal, outside the checkout form. A failed or blocked browser storage operation falls back to an in-memory cart rather than blocking hydration or actions. Corrupt saved cart entries are discarded. Price-check errors offer an explicit retry. Origin validation accepts only the request origin or the configured canonical site origin, including trusted hosting-proxy paths. The site delegates iframe embedding policy to its hosting platform.

## Native document navigation

Storefront links use real HTML anchors through `components/site-link.tsx`, preserving browser navigation before JavaScript initializes and avoiding the experimental RSC client click/prefetch path on private hosting. Header/menu/story/kitchen links, product links, category links and checkout links share this behavior. Cart preferences persist across document loads. Successful checkout and tracking lookup use a same-origin full-document redirect. Client controls (customization, cart quantities and filters) remain interactive. `tests/navigation.test.tsx` covers the five reported links and does not substitute a fake router/link implementation.

If embedded/private browser storage is denied, native navigation temporarily carries only public cart items and kitchen preferences in a URL fragment. The destination validates and restores those choices, then removes the fragment. Names, phone numbers, addresses and payment data are never included. Pricing is always revalidated on the server.
