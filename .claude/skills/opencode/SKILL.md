---
name: opencode
description: Reference documentation for the OpenCode agent skill system — how to create, discover, and configure reusable skills for AI agents.
license: MIT
compatibility: opencode
metadata:
  source: https://opencode.ai/docs/skills
  category: reference
---

# OpenCode Agent Skills Reference

This skill contains the official OpenCode documentation for the agent skill system, saved locally for offline reference.

## Overview

Agent skills let OpenCode discover reusable instructions from your repo or home directory. Skills are loaded on-demand via the native `skill` tool — agents see available skills and can load the full content when needed.

## Skill File Structure

Create one folder per skill name and put a `SKILL.md` inside it. OpenCode searches these locations:

**Project config:**
- `.opencode/skills/<name>/SKILL.md`

**Global config:**
- `~/.config/opencode/skills/<name>/SKILL.md`

**Project Claude-compatible:**
- `.claude/skills/<name>/SKILL.md`

**Global Claude-compatible:**
- `~/.claude/skills/<name>/SKILL.md`

**Project agent-compatible:**
- `.agents/skills/<name>/SKILL.md`

**Global agent-compatible:**
- `~/.agents/skills/<name>/SKILL.md`

## Discovery

For project-local paths, OpenCode walks up from your current working directory until it reaches the git worktree. It loads any matching `skills/*/SKILL.md` in `.opencode/` and any matching `.claude/skills/*/SKILL.md` or `.agents/skills/*/SKILL.md` along the way.

Global definitions are also loaded from `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, and `~/.agents/skills/*/SKILL.md`.

## Frontmatter Requirements

Each `SKILL.md` must start with YAML frontmatter. Only these fields are recognized:

```yaml
name: (required) — skill identifier
description: (required) — what the skill does, 1-1024 chars
license: (optional) — e.g., MIT
compatibility: (optional) — e.g., opencode
metadata: (optional) — string-to-string map
```

Unknown frontmatter fields are ignored.

## Name Validation

The `name` field must:
- Be 1–64 characters
- Be lowercase alphanumeric with single hyphen separators
- Not start or end with `-`
- Not contain consecutive `--`
- Match the directory name that contains `SKILL.md`

Regex: `^[a-z0-9]+(-[a-z0-9]+)*$`

## Example Skill

Create `.opencode/skills/git-release/SKILL.md`:

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do
- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me
Use this when you are preparing a tagged release. Ask clarifying questions if the target versioning scheme is unclear.
```

## Tool Integration

OpenCode lists available skills in the `skill` tool description. Each entry includes the skill name and description. The agent loads a skill by calling:

```
skill({ name: "git-release" })
```

## Permissions

Control which skills agents can access using pattern-based permissions in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permission | Behavior |
|------------|----------|
| `allow` | Skill loads immediately |
| `deny` | Skill hidden from agent, access rejected |
| `ask` | User prompted for approval before loading |

Patterns support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

## Per-Agent Overrides

Give specific agents different permissions than the global defaults.

**For custom agents** (in agent frontmatter):
```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**For built-in agents** (in `opencode.json`):
```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

## Disable Skills

Completely disable skills for agents that shouldn't use them.

**For custom agents:**
```yaml
---
tools:
  skill: false
---
```

**For built-in agents:**
```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

When disabled, the `<available_skills>` section is omitted entirely.

## Troubleshooting

If a skill does not show up:
1. Verify `SKILL.md` is spelled in all caps
2. Check that frontmatter includes `name` and `description`
3. Ensure skill names are unique across all locations
4. Check permissions — skills with `deny` are hidden from agents

## Source

This reference was saved from: https://opencode.ai/docs/skills (last updated: Aug 14, 2026)