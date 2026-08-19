# Redis Cache Module

The Redis Cache Module uses Redis to cache data in your store. In production, it's recommended to use this module.

The Redis Cache Module is deprecated starting from [Medusa v2.11.0](https://github.com/medusajs/medusa/releases/tag/v2.11.0). Use the [Redis Caching Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/caching/providers/redis) instead.

***

## Register the Redis Cache Module

### Prerequisites

- [Redis installed and Redis server running](https://redis.io/docs/getting-started/installation/)

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: { 
        redisUrl: process.env.CACHE_REDIS_URL,
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the following environment variables:

```bash
CACHE_REDIS_URL=<YOUR_REDIS_URL>
```

### Redis Cache Module Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`redisUrl\`|A string indicating the Redis connection URL.|Yes|-|
|\`redisOptions\`|An object of Redis options. Refer to the |No|-|
|\`ttl\`|The number of seconds an item can live in the cache before it’s removed.|No|\`30\`|
|\`namespace\`|A string used to prefix all cached keys with |No|\`medusa\`|

***

## Test the Module

To test the module, start the Medusa application:

```bash
npm run dev
```

You'll see the following message in the terminal's logs:

```bash
Connection to Redis in module 'cache-redis' established
```
