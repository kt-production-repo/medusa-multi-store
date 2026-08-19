# Locking Module

In this document, you'll learn about the Locking Module and its providers.

## What is the Locking Module?

The Locking Module manages access to shared resources by multiple processes or threads. It prevents conflicts between processes that are trying to access the same resource at the same time, and ensures data consistency.

Medusa uses the Locking Module to control concurrency, avoid race conditions, and protect parts of code that should not be executed by more than one process at a time. This is especially essential in distributed or multi-threaded environments.

For example, Medusa uses the Locking Module in inventory management to ensure that only one transaction can update the stock levels at a time. By using the Locking Module in this scenario, Medusa prevents overselling an inventory item and keeps its quantity amounts accurate, even during high traffic periods or when receiving concurrent requests.

***

## How to Use the Locking Module?

You can use the Locking Module as part of the [workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows) you build for your custom features. A workflow is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

In a workflow, you can either use:

- Medusa's [acquireLockStep](https://docs.medusajs.com/references/medusa-workflows/steps/acquireLockStep) and [releaseLockStep](https://docs.medusajs.com/references/medusa-workflows/steps/releaseLockStep) to create locks around critical steps in your workflow.
- The Locking Module's service directly in your steps to have more control over the locking mechanism

For example:

### Workflow

```ts title="src/workflows/charge-customer.ts"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { acquireLockStep, releaseLockStep } from "@medusajs/medusa/core-flows"
import { chargeCustomerStep } from "./steps/charge-customer-step"

type WorkflowInput = {
  customer_id: string;
  order_id: string;
}

export const chargeCustomerWorkflow = createWorkflow(
  "charge-customer",
  (input: WorkflowInput) => {
    acquireLockStep({
      key: input.order_id,
      // Attempt to acquire the lock for two seconds before timing out
      timeout: 2,
      // Lock is only held for a maximum of ten seconds
      ttl: 10,
    })

    chargeCustomerStep(input)

    releaseLockStep({
      key: input.order_id,
    })
  }
)
```

In the example above, you create a workflow that acquires a lock on an order using the `acquireLockStep` before charging a customer. The lock is then released using the `releaseLockStep` after the operation is complete.

This ensures that only one instance of the workflow can modify the order at a time, preventing issues like double charging the customer.

### Step

***

## When to Use the Locking Module?

You should use the Locking Module when you need to ensure that only one process can access a shared resource at a time. As mentioned in the inventory example previously, you don't want customers to order quantities of inventory that are not available, or to update the stock levels of an item concurrently.

In those scenarios, you can use the Locking Module to acquire a lock for a resource and execute a critical section of code that should not be accessed by multiple processes simultaneously.

***

## What is a Locking Module Provider?

A Locking Module Provider implements the underlying logic of the Locking Module. It manages the locking mechanisms and ensures that only one process can access a shared resource at a time.

Medusa provides [multiple Locking Module Providers](#list-of-locking-module-providers) that are suitable for development and production. You can also create a [custom Locking Module Provider](https://docs.medusajs.com/references/locking-module-provider) to implement custom locking mechanisms or integrate with third-party services.

### Default Locking Module Provider

By default, Medusa uses the In-Memory Locking Module Provider. This provider uses a plain JavaScript map to store the locks. While this is useful for development, it is not recommended for production environments as it is only intended for use in a single-instance environment.

To add more providers, you can register them in the `medusa-config.ts` file. For example:

```ts
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          // add providers here...
        ],
      },
    },
  ],
})
```

When you register other providers in `medusa-config.ts`, Medusa will set the default provider based on the following scenarios:

|Scenario|Default Provider|
|---|---|---|
|One provider is registered.|The registered provider.|
|Multiple providers are registered and none of them has an |In-Memory Locking Module Provider.|
|Multiple providers and one of them has an |The provider with the |

***

## List of Locking Module Providers

Medusa provides the following Locking Module Providers. You can use one of them, or [Create a Locking Module Provider](https://docs.medusajs.com/references/locking-module-provider).

- [Redis](https://docs.medusajs.com/infrastructure-modules/locking/redis)
- [PostgreSQL](https://docs.medusajs.com/infrastructure-modules/locking/postgres)
