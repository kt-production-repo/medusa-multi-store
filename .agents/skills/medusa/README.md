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
├── building-with-medusa/SKILL.md       # official skills, one folder each
├── storefront-best-practices/SKILL.md
└── …
```

Skill loaders glob `**/SKILL.md` recursively, so nesting is transparent. The
only hard requirement is that each skill's **immediate parent folder matches
its frontmatter `name`** — which holds for all 19.

## Project skill

| Skill | Purpose |
|-------|---------|
| `medusa` | **This repo.** Overlay architecture, Dokploy topology, vendor API, build-vs-runtime env vars, debugging. Read this first. |

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

The nine `mcloud-*` skills target **Medusa Cloud**, which this project does
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
