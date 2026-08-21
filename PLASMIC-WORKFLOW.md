# Plasmic storefront — edit, validate, review, push

Full workflow for changing the visual design of the Plasmic-managed pages,
from Studio to production. The guard rails referenced here are enforced by
`scripts/hooks/pre-commit` and documented in `AGENTS.md`.

---

## 1. Scope — what Plasmic actually controls

| Surface | Managed by | Where to change it |
|---|---|---|
| `/home`, `/login`, `/signup` | **Plasmic** (project "test" in `apps/storefront/plasmic.json`) | Plasmic Studio → `npx plasmic sync` |
| `Button`, `LoginForm`, `SignupForm`, `PromoBadge`, `DummyHomePage` | **Code components** — placed in Studio, implemented in code | Upstream `apps/storefront/src/modules/**`; restyle via `overlay/storefront/src/**`, never in Studio |
| `/gb`, `/gb/store`, cart, checkout, account, search, vendor portal | **Not Plasmic** — regular Next.js templates | `overlay/storefront/src/**` |
| Generated output | `components/plasmic/**`, `public/plasmic/**`, `plasmic.json`, `plasmic.lock` | Never hand-edit; only `plasmic sync` writes these |

The pre-commit hook blocks every staged path under `apps/` **except** the four
generated-path groups above. If a commit is rejected, you are touching
upstream source by mistake.

## 2. One-time setup

1. **Plasmic access.** Project "test" (`3RVpz8tf8oHM2jiuGYHU8J`) currently
   lives in the upstream author's workspace. Either get invited to it, or log
   into <https://studio.plasmic.app> and duplicate the project into your own
   workspace (duplication brings its dependencies — react-aria,
   plasmic-embed-css — along).
2. **Rebind after duplicating.** In `apps/storefront/plasmic.json`, replace
   the "test" entry's `projectId` and `projectApiToken` with your new values.
   Keep `projectName`, paths and component entries unchanged. Delete nothing
   else.
3. **Install deps** (first time only):

   ```bash
   cd apps/storefront
   npm ci
   ```

4. **Sanity-check sync auth:**

   ```bash
   npx plasmic sync   # should complete with no changes, or pull latest
   ```

## 3. Design in Studio

1. Open <https://studio.plasmic.app> → project "test".
2. Edit visually. Notes:
   - The **Screen** global variant drives responsive breakpoints.
   - `Button`, `LoginForm`, etc. appear as black-box components — you can
     move, size and style their *containers*, but their internals live in
     code. Restyling them happens in `overlay/storefront/src/**`.
   - Uploaded images land in `public/plasmic/test/images/…` on sync.
3. Publish/save is implicit — the CLI pulls whatever the project's latest
   version is.

## 4. Sync generated code into the repo

Always run from inside the storefront app:

```bash
cd apps/storefront
npx plasmic sync
```

This rewrites exactly:

- `components/plasmic/**` (render modules, CSS modules, icons)
- `public/plasmic/**` (images)
- `plasmic.json` / `plasmic.lock` (component registry, versions)

Inspect what changed:

```bash
git status
git diff --stat
```

If anything outside those four path groups shows up, stop — something hand-
edited upstream crept in; revert it before continuing.

## 5. Validate locally

```bash
npm run dev        # next dev --turbopack -p 8000
```

Checklist at <http://localhost:8000>:

- [ ] `/home` renders the new design, no console errors
- [ ] `/login` and `/signup` render and still submit correctly
      (the forms are code components wired to Medusa — a broken submit means
      a slot/handler got detached in Studio)
- [ ] `/plasmic-host` loads (component registration host)
- [ ] Mobile widths look right (Screen variant), not just desktop
- [ ] New images resolve (no 404s under `/plasmic/...`)

Optional stricter check — a real production build against the live backend:

```bash
cat > .env.local <<'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.nokor24.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEFAULT_REGION=gb
EOF
npm run build && npm start
```

(`next build` skips type checking by config; treat `npm run dev` + clicking
through pages as the primary validation.)

## 6. Review before committing

- [ ] `git diff --stat` touches **only** generated paths (see §4) — this is
      also what the hook enforces
- [ ] No hand-edits inside `components/plasmic/**` (they will be silently
      overwritten by the next sync)
- [ ] No new secrets beyond the pre-existing `projectApiToken` fields in
      `plasmic.json`
- [ ] If overlay files were touched for code-component restyles:
      `./scripts/check-overlay.sh` passes
- [ ] Screenshots attached to the PR/commit description for reviewers

## 7. Commit & push

```bash
git add apps/storefront/components/plasmic \
        apps/storefront/public/plasmic \
        apps/storefront/plasmic.json apps/storefront/plasmic.lock
git commit -m "plasmic: <short description of the design change>"
git push origin improve-v2
```

Commit message convention: prefix `plasmic:` so design-only deploys are
greppable in history.

## 8. Deploy & verify

1. Redeploy **only the storefront** service in Dokploy (watch paths usually
   trigger it automatically on push). Backend services are unaffected by
   design changes.
2. Post-deploy smoke check:

   ```bash
   for p in /home /login /signup /plasmic-host /; do
     printf "%-16s " "$p"
     curl -sS -o /dev/null -w "HTTP %{http_code} -> %{redirect_url}\n" \
       "https://shop.nokor24.com$p"
   done
   ```

   Expect `200` for the first four and `307 -> /gb` for `/`.
3. Hard-refresh the browser (Cmd+Shift+R) to bypass cached chunks.

## 9. Troubleshooting

| Symptom | Meaning / fix |
|---|---|
| Hook rejects commit listing `src/**` files | You staged upstream source. Move it to `overlay/storefront/src/**` or unstage. |
| `sync` fails with 401/403 | Token expired or project rebound — update `projectId`/`projectApiToken` in `plasmic.json`. |
| `Encountered likely duplicate host version` in logs | Benign Plasmic warning, documented in README §10 — ignore. |
| Form submits break after a Studio edit | A code component's props/slot got detached in Studio; re-check the component's settings panel. |
| Future `update-upstream.sh` conflicts in `components/plasmic/` | Expected once your designs diverge from upstream's. Resolve by taking upstream's copy, then immediately re-running `npx plasmic sync` to restore yours. |
