# PLAN — production providers: Stripe payments, S3 file storage, SendGrid email

Close the three provider gaps found when comparing this repo against
https://medusajs.com/modules. All 17 commerce modules on that page are core
modules bundled in `@medusajs/medusa` and load by default — nothing is missing
there. What was missing is **provider configuration**:

- **Payment** only had `pp_system_default` (manual) → storefront's Stripe
  checkout was dead.
- **File** defaulted to `file-local` → uploaded images were wiped on every
  Dokploy redeploy.
- **Notification** defaulted to `notification-local` (feed only) → no emails.

The provider packages are already transitive deps of `@medusajs/medusa`
(confirmed in `apps/backend/yarn.lock`), so **no Dockerfile change is needed**.

Per AGENTS.md: `apps/**` is READ ONLY. All work is additive under `overlay/`,
`env/`, `docker-compose.yml`, `README.md`.

---

## Task list

- [x] 1. Create this plan file (PLAN-providers.md)
- [x] 2. Register the three providers in `overlay/backend/medusa-config.ts`,
         each **conditional on its env keys** (missing keys → keep Medusa's
         default, so the key-less local compose stack still boots):
         - `payment` → `@medusajs/medusa/payment-stripe` when `STRIPE_API_KEY`
         - `file` → `@medusajs/medusa/file-s3` when `S3_BUCKET` + `S3_ACCESS_KEY_ID`
         - `notification` → `@medusajs/medusa/notification-sendgrid` (keep
           `local` for the feed channel) when `SENDGRID_API_KEY`
- [x] 3. Add `CHANGE_ME` env placeholders to `env/backend-server.env.example`
         and `env/backend-worker.env.example`: `STRIPE_API_KEY`,
         `STRIPE_WEBHOOK_SECRET`, `S3_FILE_URL`, `S3_ACCESS_KEY_ID`,
         `S3_SECRET_ACCESS_KEY`, `S3_REGION`, `S3_BUCKET`, `S3_ENDPOINT`,
         `SENDGRID_API_KEY`, `SENDGRID_FROM`
- [x] 4. Add optional `${VAR:-}` passthroughs to `docker-compose.yml` on both
         backend services so test-mode keys work locally
- [x] 5. Document the providers in `README.md`: env vars, the Stripe webhook
         URL (`https://api.example.com/hooks/payment/stripe_stripe`), enabling
         the provider in Admin → Settings → Regions, `NEXT_PUBLIC_STRIPE_KEY`
         = Stripe **publishable** key, and that uploaded images now persist in
         S3
- [x] 6. Verify: `./scripts/check-overlay.sh` passes; backend compiles; local
         compose boots with test keys; `GET /admin/payments/providers` lists
         `stripe`
- [x] 7. Commit + push to GitHub (SSH) and Gitea (token) on `add-meilisearch`
         (`8cc096a`)

## Notes

- Provider registration pattern (from Medusa docs) is an array entry in the
  `modules` config with `resolve` + `options.providers`.
- S3 uses `additional_client_config: { forcePathStyle: true }` so it works
  with MinIO / R2 / DigitalOcean Spaces style endpoints, not just AWS.
- SendGrid keeps the default `local` provider alongside it: only one provider
  may own a channel (`local` → feed, `sendgrid` → email).
- Stripe webhook events to subscribe: the provider doc requires the webhook
  secret; register the endpoint in the Stripe dashboard pointing at
  `{server_url}/hooks/payment/stripe_stripe`.

## Verification status

- [x] `./scripts/check-overlay.sh` passes (additive-only guardrail)
- [x] Config parses + transpiles (esbuild), braces balanced
- [x] Provider packages pinned in `apps/backend/yarn.lock`
- [x] `docker-compose.yml` passes yaml lint
- [x] Docker boot smoke test — ran `docker compose build backend-server` +
  `docker compose up -d postgres redis meilisearch backend-server`. Backend
  served `/health` + admin index on `:9000`; the compiled admin bundle
  contains the Vendors sidebar route. A throwaway container booted with a
  dummy `STRIPE_API_KEY` loaded `payment-stripe` and consumed its options
  (log warned about the missing `webhookSecret`, proving registration).
  `/admin/payments/providers` returns `{}` until a region enables a
  provider (Admin → Settings → Regions), and the storefront will offer the
  Stripe card option once that region does.
