# lint Command - Medusa CLI Reference

This command is available since Medusa [v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0).

Lint your project using its ESLint configuration.

```bash
npx medusa lint
```

The command requires a flat ESLint config file (`eslint.config.js`, `eslint.config.mjs`, or similar). Config detection uses ESLint's own resolution, which walks ancestor directories, so a config at a monorepo root applies to nested projects. If no config file is found, the command exits with an error.

The `eslint` package must be installed in your project. It is a peer dependency of `@medusajs/eslint-plugin`.

## Arguments

|Argument|Description|
|---|---|
|\`\[paths...]\`|Files or directories to lint. Defaults to the whole project.|

## Options

|Option|Description|Default|
|---|---|---|
|\`--fix\`|Auto-fix lint issues where possible.|\`false\`|
|\`--quiet\`|Report lint errors only, suppressing warnings.|\`false\`|

## Exit Codes

The command exits with code `1` when lint errors are found. It exits with code `0` when only warnings are produced or no issues are found.
