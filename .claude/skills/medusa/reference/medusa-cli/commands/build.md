# build Command - Medusa CLI Reference

Create a standalone build of the Medusa application that you can deploy to production.

This creates a build that:

- Doesn't rely on the source TypeScript files.
- Can be copied to a production server reliably.

The build is output to a new `.medusa/server` directory.

```bash
npx medusa build
```

Refer to the [Build Medusa Application](https://docs.medusajs.com/docs/learn/build) guide for next steps.

## Options

|Option|Description|Default|
|---|---|---|
|\`--admin-only\`|Whether to build only the admin to host it separately. If this option is not passed, the admin is built to the |\`false\`|
|\`--lint\`|Run the Medusa linter before building. Pass |\`true\`|
|\`--fix\`|Auto-fix lint issues where possible before building.|\`false\`|
|\`--quiet\`|Report lint errors only, suppressing warnings.|\`false\`|

***

## Build Medusa Admin

By default, the Medusa Admin is built to the `.medusa/server/public/admin` directory.

If you want a separate build to host the admin as a standalone application, such as on Vercel, pass the `--admin-only` option as explained in the [Options](#options) section. This outputs the admin to the `.medusa/admin` directory instead.

By default, the Medusa Admin dashboard is hosted at the `/app` path. You can change it with the `admin.path` configuration in `medusa-config.ts`.

For example, to serve it from the root path `/` when hosting on a separate domain:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  admin: {
    path: "/",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  // ...
})
```

The admin will now run at `/` of your application. For example, at `acme.com`.
