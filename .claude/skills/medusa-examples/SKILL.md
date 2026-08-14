---
name: medusa-examples
description: Reference implementations for Medusa.js storefronts, plugins, custom modules, and admin extensions sourced from the official medusajs/examples GitHub repo.
license: MIT
compatibility: opencode
---

## What I do

Provide reference implementations and patterns from the official [medusajs/examples](https://github.com/medusajs/examples)
repository, cloned locally into `./repo`. OpenCode can read the full source
tree of each example directly via file tools — no guessing at remote content.

## When to use me

Use this when implementing Medusa.js features — storefront integrations,
custom modules, plugins, or admin extensions — and you want to check how the
official examples handle it.

## How to use me

Browse `./repo` for relevant example projects. Each subfolder is a standalone
example (Next.js storefronts, custom backend modules, admin plugins, etc.).
Read `package.json` and `README.md` in each subfolder to understand what the
example demonstrates, then compare its patterns against the user's code before
applying changes.

## Repo structure (top-level folders)

| Folder            | Demonstrates                                   |
|-------------------|------------------------------------------------|
| `storefront-nextjs` | Full Next.js storefront with Medusa SDK       |
| `admin-custom`     | Custom admin extensions and widgets          |
| `module-custom`    | Custom backend modules with workflows        |
| `plugin-custom`    | Plugins for extending core services          |
| `express-storefront` | Minimal Express-based storefront example     |

Full file tree is available locally in `./repo`.
