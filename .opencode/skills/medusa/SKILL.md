---
name: medusa
description: Use when working on this Medusa 2 multi-vendor marketplace repo — adding vendor/marketplace features, editing medusa-config, Dockerfiles, entrypoints, env vars, or debugging Dokploy deploys. Covers the overlay architecture that keeps apps/backend and apps/storefront byte-identical to upstream, and the build-time vs runtime env var rules. Read BEFORE editing anything under apps/, overlay/, or deploy/.
---

# Medusa 2 Multi-Vendor Marketplace (Dokploy)

Deployment repo for a multi-vendor Medusa 2 store running on Dokploy as six
separate container services.

## Repository layout

```
medusa/
├── apps/                          # OFFICIAL CODE — never edit
│   ├── backend/                   #   medusa-starter-default @ master
│   └── storefront/                #   nextjs-starter-medusa @ main
├── overlay/backend/               # ours, merged in at Docker build time
│   ├── medusa-config.ts           #   replaces the upstream file, in-image only
│   └── src/                       #   marketplace recipe (additive paths only)
├── deploy/
│   ├── backend/Dockerfile         #   one image, two services
│   ├── backend/entrypoint.sh      #   migrate-then-start / worker-wait
│   ├── meilisearch/Dockerfile     #   standalone Meilisearch search engine
│   └── storefront/Dockerfile
├── overlay/storefront/            # our storefront code (additive paths only)
├── env/                           # .env.example per Dokploy service
├── scripts/                       # bootstrap / update-upstream / check-overlay
├── .opencode/skills/              # agent skills (this file)
├── docker-compose.yml             # optional single-service alternative
└── AGENTS.md                      # project rules
```

## The one rule that governs everything

`apps/` holds the **official Medusa repositories**, vendored with
`git subtree`. They must stay byte-identical to upstream so
`./scripts/update-upstream.sh` never conflicts.

| Path | Rule |
|------|------|
| `apps/backend/**` | READ ONLY — medusa-starter-default @ master |
| `apps/storefront/**` | READ ONLY — nextjs-starter-medusa @ main |
| `overlay/backend/**` | ours — edit freely |
| `deploy/**` | Dockerfiles, entrypoints — edit freely |
| `scripts/`, `env/`, `docker-compose.yml`, `README.md` | ours |

**Never edit a file under `apps/`.** Not to fix a bug, not to add a feature,
not to tweak config. If upstream behaviour must change, add an overlay file.

### How the overlay wins without mutating the repo

`deploy/backend/Dockerfile` layers the image in this order:

```dockerfile
COPY apps/backend/ ./                        # line 28: upstream, untouched
COPY overlay/backend/src/ ./src/             # line 32: our additive code
COPY overlay/backend/medusa-config.ts ./     # line 36: the one replacement
```

Upstream lands first, our files overwrite **inside the image only**. The repo
on disk keeps official code pristine.

`overlay/backend/medusa-config.ts` is the single intentional replacement of an
upstream file. Everything else in the overlay sits on paths that do not exist
upstream.

### Adding backend functionality

Put the file under `overlay/backend/src/` on a path that does NOT exist in
`apps/backend/src/`, then verify:

```bash
./scripts/check-overlay.sh   # exits non-zero if an overlay file shadows upstream
```

Existing overlay paths (the official marketplace recipe + meilisearch):

