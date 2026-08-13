# PLAN — Medusa 2 Multi-Vendor Marketplace (consolidated)

Master plan for the `add-meilisearch` branch. Merges:
`PLAN-admin-ui.md`, `PLAN-audit.md`, `PLAN-meilisearch-storefront.md`,
`PLAN-providers.md`, `PLAN-skills-review.md`, `add-meilisearch.md`,
and `PLAN-providers-review.md`.

Per AGENTS.md: `apps/backend/**` and `apps/storefront/**` are official upstream
repos (git subtree), READ ONLY. All project code lives in `overlay/backend/**`,
`deploy/**`, `scripts/`, `env/`, and `docker-compose.yml`.
`overlay/backend/medusa-config.ts` is the single intentional upstream
replacement, applied only inside the Docker image.

## Repo rules

- `./scripts/check-overlay.sh` must pass (fails if an overlay file shadows an
  upstream file). Run after adding/moving overlay files.
- Deploy order: databases → meilisearch → backend-server → backend-worker →
  storefront.
- Storefront build calls the live backend via `generateStaticParams`, so it
  needs a real publishable key and at least one region before building.

---

## 1. Meilisearch integration

Goal: self-hosted Meilisearch with a live storefront search UI. Backend-only,
self-hosted Meilisearch on Dokploy.

### Backend module
- `meilisearch` JS client added via `RUN yarn add meilisearch` in
  `deploy/backend/Dockerfile` builder stage (in-image only; never edit
  `apps/backend/package.json`).
- `overlay/backend/src/modules/meilisearch/service.ts` — client init +
  indexData / retrieveFromIndex / deleteFromIndex / search / getIndexName.
- `overlay/backend/src/modules/meilisearch/index.ts` — Module definition,
  exports MEILISEARCH_MODULE.
- Registered in `overlay/backend/medusa-config.ts` under `modules` with
  MEILISEARCH_HOST / MEILISEARCH_API_KEY / MEILISEARCH_PRODUCT_INDEX_NAME.
- **ESM gotcha:** `meilisearch` npm package is ESM-only; Medusa compiles `src/`
  to CommonJS, so static `import` fails TS1479/TS1541 at build. Service loads
  the client lazily via `await import("meilisearch")`.

### Workflows + subscribers
- `overlay/backend/src/workflows/meilisearch/steps/sync-products.ts`
  (with compensation).
- `overlay/backend/src/workflows/meilisearch/steps/delete-products-from-meilisearch.ts`
  (with compensation).
- `overlay/backend/src/workflows/meilisearch/sync-products.ts`
  (useQueryGraphStep + transform, publishes only).
- `overlay/backend/src/workflows/meilisearch/delete-products-from-meilisearch.ts`.
- `overlay/backend/src/subscribers/product-sync.ts`
  (product.created/updated).
- `overlay/backend/src/subscribers/product-delete.ts`
  (product.deleted).
- `overlay/backend/src/subscribers/meilisearch-sync.ts`
  (manual full reindex).

### API + admin
- `overlay/backend/src/api/store/products/search/route.ts` (POST search,
  pagination: limit/offset forwarded to meili, response returns hits +
  estimatedTotalHits + query + processingTimeMs).
- `overlay/backend/src/api/admin/meilisearch/sync/route.ts`
  (emits meilisearch.sync).
- Admin page `overlay/backend/src/admin/routes/settings/meilisearch/page.tsx`
  + existing `admin/lib/client.ts` (reused).

### Storefront search UI (Option B — additive storefront overlay)
- `overlay/storefront/src/lib/data/search.ts` ("use server"):
  `searchProducts({q, countryCode, page, limit})` → POST
  `/store/products/search` → collect `hit.id` → GET `/store/products`
  hydrate → `{products, count, nextPage}`. Errors → empty.
- `overlay/storefront/src/modules/search/components/search-bar/index.tsx`
  (client): input + MagnifyingGlass icon, Enter →
  `router.replace(/{cc}/search?q=…)`.
- `overlay/storefront/src/modules/search/components/search-results/index.tsx`
  (server): fetches + renders existing ProductPreview grid + Pagination,
  empty/skeleton states.
