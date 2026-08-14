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
├── api/vendors/…                 /vendors, /vendors/products, /vendors/orders,
│                                /vendors/admins/:id
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
│                                create-vendor-orders (split-order)
├── workflows/meilisearch/        reindex / delete-index-documents
└── admin/                        Admin UI: vendors pages, widgets,
                                 vendor-admins, settings/meilisearch
overlay/storefront/src/           /search page + search bar/results (Meilisearch)
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
| `GET` | `/vendors/orders` | That vendor's split orders |
| `DELETE` | `/vendors/admins/:id` | Remove one of that vendor's admins |

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

This section mirrors the structure of the official Medusa documentation at <https://docs.medusajs.com/learn/> and <https://docs.medusajs.com/resources/> (indexed at <https://docs.medusajs.com/llms.txt>).

### Learn (Concepts & Guides)

| Section | Key Topics |
|---------|------------|
| **Get Started** | [Installation](https://docs.medusajs.com/learn/installation), [Docker Install](https://docs.medusajs.com/learn/installation/docker), [Build Application](https://docs.medusajs.com/learn/build), [Update Medusa](https://docs.medusajs.com/learn/update) |
| **Introduction** | [Architecture](https://docs.medusajs.com/learn/introduction/architecture), [Build with AI/LLMs](https://docs.medusajs.com/learn/introduction/build-with-llms-ai), [From v1 to v2](https://docs.medusajs.com/learn/introduction/from-v1-to-v2) |
| **Fundamentals → Framework** | [Framework Overview](https://docs.medusajs.com/learn/fundamentals/framework), [API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes) (parameters, HTTP methods, responses, validation, middlewares, protected routes, CORS, additional data, errors, overrides, body parsing, localization, custom links), [Data Models](https://docs.medusajs.com/learn/fundamentals/data-models) (properties, relationships, JSON properties, indexes, check constraints, type inference, migrations), [Events & Subscribers](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers) (data payload, emit events, priority), [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links) (index module, link, query, directions, custom columns, query context, read-only), [Plugins](https://docs.medusajs.com/learn/fundamentals/plugins) (create plugin, scheduled jobs), [Scheduled Jobs](https://docs.medusajs.com/learn/fundamentals/scheduled-jobs) (interval, execution number), [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows) (compensation, hooks, when-then, parallel steps, nested workflows, errors, locks, long-running, retries, multiple step usage, transform, timeout, constraints, store executions), [Custom CLI Scripts](https://docs.medusajs.com/learn/fundamentals/custom-cli-scripts) (seed data) |
| **Admin Development** | [Admin Overview](https://docs.medusajs.com/learn/fundamentals/admin), [Widgets](https://docs.medusajs.com/learn/fundamentals/admin/widgets), [UI Routes](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes), [Routing](https://docs.medusajs.com/learn/fundamentals/admin/routing), [Environment Variables](https://docs.medusajs.com/learn/fundamentals/admin/environment-variables), [Constraints](https://docs.medusajs.com/learn/fundamentals/admin/constraints), [Tips](https://docs.medusajs.com/learn/fundamentals/admin/tips), [Translations](https://docs.medusajs.com/learn/fundamentals/admin/translations) |
| **Customization** | [Custom Features](https://docs.medusajs.com/learn/customization/custom-features) (brand module, workflow, API route), [Extend Features](https://docs.medusajs.com/learn/customization/extend-features) (define link, extend create product, query linked records), [Customize Admin](https://docs.medusajs.com/learn/customization/customize-admin) (brands route, product widget), [Integrate Systems](https://docs.medusajs.com/learn/customization/integrate-systems) (third-party service, sync brands, schedule sync), [Reuse with Plugins](https://docs.medusajs.com/learn/customization/reuse-customizations), [Next Steps](https://docs.medusajs.com/learn/customization/next-steps) |
| **Debugging & Testing** | [Testing Tools](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools) (integration tests for API routes, workflows, module tests), [Debug Workflows](https://docs.medusajs.com/learn/debugging-and-testing/debug-workflows), [Logging](https://docs.medusajs.com/learn/debugging-and-testing/logging) (custom logger), [Instrumentation](https://docs.medusajs.com/learn/debugging-and-testing/instrumentation), [Feature Flags](https://docs.medusajs.com/learn/debugging-and-testing/feature-flags) (create custom flag) |
| **Deployment & Configuration** | [Deployment Overview](https://docs.medusajs.com/learn/deployment), [General Deployment](https://docs.medusajs.com/learn/deployment/general), [Worker Mode](https://docs.medusajs.com/learn/production/worker-mode), [Medusa Config](https://docs.medusajs.com/learn/configurations/medusa-config) (asymmetric encryption, pnpm, TypeScript aliases) |
| **Storefront Development** | [Storefront Overview](https://docs.medusajs.com/learn/storefront-development) |
| **Best Practices** | [Third-Party Syncing](https://docs.medusajs.com/learn/best-practices/third-party-sync) |
| **Codemods** | [Codemods Overview](https://docs.medusajs.com/learn/codemods), [Replace Imports](https://docs.medusajs.com/learn/codemods/replace-imports), [Replace Zod Imports](https://docs.medusajs.com/learn/codemods/replace-zod-imports) |
| **Contributing** | [Docs Guidelines](https://docs.medusajs.com/learn/resources/contribution-guidelines/docs), [Admin Translations](https://docs.medusajs.com/learn/resources/contribution-guidelines/admin-translations), [Usage Info](https://docs.medusajs.com/learn/resources/usage) |

### Resources (Reference & Tools)

| Category | Key References |
|----------|----------------|
| **Commerce Modules** | [Cart](https://docs.medusajs.com/resources/commerce-modules/cart), [Payment](https://docs.medusajs.com/resources/commerce-modules/payment), [Customer](https://docs.medusajs.com/resources/commerce-modules/customer), [Pricing](https://docs.medusajs.com/resources/commerce-modules/pricing), [Promotion](https://docs.medusajs.com/resources/commerce-modules/promotion), [Product](https://docs.medusajs.com/resources/commerce-modules/product), [Order](https://docs.medusajs.com/resources/commerce-modules/order), [Inventory](https://docs.medusajs.com/resources/commerce-modules/inventory), [Fulfillment](https://docs.medusajs.com/resources/commerce-modules/fulfillment), [Stock Location](https://docs.medusajs.com/resources/commerce-modules/stock-location), [Region](https://docs.medusajs.com/resources/commerce-modules/region), [Sales Channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel), [Tax](https://docs.medusajs.com/resources/commerce-modules/tax), [Currency](https://docs.medusajs.com/resources/commerce-modules/currency), [API Keys](https://docs.medusajs.com/resources/commerce-modules/api-key), [User](https://docs.medusajs.com/resources/commerce-modules/user), [Auth](https://docs.medusajs.com/resources/commerce-modules/auth) |
| **Infrastructure Modules** | [Analytics](https://docs.medusajs.com/resources/infrastructure-modules/analytics), [Caching](https://docs.medusajs.com/resources/infrastructure-modules/caching), [Event](https://docs.medusajs.com/resources/infrastructure-modules/event), [File](https://docs.medusajs.com/resources/infrastructure-modules/file), [Locking](https://docs.medusajs.com/resources/infrastructure-modules/locking), [Notification](https://docs.medusajs.com/resources/infrastructure-modules/notification), [Workflow Engine](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine) |
| **Build** | [Recipes](https://docs.medusajs.com/resources/recipes) (incl. [Marketplace Vendors](https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors)), [How-to & Tutorials](https://docs.medusajs.com/resources/how-to-tutorials), [Integrations](https://docs.medusajs.com/resources/integrations), [Storefront Development](https://docs.medusajs.com/resources/storefront-development) |
| **Tools** | [create-medusa-app](https://docs.medusajs.com/resources/create-medusa-app), [Medusa CLI](https://docs.medusajs.com/resources/medusa-cli), [JS SDK](https://docs.medusajs.com/resources/js-sdk), [Next.js Starter](https://docs.medusajs.com/resources/nextjs-starter), [Medusa UI](https://docs.medusajs.com/ui) |
| **API References** | [Admin API](https://docs.medusajs.com/api/admin), [Store API](https://docs.medusajs.com/api/store) |
| **Development References** | [Admin Injection Zones](https://docs.medusajs.com/resources/admin-widget-injection-zones), [Container Resources](https://docs.medusajs.com/resources/medusa-container-resources), [Core Workflows](https://docs.medusajs.com/resources/medusa-workflows-reference), [Data Model Language](https://docs.medusajs.com/resources/references/data-model), [Data Model Repository](https://docs.medusajs.com/resources/data-model-repository-reference), [Events Reference](https://docs.medusajs.com/resources/references/events), [Helper Steps](https://docs.medusajs.com/resources/references/helper-steps), [Service Factory](https://docs.medusajs.com/resources/service-factory-reference), [Testing Framework](https://docs.medusajs.com/resources/test-tools-reference), [Workflows SDK](https://docs.medusajs.com/resources/references/workflows) |
| **Medusa Admin** | [User Guide](https://docs.medusajs.com/user-guide) |
| **Cloud** | [Medusa Cloud](https://docs.medusajs.com/cloud) |

### Quick Navigation by Task

| Task | Best Entry Point |
|------|------------------|
| Create a custom module | [Modules](https://docs.medusajs.com/learn/fundamentals/modules) → [Data Models](https://docs.medusajs.com/learn/fundamentals/data-models) → [Service](https://docs.medusajs.com/learn/fundamentals/modules/service-factory) |
| Build a workflow | [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows) → [Steps](https://docs.medusajs.com/learn/fundamentals/workflows) → [Compensation](https://docs.medusajs.com/learn/fundamentals/workflows/compensation-function) |
| Add an API route | [API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes) → [Validation](https://docs.medusajs.com/learn/fundamentals/api-routes/validation) → [Protected Routes](https://docs.medusajs.com/learn/fundamentals/api-routes/protected-routes) |
| Extend core commerce | [Extend Features](https://docs.medusajs.com/learn/customization/extend-features) → [Module Links](https://docs.medusajs.com/learn/fundamentals/module-links) |
| Customize Admin UI | [Admin Development](https://docs.medusajs.com/learn/fundamentals/admin) → [Widgets](https://docs.medusajs.com/learn/fundamentals/admin/widgets) → [UI Routes](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes) |
| Build a storefront | [Storefront Development](https://docs.medusajs.com/learn/storefront-development) → [JS SDK](https://docs.medusajs.com/resources/js-sdk) → [Next.js Starter](https://docs.medusajs.com/resources/nextjs-starter) |
| Deploy to production | [Deployment](https://docs.medusajs.com/learn/deployment) → [Worker Mode](https://docs.medusajs.com/learn/production/worker-mode) → [Medusa Config](https://docs.medusajs.com/learn/configurations/medusa-config) |
| Write tests | [Testing Tools](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools) → [Integration Tests](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools/integration-tests) |
| Find commerce module reference | [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules) |
| Find infrastructure module reference | [Infrastructure Modules](https://docs.medusajs.com/resources/infrastructure-modules) |
| API route reference | [Admin API](https://docs.medusajs.com/api/admin) / [Store API](https://docs.medusajs.com/api/store) |

### Documentation Index

For a complete machine-readable index of all documentation pages, see:
- **llms.txt**: <https://docs.medusajs.com/llms.txt> (used by AI agents for full context)

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
