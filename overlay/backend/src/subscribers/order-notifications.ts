import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Sends transactional emails through the notification module (SendGrid
 * `email` channel) for `order.placed` and `shipment.created`.
 *
 * Medusa 2.18's only core notification subscriber handles `order.created`
 * with a stub template and a `to` that resolves to undefined, so without this
 * subscriber the "order/fulfillment emails" the README promises never fire.
 *
 * Emails are content-based (subject + html) so no SendGrid template is needed;
 * the provider falls back to `content` when no `template` is set. No-op when
 * SendGrid is not configured (the notification module is not even registered
 * then, so resolving it would throw).
 */
export default async function handleOrderNotifications({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  if (!process.env.SENDGRID_API_KEY) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notificationService = container.resolve(Modules.NOTIFICATION)

  const order = await resolveOrder(event.name, event.data.id, query)

  if (!order?.email) {
    logger.warn(
      `Order notification skipped: no order or email found for ${event.name} ${event.data.id}`
    )
    return
  }

  const isShipped = event.name === "shipment.created"
  const subject = isShipped
    ? `Your order ${order.display_id} has shipped`
    : `Order ${order.display_id} confirmed`

  try {
    await notificationService.createNotifications({
      to: order.email,
      channel: "email",
      trigger_type: event.name,
      resource_id: order.id,
      resource_type: "order",
      data: {
        order_id: order.id,
        display_id: order.display_id,
      },
      content: {
        subject,
        html: `
          <h2>${subject}</h2>
          <p>Thank you for your order${isShipped ? " — your items are on the way" : ""}.</p>
          <p>Order reference: ${order.display_id}</p>
        `,
      },
    })
  } catch (err) {
    logger.error(`Failed to send ${event.name} notification: ${err.message}`)
  }
}

async function resolveOrder(
  eventName: string,
  id: string,
  query: any
): Promise<{ id: string; email: string; display_id: string } | null> {
  if (eventName === "order.placed") {
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: ["id", "email", "display_id"],
      filters: { id },
    })
    return order ?? null
  }

  // shipment.created carries { id: <fulfillment_id> } — createShipmentWorkflow
  // marks the fulfillment shipped and its result is what gets emitted. Resolve
  // the order through the order_fulfillment link.
  const { data: [link] } = await query.graph({
    entity: "order_fulfillment",
    fields: ["order_id"],
    filters: { fulfillment_id: id },
  })
  if (!link?.order_id) {
    return null
  }

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: ["id", "email", "display_id"],
    filters: { id: link.order_id },
  })
  return order ?? null
}

export const config: SubscriberConfig = {
  event: ["order.placed", "shipment.created"],
}