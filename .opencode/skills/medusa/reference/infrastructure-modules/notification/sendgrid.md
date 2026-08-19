# SendGrid Notification Module Provider

The SendGrid Notification Module Provider integrates [SendGrid](https://sendgrid.com) to send emails to users and customers.

Cloud offers [Medusa Emails](https://docs.medusajs.com/cloud/emails), a managed email service that allows you to send transactional emails with zero configuration. It is built on top of the Notification Module and provides an easy way to manage email notifications in your Cloud projects with insights and deliverability features.

## Register the SendGrid Notification Module

### Prerequisites

- [SendGrid account](https://signup.sendgrid.com)
- [Setup SendGrid single sender](https://docs.sendgrid.com/ui/sending-email/sender-verification)
- [SendGrid API Key](https://docs.sendgrid.com/ui/account-and-settings/api-keys)

Add the module into the `providers` array of the Notification Module:

Only one provider can be defined for a channel.

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          // ...
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              channels: ["email"],
              api_key: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM,
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
SENDGRID_API_KEY=<YOUR_SENDGRID_API_KEY>
SENDGRID_FROM=<YOUR_SENDGRID_FROM>
```

### SendGrid Notification Module Options

|Option|Description|
|---|---|---|
||The channels this notification module is used to send notifications for.
Only one provider can be defined for a channel.|
|
|
|
|

## SendGrid Templates

When you send a notification, you must specify the ID of the template to use in SendGrid.

Refer to [this SendGrid documentation guide](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates) on how to create templates for your different email types.

## Advanced SendGrid Features

### Custom Personalizations

This feature is available since Medusa [v2.14.0](https://github.com/medusajs/medusa/releases/tag/v2.14.0).

You can use SendGrid's [personalizations](https://docs.sendgrid.com/api-reference/mail-send/mail-send#request-body-parameters-personalizations) feature to send customized emails to multiple recipients or include additional SendGrid-specific options.

Personalizations are useful for scenarios like:

- Sending batch emails with different content for each recipient
- Setting custom subject lines per recipient
- Adding CC/BCC recipients for specific emails
- Including additional headers or metadata

Pass the personalizations in the `provider_data` when creating a notification:

```ts
await notificationModuleService.createNotifications({
  channel: "email",
  template: "custom-template",
  provider_data: {
    personalizations: [
      {
        to: [{ email: "recipient1@example.com", name: "John Doe" }],
        dynamic_template_data: {
          name: "John",
          customField: "value1",
        },
        subject: "Custom Subject for John",
      },
      {
        to: [{ email: "recipient2@example.com", name: "Jane Smith" }],
        dynamic_template_data: {
          name: "Jane",
          customField: "value2",
        },
        subject: "Custom Subject for Jane",
      },
    ],
  },
})
```

When `personalizations` are provided, they take precedence over the `to` field and `data` field in the notification. Each personalization can include:

- `to`: Array of recipient objects with email and optional name
- `dynamic_template_data`: Template variables specific to this recipient group
- `subject`: Custom subject line for this personalization
- Other SendGrid personalization options like `cc`, `bcc`, `headers`, etc.

You still need to pass `to` at the root level of the `createNotifications` parameter, but it will be ignored when `personalizations` are provided.

***

## Test out the Module

To test the module out, you'll listen to the `product.created` event and send an email when a product is created.

Create a [subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers) at `src/subscribers/product-created.ts` with the following content:

```ts title="src/subscribers/product-created.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function productCreateHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve("query")

  const { data: [product] } = await query.graph({
    entity: "product",
    fields: ["*"],
    filters: {
      id: data.id,
    },
  })

  await notificationModuleService.createNotifications({
    to: "test@gmail.com",
    channel: "email",
    template: "product-created",
    data: {
      product_title: product.title,
      product_image: product.images[0]?.url,
    },
  })
}

export const config: SubscriberConfig = {
  event: "product.created",
}
```

In this subscriber, you:

- Resolve the Notification Module's main service and [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query) from the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container).
- Retrieve the product's details using Query to pass them to the template in SendGrid.
- Use the `createNotifications` method of the Notification Module's main service to create a notification to be sent to the specified email. By specifying the `email` channel, the SendGrid Notification Module Provider is used to send the notification.
- The `template` property of the `createNotifications` method's parameter specifies the ID of the template defined in SendGrid.
- The `data` property allows you to pass data to the template in SendGrid. For example, the product's title and image.

Then, start the Medusa application:

```bash
npm run dev
```

And create a product either using the [API route](https://docs.medusajs.com/api/admin/products/create-product) or the [Medusa Admin](https://docs.medusajs.com/user-guide/products/create). This runs the subscriber and sends an email using SendGrid.

### Other Events to Handle

Medusa emits other events that you can handle to send notifications using the SendGrid Notification Module Provider, such as `order.placed` when an order is placed.

Refer to the [Events Reference](https://docs.medusajs.com/references/events) for a complete list of events emitted by Medusa.

### Sending Emails with SendGrid in Workflows

You can also send an email using SendGrid in any [workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows). This allows you to send emails within your custom flows.

You can use the [sendNotificationsStep](https://docs.medusajs.com/references/medusa-workflows/steps/sendNotificationsStep) in your workflow to send an email using SendGrid.

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
      to: "test@gmail.com",
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

This workflow works similarly to the subscriber. It retrieves the product's details using Query and sends an email using SendGrid (by specifying the `email` channel) to the `test@gmail.com` email.

You can also execute this workflow in a subscriber. For example, you can execute it when a product is created:

```ts title="src/subscribers/product-created.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
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

This subscriber will run every time a product is created, and it will execute the `sendEmailWorkflow` to send an email using SendGrid.
