# Local Notification Module Provider

The Local Notification Module Provider simulates sending a notification, but only logs the notification's details in the terminal. This is useful for development.

***

## Register the Local Notification Module

The Local Notification Module Provider is registered by default in your application. It's configured to run on the `feed` channel.

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
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              channels: ["email"],
            },
          },
        ],
      },
    },
  ],
})
```

### Local Notification Module Options

|Option|Description|
|---|---|---|
|\`channels\`|The channels this notification module is used to send notifications for. While the local notification module doesn't actually send the notification,
it's important to specify its channels to make sure it's used when a notification for that channel is created.|

***

## Send Notifications to the Admin Notification Panel

The Local Notification Module Provider can also be used to send notifications to the [Medusa Admin's notification panel](https://docs.medusajs.com/user-guide#check-notifications).
You can send notifications to the admin dashboard when a certain action occurs using a subscriber, a custom workflow or a workflow hook.

For example, to send an admin notification whenever an order is placed, create a [subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers) at `src/subscribers/order-placed.ts` with the following content:

```ts title="src/subscribers/order-placed.ts"
import type {
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  await notificationModuleService.createNotifications({
    to: "",
    channel: "feed",
    template: "admin-ui",
    data: {
      title: "New order",
      description: `A new order has been placed`,
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
```

In this subscriber, you:

- Resolve the Notification Module's main service from the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container).
- Use the `createNotifications` method of the Notification Module's main service to create a notification to be sent to the admin dashboard. By specifying the `feed` channel, the Local Notification Module Provider is used to send the notification.
- The `template` property of the `createNotifications` method's parameter must be set to `admin-ui`.
- The `data` property allows you to customize the content of the admin notification. It must contain `title` and `description` properties.

### Test Sending Notification

To test this out, start the Medusa application:

```bash
npm run dev
```

Then, place an order. The subscriber will run, sending a notification to the Medusa Admin's notification panel.
