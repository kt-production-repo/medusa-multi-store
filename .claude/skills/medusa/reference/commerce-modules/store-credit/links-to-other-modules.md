# Links between Store Credit Module and Other Modules

This document showcases the module links defined between the Store Credit Module and other Commerce Modules.

### Prerequisites

- [Loyalty Plugin Installed](../page.mdx#1-install-the-loyalty-plugin)

## Summary

The Store Credit Module has the following links to other modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|\`StoreCreditAccount\`|\`Customer\`|Read-only|Learn more|
|\`GiftCard\`|\`StoreCreditAccount\`|Stored - many-to-one|Learn more|

***

## Customer Module

Medusa defines a read-only link between the `StoreCreditAccount` data model and the [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer)'s `Customer` data model. This means you can retrieve the customer associated with a store credit account, but you don't manage the links in a pivot table in the database. The customer of a store credit account is determined by the `customer_id` property of the `StoreCreditAccount` data model.

### Retrieve with Query

To retrieve the customer of a store credit account with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `customer.*` in `fields`:

### query.graph

```ts
const { data: storeCreditAccounts } = await query.graph({
  entity: "store_credit_account",
  fields: [
    "customer.*",
  ],
})

// storeCreditAccounts[0].customer
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: storeCreditAccounts } = useQueryGraphStep({
  entity: "store_credit_account",
  fields: [
    "customer.*",
  ],
})

// storeCreditAccounts[0].customer
```

***

## Loyalty Module

Medusa defines a link between the `GiftCard` in the [Loyalty Module](https://docs.medusajs.com/resources/commerce-modules/loyalty) and `StoreCreditAccount` data models. This link is created when a gift card is created (alongside its store credit account) or when a gift card is redeemed.

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
