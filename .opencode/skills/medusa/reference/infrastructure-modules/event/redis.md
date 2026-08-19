# Redis Event Module

The Redis Event Module uses Redis to implement Medusa's pub/sub events system.

It's powered by [BullMQ](https://bullmq.io/) and `io-redis`. BullMQ is responsible for the message queue and worker, and `io-redis` is the underlying Redis client that BullMQ connects to for events storage.

In production, it's recommended to use this module.

Our Cloud offering automatically provisions a Redis instance and configures the Redis Event Module for you. Learn more in the [Redis](https://docs.medusajs.com/cloud/redis) Cloud documentation.

***

## Register the Redis Event Module

### Prerequisites

- [Redis installed and Redis server running](https://redis.io/docs/getting-started/installation/)

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { 
        redisUrl: process.env.EVENTS_REDIS_URL,
        // suggested additional options for production use
        jobOptions: {
          removeOnComplete: {
            // keep jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
          removeOnFail: {
            // keep jobs for 1 hour or up to 1000 jobs
            age: 3600,
            count: 1000,
          },
        },
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the following environment variables:

```bash
EVENTS_REDIS_URL=<YOUR_REDIS_URL>
```

### Redis Event Module Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`redisUrl\`|A string indicating the Redis connection URL.|Yes|-|
|\`redisOptions\`|An object of Redis options. Refer to the |No|-|
|\`queueName\`|A string indicating BullMQ's queue name.|No|\`events-queue\`|
|\`queueOptions\`|An object of options to pass to the BullMQ constructor. Refer to |No|-|
|\`workerOptions\`|An object of options to pass to the BullMQ Worker constructor. Refer to |No|-|
|\`jobOptions\`|An object of options to pass to jobs added to the BullMQ queue. Refer to |No|-|

## Test the Module

To test the module, start the Medusa application:

```bash
npm run dev
```

You'll see the following message in the terminal's logs:

```bash
Connection to Redis in module 'event-redis' established
```
