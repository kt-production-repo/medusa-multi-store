# Store Module

In this section of the documentation, you will find resources to learn more about the Store Module and how to use it in your application.

Refer to the [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/settings/store) to learn how to manage your store using the dashboard.

Medusa has store related features available out-of-the-box through the Store Module. A [module](https://docs.medusajs.com/docs/learn/fundamentals/modules) is a standalone package that provides features for a single domain. Each of Medusa's commerce features are placed in Commerce Modules, such as this Store Module.

Learn more about why modules are isolated in [this documentation](https://docs.medusajs.com/docs/learn/fundamentals/modules/isolation).

## Store Features

- [Store Management](https://docs.medusajs.com/references/store/models/Store): Create and manage stores in your application.
- [Multi-Tenancy Support](https://docs.medusajs.com/references/store/models/Store): While Medusa doesn't natively support multi-tenancy, the Store Module allows you to create and manage multiple stores within a single Medusa instance. You can then build customizations to link products, customers, orders, and other resources to specific stores.

***

## How to Use Store Module's Service

In your Medusa application, you build flows around Commerce Modules. A flow is built as a [Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows), which is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

You can build custom workflows and steps. You can also re-use Medusa's workflows and steps, which are provided by the `@medusajs/medusa/core-flows` package.

For example:

```ts title="src/workflows/create-store.ts"
import { 
  createWorkflow, 
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const createStoreStep = createStep(
  "create-store",
  async ({}, { container }) => {
    const storeModuleService = container.resolve(Modules.STORE)

    const store = await storeModuleService.createStores({
      name: "My Store",
      supported_currencies: [{
        currency_code: "usd",
        is_default: true,
      }],
    })

    return new StepResponse({ store }, store.id)
  },
  async (storeId, { container }) => {
    if(!storeId) {
      return
    }
    const storeModuleService = container.resolve(Modules.STORE)
    
    await storeModuleService.deleteStores([storeId])
  }
)

export const createStoreWorkflow = createWorkflow(
  "create-store",
  () => {
    const { store } = createStoreStep()

    return new WorkflowResponse({ store })
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
import { createStoreWorkflow } from "../../workflows/create-store"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await createStoreWorkflow(req.scope)
    .run()

  res.send(result)
}
```

### Subscriber

```ts title="src/subscribers/user-created.ts"
import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
import { createStoreWorkflow } from "../workflows/create-store"

export default async function handleUserCreated({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const { result } = await createStoreWorkflow(container)
    .run()

  console.log(result)
}

export const config: SubscriberConfig = {
  event: "user.created",
}
```

### Scheduled Job

```ts title="src/jobs/run-daily.ts"
import { MedusaContainer } from "@medusajs/framework/types"
import { createStoreWorkflow } from "../workflows/create-store"

export default async function myCustomJob(
  container: MedusaContainer
) {
  const { result } = await createStoreWorkflow(container)
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
