# develop Command - Medusa CLI Reference

Start the Medusa application in development.

This command watches files for any changes, then rebuilds the files and restarts the Medusa application.

```bash
npx medusa develop
```

## Options

|Option|Description|Default|
|---|---|---|---|---|
|\`-H \<host>\`|Set the host of the Medusa server.|\`localhost\`|
|\`-p \<port>\`|Set the port of the Medusa server.|\`9000\`|
|\`--lint\`|Run the Medusa linter before starting the dev server. Pass |\`true\`|
|\`--fix\`|Auto-fix lint issues where possible before starting the dev server.|\`false\`|
