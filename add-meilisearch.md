# Add Meilisearch to the marketplace

Goal: self-hosted Meilisearch, backend integration only (storefront search UI
deferred — apps/storefront is read-only and needs a storefront overlay
mechanism first). All changes stay on overlay/deploy/env paths so
`./scripts/update-upstream.sh` stays conflict-free.

- [x] 1. Research Medusa v2 Meilisearch integration (official guide +
      medusajs/examples/meilisearch-integration). Scope decided: backend-only,
      self-hosted Meilisearch on Dokploy.
- [x] 2. Verify every new overlay path is additive — upstream apps/backend/src
      has no subscribers/, workflows/, modules/meilisearch, api/store/products/
      search, admin/lib, admin/routes/settings/meilisearch. No collisions.

## Backend module

- [x] 3. Add `meilisearch` JS client via `RUN yarn add meilisearch` in
      deploy/backend/Dockerfile builder stage (in-image only; never edit
      apps/backend/package.json).
- [x] 4. Create `overlay/backend/src/modules/meilisearch/service.ts` — client
      init + indexData / retrieveFromIndex / deleteFromIndex / search / getIndexName.
- [x] 5. Create `overlay/backend/src/modules/meilisearch/index.ts` — Module
      definition, export MEILISEARCH_MODULE.
- [x] 6. Register the module in `overlay/backend/medusa-config.ts` under
      `modules` (MEILISEARCH_HOST / MEILISEARCH_API_KEY / MEILISEARCH_PRODUCT_INDEX_NAME).

## Workflows + subscribers

- [x] 7. `overlay/backend/src/workflows/meilisearch/steps/sync-products.ts` (with compensation).
- [x] 8. `overlay/backend/src/workflows/meilisearch/steps/delete-products-from-meilisearch.ts` (with compensation).
- [x] 9. `overlay/backend/src/workflows/meilisearch/sync-products.ts` (useQueryGraphStep +
      transform, publishes only).
- [x] 10. `overlay/backend/src/workflows/meilisearch/delete-products-from-meilisearch.ts`.
- [x] 11. `overlay/backend/src/subscribers/product-sync.ts` (product.created/updated).
- [x] 12. `overlay/backend/src/subscribers/product-delete.ts` (product.deleted).
- [x] 13. `overlay/backend/src/subscribers/meilisearch-sync.ts` (manual full reindex).

## API + admin

- [x] 14. `overlay/backend/src/api/store/products/search/route.ts` (POST search).
- [x] 15. `overlay/backend/src/api/admin/meilisearch/sync/route.ts` (emits meilisearch.sync).
- [x] 16. Admin page `overlay/backend/src/admin/routes/settings/meilisearch/page.tsx`
      + existing `admin/lib/client.ts` (reused — no new sdk.ts needed).

## Infra / env / deploy

- [x] 17. Add MEILISEARCH_HOST / MEILISEARCH_API_KEY / MEILISEARCH_PRODUCT_INDEX_NAME
      to env/backend-server.env.example + env/backend-worker.env.example (runtime only).
- [x] 18. Add `meilisearch` service to docker-compose.yml (getmeili/meilisearch,
      port 7700, volume, healthcheck) + wire env into backend-server/worker.
- [x] 19. Document 6th Dokploy service `medusa-meilisearch` (getmeili/meilisearch,
      :7700, no public domain) + deploy order: databases → backend-server →
      backend-worker → storefront.

## Verify

- [x] 20. `./scripts/check-overlay.sh` passes; `git status --porcelain apps/` empty.
- [x] 21. Smoke test: build with meilisearch, seed, POST /admin/meilisearch/sync
      → docs indexed; POST /store/products/search returns hits; create/update/delete
      stays in sync.

## Deferred

- [ ] 22. Storefront search UI — requires a storefront overlay mechanism
      (overlay/storefront/ + COPY in deploy/storefront/Dockerfile + check-overlay
      extension). Out of scope here.

---

## Implementation notes (for the record)

- `meilisearch` npm package is **ESM-only**; Medusa compiles `src/` to CommonJS,
  so a static `import` fails TS1479 at build. The module service loads the client
  lazily via `await import("meilisearch")` (`modules/meilisearch/service.ts`).
- Reused the existing `overlay/backend/src/admin/lib/client.ts` for the admin
  page (the official guide's `admin/lib/sdk.ts` is a duplicate of what the repo
  already has).
- Removed the explicit `authenticate("admin", ...)` middleware on
  `/admin/meilisearch/sync`: Medusa auto-protects `/admin/*` routes, and our own
  `authenticate` middleware shadowed the framework auth (returned 401 even with a
  valid token). Stock admin routes need no extra middleware.
- smoke-test validated: seed auto-indexed 4 products via `product.created`; manual
  sync `POST /admin/meilisearch/sync` → 200; `POST /store/products/search` →
  hits; create products → doc count 4→5; delete → 5→4 and search returns 0 hits.

- **Deployment finding**: the `meilisearch` npm package is *only the JS client*;
  the engine is the standalone `getmeili/meilisearch` server (needs a persistent
  `/meili_data` volume, HTTP API on :7700), so it **cannot** run inside the Medusa
  backend process. Verified Meilisearch is **not** a native Dokploy Database
  (Dokploy native DBs are Postgres/MySQL/MariaDB/MongoDB/Redis/libsql). It is
  deployed as an Application built from `deploy/meilisearch/Dockerfile` (Option C);
  docs updated accordingly (README §3.2, env/databases.env.example Meilisearch
  section, new `env/meilisearch.env.example`). Local/dev composes via
  `docker-compose.yml` which keeps the `meilisearch` service inline.