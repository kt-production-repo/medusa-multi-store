# Agent skills

19 skills, all nested under a single `medusa/` folder and mirrored identically
to three locations so any agent tool picks them up:

```
.opencode/skills/medusa/    opencode native (registered via opencode.json)
.claude/skills/medusa/      Claude Code
.agents/skills/medusa/      generic agents
```

Layout inside each:

```
medusa/
├── SKILL.md                            # the project skill (this repo)
├── README.md                           # this file
├── reference/                          # vendored official docs (offline reference)
│   ├── learn/                          #   https://docs.medusajs.com/learn/ (149 files)
│   ├── commerce-modules/               #   https://docs.medusajs.com/resources/commerce-modules/ (135 files)
│   ├── infrastructure-modules/         #   https://docs.medusajs.com/resources/infrastructure-modules/ (33 files)
│   ├── integrations/                   #   https://docs.medusajs.com/resources/integrations/ (17 files)
│   ├── how-to-tutorials/               #   https://docs.medusajs.com/resources/how-to-tutorials/ (18 files)
│   ├── recipes/                        #   https://docs.medusajs.com/resources/recipes/ (24 files)
│   ├── ui/                             #   https://docs.medusajs.com/ui/ (43 files)
│   ├── medusa-cli/                     #   https://docs.medusajs.com/resources/medusa-cli/ (12 files)
│   ├── js-sdk/                         #   https://docs.medusajs.com/resources/js-sdk/ (2 files)
│   ├── examples/                       #   https://docs.medusajs.com/resources/examples/ (3 files)
│   ├── admin-components/               #   https://docs.medusajs.com/resources/admin-components/ (12 files)
│   ├── service-factory-reference/      #   https://docs.medusajs.com/resources/service-factory-reference/ (10 files)
│   ├── nextjs-starter/                 #   https://docs.medusajs.com/resources/nextjs-starter/ (4 files)
│   └── plugins/                        #   https://docs.medusajs.com/resources/plugins/ (1 file)
├── building-with-medusa/SKILL.md       # official skills, one folder each
├── storefront-best-practices/SKILL.md
└── …
```

Skill loaders glob `**/SKILL.md` recursively, so nesting is transparent. The
only hard requirement is that each skill's **immediate parent folder matches
its frontmatter `name`** — which holds for all 19. The `reference/` tree holds
no `SKILL.md`, so it is plain documentation, not a skill.

## Project skill

| Skill | Purpose |
|-------|---------|
| `medusa` | **This repo.** Overlay architecture, Dokploy topology, vendor API, build-vs-runtime env vars, debugging, plus a vendored offline copy of the official docs under `reference/`. Read this first. |

## Vendored reference docs

`medusa/reference/` holds an offline copy of the official Medusa
documentation, generated from `https://docs.medusajs.com/llms-full.txt`:

- `reference/learn/` — the Learn docs (`/learn/**`). One file per page; the
  path after `learn/` maps to the URL path after `learn/`.
- `reference/commerce-modules/` — the Commerce Modules reference
  (`/resources/commerce-modules/**`). `<module>/index.md` + `<module>/<topic>.md`.
- The remaining trees mirror `/resources/**` (except
  `commerce-modules`/`integrations`/`recipes` kept under their own dirs),
  `/ui/**`, and `/resources/plugins/**`. For `resources/` sections the
  `resources/` prefix is dropped: `resources/infrastructure-modules/…` →
  `reference/infrastructure-modules/…`.

463 reference files total. Internal links were normalized from the
llms-full.txt build paths (`/opt/buildhome/...`) to `docs.medusajs.com` URLs.

Re-sync the whole tree by re-running the splitter over a fresh
`llms-full.txt` download (scripts live in
`/var/folders/gh/l7_mrc851mdgb4wlckzbsjxw0000gn/T/opencode/split_learn.py`,
`split_commerce.py`, `split_rest.py`, `normalize_urls.py`), then copy
`.opencode/skills` to `.claude` and `.agents` as below.

## Official skills

Vendored from [medusajs/medusa-agent-skills](https://github.com/medusajs/medusa-agent-skills)
@ `f923b95` (2026-08-06). Upstream copies — do not edit; re-sync instead.

### Development (`medusa-dev`)

| Skill | Purpose |
|-------|---------|
| `building-with-medusa` | Backend: modules, workflows, data models, API routes |
| `building-admin-dashboard-customizations` | Admin widgets and UI routes |
| `building-storefronts` | Storefront integration with Medusa |
| `creating-agents-in-medusa` | Building AI agents inside a Medusa app |
| `db-generate` | Generate migrations for a custom module |
| `db-migrate` | Run database migrations |
| `new-user` | Create an admin user |

### Storefront (`ecommerce-storefront`)

| Skill | Purpose |
|-------|---------|
| `storefront-best-practices` | Ecommerce UX patterns, any framework |

### Learning (`learn-medusa`)

| Skill | Purpose |
|-------|---------|
| `learning-medusa` | Interactive walkthrough of Medusa fundamentals |

### Cloud (`medusa-cloud`)

| Skill | Purpose |
|-------|---------|
| `using-medusa-cloud` | Cloud overview |
| `mcloud-auth` | Authentication |
| `mcloud-deployments` | Deployments |
| `mcloud-environments` | Environments |
| `mcloud-local` | Local development against Cloud |
| `mcloud-logs` | Logs |
| `mcloud-organizations` | Organizations |
| `mcloud-projects` | Projects |
| `mcloud-variables` | Environment variables |

The eight `mcloud-*` skills target **Medusa Cloud**, which this project does
not use — it self-hosts on Dokploy. They are included for completeness; ignore
them unless you also run a Cloud project.

## Re-syncing the official skills

```bash
git clone --depth=1 https://github.com/medusajs/medusa-agent-skills.git /tmp/mas
for p in medusa-dev ecommerce-storefront learn-medusa medusa-cloud; do
  cp -r /tmp/mas/plugins/$p/skills/*/ .opencode/skills/medusa/
done

# upstream ships this folder misnamed; loaders require folder == name
mv .opencode/skills/medusa/creating-internal-agents \
   .opencode/skills/medusa/creating-agents-in-medusa 2>/dev/null || true

rm -rf .claude/skills .agents/skills
cp -r .opencode/skills .claude/skills
cp -r .opencode/skills .agents/skills
```

Do not overwrite `medusa/SKILL.md` or `medusa/README.md` — those are ours, not
upstream's.
