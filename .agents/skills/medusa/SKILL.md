---
name: medusa
description: Use when working on this Medusa 2 multi-vendor marketplace repo — adding vendor/marketplace features, editing medusa-config, Dockerfiles, entrypoints, env vars, or debugging Dokploy deploys. Covers the overlay architecture that keeps apps/backend and apps/storefront byte-identical to upstream, and the build-time vs runtime env var rules. Read BEFORE editing anything under apps/, overlay/, or deploy/.
---

# Medusa 2 Multi-Vendor Marketplace (Dokploy)

Deployment repo for a multi-vendor Medusa 2 store running on Dokploy as five
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
│   └── storefront/Dockerfile
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

Existing overlay paths (the official marketplace recipe):

```
overlay/backend/src/
├── api/vendors/…                 /vendors, /vendors/products, /vendors/orders
├── api/store/carts/[id]/complete-vendor/route.ts
├── api/middlewares.ts            vendor actor-type auth + validation
├── links/                        vendor↔product, vendor↔order
├── modules/marketplace/          Vendor + VendorAdmin models, migrations
└── workflows/marketplace/        create-vendor, split-order, …
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

Five separate services, one project:

| Service | Type | Dockerfile | Port | Domain |
|---|---|---|---|---|
| `medusa-postgres` | Database | — | 5432 | none |
| `medusa-redis` | Database | — | 6379 | none |
| `medusa-backend-server` | Application | `deploy/backend/Dockerfile` | 9000 | api.* |
| `medusa-backend-worker` | Application | same, `DISABLE_MEDUSA_ADMIN=true` | — | **none** |
| `medusa-storefront` | Application | `deploy/storefront/Dockerfile` | 8000 | shop.* |

Deploy order: **databases → backend-server → backend-worker → storefront.**
The storefront build calls the live backend via `generateStaticParams`, so it
needs a valid publishable key and at least one region to already exist.

Server vs worker is a Medusa production requirement: the server answers API
requests and serves the Admin; the worker runs scheduled jobs, subscribers and
workflows. Only the server runs migrations — the worker sleeps
`WORKER_START_DELAY` first so the two never race on the schema.

### Networking

Services resolve each other by Dokploy's **generated** service name, which
carries a random suffix:

```
http://medusa-multi-store-medusabackendserver-jsdllf:9000
```

Copy the real value from the Dokploy UI (Application → General → App Name, or
Database → Internal Connection URL). Never `localhost`, never a host IP.
Internal traffic is plain `http` — TLS terminates at Traefik.

## Vendor API surface

Added by the overlay. Vendor admins are a custom actor type, so they use
`/auth/vendor/*`, not the admin or customer auth routes.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/auth/vendor/emailpass/register` | Registration token (unregistered) |
| `POST` | `/auth/vendor/emailpass` | Authenticated token |
| `POST` | `/vendors` | Create vendor + first admin |
| `GET` `POST` | `/vendors/products` | List / create that vendor's products |
| `GET` | `/vendors/orders` | That vendor's split orders |
| `DELETE` | `/vendors/admins/:id` | Remove a vendor admin |
| `POST` | `/store/carts/:id/complete-vendor` | Checkout, splitting per vendor |

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
self-hosts on Dokploy. See `.opencode/skills/README.md`.