```
overlay/backend/src/
├── api/vendors/…                 /vendors, /vendors/products, /vendors/products/:id,
│                                /vendors/orders, /vendors/orders/:id/fulfill,
│                                /vendors/orders/:id/ship, /vendors/me,
│                                /vendors/admins, /vendors/admins/:id
├── api/admin/…                   /admin/vendors, /admin/vendors/admins,
│                                /admin/products/:id/vendor,
│                                /admin/orders/:id/vendor,
│                                /admin/meilisearch/sync
├── api/store/…                   /store/carts/[id]/complete-vendor,
│                                /store/products/search
├── api/middlewares.ts            vendor actor-type auth + validation
├── links/                        vendor↔product, vendor↔order
├── modules/marketplace/          Vendor + VendorAdmin models, migrations
├── modules/meilisearch/          self-hosted Meilisearch search module
├── subscribers/                  product sync/delete → Meilisearch
├── workflows/marketplace/        create-vendor, create-admin-vendor,
│                                add-vendor-admin, update-vendor,
│                                delete-vendor-admin, create-vendor-product,
│                                update-vendor-product, delete-vendor-product,
│                                create-vendor-orders (split-order),
│                                create-vendor-fulfillment, create-vendor-shipment
├── workflows/meilisearch/        reindex / delete-index-documents
└── admin/                        Admin UI: vendors pages, widgets,
                                 vendor-admins, settings/meilisearch
overlay/storefront/src/           /search page + search bar/results (Meilisearch);
                                 /vendor portal (login, dashboard: overview,
                                 products, orders, settings) — payment-button
                                 override + place-vendor-order.ts complete cart
                                 via /complete-vendor with /complete fallback
```

Vendor admins are a **custom actor type** (`"vendor"`), authenticated via
`/auth/vendor/emailpass`. See `overlay/backend/src/api/middlewares.ts`.

## Medusa building blocks

All patterns below are verified against the code in `overlay/backend/src/`.

### Data model

```ts
// overlay/backend/src/modules/<mod>/models/thing.ts
import { model } from "@medusajs/framework/utils"

const Thing = model.define("thing", {
  id: model.id().primaryKey(),
  handle: model.text().unique(),
  name: model.text(),
  logo: model.text().nullable(),
  admins: model.hasMany(() => Admin, { mappedBy: "thing" }),
})
export default Thing
```

Relations: `hasMany` / `belongsTo` / `hasOne` / `manyToMany`. The string passed
to `define` is the table name.

### Service

```ts
import { MedusaService } from "@medusajs/framework/utils"

class MyModuleService extends MedusaService({ Thing }) {}
export default MyModuleService
```

`MedusaService` generates CRUD automatically. A model named `Vendor` yields
`createVendors`, `listVendors`, `retrieveVendor`, `updateVendors`,
`deleteVendors` — note the **plural** on create/update/delete.

### Module definition

```ts
import { Module } from "@medusajs/framework/utils"

export const MY_MODULE = "my_module"
export default Module(MY_MODULE, { service: MyModuleService })
```

Register it in `overlay/backend/medusa-config.ts` under `modules`, never in
`apps/backend/medusa-config.ts`.

### Module links

Modules are isolated; never import another module's models. Link them:

```ts
// overlay/backend/src/links/thing-product.ts
import { defineLink } from "@medusajs/framework/utils"
import MyModule from "../modules/my-module"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
  MyModule.linkable.thing,
  { linkable: ProductModule.linkable.product.id, isList: true }
)
```

### Workflows and steps

Business logic goes in workflows, not directly in API routes.

```ts
const createThingStep = createStep(
  "create-thing",
  async (input: Input, { container }) => {
    const service = container.resolve(MY_MODULE)
    const thing = await service.createThings(input)
    return new StepResponse(thing, thing.id)   // 2nd arg → compensation
  },
  async (thingId, { container }) => {          // rollback on failure
    if (!thingId) return
    await container.resolve(MY_MODULE).deleteThings(thingId)
  }
)
```

Rules that bite:
- Never manipulate variables directly in a workflow body — use `transform`.
- Every step that writes should have a compensation function.
- Reuse a step in one workflow via `.config({ name: "unique-name" })`.

### API routes

```ts
// overlay/backend/src/api/things/route.ts  →  /things
export const POST = async (
  req: AuthenticatedMedusaRequest<Body>,
  res: MedusaResponse
) => {
  const { result } = await createThingWorkflow(req.scope).run({
    input: req.validatedBody,
  })
  res.json({ thing: result })
}
```

