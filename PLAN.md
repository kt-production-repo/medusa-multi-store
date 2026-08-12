# PLAN — smoke test fixes before commit/push

Status of the current work plan for the Medusa 2 multi-vendor marketplace repo.
Work happens against the **repo rules** in `AGENTS.md`: `apps/backend/**` and
`apps/storefront/**` are official upstream repos (git subtree) and are READ ONLY;
all project code lives in `overlay/backend/**`, `deploy/**`, `scripts/`, `env/`
and `docker-compose.yml`. `overlay/backend/medusa-config.ts` is the single
intentional upstream replacement, done only inside the Docker image.

---

## Status

### Verified / done
- `HEAD:apps/backend` and `HEAD:apps/storefront` tree hashes confirmed
  byte-identical to their upstream subtree commits; zero non-merge commits have
  ever touched `apps/`.
- Full `medusa build` (backend + admin) verified locally by merging the overlay
  into a throwaway copy of `apps/backend/src`. This surfaced 8 real bugs, all
  now fixed:
  1. `overlay/backend/src/api/admin/vendors/admins/[id]/route.ts` — default
     import of a named-only export (`deleteVendorAdminWorkflow`) → named import;
     relative import depth corrected `../../../` → `../../../../../` (3 imports).
  2. `overlay/backend/src/admin/routes/vendors/[id]/page.tsx` — `useParams` was
     a local stub returning `{ id: undefined }` (infinite spinner) → now imported
     from `react-router-dom`; removed dead `vendorId` line and dead
     `useMemo`/`useState` imports.
  3. `overlay/backend/src/admin/routes/vendors/page.tsx` — `Spinner`/`Trash` not
     exported by `@medusajs/ui` → `Skeleton` from `@medusajs/ui`, `Trash` from
     `@medusajs/icons`.
  4. `overlay/backend/src/api/middlewares.ts` — invalid `{ isAdmin: true }`
     query config → `{ isList: true }`.
  5. Removed debug `console.log("adminData")` from the admin list page.
  6. Compensation functions in `create-vendor`/`delete-vendor-admin` steps are
     now awaited (were fire-and-forget).
  7. `deploy/storefront/Dockerfile` + `docker-compose.yml` —
     `MEDUSA_BACKEND_URL` is now baked into the runtime stage and passed as a
     runtime env (was build-arg only → middleware crash at runtime).
  8. Default region `us` → `gb` (upstream seed only creates EU countries) in
     `deploy/storefront/Dockerfile`, `docker-compose.yml`,
     `env/storefront.env.example`.

### Current smoke test (docker compose, colima on macOS)
- Full stack via
  `docker compose --env-file /var/folders/gh/l7_mrc851mdgb4wlckzbsjxw0000gn/T/opencode/medusa-smoke/stack.env -f docker-compose.yml -f /var/folders/gh/l7_mrc851mdgb4wlckzbsjxw0000gn/T/opencode/medusa-smoke/compose.override.yml`.
  The temp override publishes ports (postgres 5433, redis 6380, backend 9000,
  storefront 8000).
- Backend boots, migrates, seeds (`MEDUSA_SEED=true`), creates admin user
  `admin@medusa.test`; `/health` returns `OK`.
- Seeded region Europe (`eur`) includes `gb`; publishable key exists.
- Vendor flow verified working: register vendor
  (`POST /auth/vendor/emailpass/register`), create vendor (`POST /vendors`),
  vendor auth (`POST /auth/vendor/emailpass`), create product
  (`POST /vendors/products`); product isolation confirmed (each vendor sees only
  its own products).
- Split-order checkout (`POST /store/carts/{id}/complete-vendor`) VERIFIED:
  cart with Acme Widget x2 (vendor A) + Globex Gadget x1 (vendor B), gb
  address + shipping method + `pp_system_default` payment session, produced the
  parent order (display_id 1) plus 2 per-vendor child orders; each vendor sees
  exactly its own child order via `GET /vendors/orders`.

