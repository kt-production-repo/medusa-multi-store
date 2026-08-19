# Local Event Module

The Local Event Module uses Node EventEmitter to implement Medusa's pub/sub events system. The Node EventEmitter is limited to a single process environment.

This module is useful for development and testing, but it’s not recommended to be used in production.

For production, it’s recommended to use modules like [Redis Event Bus Module](https://docs.medusajs.com/resources/infrastructure-modules/event/redis).

***

## Register the Local Event Module

The Local Event Module is registered by default in your application.

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-local",
    },
  ],
})
```

***

## Test the Module

To test the module, start the Medusa application:

```bash
npm run dev
```

You'll see the following message in the terminal's logs:

```bash
Local Event Bus installed. This is not recommended for production.
```