Validate with zod imported from **`@medusajs/framework/zod`** (required since
v2.13.0), wired up in `overlay/backend/src/api/middlewares.ts` via
`validateAndTransformBody`.

### Migrations

After changing a data model:

```bash
npx medusa db:generate <module-name>   # writes to the module's migrations/
npx medusa db:migrate                  # applies + syncs links
```

Commit the generated migration. In production the entrypoint runs
`db:migrate` automatically on the **server** instance only.

## Build-time vs runtime environment variables

This distinction has caused two separate production outages in this project.
Get it right.

| Variable | Build arg | Runtime env | Why |
|---|---|---|---|
| `NEXT_PUBLIC_*` | ✅ required | ✅ required | Inlined into the client bundle at build, AND re-checked at boot by `next.config.js` |
| `MEDUSA_BACKEND_URL` (storefront) | public domain | internal name OK | Build container is NOT on the app network |
| `MEDUSA_BACKEND_URL` (backend) | ✅ required | ✅ | Compiled into the Admin bundle |
| `DISABLE_MEDUSA_ADMIN` | ✅ | ✅ | Controls whether the admin bundle is built |
| `DATABASE_URL`, `REDIS_URL`, secrets | ❌ never | ✅ | Secrets must not be baked into images |

Two failures already seen, both from this table:

- **502 Bad Gateway** — `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` was a build arg
  only. `next.config.js` calls `checkEnvVariables()` at module load, and
  `next start` loads that file too, so the process exited on boot.
- **Build DNS failure** — using the internal service hostname as the
  storefront's build-time `MEDUSA_BACKEND_URL`. Build containers cannot
  resolve Docker network names.

## Dokploy topology

Six separate services, one project:

| Service | Type | Dockerfile | Port | Domain |
|---|---|---|---|---|
| `medusa-postgres` | Database | — | 5432 | none |
| `medusa-redis` | Database | — | 6379 | none |
| `medusa-meilisearch` | Application | `deploy/meilisearch/Dockerfile` | 7700 | none |
| `medusa-backend-server` | Application | `deploy/backend/Dockerfile` | 9000 | api.* |
| `medusa-backend-worker` | Application | same, `DISABLE_MEDUSA_ADMIN=true` | — | **none** |
| `medusa-storefront` | Application | `deploy/storefront/Dockerfile` | 8000 | shop.* |

Deploy order: **databases → meilisearch → backend-server → backend-worker →
storefront.** The storefront build calls the live backend via
`generateStaticParams`, so it needs a valid publishable key and at least one
region to already exist.

Server vs worker is a Medusa production requirement: the server answers API
requests and serves the Admin; the worker runs scheduled jobs, subscribers and
workflows. Only the server runs migrations — the worker sleeps
`WORKER_START_DELAY` first so the two never race on the schema.

### Networking

Services resolve each other by their Docker Swarm service name on the shared
network. For an Application that name is its **App Name** — set at creation in
the "Add Application" dialog as `<project-slug>-<service-name>` and shown as the
small muted line under the display name at the top of the app page (it is NOT a
field in the General tab). For a Database it is the host of the **Internal
Connection URL** on the database page.

```
http://medusa-multi-store-medusameilisearch:7700
```

Copy the real value from the UI as above. Never `localhost`, never a host IP.
Internal traffic is plain `http` — TLS terminates at Traefik.

## Vendor API surface

Added by the overlay. Vendor admins are a custom actor type, so they use
`/auth/vendor/*`, not the admin or customer auth routes.

