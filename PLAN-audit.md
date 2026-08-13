# PLAN — Repo audit: fixes after review against Medusa skills

Audit of the whole repo against the `medusa` skill + `building-with-medusa`
rules (workflows for mutations, validation in steps, Zod v4, additive-only
overlay, build-time vs runtime env vars). Full audit notes are below; only the
actionable fixes are tracked here.

Per AGENTS.md: `apps/**` is READ ONLY. All work is additive under `overlay/`,
plus deploy/env/scripts/docs.

---

## Task list

- [x] 1. Audit repo layout, overlay additive-only rule, `apps/` pristine
- [x] 2. Audit medusa-config.ts, modules, env vars vs upstream
- [x] 3. Audit marketplace module, links, workflows, API routes, admin UI,
         storefront overlay, deploy/env/scripts
- [x] 4. Compare against official marketplace recipe + Medusa docs
- [x] 5. Fix: `delete-vendor-admin` workflow must tolerate admin-created
         vendor admins (no auth identity) — use `when()` so the auth-metadata
         cleanup step only runs when an identity exists; never throw NOT_FOUND
         for a missing identity (deleting should still succeed)
- [x] 6. Fix: vendor-scope `DELETE /vendors/admins/:id` — only allow deleting
         an admin belonging to the authenticated vendor's own vendor
- [x] 7. Fix: `PostStoreProductSearchSchema` to `z.strictObject` (Zod v4)
- [x] 8. Docs: mark PLAN-admin-ui.md task 4 done; README notes storefront
         uses standard `/store/carts/:id/complete` (not the split endpoint)
- [x] 9. Fix: `create-vendor` step must generate `handle` from `name` when not
         provided — `Vendor.handle` is required (unique), so create without a
         handle 500s (found via smoke test)
- [x] 10. Verify: `./scripts/check-overlay.sh` passes; `git status --porcelain
          apps/` empty
- [x] 11. Build backend image; boot stack; smoke test:
          - admin creates a vendor without a handle → 200, handle auto-derived
          - admin deletes a vendor admin created via `/admin/vendors/admins`
            (no auth identity) → 200, row gone
          - vendor deletes its OWN admin → 200; auth metadata cleared
          - vendor tries to delete ANOTHER vendor's admin → rejected, no delete
          - store product search still works + rejects unknown fields
- [x] 12. Mark this plan complete, commit + push to GitHub (SSH) and Gitea
          (token) on `add-meilisearch`

---

## Audit notes (findings)

### Verified correct

- Overlay additive-only: `check-overlay.sh` passes, zero non-merge commits
  ever touched `apps/`, `git status --porcelain apps/` empty.
- `medusa-config.ts` is a superset of upstream: conditional providers (Stripe
  / S3 / SendGrid register only when their keys are set), Redis infra modules
  (caching-redis, event-bus-redis, workflow-engine-redis, locking-redis), the
  Marketplace module, and the Meilisearch module. Build-time vs runtime env
  vars handled per README table (MEDUSA_BACKEND_URL baked into admin bundle,
  DATABASE_URL/REDIS_URL runtime only).
- Marketplace module: Vendor + VendorAdmin models, service, module def, two
  migrations + snapshot — correct.
- Links: vendor↔product and vendor↔order, order matches `defineLink`.
- Workflows: create-vendor (auth linking via `setAuthAppMetadataStep`),
  create-admin-vendor, add-vendor-admin, update-vendor (validation in step),
  delete-vendor-admin, create-vendor-product (sales channel + shipping profile
  + inventory levels), create-vendor-orders (lock, `when` for single-vendor
  skip, per-vendor child orders), meilisearch sync/delete — all use
  `transform` where needed, compensations present.
- API routes: GET/POST/DELETE only, Zod v4 (`z.email`, `z.strictObject`),
  `validateAndTransformBody`, `AuthenticatedMedusaRequest` + exported schema
  types, `validateAndTransformQuery` for list endpoints.
- Admin UI: Vendors page + detail (tabs, create/edit/admins), Vendor Admins
  page, widgets on product.details and order.details, Settings→Meilisearch.
- Storefront overlay: /search page + search bar/results + `searchProducts`
  server action; overlay imports (`pagination`, `product-preview`,
  `skeleton-product-grid`, `@lib/data/regions`, `cookies`) all exist upstream.
- deploy/: backend (one image, two services, admin build arg), storefront
  (build-time + runtime env baked), meilisearch; entrypoint (server migrates,
  worker waits); env/*.env.example; scripts; docker-compose — consistent.

### Issues found

1. **delete-vendor-admin NOT_FOUND break** — `delete-vendor-admin/index.ts`
   queries `auth_identity` for `app_metadata.vendor_id = adminId` and throws
   NOT_FOUND when absent. Vendor admins created by an ADMIN (via
   `POST /admin/vendors` or `POST /admin/vendors/admins`) never get an auth
   identity (only self-registered vendors do, via `setAuthAppMetadataStep`).
   Deleting them then fails: compensation re-creates the row, so the Admin UI
   delete appears to silently do nothing.
2. **Vendor-scope missing on `DELETE /vendors/admins/:id`** — route deletes
   any vendor admin by id. Any authenticated vendor admin can delete another
   vendor's admin. Should be limited to the caller's own vendor.
3. **Zod v4**: `PostStoreProductSearchSchema` uses `z.object` (no strict
   modifier). Skill prefers `z.strictObject` for consistency.
4. **Docs drift**: PLAN-admin-ui.md task 4 (`Vendor Admins page`) is
   implemented but unchecked. README doesn't say the stock storefront still
   completes carts with the standard `/store/carts/:id/complete` endpoint, so
   the split-order route only fires for custom storefront integrations.
5. **Vendor.handle required but never generated** — `Vendor.handle` is
   `model.text().unique()` (non-nullable), yet both `create-vendor` and
   `create-admin-vendor` treat it as optional and never derive it. Creating a
   vendor without a handle failed with a MikroORM validation error (found via
   smoke test). Fixed in `create-vendor` step: derive a slug from `name` when
   absent.
