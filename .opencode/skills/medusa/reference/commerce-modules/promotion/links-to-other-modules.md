# Links between Promotion Module and Other Modules

This document showcases the module links defined between the Promotion Module and other Commerce Modules.

## Summary

The Promotion Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Cart|Promotion|Stored - many-to-many|Learn more|
|LineItemAdjustment|Promotion|Read-only - has one|Learn more|
|Order|Promotion|Stored - many-to-many|Learn more|

***

## Cart Module

A promotion can be applied on line items and shipping methods of a cart. Medusa defines a link between the `Cart` and `Promotion` data models.

![A diagram showcasing an example of how data models from the Cart and Promotion modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1711538015/Medusa%20Resources/cart-promotion_kuh9vm.jpg)

Medusa also defines a read-only link between the [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `LineItemAdjustment` data model and the `Promotion` data model. Because the link is read-only from the `LineItemAdjustment`'s side, you can only retrieve the promotion applied on a line item, and not the other way around.

### Retrieve with Query

To retrieve the carts that a promotion is applied on with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `carts.*` in `fields`:

To retrieve the promotion of a line item adjustment, pass `promotion.*` in `fields`.

### query.graph

```ts
const { data: promotions } = await query.graph({
  entity: "promotion",
  fields: [
    "carts.*",
  ],
})

// promotions[0].carts
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: promotions } = useQueryGraphStep({
  entity: "promotion",
  fields: [
    "carts.*",
  ],
})

// promotions[0].carts
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

## Order Module

An order is associated with the promotion applied on it. Medusa defines a link between the `Order` and `Promotion` data models.

![A diagram showcasing an example of how data models from the Order and Promotion modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716555015/Medusa%20Resources/order-promotion_dgjzzd.jpg)

### Retrieve with Query

To retrieve the orders a promotion is applied on with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `orders.*` in `fields`:

### query.graph

```ts
const { data: promotions } = await query.graph({
  entity: "promotion",
  fields: [
    "orders.*",
  ],
})

// promotions[0].orders
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: promotions } = useQueryGraphStep({
  entity: "promotion",
  fields: [
    "orders.*",
  ],
})

// promotions[0].orders
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
