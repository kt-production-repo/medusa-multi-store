# PLAN — Medusa Admin UI: widgets, pages, forms, navigation

Close the admin-side gaps found by auditing `overlay/backend/src/admin/`
against the marketplace backend surface:

- No **widgets** exist (`admin/widgets/` is absent) — product and order pages
  have no way back to the owning vendor.
- The `GET /admin/vendors/admins` endpoint is implemented but has **no page**.
- No **create/edit forms** anywhere: can't create a vendor from the Admin, add
  a vendor admin, or edit vendor details.
- No **navigation** from product/order detail pages to the vendor.

Per AGENTS.md: `apps/**` is READ ONLY. All work is additive under `overlay/`,
plus this plan file. The upstream files on disk are never touched.

---

## Task list

- [x] 1. Create this plan file (PLAN-admin-ui.md)
- [x] 2. Backend: `GET /admin/products/:id/vendor` — resolve the vendor linked
         to a product (`vendor-product` link), 404 when unlinked
- [x] 3. Frontend: **product vendor widget** (`admin/widgets/product-vendor.tsx`)
         on `product.details` showing the vendor name + link to `/vendors/:id`
- [x] 4. Frontend: **Vendor Admins page** (`admin/routes/vendor-admins/page.tsx`)
         wiring the existing `GET /admin/vendors/admins`, sidebar entry via
         `defineRouteConfig`
- [x] 5. Backend: `POST /admin/vendors` — admin-scoped create vendor + first
         admin (new `create-admin-vendor` workflow reusing the existing
         `create-vendor` / `create-vendor-admin` steps, without the
         auth-identity linking)
- [x] 6. Frontend: **Create Vendor FocusModal** on the Vendors page header
- [x] 7. Backend: `POST /admin/vendors/admins` — add a vendor admin to an
         existing vendor
- [x] 8. Frontend: **Add Vendor Admin form** (FocusModal) on the vendor detail
         Admins tab
- [x] 9. Backend: `POST /admin/vendors/:id` — update name / handle / logo
- [x] 10. Frontend: **Edit Vendor Drawer** on the vendor detail page
- [x] 11. Backend: `GET /admin/orders/:id/vendor` — resolve the vendor linked
         to a (child) order (`vendor-order` link), 404 when unlinked
- [x] 12. Frontend: **order vendor widget** (`admin/widgets/order-vendor.tsx`)
         on `order.details` showing the vendor + link to `/vendors/:id`
- [x] 13. Register the new POST bodies in `overlay/backend/src/api/middlewares.ts`
- [x] 14. Verify: `./scripts/check-overlay.sh` passes; every changed/added file
         transpiles (esbuild)
- [x] 15. Smoke test: rebuilt backend image, booted stack, logged in, verified:
         - `POST /admin/vendors` creates vendor + admin (200)
         - `POST /admin/vendors/admins` adds an admin (200)
         - `POST /admin/vendors/:id` updates name/logo (200, persisted)
         - `GET /admin/vendors/admins` lists 3 admins
         - `GET /admin/products/:id/vendor` returns the linked vendor (200);
           404 for unlinked products
         - `GET /admin/orders/:id/vendor` 404s cleanly when no orders exist
         - admin bundle contains the Vendor Admins page, Create vendor,
           Add vendor admin, Edit vendor, and both widgets
- [x] 16. Mark this plan complete, commit + push to GitHub (SSH) and Gitea
         (token) on `add-meilisearch`

---

## Notes / design decisions

- **Routes** follow the existing `AuthenticatedMedusaRequest` + `query.graph`
  pattern in `overlay/backend/src/api/admin/`.
- **Admin create-vendor** must NOT reuse `createVendorWorkflow` directly: it
  calls `setAuthAppMetadataStep`, which requires an authenticated vendor auth
  identity. The admin-scoped workflow creates vendor + admin only.
- **Widgets** use `defineWidgetConfig` with the unsuffixed zones
  `product.details` and `order.details` (v2.17.2+: position is user-controlled
  in the dashboard's Editor view, not by `.before`/`.after`).
- **Forms**: FocusModal for create, Drawer for edit (per admin skill rules).
- Widget data fetching is a display query loading on mount (`enabled: !!id`),
  invalidated after mutations where relevant.
- **Price display**: values are stored as-is; never divide by 100.
