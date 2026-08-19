# Redis Workflow Engine Module

The Redis Workflow Engine Module uses Redis to track workflow executions and handle their subscribers. In production, it's recommended to use this module.

Our Cloud offering automatically provisions a Redis instance and configures the Redis Workflow Engine Module for you. Learn more in the [Redis](https://docs.medusajs.com/cloud/redis) Cloud documentation.

***

## Register the Redis Workflow Engine Module

### Prerequisites

- [Redis installed and Redis server running](https://redis.io/docs/getting-started/installation/)

Add the module into the `modules` property of the exported object in `medusa-config.ts`:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.WE_REDIS_URL,
          // ...other Redis options
        },
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the following environment variables:

```bash
WE_REDIS_URL=<YOUR_REDIS_URL>
```

### Redis Workflow Engine Module Options

|Option|Description|Required|
|---|---|---|---|---|
|\`url\`|A string indicating the Redis connection URL.|No. If not provided, you must provide the |
|\`redisUrl\`|A string indicating the Redis connection URL.|No. If not provided, you must provide the |
|\`pubsub\`|A connection object having the following properties:|No. If not provided, you must provide the |
|\`queueName\`|The name of the queue used to keep track of retries and timeouts for workflow executions.|No|
|\`jobQueueName\`|The name of the queue used to keep track of retries and timeouts for scheduled jobs.|No|
|\`options\`|An object of Redis options. Refer to the |No|
|\`redisOptions\`|An object of Redis options. Refer to the |No|
|\`queueOptions\`|An object of options to pass to all BullMQ instances. Refer to |No|
|\`workerOptions\`|An object of options to pass to all BullMQ worker instances. Refer to |No|
|\`mainQueueOptions\`|An object of options to pass to the main BullMQ queue instance for workflows. Refer to |No|
|\`mainWorkerOptions\`|An object of options to pass to the main BullMQ worker instance for workflows. Refer to |No|
|\`jobQueueOptions\`|An object of options to pass to the main BullMQ workflow queue instance for scheduled jobs. Refer to |No|
|\`jobWorkerOptions\`|An object of options to pass to the main BullMQ workflow worker instance for scheduled jobs. Refer to |No|
|\`cleanerQueueOptions\`|An object of options to pass to the BullMQ cleaner queue instance. Refer to |No|
|\`cleanerWorkerOptions\`|An object of options to pass to the BullMQ cleaner worker instance. Refer to |No|

## Test the Module

To test the module, start the Medusa application:

```bash
npm run dev
```

You'll see the following message in the terminal's logs:

```bash
Connection to Redis in module 'workflow-engine-redis' established
```


## Workflows


## Steps
