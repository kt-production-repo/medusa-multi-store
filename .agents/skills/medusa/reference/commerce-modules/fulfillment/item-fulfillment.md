# Item Fulfillment Concepts

In this document, you’ll learn about the concepts related to item fulfillment.

## Fulfillment Data Model

A fulfillment is the shipping and delivery of one or more items to the customer. It’s represented by the [Fulfillment data model](https://docs.medusajs.com/references/fulfillment/models/Fulfillment).

A fulfillment can be created to fulfill orders, [returns](../../order/return/), [exchanges](https://docs.medusajs.com/resources/commerce-modules/order/exchange), and [claims](https://docs.medusajs.com/resources/commerce-modules/order/claim).

***

## Fulfillment Processing by a Fulfillment Provider

A fulfillment is associated with a [fulfillment provider](https://docs.medusajs.com/resources/commerce-modules/fulfillment/fulfillment-provider) that handles all its processing, such as creating a shipment for the fulfillment’s items.

The fulfillment is also associated with a [shipping option](https://docs.medusajs.com/resources/commerce-modules/fulfillment/shipping-option) of that provider, which determines how the item is shipped.

![A diagram showcasing the relation between a fulfillment, fulfillment provider, and shipping option](https://res.cloudinary.com/dza7lstvk/image/upload/v1712331947/Medusa%20Resources/fulfillment-shipping-option_jk9ndp.jpg)

***

## data Property of Fulfillment Data Model

The `Fulfillment` data model has a `data` property that holds any necessary data for the third-party fulfillment provider to process the fulfillment.

For example, the `data` property can hold the ID of the fulfillment in the third-party provider. The associated fulfillment provider then uses it whenever it retrieves the fulfillment's details.

***

## Pass Additional Data to the Fulfillment Provider

This feature is available since Medusa [v2.19.0](https://github.com/medusajs/medusa/releases/tag/v2.19.0).

When creating a fulfillment through the [Create Fulfillment API route](https://docs.medusajs.com/api/admin/orders/create-fulfillment), you can pass an `additional_data` field in the request body. Unlike the `data` field, `additional_data` is not persisted on the fulfillment record; it is only forwarded as-is to the Fulfillment Module Provider's `createFulfillment` method.

This lets you send custom key-value pairs to the provider at creation time without storing them on the fulfillment. For example, you can pass a carrier-specific instruction that the provider reads when it talks to the third-party service:

```json title="Request body"
{
  "location_id": "loc_123",
  "items": [...],
  "additional_data": {
    "carrier_instruction": "leave_at_door"
  }
}
```

In the Fulfillment Module Provider's `createFulfillment` method, the fifth argument receives this object:

```ts title="src/modules/my-fulfillment/service.ts"
class MyFulfillmentProviderService
  extends AbstractFulfillmentProviderService {
  // ...

  async createFulfillment(
    data: Record<string, unknown>,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>,
    additionalData?: Record<string, unknown>
  ) {
    const instruction = additionalData?.carrier_instruction
    // use instruction when calling the third-party service
  }
}
```

***

## Override Delivery Address Per Fulfillment

This feature is available since Medusa [v2.19.0](https://github.com/medusajs/medusa/releases/tag/v2.19.0).

By default, when creating a fulfillment for an order, Medusa uses the order's shipping address as the delivery address sent to the Fulfillment Module Provider.

You can override this on a per-fulfillment basis by passing a `delivery_address` field in the [Create Fulfillment API route](https://docs.medusajs.com/api/admin/orders/create-fulfillment) request body. The provided address is merged over the order's shipping address, so you only need to supply the fields you want to change:

```json title="Request body"
{
  "location_id": "loc_123",
  "items": [...],
  "delivery_address": {
    "first_name": "Jane",
    "last_name": "Doe"
  }
}
```

The merged address is forwarded to the Fulfillment Module Provider but the order's shipping address is not mutated.

***

## Fulfillment Items

A fulfillment is used to fulfill one or more items. Each item is represented by the [FulfillmentItem data model](https://docs.medusajs.com/references/fulfillment/models/FulfillmentItem).

The fulfillment item holds details relevant to fulfilling the item, such as barcode, SKU, and quantity to fulfill.

![A diagram showcasing the relation between fulfillment and fulfillment items.](https://res.cloudinary.com/dza7lstvk/image/upload/v1712332114/Medusa%20Resources/fulfillment-item_etzxb0.jpg)

***

## Fulfillment Label

Once a shipment is created for the fulfillment, you can store its tracking number, URL, or other related details as a label, represented by the [FulfillmentLabel data model](https://docs.medusajs.com/references/fulfillment/models/FulfillmentLabel).

### Accessing Tracking Information

To access tracking information for a fulfillment, you must retrieve the related labels. For example, to retrieve the tracking data with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query):

```ts
const { data: fulfillment } = query.graph({
  entity: "fulfillment",
  fields: [
    "labels.tracking_number",
    "labels.tracking_url",
    "labels.label_url",
  ],
  filters: {
    id: "fulfillment_123",
  },
})

fulfillment.labels.forEach((label) => {
  console.log("Tracking Number:", label.tracking_number)
  console.log("Tracking URL:", label.tracking_url)
  console.log("Label URL:", label.label_url)
})
```

***

## Fulfillment Status

The [Fulfillment data model](https://docs.medusajs.com/references/fulfillment/models/Fulfillment) has three properties to determine the current status of the fulfillment:

- `packed_at`: The date the fulfillment was packed. If set, the fulfillment has been packed.
- `shipped_at`: The date the fulfillment was shipped. If set, the fulfillment has been shipped.
- `delivered_at`: The date the fulfillment was delivered. If set, the fulfillment has been delivered.
