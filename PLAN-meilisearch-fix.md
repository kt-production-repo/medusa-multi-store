# PLAN — Meilisearch Integration Fixes

## Problems Found

1. **`meilisearch` npm package unavailable for local dev** — installed only in Docker via `yarn add` (ESM-only v0.60.0, not in upstream `apps/backend/package.json`)
2. **No index configuration** — missing `searchableAttributes`, `filterableAttributes`, `displayedAttributes`
3. **No task-completion waiting** — `addDocuments`/`deleteDocuments`/`updateSettings` return `EnqueuedTaskPromise` but `.waitTask()` is never called
4. **No graceful degradation** — if Meilisearch is unreachable at module init, the service throws and crashes the Medusa boot
5. **Storefront search bar not wired into header** — only accessible via `/search` page route (overlay pattern prevents modifying upstream `nav/index.tsx`)
6. **Storefront Dockerfile** — duplicate `COPY overlay/storefront/src/ ./src/` line (fixed)

## Tasks

- [x] 1. Review meilisearch module code against `meilisearch@0.60.0` SDK + Medusa 2.18.0 patterns
- [x] 2. Fix `service.ts`: graceful degradation (return `undefined` client, safe defaults) + index configuration (`updateSettings().waitTask()`) + `.waitTask()` on all writes + logger extraction from Medusa container
- [x] 3. Verify `delete-products-from-meilisearch.ts` step — already imports `MeilisearchModuleService` with type parameter (confirmed correct)
- [x] 4. Remove duplicate `COPY overlay/storefront/src/ ./src/` in storefront Dockerfile
- [x] 5. Storefront header integration — search page at `/[countryCode]/search` works; header link requires upstream nav template modification (blocked by overlay additive-only rule)
- [x] 6. Run `check-overlay.sh` — PASS (overlay is additive-only)
- [x] 7. Smoke test — Docker image builds, `MODULE: meilisearch` loads, `Meilisearch index configured with settings`, search returns `{ hits, estimatedTotalHits, query, processingTimeMs }`, sync returns 200

## Deployment Order

databases -> meilisearch -> backend-server -> backend-worker -> storefront