Vendor-authenticated (`/vendors*`):

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/vendors` | Create vendor + first admin |
| `GET` `POST` | `/vendors/products` | List / create that vendor's products |
| `POST` `DELETE` | `/vendors/products/:id` | Update / delete that vendor's product (ownership-guarded) |
| `GET` | `/vendors/orders` | That vendor's split orders (incl. fulfillments) |
| `POST` | `/vendors/orders/:id/fulfill` | Fulfill that vendor's order |
| `POST` | `/vendors/orders/:id/ship` | Ship a fulfillment of that vendor's order |
| `GET` `POST` | `/vendors/me` | That vendor's profile (+ stats) / update own profile |
| `POST` | `/vendors/admins` | Invite an admin to that vendor |
| `DELETE` | `/vendors/admins/:id` | Remove one of that vendor's admins |
| `POST` | `/store/carts/:id/complete-vendor` | Checkout, splitting one cart into per-vendor orders |

Admin-authenticated (`/admin*`):

| Method | Route | Purpose |
|---|---|---|
| `GET` `POST` | `/admin/vendors` | List / create vendors (admin-scoped) |
| `POST` | `/admin/vendors/:id` | Update a vendor |
| `GET` `POST` | `/admin/vendors/admins` | List / add vendor admins |
| `DELETE` | `/admin/vendors/admins/:id` | Remove a vendor admin |
| `GET` | `/admin/products/:id/vendor` | Vendor linked to a product |
| `GET` | `/admin/orders/:id/vendor` | Vendor linked to an order |
| `POST` | `/admin/meilisearch/sync` | Full Meilisearch reindex |

Store (publishable key):

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/store/products/search` | Meilisearch product search |
| `POST` | `/store/carts/:id/complete-vendor` | Checkout, splitting per vendor |

Vendor auth (`/auth/vendor/emailpass*`) is the custom actor type's auth; the
full route list also lives in `README.md`.

Three-step vendor onboarding:

```bash
# 1. registration token (no account yet)
curl -X POST https://<api>/auth/vendor/emailpass/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"v@example.com","password":"secret"}'

# 2. create the vendor, passing that token
curl -X POST https://<api>/vendors \
  -H "Authorization: Bearer <token>" -H 'Content-Type: application/json' \
  -d '{"name":"Acme","handle":"acme","admin":{"email":"v@example.com"}}'

# 3. real auth token for subsequent calls
curl -X POST https://<api>/auth/vendor/emailpass \
  -H 'Content-Type: application/json' \
  -d '{"email":"v@example.com","password":"secret"}'
```

No trailing slash on these URLs — it bypasses the route middleware.

Order splitting: `POST /store/carts/:id/complete-vendor` groups cart items by
each product's linked vendor, creates the parent order, then one child order
per vendor. Single-vendor carts skip the child orders and link the parent
directly.

## Local development

```bash
./scripts/bootstrap.sh                 # first time: pull upstream into apps/
cd apps/backend && yarn install
cp .env.template .env                  # set DATABASE_URL, REDIS_URL
```

`apps/backend/.env` is gitignored, so this does not dirty the subtree.

To run the marketplace code locally, the overlay must be present in
`apps/backend/src/`. Since that directory is read-only, either work through
Docker (`docker compose up --build`), or copy the overlay in temporarily and
delete it before committing:

```bash
cp -r overlay/backend/src/* apps/backend/src/     # temporary only
git status --porcelain apps/                      # MUST be empty before commit
```

Prefer Docker. Accidentally committing the overlay into `apps/` breaks
`update-upstream.sh` forever.

## Debugging checklist

Before assuming a code bug, check these in order:

1. **502 Bad Gateway** → container exited on boot. Check runtime env vars,
   especially `NEXT_PUBLIC_*`.
2. **500 on every storefront route** → `apps/storefront/src/middleware.ts`
   runs on all requests and fetches `/store/regions`. Almost always: no
   regions exist, or
   `NEXT_PUBLIC_DEFAULT_REGION` doesn't match any seeded country.
3. **400 from `/store/*`** → missing or invalid `x-publishable-api-key`, or the
   key has no sales channel attached.
