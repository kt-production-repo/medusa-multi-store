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
│   ├── medusa-config.ts           #   prod config + marketplace module
│   └── src/                       #   multi-vendor recipe (additive paths only)
│       ├── api/                   #     /vendors, /vendors/products, ...
│       ├── links/                 #     vendor <-> product, vendor <-> order
│       ├── modules/marketplace/   #     Vendor + VendorAdmin models, migrations
│       └── workflows/marketplace/ #     create-vendor, split-order, ...
│
├── deploy/
│   ├── backend/Dockerfile         # one image, two services (server + worker)
│   ├── backend/entrypoint.sh      # migrate-then-start / worker-wait logic
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

Create **one project** with **five services**. Postgres and Redis are native
Dokploy Databases; the other three are Applications built from this one repo
using different Dockerfiles.

| # | Service | Dokploy type | Dockerfile | Port | Domain |
|---|---------|--------------|-----------|------|--------|
| 1 | `medusa-postgres` | Database → Postgres | — | 5432 | none |
| 2 | `medusa-redis` | Database → Redis | — | 6379 | none |
| 3 | `medusa-backend-server` | Application | `deploy/backend/Dockerfile` | 9000 | `api.example.com` |
| 4 | `medusa-backend-worker` | Application | `deploy/backend/Dockerfile` | — | **none** |
| 5 | `medusa-storefront` | Application | `deploy/storefront/Dockerfile` | 8000 | `shop.example.com` |

Medusa requires the server/worker split in production: the **server** answers API
requests and serves the Admin, the **worker** runs scheduled jobs, subscribers and
workflows. Running both roles in one container double-fires jobs once you scale.

### Order of operations

Deploy **1 → 2 → 3 → 4 → 5**. The storefront is last because its build needs a
publishable API key that only exists after the backend is live.

### 3.1 Databases

Create → Database → Postgres (`postgres:16-alpine`) and Redis (`redis:7-alpine`).
Use `env/databases.env.example` for the credentials.

After each is deployed, open its page and copy the **Internal Connection URL** —
that is what the backends use. Leave *External Port* empty so neither database is
exposed to the internet.

### 3.2 Backend server

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

### 3.3 Backend worker

Same repo, same Dockerfile, different variables.

- **Dockerfile Path**: `deploy/backend/Dockerfile`
- **Environment**: paste `env/backend-worker.env.example`
- **Build Time Arguments**: `DISABLE_MEDUSA_ADMIN=true`
- **Domains**: **none** — never expose the worker

`JWT_SECRET` and `COOKIE_SECRET` must be byte-identical to the server's, and both
must point at the same Postgres and Redis.

Only the server runs `db:migrate`; the worker waits `WORKER_START_DELAY` seconds
first, so the two can never race on the same schema.

### 3.4 Storefront

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
**service name** on the shared Docker network:

```
DATABASE_URL=postgres://medusa:pass@medusa-postgres:5432/medusa
REDIS_URL=redis://default:pass@medusa-redis:6379
```

Never use `localhost` or a host IP — each service is its own container.

If a name fails to resolve on a Swarm host without IPVS kernel modules, use the
`tasks.` prefix (`tasks.medusa-postgres:5432`) per Dokploy's networking
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

Vendor endpoints added by the overlay:

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/vendors` | Create a vendor + first admin |
| `GET`/`POST` | `/vendors/products` | List / create that vendor's products |
| `GET` | `/vendors/orders` | That vendor's split orders |
| `GET`/`POST` | `/vendors/admins/:id` | Manage vendor admins |
| `POST` | `/store/carts/:id/complete-vendor` | Checkout, splitting one cart into per-vendor orders |

---

## 7. Keeping up with upstream

```bash
./scripts/update-upstream.sh              # both
./scripts/update-upstream.sh backend      # or just one
./scripts/check-overlay.sh                # confirm still additive
git push
```

Then redeploy `backend-server`, `backend-worker` and `storefront` in Dokploy.

Because `apps/` is never edited locally, these pulls are fast-forwards. The only
thing that can break is a genuine Medusa API change, which `check-overlay.sh`
plus a test deploy will surface.

Enable **Watch Paths** on each Application so a backend-only commit does not
rebuild the storefront:

| Service | Watch Paths |
|---------|-------------|
| `medusa-backend-server` | `apps/backend/**`, `overlay/backend/**`, `deploy/backend/**` |
| `medusa-backend-worker` | `apps/backend/**`, `overlay/backend/**`, `deploy/backend/**` |
| `medusa-storefront` | `apps/storefront/**`, `deploy/storefront/**` |

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
