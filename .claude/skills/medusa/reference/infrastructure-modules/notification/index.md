# Notification Module

In this document, you'll learn about the Notification Module and its providers.

Cloud offers [Medusa Emails](https://docs.medusajs.com/cloud/emails), a managed email service that allows you to send transactional emails with zero configuration. It is built on top of the Notification Module and provides an easy way to manage email notifications in your Cloud projects with insights and deliverability features.

## What is the Notification Module?

The Notification Module exposes the functionalities to send a notification to a customer or user. For example, sending an order confirmation email. Medusa uses the Notification Module in its core commerce features for notification operations, and you can use it in your custom features as well.

***

## How to Use the Notification Module?

You can use the Notification Module as part of the [workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows) you build for your custom features. A workflow is a special function composed of a series of steps that guarantees data consistency and reliable roll-back mechanism.

In a step of your workflow, you can resolve the Notification Module's service and use its methods to send notifications.

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
    const notificationModuleService = container.resolve(
      Modules.NOTIFICATION
    )

    await notificationModuleService.createNotifications({
      to: "customer@gmail.com",
      channel: "email",
      template: "product-created",
      data,
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

In the example above, you create a workflow that has a step. In the step, you resolve the service of the Notification Module from the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container).

Then, you use the `createNotifications` method of the Notification Module to send an email notification.

Find a full example of sending a notification in the [Send Notification guide](https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification).

***

## What is a Notification Module Provider?

A Notification Module Provider implements the underlying logic of sending notification. It either integrates a third-party service or uses custom logic to send the notification.

By default, Medusa uses the [Local Notification Module](https://docs.medusajs.com/resources/infrastructure-modules/notification/local) which only simulates sending the notification by logging a message in the terminal.

Medusa provides other Notification Modules that actually send notifications, such as the [SendGrid Notification Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/notification/send-notification). You can also [Create a Notification Module Provider](https://docs.medusajs.com/references/notification-provider-module).

- [Local](https://docs.medusajs.com/infrastructure-modules/notification/local)
- [SendGrid](https://docs.medusajs.com/infrastructure-modules/notification/sendgrid)
- [Mailchimp](https://docs.medusajs.com/integrations/guides/mailchimp)
- [Resend](https://docs.medusajs.com/integrations/guides/resend)
- [Slack](https://docs.medusajs.com/integrations/guides/slack)
- [Twilio SMS](https://docs.medusajs.com/how-to-tutorials/tutorials/phone-auth#step-3-integrate-twilio-sms)

***

## Notification Module Provider Channels

When you send a notification, you specify the channel to send it through, such as `email` or `sms`.

You register providers of the Notification Module in `medusa-config.ts`. For each provider, you pass a `channels` option specifying which channels the provider can be used in. Only one provider can be setup for each channel.

For example:

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = {
  // ...
  modules: [
    // ...
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          // ...
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "notification",
            options: {
              channels: ["email"],
            },
          },
        ],
      },
    },
  ],
}
```

The `channels` option is an array of strings indicating the channels this provider is used for.