4. **npm `E429` during build** → registry rate limit from re-downloading an
   already-installed tree. The backend Dockerfile reuses yarn's `node_modules`
   to avoid this.

Useful probes:

```bash
curl -s https://<api-domain>/health                     # expect OK
curl -s -H "x-publishable-api-key: pk_…" \
  https://<api-domain>/store/regions                    # expect non-empty
```

The upstream seed (`apps/backend/src/scripts/seed.ts:66`) creates ONE Europe
region with `["gb","de","dk","se","fr","es","it"]` — **no `us`**. If
`NEXT_PUBLIC_DEFAULT_REGION=us`, add the region in Admin → Settings → Regions
rather than editing the seed file.

## Updating upstream

```bash
./scripts/update-upstream.sh          # both, or: backend | storefront
./scripts/check-overlay.sh            # confirm overlay still additive
git push
```

Then redeploy backend-server, backend-worker and storefront.

These pulls stay conflict-free **only** because nothing under `apps/` is ever
edited locally. Preserve that invariant.

## Conventions

- No code comments unless they explain a non-obvious "why".
- Shell scripts: `set -euo pipefail`, idempotent.
- Never commit secrets; `env/*.env.example` holds placeholders only.
- Official docs: <https://docs.medusajs.com> · marketplace recipe:
  <https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors>

---

## Official Documentation Reference

The full Medusa documentation is vendored **locally** in this skill so agents
have offline, in-context access to the official docs without fetching. Load a
reference file (relative to this `SKILL.md`) when you need authoritative detail
beyond this file's summaries.

### Vendored reference trees

The full Medusa docs (all sections of <https://docs.medusajs.com> except the
OpenAPI reference and user-guide) are vendored as **463 markdown files** under
`reference/`. Path conventions:

- **Learn** — `reference/learn/` mirrors <https://docs.medusajs.com/learn/>.
  One file per page; the path after `reference/learn/` equals the URL path
  after `learn/` (e.g. `reference/learn/fundamentals/workflows.md` ←
  `learn/fundamentals/workflows`). `/learn` landing → `reference/learn/index.md`.
- **Everything under `resources/`** — `reference/` **drops the `resources/`
  prefix**: `resources/infrastructure-modules/…` → `reference/infrastructure-modules/…`,
  `resources/integrations/…` → `reference/integrations/…`, etc. Module-style
  sections use `<section>/index.md` for the landing page and
  `<section>/<topic>.md` for sub-pages.
- **UI** — `reference/ui/` drops `ui/` from the URL.
- **Examples** — `reference/examples/` (drops `resources/examples/`).

Always prefer these local files over fetching docs.medusajs.com. When a link
points to a docs URL, strip the `docs.medusajs.com/` prefix and look for the
corresponding file under `reference/`.

### Learn (Concepts & Guides)

