# Fixing Plan: Storefront Production Issues

Working plan for the storefront at `https://shop.nokor24.com`. Each step is
marked `[x]` once the fix is committed, pushed to both `origin` (GitHub) and
`gitea`, and Dokploy has redeployed.

## Step 1 — Fix HTTP 500 on all SSR pages (nav server-function-during-render)

**Status: [x] DONE — commit `8406beb`, pushed**

**Symptom:** `/us`, `/us/store`, `/us/search`, `/us/account` all return HTTP
500 with the Next.js error shell (`<html id="__next_error__">`) even though
the RSC/flight payload renders fully.

**Root cause:** `overlay/storefront/src/modules/layout/templates/nav/nav-ui.tsx`
is a `"use client"` component but rendered `CartButton`, an async **server**
component that calls `retrieveCart()` (a Server Function) in its render body.
During FIZZ/HTML rendering the client tree executes, throwing
`Server Functions cannot be called during initial render` on every page. RSC
succeeded because client components are only serialized, never executed.

**Fix:**
- `nav/index.tsx` (server): fetch `retrieveCart()` and pass `cart` down.
- `nav-ui.tsx` (client): render `CartDropdown cart={cart}` directly, drop the
  server `CartButton` import.
- Deleted now-unused `overlay/storefront/.../cart-button/index.tsx`.

## Step 2 — Verify all four pages return 200 after redeploy

**Status: [x] DONE — verified live 2026-08-18**

After Dokploy redeployed, fresh cookie-jar smoke test:

| Page | Status | Result |
|------|--------|--------|
| `/us` | 200 | Hero, CategoryGrid, OurPromise, Testimonials render; no error shell |
| `/us/store` | 200 | product grid present |
| `/us/search?q=mattress` | 200 | search bar + empty-results state |
| `/us/account` | 200 | login form (logged out) |

First request still 307 + `_medusa_cache_id` cookie, second request 200.

## Step 3 — ProductHighlights section missing on home

**Status: [ ] pending**

**Symptom:** "Perfect sleep, two ways" section absent from `/us`; no
`pcol_*` collection IDs in the flight payload. CategoryGrid, OurPromise,
Testimonials render fine.

**Observation:** `product-highlights/index.tsx` returns `null` when
`listCollections` is empty or `getRegion("us")` is null. The backend seed
(`apps/backend/src/scripts/seed.ts`) creates no collections, so this is a
data gap — decide whether to seed collections in the backend admin or make
the section fall back gracefully to another data source.

## Step 4 — Confirm account page `E{...404}` marker is expected

**Status: [x] verified — no fix needed**

The `@dashboard` parallel slot calls `notFound()` when logged out; the layout
renders `{customer ? dashboard : login}`. The `E{"digest":...404}` marker is
normal upstream behavior. Home/store/search have no error markers yet still
500'd, proving the shared FIZZ error in Step 1 was the 500 cause.