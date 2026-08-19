# Send Notification with the Notification Module

In this guide, you'll learn about the different ways to send notifications using the Notification Module.

## Using the Create Method

In your resource, such as a [subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers), resolve the Notification Module's main service and use its `create` method:

```ts title="src/subscribers/product-created.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { INotificationModuleService } from "@medusajs/framework/types"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService: INotificationModuleService =
    container.resolve(Modules.NOTIFICATION)

  await notificationModuleService.createNotifications({
    to: "user@gmail.com",
    channel: "email",
    template: "product-created",
    data,
  })
}

export const config: SubscriberConfig = {
  event: "product.created",
}
```

The `create` method accepts an object or an array of objects having the following properties:

- to: (\`string\`) The destination to send the notification to. When sending an email, it'll be the email address. When sending an SMS, it'll be the phone number.
- channel: (\`string\`) The channel to send the notification through. For example, \`email\` or \`sms\`. The module provider defined for that channel will be used to send the notification.
- template: (\`string\`) The ID of the template used for the notification. This is useful for providers like SendGrid, where you define templates within SendGrid and use their IDs here.
- data: (\`Record\<string, unknown>\`) The data to pass along to the template, if necessary.

For a full list of properties accepted, refer to [this guide](https://docs.medusajs.com/references/notification-provider-module#create).

***

## Using the sendNotificationsStep

If you want to send a notification as part of a workflow, You can use the [sendNotificationsStep](https://docs.medusajs.com/references/medusa-workflows/steps/sendNotificationsStep) in your workflow.

For example:

```ts title="src/workflows/send-email.ts"
import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { 
  sendNotificationsStep, 
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

type WorkflowInput = {
  id: string
}

export const sendEmailWorkflow = createWorkflow(
  "send-email-workflow",
  ({ id }: WorkflowInput) => {
    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: [
        "*",
        "variants.*",
      ],
      filters: {
        id,
      },
    })

    sendNotificationsStep({
      to: "user@gmail.com",
      channel: "email",
      template: "product-created",
      data: {
        product_title: product[0].title,
        product_image: product[0].images[0]?.url,
      },
    })
  }
)
```

For a full list of input properties accepted, refer to the [sendNotificationsStep](https://docs.medusajs.com/references/medusa-workflows/steps/sendNotificationsStep) reference.

You can then execute this workflow in a subscriber, API route, or scheduled job.

For example, you can execute it when a product is created:

```ts title="src/subscribers/product-created.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { sendEmailWorkflow } from "../workflows/send-email"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await sendEmailWorkflow(container).run({
    input: {
      id: data.id,
    },
  })
}

export const config: SubscriberConfig = {
  event: "product.created",
}
```
