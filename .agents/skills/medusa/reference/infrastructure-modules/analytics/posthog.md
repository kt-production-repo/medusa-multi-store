# PostHog Analytics Module Provider

The PostHog Analytics Module Provider allows you to integrate [PostHog](https://posthog.com/) with Medusa.

PostHog is an open-source product analytics platform that helps you track user interactions and analyze user behavior in your commerce application.

By integrating PostHog with Medusa, you can track events such as cart additions, order completions, and user sign-ups, enabling you to gain insights into user behavior and optimize your application accordingly.

The Analytics Module and its providers are available starting [Medusa v2.8.3](https://github.com/medusajs/medusa/releases/tag/v2.8.3).

***

## Register the PostHog Analytics Module

### Prerequisites

- [PostHog account](https://app.posthog.com/signup)
- [PostHog API Key](https://posthog.com/docs/api)

Add the module into the `provider` object of the Analytics Module:

You can use only one provider in your Medusa application.

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/analytics",
      options: {
        providers: [
          {
            resolve: "@medusajs/analytics-posthog",
            id: "posthog",
            options: {
              posthogEventsKey: process.env.POSTHOG_EVENTS_API_KEY,
              posthogHost: process.env.POSTHOG_HOST,
            },
          },
        ],
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the following environment variables:

```bash
POSTHOG_EVENTS_API_KEY=<YOUR_POSTHOG_EVENTS_API_KEY>
POSTHOG_HOST=<YOUR_POSTHOG_HOST>
```

### PostHog Analytics Module Options

|Option|Description|Default|
|---|---|---|
|\`eventsKey\`|The PostHog API key for tracking events. This is required to authenticate your requests to the PostHog API.|-|
|\`posthogHost\`|The PostHog API host URL.|\`https://eu.i.posthog.com\`|

***

## Test out the Module

To test the module out, you'll track in PostHog when an order is placed.

You'll first create a [workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows) that tracks the order completion event. Then, you can execute the workflow in a [subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers) that listens to the `order.placed` event.

For example, create a workflow at `src/workflows/track-order-placed.ts` with the following content:

```ts title="src/workflows/track-order-placed.ts"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { Modules } from "@medusajs/framework/utils"
import { OrderDTO } from "@medusajs/framework/types"

type StepInput = {
  order: OrderDTO
}

const trackOrderPlacedStep = createStep(
  "track-order-placed-step",
  async ({ order }: StepInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "order_placed",
      actor_id: order.customer_id,
      properties: {
        order_id: order.id,
        total: order.total,
        items: order.items?.map((item) => ({
          variant_id: item.variant_id,
          product_id: item.product_id,
          quantity: item.quantity,
        })),
        customer_id: order.customer_id,
      },
    })
  }
)

type WorkflowInput = {
  order_id: string
}

export const trackOrderPlacedWorkflow = createWorkflow(
  "track-order-placed-workflow",
  ({ order_id }: WorkflowInput) => {
    const { data: orders } = useQueryGraphStep({
      entity: "order",
      fields: [
        "*",
        "customer.*",
        "items.*",
      ],
      filters: {
        id: order_id,
      },
    })
    trackOrderCreatedStep({
      order: orders[0],
    } as unknown as StepInput)
  }
)
```

This workflow retrieves the order details using the `useQueryGraphStep` and then tracks the order placement event using the `trackOrderPlacedStep`.

In the step, you resolve the service of the Analytics Module from the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container) and use its `track` method to track the event. This method will use the underlying provider configured (which is the PostHog Analytics Module Provider, in this case) to track the event.

Next, create a subscriber at `src/subscribers/order-placed.ts` with the following content:

```ts title="src/subscribers/order-placed.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { trackOrderPlacedWorkflow } from "../workflows/track-order-placed"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await trackOrderPlacedWorkflow(container).run({
    input: {
      order_id: data.id,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

This subscriber listens to the `order.placed` event and executes the `trackOrderPlacedWorkflow` workflow, passing the order ID as input.

You'll now track the order placement event whenever an order is placed in your Medusa application. You can test this out by placing an order and checking your PostHog dashboard for the tracked event.

***

## Additional Resources

- [How to Use the Analytics Module](https://docs.medusajs.com/references/analytics/service)
