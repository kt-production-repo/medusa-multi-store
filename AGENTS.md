# Project rules

Medusa 2 multi-vendor marketplace, deployed to Dokploy as separate container
services. See README.md for the deployment topology.

## Never modify upstream Medusa code

`apps/backend/` and `apps/storefront/` are the official Medusa repositories,
vendored via `git subtree`. They MUST stay byte-identical to upstream so that
`./scripts/update-upstream.sh` remains conflict-free.

| Path | Rule |
|------|------|
| `apps/backend/**` | READ ONLY — official medusa-starter-default |
| `apps/storefront/**` | READ ONLY — official nextjs-starter-medusa |
| `overlay/backend/**` | our backend code — edit freely |
| `deploy/**` | Dockerfiles + entrypoints — edit freely |
| `scripts/`, `env/`, `docker-compose.yml` | ours — edit freely |

To change backend behaviour, add a file under `overlay/backend/src/` on a path
that does NOT exist upstream. The Docker build copies upstream first, then
layers the overlay on top, so the overlay wins inside the image without ever
mutating the repo.

`overlay/backend/medusa-config.ts` is the single intentional replacement of an
upstream file, and it is replaced only inside the image.

After adding or moving overlay files, run:

```bash
./scripts/check-overlay.sh   # fails if an overlay file shadows an upstream one
```

## Build-time vs runtime environment variables

Getting this wrong causes silent production failures — both have bitten this
project already.

- `NEXT_PUBLIC_*` are inlined into the client bundle at build time AND checked
  at boot by `next.config.js` → set them as **both** Dokploy Build Time
  Arguments and runtime Environment variables.
- `MEDUSA_BACKEND_URL` for the storefront must be the **public** domain at
  build time (the build container is not on the app network), and may be the
  internal service name at runtime.
- Admin `backendUrl` is compiled into the admin bundle, so it must be a build
  arg on the backend server service.

## Deployment order

Databases → backend-server → backend-worker → storefront.

The storefront build calls the live backend via `generateStaticParams`, so it
needs a real publishable key and at least one region to exist first.

## Agent skills

19 skills live in `.opencode/skills/` (mirrored to `.claude/` and `.agents/`).

Start with the `medusa` skill — it documents this repo's overlay architecture,
Dokploy topology and vendor API. The other 18 are the official
[medusajs/medusa-agent-skills](https://github.com/medusajs/medusa-agent-skills),
vendored so every contributor gets identical guidance with no install step.

Treat the official skills as read-only; re-sync rather than edit. See
`.opencode/skills/README.md`.

## Conventions

- Do not add code comments unless they explain a non-obvious "why".
- Shell scripts: `set -euo pipefail`, and keep them idempotent.
- Never commit secrets. `env/*.env.example` holds placeholders only.