| Section | Local file(s) | Key Topics |
|---------|---------------|------------|
| **Get Started** | `reference/learn/installation.md`, `installation/docker.md`, `build.md`, `update.md`, `start.md` | Install, Docker install, build the application, update Medusa, AI-agent quickstart |
| **Introduction** | `reference/learn/introduction/architecture.md`, `build-with-llms-ai.md`, `from-v1-to-v2.md` | Architecture, Build with AI/LLMs, From v1 to v2 |
| **Fundamentals → Framework** | `reference/learn/fundamentals/framework.md`, `api-routes*.md`, `data-models*.md`, `events-and-subscribers*.md`, `module-links*.md`, `plugins*.md`, `scheduled-jobs*.md`, `workflows*.md`, `custom-cli-scripts*.md` | Framework overview, API routes (params, HTTP methods, responses, validation, middlewares, protected routes, CORS, additional data, errors, overrides, body parsing, localization, custom links), data models (properties, relationships, JSON, indexes, constraints, migrations), events & subscribers, module links, plugins, scheduled jobs, workflows (compensation, hooks, conditions, parallel, nested, errors, locks, long-running, retries, transform, timeout, store executions), custom CLI scripts |
| **Fundamentals → Modules** | `reference/learn/fundamentals/modules*.md` | Modules structure, container, isolation, options, loaders, multiple services, service constraints/factory, DB operations, commerce vs infrastructure modules |
| **Admin Development** | `reference/learn/fundamentals/admin*.md` | Admin overview, widgets, UI routes, routing, environment variables, constraints, tips, translations, injection zones |
| **Customization** | `reference/learn/customization/*.md` | Custom features (module, workflow, API route), extend features (define link, extend create product, query linked), customize admin (route, widget), integrate systems (service, handle event, schedule task), reuse with plugins, next steps |
| **Debugging & Testing** | `reference/learn/debugging-and-testing/*.md` | Testing tools (integration tests, module tests), debug workflows, logging, instrumentation, feature flags |
| **Deployment & Configuration** | `reference/learn/deployment*.md`, `production/worker-mode.md`, `configurations/medusa-config*.md`, `configurations/pnpm.md`, `configurations/ts-aliases.md` | Deployment overview/general, worker mode, medusa config, asymmetric encryption, pnpm, TypeScript aliases |
| **Storefront Development** | `reference/learn/storefront-development.md` | Storefront overview |
| **Best Practices** | `reference/learn/best-practices/third-party-sync.md` | Third-party syncing |
| **Codemods** | `reference/learn/codemods*.md` | Codemods overview, replace imports, replace zod imports |
| **Contributing** | `reference/learn/resources/contribution-guidelines/code.md`, `docs.md`, `admin-translations.md`, `resources/usage.md` | Code contribution, docs guidelines, admin translations, usage info |

### Commerce Modules (Reference & Tools)

Vendored locally under `reference/commerce-modules/`. Read the module's
`index.md` for the overview, then drill into specific topics:

| Module | Local file(s) |
|--------|---------------|
| **Cart** | `reference/commerce-modules/cart/index.md` |
| **Payment** | `reference/commerce-modules/payment/index.md` + `payment-provider/` |
| **Customer** | `reference/commerce-modules/customer/index.md` |
| **Pricing** | `reference/commerce-modules/pricing/index.md` |
| **Promotion** | `reference/commerce-modules/promotion/index.md` |
| **Product** | `reference/commerce-modules/product/index.md` + guides |
| **Order** | `reference/commerce-modules/order/index.md` |
| **Inventory** | `reference/commerce-modules/inventory/index.md` |
| **Fulfillment** | `reference/commerce-modules/fulfillment/index.md` |
| **Stock Location** | `reference/commerce-modules/stock-location/index.md` |
| **Region** | `reference/commerce-modules/region/index.md` |
| **Sales Channel** | `reference/commerce-modules/sales-channel/index.md` |
| **Tax** | `reference/commerce-modules/tax/index.md` |
| **Currency** | `reference/commerce-modules/currency/index.md` |
| **API Keys** | `reference/commerce-modules/api-key/index.md` |
| **User** | `reference/commerce-modules/user/index.md` |
| **Auth** | `reference/commerce-modules/auth/index.md` |

Not vendored: the OpenAPI reference (`/api/admin`, `/api/store`), the
user-guide, and Cloud docs — link out as needed.

### Infrastructure Modules (System)

Vendored under `reference/infrastructure-modules/`. Read `<module>/index.md`
first, then drill into providers/guides:

