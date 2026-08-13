# PLAN — Providers review: Payments, File storage, Notifications/email, Auth

Read-only audit of Payments, File storage, Notifications/email, Auth and their
env wiring in the Medusa 2.18 image, plus the overlay, `env/`, `deploy/` and
README claims. Fixes limited to repo-owned files (`overlay/backend/**`, `env/`,
`README.md`, `docker-compose.yml`); `apps/**` and vendored skills stay pristine.

## Task list

- [x] 1. Audit medusa-config.ts provider registration (Stripe, S3, SendGrid,
         Redis modules) + env guards
- [x] 2. Audit Payments: parent vs child order payment handling in
         `create-vendor-orders`, Stripe webhook path, capture behaviour
- [x] 3. Audit File storage: S3 provider options, region/file_url handling,
         actual usage
- [x] 4. Audit Notifications: which core subscriber exists, which events it
         handles, SendGrid provider requirements, child-order email behaviour
- [x] 5. Audit Auth: vendor/admin actor types, auth identity lifecycle,
         CORS, JWT/COOKIE secrets
- [x] 6. Audit env wiring: STRIPE/S3/SENDGRID keys in env examples, compose,
         Dockerfiles, README
- [ ] 7. Fix: add overlay subscriber `order-notifications.ts` for
         `order.placed` + `shipment.created` → SendGrid email (the README
         "order/fulfillment emails" claim is currently unrealized: the only
         core notification subscriber handles `order.created` with a stub
         template and a `to` that resolves to undefined)
- [x] 8. Fix: S3 `region` default (`us-east-1`) in medusa-config so the AWS
         SDK never gets `undefined` region when keys are set but region is not
- [x] 9. Fix: fail fast on missing `JWT_SECRET`/`COOKIE_SECRET` in production
         via entrypoint.sh guard (Auth hardening); config keeps dev fallback
- [x] 10. Docs: correct README SendGrid section + env example comment to
          reflect real email flow (content-based email, no template required)
- [x] 11. Verify: `check-overlay.sh` passes; `apps/` clean; build OK; boot
          health 200; smoke-tested query paths (order, order_fulfillment link)
          + createNotifications reached SendGrid (401 with fake key proves
          wiring). Entrypoint guard fails fast without secrets.
- [ ] 12. Mark plan complete; commit + push GitHub (SSH) + Gitea (token) on
          `add-meilisearch`

## Findings

### Payments — PASS with notes
- Parent order: `completeCartWorkflow` (in `create-vendor-orders/index.ts`)
  validates the payment session, creates the order, links the payment
  collection, authorizes the session, and emits `order.placed`. Parent checkout
  is fully wired (verified in `complete-cart.js` dist).
- Child vendor orders (`steps/create-vendor-orders.ts` via `createOrderWorkflow`):
  NO payment collection/session/capture — this is the official marketplace
  recipe's design (payment stays on the parent; child orders are for vendor
  attribution). Not a bug; documented behaviour.
- Stripe webhook path `https://api.example.com/hooks/payment/stripe_stripe`
  (README:260) matches the provider's `pp_` route prefix — correct.
- Stripe capture is manual by default (no `capture: true`); admin captures in
  Admin. Fine.
- Storefront uses standard `/store/carts/:id/complete` (not `/complete-vendor`)
  — already documented in README; split-order fires only for a custom
  storefront integration.

### File storage — minor RISK (fixed)
- S3 provider options match the `@medusajs/file-s3` schema (access_key_id,
  secret_access_key, region, bucket, file_url, endpoint, forcePathStyle).
- `s3Configured` guards on BUCKET + access/secret keys but not `S3_REGION`;
  `region: process.env.S3_REGION` can be `undefined`, which the AWS SDK
  rejects at runtime. Env example defaults `S3_REGION=us-east-1`, but the
  config should default it too (repo-owned file).
- `S3_FILE_URL` blank → provider builds `undefined/<key>` public URLs. Documented
  as optional in README; left as-is (presigned use-case), noted in README.
- No repo code calls the file module directly — Admin product-image uploads are
  the consumer.

### Notifications/email — BUG (fixed)
- Verified in the image: the ONLY core notification subscriber is
  `@medusajs/medusa/dist/subscribers/configurable-notifications.js`, which
  subscribes to **`order.created` only**, with template `order-created-template`
  and `to: "order.email"`. But the `order.created` payload is `{ id }` — so
  `to` resolves to `undefined` and the SendGrid send fails / is a stub.
- `order.placed` (emitted by complete-cart) and `shipment.created` have **no
  subscriber at all** → no customer order-confirmation or fulfillment emails.
  The README + env-example claim "order/fulfillment emails" is unrealized.
- Child orders created via `createOrderWorkflow` also emit `order.created`
  (order module `@EmitEvents`), so the stub would fire N+1 times if wired.
- Fix: repo-owned overlay subscriber `order-notifications.ts` subscribing to
  `order.placed` and `shipment.created`, resolving the order's email, sending a
  content-based (subject + html) email through the notification module's
  `email` channel. No SendGrid template required (provider falls back to
  `content`). No-op when `SENDGRID_API_KEY` is not set.

### Auth — PASS with RISK (fixed)
- Vendor is a custom actor type; `/auth/vendor/*` used by vendor routes;
  `allowUnregistered` on `POST /vendors`; auth identity linked via
  `setAuthAppMetadataStep` in `create-vendor`. Admin-created vendor admins
  have no auth identity (can't log in as vendor) — documented behaviour.
- One auth identity cannot own two vendor admins (`setAuthAppMetadataStep`
  throws on an existing `vendor_id` key). A brand-new email → new identity →
  second vendor is allowed (no per-person guard) — by design, noted.
- CORS vars (`STORE_CORS`/`ADMIN_CORS`/`AUTH_CORS`) present in config + env
  examples. OK.
- RISK: `JWT_SECRET`/`COOKIE_SECRET` fall back to `"supersecret"` in
  medusa-config.ts:177-178 when env missing. In production that silently ships
  predictable auth secrets. Fixed to fail fast in production (dev fallback kept).

### env wiring — PASS
- All STRIPE/S3/SENDGRID keys present and correctly named in
  `env/backend-server.env.example`, `env/backend-worker.env.example`,
  `docker-compose.yml`, both Dockerfiles, and README. Provider option names
  match what each provider expects (`api_key`/`from` for SendGrid, `apiKey`/
  `webhookSecret` for Stripe, `file_url`/`access_key_id`/etc. for S3).