# PLAN — Skills/docs review: audit of `.opencode/skills/medusa/**` + env files

Audit of every `.md` under `.opencode/skills/medusa/` (and its `.claude` /
`.agents` mirrors) against the actual repo, plus `env/`, `docker-compose.yml`,
`deploy/` and the root docs. Official vendored skills are read-only upstream;
only repo-owned files are edited.

## Task list

- [x] 1. Inventory skills: 19 total (1 project + 18 official); every
         `*/SKILL.md` frontmatter `name` == parent folder
- [x] 2. Verify `.claude` and `.agents` mirrors byte-identical to `.opencode`
- [x] 3. Cross-check medusa `SKILL.md` claims vs repo (services, topology,
         overlay tree, routes, env, branches, versions, building blocks)
- [x] 4. Audit `env/*.env.example` vs `docker-compose.yml`, `deploy/`,
         README.md, SKILL.md
- [x] 5. Read README.md + all `*PLAN*.md` for stale/misleading content
- [x] 6. Read the 18 official skills (report-only; no edits — vendored upstream)
- [x] 7. Fix: `SKILL.md` — "five" → "six" services; add `medusa-meilisearch`
         to topology + deploy order; rebuild overlay tree (add api/admin/,
         store search, modules/meilisearch/, subscribers/, workflows/
         meilisearch/, admin/, overlay/storefront/; "split-order" →
         create-vendor-orders); extend vendor API table with the 9 missing
         routes; add `deploy/meilisearch/Dockerfile` to layout tree
- [x] 8. Fix: skills `README.md` — "nine" → "eight" `mcloud-*` skills
- [x] 9. Fix: `env/backend-server.env.example` + `env/backend-worker.env.example`
         — `MEILISEARCH_HOST` value must be the project-slug-prefixed App Name
         `http://medusa-multi-store-medusameilisearch:7700` (matches comments
         + databases.env.example + README)
- [x] 10. Fix: `docker-compose.yml` header — "all five services" / "5 SEPARATE"
          → six; add `NEXT_PUBLIC_STRIPE_KEY` build arg to storefront
- [x] 11. Fix: `README.md` — "split-order" → `create-vendor-orders` in the
          layout tree
- [x] 12. Fix: `env/databases.env.example` — note the bundled compose redis
          runs without `requirepass` (compose path uses passwordless
          `redis://redis:6379`)
- [x] 13. Fix: `PLAN.md` — tick the commit checkbox; `AGENTS.md` + `add-meilisearch.md`
          deploy order includes meilisearch
- [x] 14. Re-mirror `.opencode/skills` → `.claude/skills` + `.agents/skills`
- [x] 15. Verify: mirrors identical, frontmatter ok, `check-overlay.sh` passes,
          `apps/` clean; `docker compose build` smoke test
- [x] 16. Commit + push to GitHub (SSH) and Gitea (token) on `add-meilisearch`

## Findings that drove the fixes

### Verified correct (no change)
- All 18 official skills present with every referenced file existing; no
  TODOs; no stale version claims vs the 2.18.0 / next 15.3.9 stack.
- Mirrors byte-identical; frontmatter `name` == folder for all skills.
- SKILL.md building-blocks snippets, branches (master/main), local-dev steps,
  build-vs-runtime env table, debugging checklist, seed region claim — all
  match the repo.
- Server/worker env split is correct (admin-email/password/seed are
  server-only; `WORKER_START_DELAY` worker-only; entrypoint/Dockerfile vars
  all present in env examples).

### Issues fixed
1. **SKILL.md service count** — "five separate container services" (lines 8,
   233) and a 5-row topology table: the repo has **six** services (a
   `medusa-meilisearch` Application exists: `deploy/meilisearch/Dockerfile`,
   compose `meilisearch:` service, README 6-row table).
2. **SKILL.md overlay tree** stale — omits `api/admin/` (7 routes),
   `api/store/products/search`, `modules/meilisearch/`, `subscribers/` (3),
   `workflows/meilisearch/` (2), `admin/` (routes + 2 widgets), and the whole
   `overlay/storefront/` search UI. Names a non-existent "split-order"
   workflow (it is `create-vendor-orders`).
3. **SKILL.md vendor API table** — 7 rows documented, 9 overlay routes
   missing (`/admin/vendors*`, `/admin/products/:id/vendor`,
   `/admin/orders/:id/vendor`, `/store/products/search`,
   `/admin/meilisearch/sync`). README already has all 13.
4. **SKILL.md layout tree** omits `deploy/meilisearch/Dockerfile`.
5. **skills README.md:76** — "The nine `mcloud-*` skills" but there are eight.
6. **env MEILISEARCH_HOST** — `env/backend-server.env.example:70` and
   `env/backend-worker.env.example:55` use `http://medusa-meilisearch:7700`
   (unresolvable in Dokploy); the documented value everywhere else is the
   project-slug-prefixed App Name.
7. **docker-compose.yml:2,4** — header says "all five services" / "5 SEPARATE
   Dokploy services", file defines six.
8. **README.md:29** — layout tree says `workflows/marketplace/ # create-vendor,
   split-order, ...`; the split-order workflow is `create-vendor-orders`.
9. **databases.env.example** — documents `REDIS_PASSWORD` /
   `redis://default:CHANGE_ME@medusa-redis:6379` (native-Dokploy-DB path), but
   the bundled compose runs redis without `requirepass`; the compose path uses
   passwordless `redis://redis:6379`. Worth an explicit note.
10. **PLAN.md:136-137** — commit checkbox stale (commits already exist);
    AGENTS.md:50 and add-meilisearch.md:52 deploy orders omit meilisearch.
11. **storefront compose args** — `NEXT_PUBLIC_STRIPE_KEY` is used by the
    storefront code and set in the env example + Dockerfile but not passed as a
    compose build arg (local compose always falls back to manual checkout).