---

## Task checklist

- [x] Implement inventory fix in create-vendor-product workflow
- [x] Rebuild backend image + recreate stack
- [x] Split-order checkout smoke test passes (2 per-vendor orders)
- [x] Storefront builds and boots
- [x] Backend-worker starts clean
- [x] Stack torn down, apps/ clean, check-overlay passes

---

## Bug found by the smoke test (key remaining work)

Vendor-created products cannot be added to a cart: `POST /store/carts/{id}/line-items`
returns 400 `"Sales channel <id> is not associated with any stock location for
variant <id>"`.

**Root cause:** `overlay/backend/src/workflows/marketplace/create-vendor-product/index.ts`
(mirrors the official Medusa marketplace example) creates the product and links
it to the store's default sales channel, but **never creates inventory levels**.
Seed products are purchasable because the seed creates inventory levels at the
default stock location (European Warehouse); vendor products get inventory items
but zero inventory levels, so the sales channel has no stock location for those
variants.

---

## Fix (implemented, verified)

In `overlay/backend/src/workflows/marketplace/create-vendor-product/index.ts`:

1. Extended the `store` query to also fetch `default_location_id`.
2. After `createProductsWorkflow` + vendor link, query the created product's
   variants → `inventory_items.inventory_item_id`.
3. Run `createInventoryLevelsWorkflow` via `runAsStep` to create one inventory
   level per vendor variant at the store's `default_location_id`, defaulting to
   a stocked quantity of 100 with an optional per-variant `stocked_quantity`
   override from the product payload.
4. Verified in the running image (DB shows both vendor variants with
   inventory levels at the default stock location) and end-to-end: vendor
   products can now be added to cart and complete checkout.

---

## Remaining verification steps after the fix

All completed in the smoke run:

- Rebuilt the backend Docker image and re-ran the split-order checkout smoke
  test: cart with Acme Widget x2 (vendor A) + Globex Gadget x1 (vendor B), gb
  address + shipping method + `pp_system_default` payment session →
  parent order (display 1) + 2 per-vendor child orders; each vendor sees exactly
  its own order via `GET /vendors/orders`.
- Built + booted the storefront image against the live backend (validated
  `MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_*` Dockerfile wiring); `/gb/store` lists
  seed products and `/gb/products/t-shirt` renders the detail page.
- Verified backend-worker mode starts clean (sleeps `WORKER_START_DELAY`, then
  starts and drains queued events with no errors).
- Torn down the stack (`docker compose down -v`); `git status --porcelain apps/`
  empty; `./scripts/check-overlay.sh` passes.

---

## Commit / push checklist

- [x] Split-order checkout smoke test passes (2 per-vendor orders, per-vendor
      isolation confirmed).
- [x] Storefront builds and boots against the live backend.
- [x] Backend-worker mode starts clean.
- [x] Stack torn down (`docker compose down -v`).
- [x] `git status --porcelain apps/` empty.
- [x] `./scripts/check-overlay.sh` passes.
- [ ] Commit only overlay + deploy + env + compose changes.
- [ ] Push to GitHub only after the user explicitly confirms.

## Smoke-test notes for next time

- The stack's `.env` files under `medusa-smoke/` hold a publishable key that
  is invalidated whenever the DB volume is recreated (`down -v`). Re-fetch it
  from `GET /admin/api-keys?type=publishable` (admin token) before running the
  storefront or `/store/*` calls.
- The storefront must know the backend's address during its build
  (`generateStaticParams` calls the live API). From a build container on this
  colima setup, `http://host.docker.internal:9000` reaches the published
  backend; bake that (or the public domain) as `MEDUSA_BACKEND_URL` for the
  build.
- The upstream storefront only lists products under `/{countryCode}/store`,
  not `/{countryCode}/products`; `products/[handle]` is the detail page.
- The middleware issues a 307 + `_medusa_cache_id` cookie on first visit —
  curl needs a cookie jar (or a browser) or it loops.