| Module | Index | Providers & Guides |
|--------|-------|--------------------|
| **Analytics** | `analytics/index.md` | `analytics/local.md`, `analytics/posthog.md` |
| **Cache** (v1, cache module) | `cache/index.md` | `cache/in-memory.md`, `cache/redis.md`, `cache/create.md` |
| **Caching** (v2, new caching module) | `caching/index.md` | `caching/concepts.md`, `caching/providers/redis.md`, `caching/guides/clear-cache.md`, `caching/guides/memcached.md`, `caching/migrate-cache.md` |
| **Event** | `event/index.md` | `event/local.md`, `event/redis.md`, `event/create.md` |
| **File** | `file/index.md` | `file/local.md`, `file/s3.md` |
| **Locking** | `locking/index.md` | `locking/redis.md`, `locking/postgres.md` |
| **Notification** | `notification/index.md` | `notification/local.md`, `notification/sendgrid.md`, `notification/send-notification.md` |
| **Workflow Engine** | `workflow-engine/index.md` | `workflow-engine/in-memory.md`, `workflow-engine/redis.md`, `workflow-engine/how-to-use.md` |

### Recipes (End-to-End Builds)

Vendored under `reference/recipes/`. Each recipe's `index.md` is the plan;
`examples/` and `implement.md` are walkthroughs:

| Recipe | Local file(s) |
|--------|---------------|
| **Marketplace** | `recipes/marketplace/index.md` + `examples/vendors.md`, `examples/restaurant-delivery.md` |
| **B2B** | `recipes/b2b/index.md` |
| **Bundled Products** | `recipes/bundled-products/index.md` + `implement.md` |
| **Commerce Automation** | `recipes/commerce-automation/index.md` + `restock-notification.md` |
| **Digital Products** | `recipes/digital-products/index.md` + `examples/standard.md` |
| **Ecommerce** | `recipes/ecommerce/index.md` |
| **ERP (Odoo)** | `recipes/erp/index.md` + `odoo.md` |
| **Multi-Region Store** | `recipes/multi-region-store/index.md` |
| **Omnichannel** | `recipes/omnichannel/index.md` |
| **Order Management (OMS)** | `recipes/oms/index.md` |
| **Personalized Products** | `recipes/personalized-products/index.md` + `implement.md` |
| **Point of Sale (POS)** | `recipes/pos/index.md` |
| **Subscriptions** | `recipes/subscriptions/index.md` |
| **Ticket Booking** | `recipes/ticket-booking/index.md` + `example.md`, `example/storefront.md` |

### Integrations (Third-Party Providers)

Vendored under `reference/integrations/guides/`:
algolia, avalara, contentful, magento, mailchimp, meilisearch, okta, payload,
paypal, resend, sanity, segment, sentry, shipstation, slack, strapi.

### How-to Tutorials (Standalone Features)

Vendored under `reference/how-to-tutorials/tutorials/`: abandoned-cart,
agentic-commerce, category-images, customer-tiers, first-purchase-discounts,
gift-message, invoice-generator, loyalty-points, phone-auth, preorder,
product-builder, product-feed, product-rentals, product-reviews, re-order,
saved-payment-methods. Plus `how-to-tutorials/how-to/admin/auth.md` (custom
Admin authentication).

### Medusa UI (Component Library)

Vendored under `reference/ui/`. One file per component in `components/`:
alert, avatar, badge, button, calendar, checkbox, code-block, command,
command-bar, container, copy, currency-input, data-table, date-picker, drawer,
dropdown-menu, focus-modal, heading, icon-badge, icon-button, inline-tip,
input, kbd, label, otp-input, progress-accordion, progress-tabs, prompt,
radio-group, select, status-badge, switch, table, tabs, text, textarea, toast,
tooltip. Plus `installation/` (setup), `utils/clx.md` (classname helper).

### Reference & Tooling

