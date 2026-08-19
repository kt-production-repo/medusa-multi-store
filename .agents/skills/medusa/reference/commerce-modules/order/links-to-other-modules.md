# Links between Order Module and Other Modules

This document showcases the module links defined between the Order Module and other Commerce Modules.

## Summary

The Order Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Order|Customer|Read-only - has one|Learn more|
|Order|Cart|Stored - one-to-one|Learn more|
|Order|Fulfillment|Stored - one-to-many|Learn more|
|Return|Fulfillment|Stored - one-to-many|Learn more|
|Order|PaymentCollection|Stored - one-to-many|Learn more|
|OrderClaim|PaymentCollection|Stored - one-to-many|Learn more|
|OrderExchange|PaymentCollection|Stored - one-to-many|Learn more|
|OrderLineItem|Product|Read-only - has many|Learn more|
|Order|Promotion|Stored - many-to-many|Learn more|
|Order|Region|Read-only - has one|Learn more|
|Order|SalesChannel|Read-only - has one|Learn more|

***

## Customer Module

Medusa defines a read-only link between the `Order` data model and the [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer)'s `Customer` data model. This means you can retrieve the details of an order's customer, but you don't manage the links in a pivot table in the database. The customer of an order is determined by the `customer_id` property of the `Order` data model.

### Retrieve with Query

To retrieve the customer of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `customer.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "customer.*",
  ],
})

// orders[0].customer
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "customer.*",
  ],
})

// orders[0].customer
```

***

## Cart Module

The [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart) provides cart-management features.

Medusa defines a link between the `Order` and `Cart` data models. The order is linked to the cart used for the purchased.

![A diagram showcasing an example of how data models from the Cart and Order modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1728375735/Medusa%20Resources/cart-order_ijwmfs.jpg)

### Retrieve with Query

To retrieve the cart of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `cart.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "cart.*",
  ],
})

// orders[0].cart
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "cart.*",
  ],
})

// orders[0].cart
```

### Manage with Link

To manage the cart of an order, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.CART]: {
    cart_id: "cart_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.CART]: {
    cart_id: "cart_123",
  },
})
```

***

## Fulfillment Module

A fulfillment is created for an orders' items. Medusa defines a link between the `Fulfillment` and `Order` data models.

![A diagram showcasing an example of how data models from the Fulfillment and Order modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716549903/Medusa%20Resources/order-fulfillment_h0vlps.jpg)

A fulfillment is also created for a return's items. So, Medusa defines a link between the `Fulfillment` and `Return` data models.

![A diagram showcasing an example of how data models from the Fulfillment and Order modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1728399052/Medusa%20Resources/Social_Media_Graphics_2024_Order_Return_vetimk.jpg)

### Retrieve with Query

To retrieve the fulfillments of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `fulfillments.*` in `fields`:

To retrieve the fulfillments of a return, pass `fulfillments.*` in `fields`.

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "fulfillments.*",
  ],
})

// orders[0].fulfillments
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "fulfillments.*",
  ],
})

// orders[0].fulfillments
```

### Manage with Link

To manage the fulfillments of an order, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.FULFILLMENT]: {
    fulfillment_id: "ful_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.FULFILLMENT]: {
    fulfillment_id: "ful_123",
  },
})
```

***

## Payment Module

An order's payment details are stored in a payment collection. This also applies for claims and exchanges.

So, Medusa defines links between the `PaymentCollection` data model and the `Order`, `OrderClaim`, and `OrderExchange` data models.

![A diagram showcasing an example of how data models from the Order and Payment modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716554726/Medusa%20Resources/order-payment_ubdwok.jpg)

### Retrieve with Query

To retrieve the payment collections of an order, order exchange, or order claim with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `payment_collections.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "payment_collections.*",
  ],
})

// orders[0].payment_collections
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "payment_collections.*",
  ],
})

// orders[0].payment_collections
```

### Manage with Link

To manage the payment collections of an order, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.PAYMENT]: {
    payment_collection_id: "paycol_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.PAYMENT]: {
    payment_collection_id: "paycol_123",
  },
})
```

***

## Product Module

Medusa defines read-only links between:

- the `OrderLineItem` data model and the [Product Module](https://docs.medusajs.com/resources/commerce-modules/product)'s `Product` data model. This means you can retrieve the details of a line item's product, but you don't manage the links in a pivot table in the database. The product of a line item is determined by the `product_id` property of the `OrderLineItem` data model.
- the `OrderLineItem` data model and the [Product Module](https://docs.medusajs.com/resources/commerce-modules/product)'s `ProductVariant` data model. This means you can retrieve the details of a line item's variant, but you don't manage the links in a pivot table in the database. The variant of a line item is determined by the `variant_id` property of the `OrderLineItem` data model.

### Retrieve with Query

To retrieve the variant of a line item with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `variant.*` in `fields`:

To retrieve the product, pass `product.*` in `fields`.

### query.graph

```ts
const { data: lineItems } = await query.graph({
  entity: "order_line_item",
  fields: [
    "variant.*",
  ],
})

// lineItems.variant
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: lineItems } = useQueryGraphStep({
  entity: "order_line_item",
  fields: [
    "variant.*",
  ],
})

// lineItems.variant
```

***

## Promotion Module

An order is associated with the promotion applied on it. Medusa defines a link between the `Order` and `Promotion` data models.

![A diagram showcasing an example of how data models from the Order and Promotion modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716555015/Medusa%20Resources/order-promotion_dgjzzd.jpg)

### Retrieve with Query

To retrieve the promotion applied on an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `promotion.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "promotions.*",
  ],
})

// orders[0].promotions
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "promotions.*",
  ],
})

// orders[0].promotions
```

### Manage with Link

To manage the promotion of an order, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.PROMOTION]: {
    promotion_id: "promo_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  [Modules.PROMOTION]: {
    promotion_id: "promo_123",
  },
})
```

***

## Region Module

Medusa defines a read-only link between the `Order` data model and the [Region Module](https://docs.medusajs.com/resources/commerce-modules/region)'s `Region` data model. This means you can retrieve the details of an order's region, but you don't manage the links in a pivot table in the database. The region of an order is determined by the `region_id` property of the `Order` data model.

### Retrieve with Query

To retrieve the region of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `region.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "region.*",
  ],
})

// orders[0].region
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "region.*",
  ],
})

// orders[0].region
```

***

## Sales Channel Module

Medusa defines a read-only link between the `Order` data model and the [Sales Channel Module](https://docs.medusajs.com/resources/commerce-modules/sales-channel)'s `SalesChannel` data model. This means you can retrieve the details of an order's sales channel, but you don't manage the links in a pivot table in the database. The sales channel of an order is determined by the `sales_channel_id` property of the `Order` data model.

### Retrieve with Query

To retrieve the sales channel of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channel.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "sales_channel.*",
  ],
})

// orders[0].sales_channel
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "sales_channel.*",
  ],
})

// orders[0].sales_channel
```
