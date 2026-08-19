# In-Memory Cache Module

The In-Memory Cache Module uses a plain JavaScript Map object to store the cached data. This module is used by default in your Medusa application.

This module is helpful for development or when you’re testing out Medusa, but it’s not recommended to be used in production.

For production, it’s recommended to use modules like [Redis Cache Module](https://docs.medusajs.com/resources/infrastructure-modules/cache/redis).

The In-Memory Cache Module is deprecated starting from [Medusa v2.11.0](https://github.com/medusajs/medusa/releases/tag/v2.11.0). Use the [Caching Module](https://docs.medusajs.com/resources/infrastructure-modules/caching) instead.

***

## Register the In-Memory Cache Module

The In-Memory Cache Module is registered by default in your application.

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"
// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/cache-inmemory",
      options: {
        // optional options
      },
    },
  ],
})
```

### In-Memory Cache Module Options

|Option|Description|Default|
|---|---|---|---|---|
|\`ttl\`|The number of seconds an item can live in the cache before it’s removed.|\`30\`|