| Section | Local files | Notes |
|---------|-------------|-------|
| **Medusa CLI** | `reference/medusa-cli/index.md` + `commands/*.md` | build, codemod, db, develop, exec, lint, new, plugin, start, telemetry, user |
| **JS SDK** | `reference/js-sdk/index.md` + `auth/overview.md` | storefront/frontend SDK |
| **Service Factory** | `reference/service-factory-reference/index.md` + `methods/*.md`, `tips/filtering.md` | generated CRUD methods |
| **Admin Components** | `reference/admin-components/index.md` + `components/*.md`, `layouts/*.md` | reusable admin UI |
| **Next.js Starter** | `reference/nextjs-starter/guides/*.md` | customize-stripe, remove-country-code, revalidate-cache, storefront-returns |
| **Examples** | `reference/examples/index.md` + `guides/*.md` | custom-item-price, quote-management |
| **Plugins** | `reference/plugins/guides/wishlist.md` | build a wishlist plugin |

### Quick Navigation by Task

Local paths are relative to `reference/` unless marked (L=learn).
Read the first file listed, then follow the chain.

| Task | Best Entry Point |
|------|------------------|
| Create a custom module | (L) `learn/fundamentals/modules.md` → `learn/fundamentals/data-models.md` → `learn/fundamentals/modules/service-factory.md` |
| Build a workflow | (L) `learn/fundamentals/workflows.md` → `learn/fundamentals/workflows/compensation-function.md` |
| Add an API route | (L) `learn/fundamentals/api-routes.md` → `learn/fundamentals/api-routes/validation.md` → `learn/fundamentals/api-routes/protected-routes.md` |
| Extend core commerce | (L) `learn/customization/extend-features.md` → `learn/fundamentals/module-links.md` |
| Customize Admin UI | (L) `learn/fundamentals/admin.md` → `learn/fundamentals/admin/widgets.md` → `learn/fundamentals/admin/ui-routes.md` → `admin-components/` → `ui/` |
| Build a storefront | (L) `learn/storefront-development.md` → `js-sdk/index.md` → `nextjs-starter/guides/*.md` |
| Deploy to production | (L) `learn/deployment.md` → `learn/production/worker-mode.md` → `learn/configurations/medusa-config.md` |
| Write tests | (L) `learn/debugging-and-testing/testing-tools.md` → `learn/debugging-and-testing/testing-tools/integration-tests.md` |
| Find commerce module reference | `commerce-modules/<module>/index.md` |
| Find infrastructure module reference | `infrastructure-modules/<module>/index.md` |
| Pick a provider (Redis, S3, SendGrid…) | `infrastructure-modules/` (per module index) |
| Build a full store from a plan | `recipes/<name>/index.md` → `recipes/<name>/examples/*.md` |
| Integrate a third-party service | `integrations/guides/<provider>.md` |
| Build a one-off feature | `how-to-tutorials/tutorials/<name>.md` |
| Use an Admin UI component | `ui/components/<name>.md` |
| Use a generated service method | `service-factory-reference/methods/<method>.md` |
| CLI reference | `medusa-cli/index.md` → `medusa-cli/commands/<command>.md` |
| API route reference (admin/store) | online: <https://docs.medusajs.com/api/admin> / <https://docs.medusajs.com/api/store> |

### Documentation Index

For the complete machine-readable index of all documentation pages (including
sections not vendored here), see:
- **llms.txt**: <https://docs.medusajs.com/llms.txt>
- **llms-full.txt**: <https://docs.medusajs.com/llms-full.txt> (full text of
  every page — the source this reference tree was generated from)

---

## Related skills

The 18 official Medusa skills are vendored alongside this one. Load them for
depth beyond this repo's specifics:

| Task | Skill |
|------|-------|
| Backend modules, workflows, data models | `building-with-medusa` |
| Admin widgets and UI routes | `building-admin-dashboard-customizations` |
| Storefront integration | `building-storefronts` |
| Ecommerce UX patterns | `storefront-best-practices` |
| Learning Medusa from scratch | `learning-medusa` |
| Migrations | `db-generate`, `db-migrate` |
| Admin users | `new-user` |

The `mcloud-*` skills cover Medusa Cloud and do not apply here — this project
self-hosts on Dokploy. See `.opencode/skills/medusa/README.md`.
