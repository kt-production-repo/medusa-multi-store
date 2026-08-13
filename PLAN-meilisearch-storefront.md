# PLAN — Meilisearch search UI in the storefront

**Mode:** Option B — strictly additive to `apps/storefront/`. No upstream file is shadowed, so the storefront overlay needs only an *additive* `check-overlay.sh` branch (no intentional-replacement exception). `apps/` stays byte-identical to upstream.

**Security:** the storefront never holds the Meili master key. It queries `POST /store/products/search` on the Medusa backend (public, publishable-key protected), which returns raw Meili `hits` whose `id` = product id. Full priced products are hydrated via `GET /store/products?id=[ids]&region_id=…&fields=…`, reusing the existing `listProducts` pattern. The JS SDK auto-attaches `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.

**Backend enhancement found during audit:** the current `/store/products/search` route only accepts `{ q }`. The plan adds optional `limit`/`offset` forwarding (additive — route + service are overlay-owned) so the page can paginate.

## Checklist

- [ ] 0. Create `overlay/storefront/src/` skeleton + this plan file.
- [ ] 1. Backend search route + service enhancement (pagination): `route.ts` schema gains `limit`/`offset` → forwarded to `service.search(q, {limit, offset})`.
- [ ] 2. Storefront search data fn: `overlay/storefront/src/lib/data/search.ts` (`"use server"`): `searchProducts({q, countryCode, limit?, offset?})` → POST search → collect `hit.id` → GET `/store/products` hydrate → `{products, count}`.
- [ ] 3. Search bar component: `overlay/storefront/src/modules/search/components/search-bar/index.tsx` (client): input + `MagnifyingGlass` icon (`@medusajs/icons`), Enter → `router.replace(/<cc>/search?q=…)`, hidden when `NEXT_PUBLIC_MEILISEARCH_ENABLED=false`.
- [ ] 4. Search results page: `overlay/storefront/src/app/[countryCode]/(main)/search/page.tsx`: reads `q`+`page`, calls `searchProducts`, renders existing `ProductPreview` grid, `SkeletonProductGrid` fallback, empty state.
- [ ] 5. `deploy/storefront/Dockerfile` builder: add `COPY overlay/storefront/src/ ./src/` after `COPY apps/storefront/ ./`.
- [ ] 6. `scripts/check-overlay.sh`: add `check overlay/storefront/src apps/storefront/src` (additive only).
- [ ] 7. `env/storefront.env.example`: add `NEXT_PUBLIC_MEILISEARCH_ENABLED=true` to build args + runtime env.
- [ ] 8. `README.md`: add `overlay/storefront/**` to storefront Watch Paths; minor "3.6 Storefront search" note; fix §5 ("not wired up yet" → live).
- [ ] 9. `add-meilisearch.md`: check off step 22.
- [ ] 10. Guardrails: `./scripts/check-overlay.sh` exits 0; `git status --porcelain apps/` empty.
- [ ] 11. Smoke test (docker compose, seeded): `/<cc>/search?q=…` renders; Enter navigates/paginates; empty→graceful; `=false` builds & boots fine.

## Files touched (all ours; none under `apps/`)

| File | Action | Additive |
|------|--------|----------|
| `overlay/storefront/src/lib/data/search.ts` | new | yes |
| `overlay/storefront/src/modules/search/components/search-bar/index.tsx` | new | yes |
| `overlay/storefront/src/app/[countryCode]/(main)/search/page.tsx` | new | yes |
| `overlay/backend/src/api/store/products/search/route.ts` | extend | yes (route is ours) |
| `overlay/backend/src/modules/meilisearch/service.ts` | extend | yes |
| `deploy/storefront/Dockerfile` | add COPY overlay/storefront/src/ ./src/ | yes |
| `scripts/check-overlay.sh` | add storefront branch | yes |
| `env/storefront.env.example` | add env (build+runtime) | yes |
| `README.md` | watch path + 3.6 + §5 fix | yes |
| `add-meilisearch.md` | check step 22 | yes |
