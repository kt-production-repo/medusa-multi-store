# How to Use the Workflow Engine Module

In this document, you’ll learn about the different methods in the Workflow Engine Module's service and how to use them.

***

## Resolve Workflow Engine Module's Service

In your workflow's step, you can resolve the Workflow Engine Module's service from the Medusa container:

```ts
import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const workflowEngineModuleService = container.resolve(
      Modules.WORKFLOW_ENGINE
    )
    
    // TODO use workflowEngineModuleService
  } 
)
```

This will resolve the service of the configured Workflow Engine Module, which is the [In-Memory Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/in-memory) by default.

You can then use the Workflow Engine Module's service's methods in the step. The rest of this guide details these methods.

***

## retryStep

This method retries a step that has temporary failed, such as a step that has `autoRetry` set to `false` or when the machine running the Medusa application shuts down. Learn more about it in the [Retry Failed Steps](https://docs.medusajs.com/docs/learn/fundamentals/workflows/retry-failed-steps) guide.

This method is available since [Medusa v2.10.2](https://github.com/medusajs/medusa/releases/tag/v2.10.2).

### Example

```ts
// other imports...
import {
  TransactionHandlerType,
} from "@medusajs/framework/utils"

workflowEngine.retryStep({
  idempotencyKey: {
    action: TransactionHandlerType.INVOKE,
    transactionId,
    stepId: "step-1",
    workflowId: "hello-world",
  },
})
```

### Parameters

- idempotencyKey: (\`object\`) The details of the step to retry.

  - action: (\`invoke\` | \`compensate\`) If the step's compensation function is running, use \`compensate\`. Otherwise, use \`invoke\`.

  - transactionId: (\`string\`) The ID of the workflow execution's transaction.

  - stepId: (\`string\`) The ID of the step to change its status. This is the first parameter passed to \`createStep\` when creating the step.

  - workflowId: (\`string\`) The ID of the workflow. This is the first parameter passed to \`createWorkflow\` when creating the workflow.
- options: (\`object\`) Options to pass to the step.

  - container: (\`Container\`) An instance of the Medusa container.

***

## setStepSuccess

This method sets an async step in a currently-executing [long-running workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows/long-running-workflow) as successful. The workflow will then continue to the next step.

### Example

```ts
// other imports...
import {
  TransactionHandlerType,
} from "@medusajs/framework/utils"

await workflowEngineModuleService.setStepSuccess({
  idempotencyKey: {
    action: TransactionHandlerType.INVOKE,
    transactionId,
    stepId: "step-2",
    workflowId: "hello-world",
  },
  stepResponse: new StepResponse("Done!"),
})
```

### Parameters

- idempotencyKey: (\`object\`) The details of the step to set as successful.

  - action: (\`invoke\` | \`compensate\`) If the step's compensation function is running, use \`compensate\`. Otherwise, use \`invoke\`.

  - transactionId: (\`string\`) The ID of the workflow execution's transaction.

  - stepId: (\`string\`) The ID of the step to change its status. This is the first parameter passed to \`createStep\` when creating the step.

  - workflowId: (\`string\`) The ID of the workflow. This is the first parameter passed to \`createWorkflow\` when creating the workflow.
- stepResponse: (\`StepResponse\`) Set the response of the step. This is similar to the response you return in a step's definition, but since the async step doesn't have a response, you set its response when changing its status.
- options: (\`object\`) Options to pass to the step.

  - container: (\`Container\`) An instance of the Medusa container.

***

## setStepFailure

This method sets an async step in a currently-executing [long-running workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows/long-running-workflow) as failed. The workflow will then stop executing and the compensation functions of the workflow's steps will be executed.

### Example

```ts
// other imports...
import {
  TransactionHandlerType,
} from "@medusajs/framework/utils"

await workflowEngineModuleService.setStepFailure({
  idempotencyKey: {
    action: TransactionHandlerType.INVOKE,
    transactionId,
    stepId: "step-2",
    workflowId: "hello-world",
  },
  stepResponse: new StepResponse("Failed!"),
})
```

### Parameters

- idempotencyKey: (\`object\`) The details of the step to set as failed.

  - action: (\`invoke\` | \`compensate\`) If the step's compensation function is running, use \`compensate\`. Otherwise, use \`invoke\`.

  - transactionId: (\`string\`) The ID of the workflow execution's transaction.

  - stepId: (\`string\`) The ID of the step to change its status. This is the first parameter passed to \`createStep\` when creating the step.

  - workflowId: (\`string\`) The ID of the workflow. This is the first parameter passed to \`createWorkflow\` when creating the workflow.
- stepResponse: (\`StepResponse\`) Set the response of the step. This is similar to the response you return in a step's definition, but since the async step doesn't have a response, you set its response when changing its status.
- options: (\`object\`) Options to pass to the step.

  - container: (\`Container\`) An instance of the Medusa container.

***

## subscribe

This method subscribes to a workflow's events. You can use this method to listen to a [long-running workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows/long-running-workflow)'s events and retrieve its result once it's done executing.

Refer to the [Long-Running Workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows/long-running-workflow#access-long-running-workflow-status-and-result) documentation to learn more.

### Example

```ts
const { transaction } = await helloWorldWorkflow(container).run()

const subscriptionOptions = {
  workflowId: "hello-world",
  transactionId: transaction.transactionId,
  subscriberId: "hello-world-subscriber",
}

await workflowEngineModuleService.subscribe({
  ...subscriptionOptions,
  subscriber: async (data) => {
    if (data.eventType === "onFinish") {
      console.log("Finished execution", data.result)
      // unsubscribe
      await workflowEngineModuleService.unsubscribe({
        ...subscriptionOptions,
        subscriberOrId: subscriptionOptions.subscriberId,
      })
    } else if (data.eventType === "onStepFailure") {
      console.log("Workflow failed", data.step)
    }
  },
})
```

### Parameters

- subscriptionOptions: (\`object\`) The options for the subscription.

  - workflowId: (\`string\`) The ID of the workflow to subscribe to. This is the first parameter passed to \`createWorkflow\` when creating the workflow.

  - transactionId: (\`string\`) The ID of the workflow execution's transaction. This is returned when you execute a workflow.

  - subscriberId: (\`string\`) A unique ID for the subscriber. It's used to unsubscribe from the workflow's events.

  - subscriber: (\`(data: WorkflowEvent) => void\`) The subscriber function that will be called when the workflow emits an event.

***

## unsubscribe

This method unsubscribes from a workflow's events. You can use this method to stop listening to a [long-running workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows/long-running-workflow)'s events after you've received the result.

### Example

```ts
await workflowEngineModuleService.unsubscribe({
  workflowId: "hello-world",
  transactionId: "transaction-id",
  subscriberOrId: "hello-world-subscriber",
})
```

### Parameters

- workflowId: (\`string\`) The ID of the workflow to unsubscribe from. This is the first parameter passed to \`createWorkflow\` when creating the workflow.
- transactionId: (\`string\`) The ID of the workflow execution's transaction. This is returned when you execute a workflow.
- subscriberOrId: (\`string\`) The subscriber ID or the subscriber function to unsubscribe from the workflow's events.
