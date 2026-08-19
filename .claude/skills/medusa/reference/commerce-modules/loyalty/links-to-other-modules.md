# Links between Loyalty Module and Other Modules

This document showcases the module links defined between the Loyalty Module and other Commerce Modules.

### Prerequisites

- [Loyalty Plugin Installed](../page.mdx#1-install-the-loyalty-plugin)

## Summary

The Loyalty Module has the following links to other modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Cart|\`GiftCard\`|Stored - many-to-many|Learn more|
|Order|\`GiftCard\`|Stored - many-to-many|Learn more|
|\`GiftCard\`|OrderLineItem|Read-only|Learn more|
|\`GiftCard\`|\`StoreCreditAccount\`|Stored - many-to-one|Learn more|

***

## Cart Module

When a customer applies a gift card during checkout, Medusa defines a link between the `Cart` and `GiftCard` data models.

This allows you to retrieve the gift cards applied on a cart.

### Retrieve with Query

To retrieve the gift cards of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `gift_cards.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "gift_cards.*",
  ],
})

// carts[0].gift_cards
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "gift_cards.*",
  ],
})

// carts[0].gift_cards
```

### Manage with Link

To manage the gift cards of a cart, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.CART]: {
    cart_id: "cart_123",
  },
  loyalty: {
    gift_card_id: "gcard_123",
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
  loyalty: {
    gift_card_id: "gcard_123",
  },
})
```

***

## Order Module

### Order and Gift Cards

When a customer places an order that includes gift cards, Medusa defines a link between the `Order` and `GiftCard` data models.

This allows you to retrieve the gift cards applied on an order.

#### Retrieve with Query

To retrieve the gift cards of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `gift_cards.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "gift_cards.*",
  ],
})

// orders[0].gift_cards
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "gift_cards.*",
  ],
})

// orders[0].gift_cards
```

#### Manage with Link

To manage the gift cards of an order, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.ORDER]: {
    order_id: "order_123",
  },
  loyalty: {
    gift_card_id: "gcard_123",
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
  loyalty: {
    gift_card_id: "gcard_123",
  },
})
```

### Gift Card and Order Line Item

Medusa defines a read-only link between the `GiftCard` data model and the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `OrderLineItem` data model. This means you can retrieve the order line item where the gift card was purchased, but you don't manage the links in a pivot table in the database. The line item of a gift card is determined by the `line_item_id` property of the `GiftCard` data model.

#### Retrieve with Query

To retrieve the order line item of a gift card with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `line_item.*` in `fields`:

### query.graph

```ts
const { data: giftCards } = await query.graph({
  entity: "gift_card",
  fields: [
    "line_item.*",
  ],
})

// giftCards[0].line_item
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: giftCards } = useQueryGraphStep({
  entity: "gift_card",
  fields: [
    "line_item.*",
  ],
})

// giftCards[0].line_item
```

***

## Store Credit Module

Medusa defines a link between the `GiftCard` and `StoreCreditAccount` from the [Store Credit Module](https://docs.medusajs.com/resources/commerce-modules/store-credit). This link is created when a gift card is created (alongside its store credit account) or when a gift card is redeemed.

This allows you to retrieve the store credit account associated with a gift card.

### Retrieve with Query

To retrieve the store credit account of a gift card with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `store_credit_account.*` in `fields`:

### query.graph

```ts
const { data: giftCards } = await query.graph({
  entity: "gift_card",
  fields: [
    "store_credit_account.*",
  ],
})

// giftCards[0].store_credit_account
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: giftCards } = useQueryGraphStep({
  entity: "gift_card",
  fields: [
    "store_credit_account.*",
  ],
})

// giftCards[0].store_credit_account
```

### Manage with Link

To manage the store credit account of a gift card, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
// ...

await link.create({
  loyalty: {
    gift_card_id: "gcard_123",
  },
  store_credit: {
    store_credit_account_id: "sc_acc_123",
  },
})
```

### createRemoteLinkStep

```ts
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  loyalty: {
    gift_card_id: "gcard_123",
  },
  store_credit: {
    store_credit_account_id: "sc_acc_123",
  },
})
```
