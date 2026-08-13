# Medusa 2 Multi-Vendor Marketplace on Dokploy

Deployment sources for a **multi-vendor (marketplace) Medusa 2 store** running on
[Dokploy](https://dokploy.com) as **separate container services**.

**No original Medusa 2 code is modified.** The official repositories are pulled in
as git subtrees under `apps/`, and every customisation lives outside that
directory. Upstream updates stay a single conflict-free command.

---

## 1. Repository layout

```
medusa/
├── apps/                          # OFFICIAL CODE — never edited
│   ├── backend/                   #   medusajs/medusa-starter-default @ master
│   └── storefront/                #   medusajs/nextjs-starter-medusa   @ main
│
├── overlay/backend/               # our code, layered in at BUILD time only
│   ├── medusa-config.ts           #   prod config + marketplace + meilisearch modules
│   └── src/                       #   additive paths only (never exist upstream)
│       ├── api/                   #     /vendors, /vendors/products, /admin/vendors, ...
│       ├── admin/                 #     Admin UI: Vendors + Settings → Meilisearch pages
│       ├── links/                 #     vendor <-> product, vendor <-> order
│       ├── modules/marketplace/   #     Vendor + VendorAdmin models, migrations
│       ├── modules/meilisearch/   #     self-hosted Meilisearch search module
│       ├── subscribers/           #     product sync/delete -> Meilisearch
│       ├── workflows/marketplace/ #     create-vendor, split-order, ...
│       └── workflows/meilisearch/ #     reindex / delete-index-documents
│
├── overlay/storefront/            # our storefront code (additive paths only)
│   └── src/                       #   Meilisearch search UI, /search page
│
├── deploy/
│   ├── backend/Dockerfile         # one image, two services (server + worker)
│   ├── backend/entrypoint.sh      # migrate-then-start / worker-wait logic
│   ├── meilisearch/Dockerfile     # standalone Meilisearch search engine
│   └── storefront/Dockerfile      # Next.js standalone build
│
├── env/                           # .env.example per Dokploy service
├── scripts/                       # bootstrap / update / overlay guard
├── docker-compose.yml             # OPTIONAL single-service alternative
└── .dockerignore
```

### Why an overlay instead of editing in place

The marketplace recipe needs exactly **one** upstream file changed
(`medusa-config.ts`, to register the module) and everything else is new files.
Rather than commit that change into `apps/backend`, the Dockerfile copies our
version over it *inside the image*. The checked-out upstream tree stays byte
identical to the official repo, so `git subtree pull` never conflicts.

Verify this at any time:

```bash
./scripts/check-overlay.sh
```

It fails loudly if a future Medusa release ever ships a file at one of our
overlay paths.

---

## 2. First-time setup

```bash
git clone <your-fork> medusa && cd medusa
./scripts/bootstrap.sh          # pulls both official repos into apps/
git remote add origin git@github.com:you/medusa-dokploy.git
git push -u origin main
```

`bootstrap.sh` runs `git subtree add --squash` for each upstream repo, so your
repo contains real files (Dokploy clones a single repo — submodules are not
fetched, which is why subtrees are used here).

---

## 3. Dokploy services

Create **one project** with **six services**. Postgres and Redis are native
Dokploy Databases; Meilisearch and the other three are Applications built from
this one repo using different Dockerfiles. (Meilisearch is a search engine, not
a relational database, so it runs as an Application — see §3.2.)

| # | Service | Dokploy type | Dockerfile | Port | Domain |
|---|---------|--------------|-----------|------|--------|
| 1 | `medusa-postgres` | Database → Postgres | — | 5432 | none |
| 2 | `medusa-redis` | Database → Redis | — | 6379 | none |
| 3 | `medusa-meilisearch` | Application | `deploy/meilisearch/Dockerfile` | 7700 | none |
| 4 | `medusa-backend-server` | Application | `deploy/backend/Dockerfile` | 9000 | `api.example.com` |
| 5 | `medusa-backend-worker` | Application | `deploy/backend/Dockerfile` | — | **none** |
| 6 | `medusa-storefront` | Application | `deploy/storefront/Dockerfile` | 8000 | `shop.example.com` |

Medusa requires the server/worker split in production: the **server** answers API
requests and serves the Admin, the **worker** runs scheduled jobs, subscribers and
workflows. Running both roles in one container double-fires jobs once you scale.

### Order of operations

Deploy **1 → 2 → 3 → 4 → 5 → 6**. The storefront is last because its build needs a
publishable API key that only exists after the backend is live.

### 3.1 Databases

Create → Database → Postgres (`postgres:16-alpine`) and Redis (`redis:7-alpine`).
Use `env/databases.env.example` for the credentials.

After each is deployed, open its page and copy the **Internal Connection URL** —
that is what the backends use. Leave *External Port* empty so neither database is
exposed to the internet.

### 3.2 Meilisearch

**Option C — Application** (the one this repo supports): create → Application
→ Git provider → this repo, then:

- **Build Type**: `Dockerfile`
- **Dockerfile Path**: `deploy/meilisearch/Dockerfile`
- **Docker Context Path**: `.`
- **Environment**: paste `env/meilisearch.env.example` — set `MEILI_MASTER_KEY`
  (`openssl rand -base64 32`).
- **Volumes**: add an *Empty Volume* mounted at `/meili_data` (the search index
  lives here; it survives redeploys).
- **Domains**: **none** — never expose the search engine publicly.

After it's up, note the application's **App Name** — the Docker Swarm service
name that other services use to reach it on the shared network. It is shown as
the small muted line under the app's display name at the top of the
application page (the same name you set in the "Add Application" dialog, which
auto-prefixes it with the project slug, e.g. `medusa-multi-store-medusameilisearch`).
Put it into `MEILISEARCH_HOST` on **both** backend services as
`http://<app-name>:7700`, and set `MEILISEARCH_API_KEY` to the same
`MEILI_MASTER_KEY`.

> Note: Meilisearch is **not** a native Dokploy Database (only Postgres, MySQL,
> MariaDB, MongoDB, Redis/libsql are). The older "Database → Meilisearch" menu
> does not exist in current Dokploy; deploy it as an Application like the other
> services here. For a local all-in-one stack, `docker-compose.yml` already
> includes the `meilisearch` service instead.

The `meilisearch` JS client is `yarn add`-ed inside the backend image only
(`deploy/backend/Dockerfile`), so `apps/backend/package.json` stays upstream.

### 3.3 Backend server

Create → Application → Git provider → this repo.

- **Build Type**: `Dockerfile`
- **Dockerfile Path**: `deploy/backend/Dockerfile`
- **Docker Context Path**: `.` (the build context is the repo root — the
  Dockerfile reads from both `apps/backend/` and `overlay/backend/`)
- **Environment**: paste `env/backend-server.env.example`
- **Build Time Arguments**: `DISABLE_MEDUSA_ADMIN=false` and
  `MEDUSA_BACKEND_URL=https://api.example.com`
- **Domains**: `api.example.com` → **container port 9000**, HTTPS + Let's Encrypt

`MEDUSA_BACKEND_URL` must be a **build argument**: it is compiled into the static
Admin bundle, so setting it only at runtime leaves the dashboard calling the
wrong host.

### 3.4 Backend worker

Same repo, same Dockerfile, different variables.

- **Dockerfile Path**: `deploy/backend/Dockerfile`
- **Environment**: paste `env/backend-worker.env.example`
- **Build Time Arguments**: `DISABLE_MEDUSA_ADMIN=true`
- **Domains**: **none** — never expose the worker

`JWT_SECRET` and `COOKIE_SECRET` must be byte-identical to the server's, and both
must point at the same Postgres and Redis.

Only the server runs `db:migrate`; the worker waits `WORKER_START_DELAY` seconds
first, so the two can never race on the same schema.

### 3.5 Storefront

- **Dockerfile Path**: `deploy/storefront/Dockerfile`
- **Docker Context Path**: `.`
- **Build Time Arguments** (all required at build time):
  `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, `MEDUSA_BACKEND_URL`,
  `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_DEFAULT_REGION`
- **Domains**: `shop.example.com` → **container port 8000**

Get the publishable key from Medusa Admin → Settings → API Key Management. The
upstream `check-env-variables.js` aborts the build if it is missing, and
`NEXT_PUBLIC_*` values are inlined into the client bundle — runtime variables are
too late.

---

## 4. Networking

Dokploy Applications and Databases in the same project resolve each other by
their **Docker Swarm service name** on the shared network. For an Application
that name is its **App Name** (shown in the app page header, set at creation as
`<project-slug>-<service-name>`); for a Database it is shown on the database
page as the **Internal Connection URL** host. Example, with the project slug
`medusa-multi-store`:

```
DATABASE_URL=postgres://medusa:pass@<db-app-name>:5432/medusa
REDIS_URL=redis://default:pass@<redis-app-name>:6379
MEILISEARCH_HOST=http://medusa-multi-store-medusameilisearch:7700
```

Never use `localhost` or a host IP — each service is its own container.

If a name fails to resolve on a Swarm host without IPVS kernel modules, use the
`tasks.` prefix (`tasks.<db-app-name>:5432`) per Dokploy's networking
troubleshooting guide.

Optionally point the storefront's *server-side* fetches at
`http://medusa-backend-server:9000` to skip a round trip through Traefik. Keep
`NEXT_PUBLIC_BASE_URL` on the public domain — the browser cannot resolve internal
names.

---

## 5. CORS

Medusa rejects browser requests from unlisted origins. On **both** backends:

```
STORE_CORS=https://shop.example.com
ADMIN_CORS=https://api.example.com
AUTH_CORS=https://shop.example.com,https://api.example.com
```

Comma-separated, no trailing slashes. `AUTH_CORS` must contain every origin that
logs anyone in — storefront customers, admin users, **and vendor admins**.

---

## 6. Verifying

| Check | URL |
|-------|-----|
| Backend health | `https://api.example.com/health` → `OK` |
| Admin dashboard | `https://api.example.com/app` |
| Storefront | `https://shop.example.com` |
| Worker | Dokploy → Logs → no HTTP traffic, jobs ticking |

Multi-vendor smoke test:

```bash
# 1. registration token
curl -X POST https://api.example.com/auth/vendor/emailpass/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"vendor@example.com","password":"supersecret"}'

# 2. create vendor + its admin
curl -X POST https://api.example.com/vendors \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer <token-from-step-1>" \
  -d '{"name":"Acme","handle":"acme","admin":{"email":"vendor@example.com"}}'

# 3. authenticated vendor token
curl -X POST https://api.example.com/auth/vendor/emailpass \
  -H 'Content-Type: application/json' \
  -d '{"email":"vendor@example.com","password":"supersecret"}'
```

No trailing slash on these URLs — it bypasses the route middleware.

Vendor endpoints added by the overlay (authenticated as a vendor):

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/vendors` | Create a vendor + first admin |
| `GET`/`POST` | `/vendors/products` | List / create that vendor's products |
| `GET` | `/vendors/orders` | That vendor's split orders |
| `DELETE` | `/vendors/admins/:id` | Remove one of that vendor's admins |
| `POST` | `/store/carts/:id/complete-vendor` | Checkout, splitting one cart into per-vendor orders |

Admin-scoped routes (used by the Admin UI pages under `overlay/backend/src/admin/`):

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/admin/vendors` | List vendors (`q`, `limit`, `offset`) |
| `GET` | `/admin/vendors/:id` | Vendor detail incl. admins, products, orders |
| `GET` | `/admin/vendors/admins` | List vendor admins across all vendors |
| `DELETE` | `/admin/vendors/admins/:id` | Delete a vendor admin from the Admin |

The Admin UI adds a **Vendors** page (`/vendors` and `/vendors/:id`, with
Overview / Admins / Products / Orders tabs) and a **Settings → Meilisearch**
page with a "Sync Data to Meilisearch" button.

Meilisearch endpoints added by the overlay:

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/store/products/search` | Search products in Meilisearch (`{"q":"..."}`) |
| `POST` | `/admin/meilisearch/sync` | Emit `meilisearch.sync` → full reindex |

Products are indexed automatically on `product.created` / `product.updated` /
`product.deleted`. To (re)index everything, hit `POST /admin/meilisearch/sync`
or use the **Settings → Meilisearch** page in the Admin. The storefront search
UI is live at `https://shop.example.com/{countryCode}/search?q=…`, driven by
the overlay at `overlay/storefront/src/`.

---

## 7. Keeping up with upstream

```bash
./scripts/update-upstream.sh              # both
./scripts/update-upstream.sh backend      # or just one
./scripts/check-overlay.sh                # confirm still additive
git push
```

Then redeploy `backend-server`, `backend-worker` and `storefront` in Dokploy — plus `medusa-meilisearch` if you bump the search engine image tag.

Because `apps/` is never edited locally, these pulls are fast-forwards. The only
thing that can break is a genuine Medusa API change, which `check-overlay.sh`
plus a test deploy will surface.

Enable **Watch Paths** on each Application so a backend-only commit does not
rebuild the storefront:

| Service | Watch Paths |
|---------|-------------|
| `medusa-backend-server` | `apps/backend/**`, `overlay/backend/**`, `deploy/backend/**` |
| `medusa-backend-worker` | `apps/backend/**`, `overlay/backend/**`, `deploy/backend/**` |
| `medusa-meilisearch` | `deploy/meilisearch/**` |
| `medusa-storefront` | `apps/storefront/**`, `overlay/storefront/**`, `deploy/storefront/**` |

---

## 8. Version notes

`apps/backend` tracks Medusa **2.18.0**; the marketplace recipe was published
against 2.14.0. The overlay was checked against 2.18 and is compatible:

- `src/api/vendors/route.ts` already imports zod from `@medusajs/framework/zod`,
  required since v2.13.0 — confirmed present in the 2.18.0 exports map.
- `useQueryGraphStep`, `setAuthAppMetadataStep`, `createRemoteLinkStep`,
  `getOrdersListWorkflow` and `completeCartWorkflow` all still resolve from
  `@medusajs/medusa/core-flows`.
- `@medusajs/medusa/api/admin/products/validators` is still a valid subpath
  under the package's `./api/*` export.

The config uses the current **Caching** module (`@medusajs/caching-redis`), not
the deprecated Cache module.

---

## 9. Gotchas

- **Volumes**: use Docker named volumes, never absolute host paths or
  repo-relative bind mounts. Dokploy re-clones the repo on every deploy and
  wipes it. Native Dokploy Databases handle this correctly by default.
- **Compose env vars**: Dokploy writes UI variables to `.env` next to the compose
  file but does **not** auto-inject them. The bundled `docker-compose.yml` uses
  `${VAR}` interpolation accordingly.
- **Memory**: give the backend at least 2 GB. The Admin bundle build is the peak.
- **Secrets**: generate with `openssl rand -base64 32`. Changing `COOKIE_SECRET`
  later logs out every session.
- **Seeding**: `MEDUSA_SEED=true` runs once on first boot — set it back to
  `false` immediately afterwards.

---

## 10. Sources

- Medusa docs — <https://docs.medusajs.com/>
  ([deployment](https://docs.medusajs.com/learn/deployment/general),
  [Docker](https://docs.medusajs.com/learn/installation/docker),
  [worker mode](https://docs.medusajs.com/learn/production/worker-mode),
  [marketplace recipe](https://docs.medusajs.com/resources/recipes/marketplace/examples/vendors))
- Dokploy docs — <https://docs.dokploy.com/docs/core>
  ([applications](https://docs.dokploy.com/docs/core/applications),
  [build types](https://docs.dokploy.com/docs/core/applications/build-type),
  [databases](https://docs.dokploy.com/docs/core/databases),
  [compose](https://docs.dokploy.com/docs/core/docker-compose),
  [watch paths](https://docs.dokploy.com/docs/core/watch-paths))
- Upstream repos — [medusa-starter-default](https://github.com/medusajs/medusa-starter-default),
  [nextjs-starter-medusa](https://github.com/medusajs/nextjs-starter-medusa),
  [examples/marketplace](https://github.com/medusajs/examples/tree/main/marketplace)
