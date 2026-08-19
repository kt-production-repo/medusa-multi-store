# Settings Module

In this section of the documentation, you will find resources to learn more about the Settings Module and how to use it in your application.

Refer to the [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/tips/table-views) to learn how to customize data tables and manage views in the dashboard.

Medusa has admin personalization and configuration features available out-of-the-box through the Settings Module. A [module](https://docs.medusajs.com/docs/learn/fundamentals/modules) is a standalone package that provides features for a single domain. Each of Medusa's commerce features is provided in Commerce Modules, such as the Settings Module.

The Settings Module powers dashboard personalization features, such as configuring data tables, customizing page layouts, and storing user preferences.

Refer to the [Module Isolation](https://docs.medusajs.com/docs/learn/fundamentals/modules/isolation) guide to learn more about why modules are isolated.

## Settings Features

- [View Configurations](https://docs.medusajs.com/resources/commerce-modules/settings/view-configurations): Store data-table views for an entity, including visible columns, column order and widths, filters, sorting, and search. Views can be personal to a user or a shared system default.
- [Layout Configurations](https://docs.medusajs.com/resources/commerce-modules/settings/layout-configurations): Store per-zone layout preferences, such as the order and visibility of sections on a page, for a user or as a shared system default.
- [Property Labels](https://docs.medusajs.com/resources/commerce-modules/settings/property-labels): Set custom, translatable labels and descriptions for an entity's properties.
- [User Preferences](https://docs.medusajs.com/resources/commerce-modules/settings/user-preferences): Store arbitrary preferences for a user as key-value pairs.

***

## How to Use the Settings Module

In your Medusa application, you build flows around Commerce Modules. A flow is built as a [Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows), which is a special function composed of a series of steps that guarantees data consistency and a reliable rollback mechanism.

You can build custom workflows and steps. You can also re-use Medusa's workflows and steps, which are provided by the `@medusajs/medusa/core-flows` package.

For example:

```ts title="src/workflows/set-preference.ts"
import { 
  createWorkflow, 
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

const setPreferenceStep = createStep(
  "set-preference",
  async ({}, { container }) => {
    const settingsModuleService = container.resolve(Modules.SETTINGS)

    const preference = await settingsModuleService
      .setUserPreference("user_123", "theme", {
        mode: "dark",
      })

    return new StepResponse({ preference })
  }
)

export const setPreferenceWorkflow = createWorkflow(
  "set-preference",
  () => {
    const { preference } = setPreferenceStep()

    return new WorkflowResponse({
      preference,
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
import { setPreferenceWorkflow } from "../../workflows/set-preference"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await setPreferenceWorkflow(req.scope)
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
import { setPreferenceWorkflow } from "../workflows/set-preference"

export default async function handleUserCreated({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const { result } = await setPreferenceWorkflow(container)
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
import { setPreferenceWorkflow } from "../workflows/set-preference"

export default async function myCustomJob(
  container: MedusaContainer
) {
  const { result } = await setPreferenceWorkflow(container)
    .run()

  console.log(result)
}

export const config = {
  name: "run-once-a-day",
  schedule: `0 0 * * *`,
}
```

Refer to the [Workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows) documentation to learn more.

***
