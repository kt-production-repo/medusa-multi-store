# Event Module

In this document, you'll learn what an Event Module is and how to use it in your Medusa application.

## What is an Event Module?

An Event Module implements the underlying publish/subscribe system that handles queueing events, emitting them, and executing their subscribers.

This makes the event architecture customizable, as you can either choose one of Medusa’s event modules or create your own.

Learn more about Medusa's event systems in the [Events and Subscribers documentation](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers).

### Default Event Module

By default, Medusa uses the [Local Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/local). This module uses Node’s EventEmitter to implement the publish/subscribe system. While this is suitable for development, it's recommended to use other Event Modules, such as the [Redis Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/redis), for production. You can also [Create an Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/create).

***

## How to Use the Event Module?

You can use the registered Event Module as part of the [workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows) you build for your custom features. A workflow is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

Medusa provides the helper step [emitEventStep](https://docs.medusajs.com/references/helper-steps/emitEventStep) that you can use in your workflow. You can also resolve the Event Module's service in a step of your workflow and use its methods to emit events.

For example:

```ts
import { Modules } from "@medusajs/framework/utils"
import { 
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  "step-1",
  async ({}, { container }) => {
    const eventModuleService = container.resolve(
      Modules.EVENT_BUS
    )

    await eventModuleService.emit({
      name: "custom.event",
      data: {
        id: "123",
        // other data payload
      },
    })
  } 
)

export const workflow = createWorkflow(
  "workflow-1",
  () => {
    step1()
  }
)
```

In the example above, you create a workflow that has a step. In the step, you resolve the service of the Event Module from the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container).

Then, you use the `emit` method of the Event Module to emit an event with the name `"custom.event"` and the data payload `{ id: "123" }`.

***

## List of Event Modules

Medusa provides the following Event Modules. You can use one of them, or [Create an Event Module](https://docs.medusajs.com/resources/infrastructure-modules/event/create).

- [Local](https://docs.medusajs.com/infrastructure-modules/event/local)
- [Redis](https://docs.medusajs.com/infrastructure-modules/event/redis)
