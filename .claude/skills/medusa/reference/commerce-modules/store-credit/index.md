# Store Credit Module

In this section of the documentation, you will find resources to learn more about the Store Credit Module and how to use it in your application.

The Store Credit Module is part of the Loyalty Plugin. It's compatible with Medusa v2.14.0+.

Refer to the [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/loyalty/store-credits) to learn how to manage store credit using the dashboard.

Medusa has store-credit related features available through the Store Credit Module. A [module](https://docs.medusajs.com/docs/learn/fundamentals/modules) is a standalone package that provides features for a single domain. Each of Medusa's commerce features are placed in Commerce Modules, such as this Store Credit Module.

Learn more about why modules are isolated in [this documentation](https://docs.medusajs.com/docs/learn/fundamentals/modules/isolation).

## Features

- [Store Credit Accounts](https://docs.medusajs.com/resources/commerce-modules/store-credit/concepts#store-credit-account): Create and manage customer store credit accounts
- [Credit Transactions](https://docs.medusajs.com/resources/commerce-modules/store-credit/concepts#store-credit-account): Credit and debit operations with full transaction history
- [Balance Tracking](https://docs.medusajs.com/resources/commerce-modules/store-credit/concepts#store-credit-balance-calculation): Real-time balance calculation and reporting
- [Cart Integration](https://docs.medusajs.com/resources/commerce-modules/store-credit/concepts#during-checkout): Apply store credits as payment during checkout

***

## How to Use the Store Credit Module

### 1. Install the Loyalty Plugin

The Store Credit Module is part of the Loyalty Plugin. So, install the loyalty plugin:

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

### 2. Run Migrations

After installing the plugin, run the migrations to create the necessary tables in the database:

```bash
npx medusa db:migrate
```

### 3. Use Store Credit Features in Your Application

In your Medusa application, you build flows around Commerce Modules. A flow is built as a [Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows), which is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

You can build custom workflows and steps. You can also re-use the Loyalty Plugin's workflows and steps.

For example:

```ts title="src/workflows/create-store-credit.ts"
import { 
  createWorkflow, 
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

const createStoreCreditStep = createStep(
  "create-store-credit-account",
  async ({}, { container }) => {
    const storeCreditModuleService = container.resolve("store_credit")

    const storeCreditAccount = await storeCreditModuleService.createStoreCreditAccounts({
      code: "test-code",
      customer_id: "customer_123",
      currency_code: "usd",
    })

    return new StepResponse({ storeCreditAccount }, storeCreditAccount.id)
  },
  async (storeCreditAccountId, { container }) => {
    const storeCreditModuleService = container.resolve("store_credit")

    await storeCreditModuleService.deleteStoreCreditAccounts([storeCreditAccountId])
  }
)

export const createStoreCreditWorkflow = createWorkflow(
  "create-store-credit-account",
  () => {
    const { storeCreditAccount } = createStoreCreditStep()

    return new WorkflowResponse({
      storeCreditAccount,
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
import { createStoreCreditWorkflow } from "../../workflows/create-store-credit"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await createStoreCreditWorkflow(req.scope)
    .run()

  res.send(result)
}
```

### Subscriber

```ts title="src/subscribers/customer-created.ts"
import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
import { createStoreCreditWorkflow } from "../workflows/create-store-credit"

export default async function handleCustomerCreated({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const { result } = await createStoreCreditWorkflow(container)
    .run()

  console.log(result)
}

export const config: SubscriberConfig = {
  event: "customer.created",
}
```

### Scheduled Job

```ts title="src/jobs/run-daily.ts"
import { MedusaContainer } from "@medusajs/framework/types"
import { createStoreCreditWorkflow } from "../workflows/create-store-credit"

export default async function myCustomJob(
  container: MedusaContainer
) {
  const { result } = await createStoreCreditWorkflow(container)
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
