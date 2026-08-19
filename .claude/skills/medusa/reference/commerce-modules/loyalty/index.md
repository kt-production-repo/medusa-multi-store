# Loyalty Module

In this section of the documentation, you will find resources to learn more about the Loyalty Module and how to use it in your application.

The Loyalty Module is part of the Loyalty Plugin. It's compatible with Medusa v2.14.0+.

Refer to the [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/loyalty) to learn how to manage gift cards using the dashboard.

Medusa has loyalty related features available through the Loyalty Module. A [module](https://docs.medusajs.com/docs/learn/fundamentals/modules) is a standalone package that provides features for a single domain. Each of Medusa's commerce features are placed in Commerce Modules, such as this Loyalty Module.

Learn more about why modules are isolated in [this documentation](https://docs.medusajs.com/docs/learn/fundamentals/modules/isolation).

## Features

- [Gift Card Products](https://docs.medusajs.com/resources/commerce-modules/loyalty/gift-cards#gift-card-products): Create physical or digital gift cards as products that customers can purchase
- [Gift Card Management](https://docs.medusajs.com/user-guide/loyalty/gift-cards): Issue, redeem, and track gift cards with unique codes
- [Cart Integration](https://docs.medusajs.com/resources/commerce-modules/loyalty/gift-cards#2-apply-to-cart): Apply gift cards as payment during checkout

***

## How to Use the Loyalty Module

### 1. Install the Loyalty Plugin

The Loyalty Module is part of the Loyalty Plugin. So, install the loyalty plugin:

```bash
npm install @medusajs/loyalty-plugin
```

Then, add it to your `medusa-config.js`:

```js title="medusa-config.js"
module.exports = defineConfig({
  // ... other configurations
  plugins: [
    {
      resolve: `@medusajs/loyalty-plugin`,
      options: {},
    },
    // ... other plugins
  ],
})
```

Refer to the [Plugin Options](https://docs.medusajs.com/resources/commerce-modules/loyalty/module-options) guide for a full list of options you can pass to the Loyalty Plugin.

### 2. Run Migrations

After installing the plugin, run the migrations to create the necessary tables in the database:

```bash
npx medusa db:migrate
```

### 3. Use Loyalty Features in Your Application

In your Medusa application, you build flows around Commerce Modules. A flow is built as a [Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows), which is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

You can build custom workflows and steps. You can also re-use the Loyalty Plugin's workflows and steps.

For example:

```ts title="src/workflows/create-gift-card.ts"
import { 
  createWorkflow, 
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

const createGiftCardStep = createStep(
  "create-gift-card",
  async ({}, { container }) => {
    const loyaltyModuleService = container.resolve("loyalty")

    const giftCard = await loyaltyModuleService.createGiftCards({
      code: "test-code",
      value: 50,
      currency_code: "usd",
      expires_at: null,
      reference_id: "order_123",
      reference: "order",
      line_item_id: "litem_123",
      customer_id: "customer_123",
    })

    return new StepResponse({ giftCard }, giftCard.id)
  },
  async (giftCardId, { container }) => {
    const loyaltyModuleService = container.resolve("loyalty")

    await loyaltyModuleService.deleteGiftCards([giftCardId])
  }
)

export const createGiftCardWorkflow = createWorkflow(
  "create-gift-card",
  () => {
    const { giftCard } = createGiftCardStep()

    return new WorkflowResponse({
      giftCard,
    })
  }
)
```

You can then execute the workflow in your custom API routes, scheduled jobs, or subscribers:

### API Route

```ts title="src/api/workflow/route.ts"
import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createGiftCardWorkflow } from "../../workflows/create-gift-card"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await createGiftCardWorkflow(req.scope)
    .run()

  res.send(result)
}
```

### Subscriber

```ts title="src/subscribers/order-created.ts"
import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
import { createGiftCardWorkflow } from "../workflows/create-gift-card"

export default async function handleOrderCreated({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const { result } = await createGiftCardWorkflow(container)
    .run()

  console.log(result)
}

export const config: SubscriberConfig = {
  event: "order.created",
}
```

### Scheduled Job

```ts title="src/jobs/run-daily.ts"
import { MedusaContainer } from "@medusajs/framework/types"
import { createGiftCardWorkflow } from "../workflows/create-gift-card"

export default async function myCustomJob(
  container: MedusaContainer
) {
  const { result } = await createGiftCardWorkflow(container)
    .run()

  console.log(result)
}

export const config = {
  name: "run-once-a-day",
  schedule: `0 0 * * *`,
}
```

Learn more about workflows in [this documentation](https://docs.medusajs.com/docs/learn/fundamentals/workflows).

***
