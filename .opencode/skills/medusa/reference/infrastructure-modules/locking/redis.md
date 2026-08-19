# Redis Locking Module Provider

The Redis Locking Module Provider uses Redis to manage locks across multiple instances of Medusa. Redis ensures that locks are globally available, which is ideal for distributed environments.

This provider is recommended for production environments where Medusa is running in a multi-instance setup.

Our Cloud offering automatically provisions a Redis instance and configures the Redis Locking Module Provider for you. Learn more in the [Redis](https://docs.medusajs.com/cloud/redis) Cloud documentation.

***

## Register the Redis Locking Module Provider

### Prerequisites

- [A redis server set up locally or a database in your deployed application.](https://redis.io/download)

To register the Redis Locking Module Provider, add it to the list of providers of the Locking Module in `medusa-config.ts`:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            // set this if you want this provider to be used by default
            // and you have other Locking Module Providers registered.
            is_default: true,
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the following environment variable:

```bash
LOCKING_REDIS_URL=<YOUR_LOCKING_REDIS_URL>
```

Where `<YOUR_LOCKING_REDIS_URL>` is the URL of your Redis server, either locally or in the deployed environment.

The default Redis URL in a local environment is `redis://localhost:6379`.

### Redis Locking Module Provider Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`redisUrl\`|A string indicating the Redis connection URL.|Yes|-|
|\`redisOptions\`|An object of Redis options. Refer to the |No|-|
|\`namespace\`|A string used to prefix all locked keys with |No|\`medusa\_lock:\`|
|\`waitLockingTimeout\`|A number indicating the default timeout (in seconds) to wait while acquiring a lock. This timeout is used when no timeout is specified when executing an asynchronous job or acquiring a lock.|No|\`5\`|
|\`defaultRetryInterval\`|A number indicating the time (in milliseconds) to wait before retrying to acquire a lock.|No|\`20\`|
|\`maximumRetryInterval\`|A number indicating the maximum time (in milliseconds) to wait before retrying to acquire a lock.|No|\`1000\`|
|\`backoffFactor\`|A number indicating the multiplier used for exponential backoff when retrying to acquire a lock. Each retry will wait longer than the previous one by this factor.|No|\`2\`|

***

## Test out the Module

To test out the Redis Locking Module Provider, start the Medusa application:

```bash
npm run dev
```

You'll see the following message logged in the terminal:

```bash
info:    Connection to Redis in "locking-redis" provider established
```

This message indicates that the Redis Locking Module Provider has successfully connected to the Redis server.

If you set the `is_default` flag to `true` in the provider options or you only registered the Redis Locking Module Provider, the Locking Module will use it by default for all locking operations.

***

## Use Provider with Locking Module

The Redis Locking Module Provider will be the default provider if you don't register any other providers, or if you set the `is_default` flag to `true`:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              // ...
            },
          },
        ],
      },
    },
  ],
})
```

If you use the Locking Module in your customizations, the Redis Locking Module Provider will be used by default in this case. You can also explicitly use this provider by passing its identifier `lp_locking-redis` to the Locking Module's service methods.

For example, when using the `acquire` method in a [workflow step](https://docs.medusajs.com/docs/learn/fundamentals/workflows):

```ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const lockingModuleService = container.resolve(
      Modules.LOCKING
    )

    await lockingModuleService.acquire("prod_123", {
      provider: "lp_locking-redis",
    })
  } 
)
```
