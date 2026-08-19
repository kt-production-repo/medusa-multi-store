# In-Memory Workflow Engine Module

The In-Memory Workflow Engine Module uses a plain JavaScript Map object to store the workflow executions.

This module is helpful for development or when you’re testing out Medusa, but it’s not recommended to be used in production.

For production, it’s recommended to use modules like [Redis Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/redis).

***

## Register the In-Memory Workflow Engine Module

The In-Memory Workflow Engine Module is registered by default in your application.

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/workflow-engine-inmemory",
    },
  ],
})
```