- `overlay/storefront/src/app/[countryCode]/(main)/search/page.tsx`:
  page shell (SearchBar + Suspense'd SearchResults).
- `deploy/storefront/Dockerfile` builder: `COPY overlay/storefront/src/ ./src/`
  after `COPY apps/storefront/ ./`.
- `scripts/check-overlay.sh`: added
  `check overlay/storefront/src apps/storefront/src` (additive only).
- No `NEXT_PUBLIC_MEILISEARCH_ENABLED` needed — `searchProducts` catches
  backend/Meili errors and returns `[]`.

### Infra / env / deploy
- MEILISEARCH_HOST / MEILISEARCH_API_KEY / MEILISEARCH_PRODUCT_INDEX_NAME in
  `env/backend-server.env.example` + `env/backend-worker.env.example`
  (runtime only).
- `meilisearch` service in `docker-compose.yml`
  (getmeili/meilisearch, port 7700, volume at `/meili_data`, healthcheck) +
  env wired into backend-server/worker.
- Meilisearch persistence is a Docker volume
  (`medusa_meilisearch_data:/meili_data`) on the engine service only — not an
  env var on backends. Documented in `env/meilisearch.env.example`,
  `docker-compose.yml`, `deploy/meilisearch/Dockerfile`, README §3.2.

### Verified
- `check-overlay.sh` passes; `git status --porcelain apps/` empty.
- Smoke test: build with meilisearch, seed, `POST /admin/meilisearch/sync` →
  docs indexed; `POST /store/products/search` returns hits; create/update/
  delete stays in sync.
- Storefront search live at `/{cc}/search?q=…` (200, renders product grid;
  gibberish → "No products found"; no `q` → "Enter a search term"; meili down
  → graceful 200 empty state).

### Checklist (all complete)
- [x] 1–22. All Meilisearch steps (module, workflows, API, admin, storefront
  UI, deploy, env, verify) — done.

---

## 2. Admin UI: widgets, pages, forms, navigation

Close admin-side gaps found by auditing `overlay/backend/src/admin/` against
the marketplace backend surface.

### Task list
- [x] 1. Create this plan file
- [x] 2. Backend: `GET /admin/products/:id/vendor` — resolve vendor linked to
  a product (`vendor-product` link), 404 when unlinked
- [x] 3. Frontend: product vendor widget
  (`admin/widgets/product-vendor.tsx`) on `product.details` showing vendor
  name + link to `/vendors/:id`
- [x] 4. Frontend: Vendor Admins page
  (`admin/routes/vendor-admins/page.tsx`) wiring `GET /admin/vendors/admins`,
  sidebar entry via `defineRouteConfig`
- [x] 5. Backend: `POST /admin/vendors` — admin-scoped create vendor + first
  admin (new `create-admin-vendor` workflow reusing existing
  `create-vendor` / `create-vendor-admin` steps, without auth-identity linking)
- [x] 6. Frontend: Create Vendor FocusModal on Vendors page header
- [x] 7. Backend: `POST /admin/vendors/admins` — add a vendor admin to an
  existing vendor
- [x] 8. Frontend: Add Vendor Admin form (FocusModal) on vendor detail Admins
  tab
- [x] 9. Backend: `POST /admin/vendors/:id` — update name / handle / logo
- [x] 10. Frontend: Edit Vendor Drawer on vendor detail page
- [x] 11. Backend: `GET /admin/orders/:id/vendor` — resolve vendor linked to
  a (child) order (`vendor-order` link), 404 when unlinked
- [x] 12. Frontend: order vendor widget (`admin/widgets/order-vendor.tsx`) on
  `order.details` showing vendor + link to `/vendors/:id`
- [x] 13. Register new POST bodies in
  `overlay/backend/src/api/middlewares.ts`
- [x] 14. Verify: `./scripts/check-overlay.sh` passes; every changed/added
  file transpiles (esbuild)
- [x] 15. Smoke test: rebuilt backend image, booted stack, logged in, verified
  all endpoints + admin bundle contains all new pages/widgets

### Design decisions
- Routes follow `AuthenticatedMedusaRequest` + `query.graph` pattern.
- Admin create-vendor must NOT reuse `createVendorWorkflow` directly: it calls
  `setAuthAppMetadataStep` (requires authenticated vendor identity). Admin-
  scoped workflow creates vendor + admin only.
- Widgets use `defineWidgetConfig` with zones `product.details` and
  `order.details` (v2.17.2+: position is user-controlled in dashboard Editor,
  not `.before`/`.after`).
- Forms: FocusModal for create, Drawer for edit.
- Widget data fetching is a display query on mount (`enabled: !!id`).
- Price values stored as-is; never divide by 100.

---

## 3. Repo audit: fixes after review against Medusa skills

Audit against `medusa` skill + `building-with-medusa` rules (workflows for
mutations, validation in steps, Zod v4, additive-only overlay, env var rules).

### Fixes applied
- **delete-vendor-admin NOT_FOUND break:** workflow used `when()` so auth-
  metadata cleanup only runs when identity exists; never throw NOT_FOUND for
  missing identity.
- **Vendor-scope on `DELETE /vendors/admins/:id`:** limited to caller's own
  vendor.
- **Zod v4:** `PostStoreProductSearchSchema` → `z.strictObject`.
- **Vendor.handle required:** derive slug from `name` when absent in
  `create-vendor` step.
- **Docs:** checked PLAN-admin-ui.md task 4; noted storefront uses standard
  `/store/carts/:id/complete`.

### Audit notes (verified correct)
- Overlay additive-only: `check-overlay.sh` passes, zero non-merge commits
  ever touched `apps/`.
- `medusa-config.ts` is a superset of upstream: conditional providers, Redis
  infra modules, Marketplace + Meilisearch modules.
- Marketplace module: Vendor + VendorAdmin models, service, module def,
  migrations + snapshot.
- Links: vendor↔product, vendor↔order.
- Workflows: create-vendor, create-admin-vendor, add-vendor-admin, update-
  vendor, delete-vendor-admin, create-vendor-product, create-vendor-orders,
  meilisearch sync/delete.
- API routes: GET/POST/DELETE only, Zod v4, `validateAndTransformBody` +
  `validateAndTransformQuery`.

---

## 4. Production providers: Stripe, S3, SendGrid

### Providers registered in overlay/backend/medusa-config.ts
- `payment` → `@medusajs/medusa/payment-stripe` when `STRIPE_API_KEY`
- `file` → `@medusajs/medusa/file-s3` when `S3_BUCKET` + `S3_ACCESS_KEY_ID`
- `notification` → `@medusajs/medusa/notification-sendgrid` when
  `SENDGRID_API_KEY` (keeps `local` for feed channel)
- Each conditional on env keys (missing → keep default, keyless local boots).

### Env + infrastructure
- `CHANGE_ME` placeholders in `env/backend-server.env.example` +
  `env/backend-worker.env.example`.
- Optional `${VAR:-}` passthroughs in `docker-compose.yml`.
- Documented in README: Stripe webhook URL, Admin → Settings → Regions,
  `NEXT_PUBLIC_STRIPE_KEY`, S3 persistence.

### Fixes applied
- **S3 region default:** `region` → `us-east-1` in medusa-config (AWS SDK
  rejects `undefined` region).
- **Notifications/email bug:** only core subscriber handled `order.created`
  with stub `to`. `order.placed` + `shipment.created` had NO subscriber.
  **Fix:** overlay subscriber `order-notifications.ts` for both events,
  content-based email, no-op when `SENDGRID_API_KEY` unset.
- **Auth hardening:** fail fast on missing `JWT_SECRET`/`COOKIE_SECRET` in
  production via `deploy/backend/entrypoint.sh` (dev fallback kept).

### Findings
- **Payments:** parent order fully wired (payment session, collection, auth,
  `order.placed`). Child vendor orders: no payment (official design — payment
  on parent). Stripe capture manual by default.
- **File storage:** S3 options match `@medusajs/file-s3` schema.
  `S3_FILE_URL` blank → presigned use-case.
- **Auth:** vendor is custom actor type; `/auth/vendor/*`. Admin-created
  vendor admins have no auth identity (documented).

### Verification
- [x] `check-overlay.sh` passes; `apps/` clean; build OK; boot health 200.
- [x] Smoke tested SendGrid wiring (401 with fake key proves registration).
  Entrypoint guard fails fast without secrets.

---

## 5. Skills/docs review

Audit of every `.md` under `.opencode/skills/medusa/` (and `.claude` /
`.agents` mirrors) against the repo. Official skills read-only upstream.

### Fixes applied
1. SKILL.md: "five" → "six" services; added medusa-meilisearch to topology +
   deploy order.
2. SKILL.md overlay tree: synced (api/admin/, store search, modules/
   meilisearch/, subscribers/, workflows/meilisearch/, admin/,
   overlay/storefront/; "split-order" → `create-vendor-orders`).
3. SKILL.md vendor API table: added 9 missing routes.
4. SKILL.md layout tree: added `deploy/meilisearch/Dockerfile`.
5. skills README.md: "nine" → "eight" `mcloud-*` skills.
6. env MEILISEARCH_HOST: fixed to project-slug-prefixed App Name.
7. docker-compose.yml header: "five" → "six"; added `NEXT_PUBLIC_STRIPE_KEY`
   build arg.
8. README.md: "split-order" → `create-vendor-orders`.
9. databases.env.example: noted compose redis runs passwordless.
10. PLAN.md: ticked commit checkbox.
11. AGENTS.md + add-meilisearch.md: deploy orders include meilisearch.
12. Re-mirrored `.opencode/skills` → `.claude/skills` + `.agents/skills`.

### Verification
- [x] Mirrors identical, frontmatter ok, `check-overlay.sh` passes, `apps/`
  clean; `docker compose build` smoke test.

---

## 6. Smoke test: split-order checkout + inventory fix

### 8 bugs found & fixed (via full `medusa build` in throwaway overlay copy)
1. Default import of named-only export → named import; relative import depth
   corrected.
2. `useParams` was a local stub → imported from `react-router-dom`.
3. `Spinner`/`Trash` not exported by `@medusajs/ui` → `Skeleton`, `Trash`
   from `@medusajs/icons`.
4. Invalid `{ isAdmin: true }` query config → `{ isList: true }`.
5. Removed debug `console.log`.
6. Compensation functions now awaited (were fire-and-forget).
7. `deploy/storefront/Dockerfile` + `docker-compose.yml`: `MEDUSA_BACKEND_URL`
   now baked into runtime stage + passed as runtime env (was build-arg only →
   middleware crash).
8. Default region `us` → `gb` (upstream seed only creates EU countries).

### Bug found by smoke test (key remaining work — FIXED)
- Vendor-created products couldn't be added to cart: 400 "Sales channel <id>
  is not associated with any stock location for variant <id>".
- **Root cause:** `create-vendor-product` workflow created the product but
  never created inventory levels. Seed products were purchasable because the
  seed created inventory levels; vendor products got inventory items but zero
  levels.
- **Fix:** extended `store` query to fetch `default_location_id`; after
  `createProductsWorkflow`, query variants → inventory_items; run
  `createInventoryLevelsWorkflow` at the store's default location
  (stocked_quantity 100, optional per-variant override).

### Smoke test results (all pass)
- Split-order checkout: cart with Acme Widget x2 (vendor A) + Globex Gadget
  x1 (vendor B) → parent order (display 1) + 2 per-vendor child orders; each
  vendor sees exactly its own order via `GET /vendors/orders`.
- Storefront builds + boots against live backend.
- Backend-worker starts clean.
- Stack torn down; `apps/` clean; `check-overlay.sh` passes.

### Smoke-test notes
- Stack `.env` hold a publishable key invalidated on `down -v`. Re-fetch from
  `GET /admin/api-keys?type=publishable` before running storefront.
- Storefront build needs live backend (`generateStaticParams`). From build
  container: `http://host.docker.internal:9000` reaches published backend.
- Upstream storefront lists products under `/{cc}/store`, not `/{cc}/products`.
- Middleware issues 307 + `_medusa_cache_id` cookie; curl needs a cookie jar.

---

## Deployment order

databases → meilisearch → backend-server → backend-worker → storefront.

- The storefront build calls the live backend via `generateStaticParams`, so it
  needs a real publishable key and at least one region first.
