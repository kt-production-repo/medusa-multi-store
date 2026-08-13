# PLAN — Meilisearch search UI in the storefront

**Mode:** Option B — strictly additive to `apps/storefront/`. No upstream file is shadowed, so the storefront overlay needs only an *additive* `check-overlay.sh` branch (no intentional-replacement exception). `apps/` stays byte-identical to upstream.

**Security:** the storefront never holds the Meili master key. It queries `POST /store/products/search` on the Medusa backend (public, publishable-key protected), which returns raw Meili `hits` whose `id` = product id. Full priced products are hydrated via `GET /store/products?id=[ids]&region_id=…&fields=…`, reusing the existing `listProducts` pattern. The JS SDK auto-attaches `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

**Backend enhancement:** the `/store/products/search` route originally accepted only `{ q }`. It now also accepts optional `limit`/`offset`, forwarded to the meilisearch client, with a response that includes `hits` + `estimatedTotalHits` + `query` + `processingTimeMs` for pagination.

**No env flag:** Option B has no header bar to toggle, and `searchProducts` already catches backend/Meili errors and returns `[]` (graceful "No products found" state), so `NEXT_PUBLIC_MEILISEARCH_ENABLED` is not required. This keeps the storefront Surface area minimal.

## Checklist

- [x] 0. Create `overlay/storefront/src/` skeleton + this plan file.
- [x] 1. Backend route + service enhancement (pagination):
  - `overlay/backend/src/modules/meilisearch/service.ts`: `import type { SearchParams }`; `search(query, type?, options?: SearchParams)` forwards to `index.search`.
  - `overlay/backend/src/api/store/products/search/route.ts`: schema gains optional `limit`/`offset`; response returns `hits` + `estimatedTotalHits` + `query` + `processingTimeMs`.
- [x] 2. Storefront search data fn: `overlay/storefront/src/lib/data/search.ts` (`"use server"`): `searchProducts({q, countryCode, page, limit})` → POST `/store/products/search` → collect `hit.id` → GET `/store/products` hydrate → `{products, count, nextPage}`. Errors → empty.
- [x] 3. Search bar + results page + /search route:
  - `overlay/storefront/src/modules/search/components/search-bar/index.tsx` (client): input + `MagnifyingGlass` icon (`@medusajs/icons`, exported), Enter → `router.replace(/{cc}/search?q=…)`.
  - `overlay/storefront/src/modules/search/components/search-results/index.tsx` (server): fetches + renders existing `ProductPreview` grid + `Pagination`, empty/skeleton states.
  - `overlay/storefront/src/app/[countryCode]/(main)/search/page.tsx`: page shell (SearchBar + Suspense'd SearchResults).
- [ ] 4. `deploy/storefront/Dockerfile` builder: add `COPY overlay/storefront/src/ ./src/` after `COPY apps/storefront/ ./`.
- [ ] 5. `scripts/check-overlay.sh`: add `check overlay/storefront/src apps/storefront/src` (additive only).
- [ ] 6. `README.md`: add `overlay/storefront/**` to storefront Watch Paths; minor storefront-search note; fix §5 ("not wired up yet" → live).
- [ ] 7. `add-meilisearch.md`: check off step 22.
- [ ] 8. Guardrails: `./scripts/check-overlay.sh` exits 0; `git status --porcelain apps/` empty.
- [ ] 9. Smoke test (docker compose, seeded): `/<cc>/search?q=…` renders results; Enter navigates/paginates; empty/gibberish → graceful empty state; meili down → no crash.

## Files touched (all ours; none under `apps/`)

| File | Action | Additive |
|------|--------|----------|
| `overlay/storefront/src/lib/data/search.ts` | new | yes |
| `overlay/storefront/src/modules/search/components/search-bar/index.tsx` | new | yes |
| `overlay/storefront/src/modules/search/components/search-results/index.tsx` | new | yes |
| `overlay/storefront/src/app/[countryCode]/(main)/search/page.tsx` | new | yes |
| `overlay/backend/src/api/store/products/search/route.ts` | extend | yes (route is ours) |
| `overlay/backend/src/modules/meilisearch/service.ts` | extend | yes |
| `deploy/storefront/Dockerfile` | add COPY overlay/storefront/src/ ./src/ | yes |
| `scripts/check-overlay.sh` | add storefront branch | yes |
| `README.md` | watch path + storefront search note + §5 fix | yes |
| `add-meilisearch.md` | check step 22 | yes |
