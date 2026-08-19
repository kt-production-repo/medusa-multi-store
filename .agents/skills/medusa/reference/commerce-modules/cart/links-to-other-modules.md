# Links between Cart Module and Other Modules

This document showcases the module links defined between the Cart Module and other Commerce Modules.

## Summary

The Cart Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Cart|Customer|Read-only - has one|Learn more|
|ShippingMethod|ShippingOption|Read-only - has one|Learn more|
|Order|Cart|Stored - one-to-one|Learn more|
|Cart|PaymentCollection|Stored - one-to-one|Learn more|
|LineItem|Product|Read-only - has one|Learn more|
|LineItem|ProductVariant|Read-only - has one|Learn more|
|Cart|Promotion|Stored - many-to-many|Learn more|
|Cart|Region|Read-only - has one|Learn more|
|Cart|SalesChannel|Read-only - has one|Learn more|

***

## Customer Module

Medusa defines a read-only link between the `Cart` data model and the [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer)'s `Customer` data model. This means you can retrieve the details of a cart's customer, but you don't manage the links in a pivot table in the database. The customer of a cart is determined by the `customer_id` property of the `Cart` data model.

### Retrieve with Query

To retrieve the customer of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `customer.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "customer.*",
  ],
})

// carts[0].customer
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "customer.*",
  ],
})

// carts[0].customer
```

***

## Fulfillment Module

Medusa defines a read-only link between the `ShippingMethod` data model and the [Fulfillment Module](https://docs.medusajs.com/resources/commerce-modules/fulfillment)'s `ShippingOption` data model. This means you can retrieve the details of a shipping method's shipping option, but you don't manage the links in a pivot table in the database. The shipping option of a shipping method is determined by the `shipping_option_id` property of the `ShippingMethod` data model.

This link allows you to retrieve the shipping option that a shipping method was created from.

This read-only link was added in [Medusa v2.10.0](https://github.com/medusajs/medusa/releases/tag/v2.10.0)

### Retrieve with Query

To retrieve the shipping option of a shipping method with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `shipping_option.*` in `fields`:

### query.graph

```ts
const { data: shippingMethods } = await query.graph({
  entity: "shipping_method",
  fields: [
    "shipping_option.*",
  ],
})

// shippingMethods[0].shipping_option
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: shippingMethods } = useQueryGraphStep({
  entity: "shipping_method",
  fields: [
    "shipping_option.*",
  ],
})

// shippingMethods[0].shipping_option
```

## Order Module

The [Order Module](https://docs.medusajs.com/resources/commerce-modules/order) provides order-management features.

Medusa defines a link between the `Cart` and `Order` data models. The cart is linked to the order created once the cart is completed.

![A diagram showcasing an example of how data models from the Cart and Order modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1728375735/Medusa%20Resources/cart-order_ijwmfs.jpg)

### Retrieve with Query

To retrieve the order of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `order.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "order.*",
  ],
})

// carts[0].order
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "order.*",
  ],
})

// carts[0].order
```

### Manage with Link

To manage the order of a cart, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  [Modules.ORDER]: {
    order_id: "order_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  [Modules.ORDER]: {
    order_id: "order_123",
  },
})
```

***

## Payment Module

The [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment) handles payment processing and management.

Medusa defines a link between the `Cart` and `PaymentCollection` data models. A cart has a payment collection which holds all the authorized payment sessions and payments made related to the cart.

![A diagram showcasing an example of how data models from the Cart and Payment modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1711537849/Medusa%20Resources/cart-payment_ixziqm.jpg)

### Retrieve with Query

To retrieve the payment collection of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `payment_collection.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "payment_collection.*",
  ],
})

// carts[0].payment_collection
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "payment_collection.*",
  ],
})

// carts[0].payment_collection
```

### Manage with Link

To manage the payment collection of a cart, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  [Modules.PAYMENT]: {
    payment_collection_id: "paycol_123",
  },
})
```

### createRemoteLinkStep

```ts
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  [Modules.PAYMENT]: {
    payment_collection_id: "paycol_123",
  },
})
```

***

## Product Module

Medusa defines read-only links between:

- the `LineItem` data model and the [Product Module](https://docs.medusajs.com/resources/commerce-modules/product)'s `Product` data model. This means you can retrieve the details of a line item's product, but you don't manage the links in a pivot table in the database. The product of a line item is determined by the `product_id` property of the `LineItem` data model.
- the `LineItem` data model and the [Product Module](https://docs.medusajs.com/resources/commerce-modules/product)'s `ProductVariant` data model. This means you can retrieve the details of a line item's variant, but you don't manage the links in a pivot table in the database. The variant of a line item is determined by the `variant_id` property of the `LineItem` data model.

### Retrieve with Query

To retrieve the variant of a line item with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `variant.*` in `fields`:

To retrieve the product, pass `product.*` in `fields`.

### query.graph

```ts
const { data: lineItems } = await query.graph({
  entity: "line_item",
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
  entity: "line_item",
  fields: [
    "variant.*",
  ],
})

// lineItems.variant
```

***

## Promotion Module

The [Promotion Module](https://docs.medusajs.com/resources/commerce-modules/promotion) provides discount features.

Medusa defines a link between the `Cart` and `Promotion` data models. This indicates the promotions applied on a cart.

![A diagram showcasing an example of how data models from the Cart and Promotion modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1711538015/Medusa%20Resources/cart-promotion_kuh9vm.jpg)

Medusa also defines a read-only link between the `LineItemAdjustment` and `Promotion` data models. This means you can retrieve the details of the promotion applied on a line item, but you don't manage the links in a pivot table in the database. The promotion of a line item is determined by the `promotion_id` property of the `LineItemAdjustment` data model.

### Retrieve with Query

To retrieve the promotions of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `promotions.*` in `fields`:

To retrieve the promotion of a line item adjustment, pass `promotion.*` in `fields`.

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "promotions.*",
  ],
})

// carts[0].promotions
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "promotions.*",
  ],
})

// carts[0].promotions
```

### Manage with Link

To manage the promotions of a cart, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.CART]: {
    cart_id: "cart_123",
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
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  [Modules.PROMOTION]: {
    promotion_id: "promo_123",
  },
})
```

***

## Region Module

Medusa defines a read-only link between the `Cart` data model and the [Region Module](https://docs.medusajs.com/resources/commerce-modules/region)'s `Region` data model. This means you can retrieve the details of a cart's region, but you don't manage the links in a pivot table in the database. The region of a cart is determined by the `region_id` property of the `Cart` data model.

### Retrieve with Query

To retrieve the region of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `region.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "region.*",
  ],
})

// carts[0].region
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "region.*",
  ],
})

// carts[0].region
```

***

## Sales Channel Module

Medusa defines a read-only link between the `Cart` data model and the [Sales Channel Module](https://docs.medusajs.com/resources/commerce-modules/sales-channel)'s `SalesChannel` data model. This means you can retrieve the details of a cart's sales channel, but you don't manage the links in a pivot table in the database. The sales channel of a cart is determined by the `sales_channel_id` property of the `Cart` data model.

### Retrieve with Query

To retrieve the sales channel of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channel.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "sales_channel.*",
  ],
})

// carts[0].sales_channel
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "sales_channel.*",
  ],
})

// carts[0].sales_channel
```
