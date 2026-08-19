# Links between Customer Module and Other Modules

This document showcases the module links defined between the Customer Module and other Commerce Modules.

## Summary

The Customer Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Customer|AccountHolder|Stored - many-to-many|Learn more|
|Cart|Customer|Read-only - has one|Learn more|
|Order|Customer|Read-only - has one|Learn more|

***

## Payment Module

Medusa defines a link between the `Customer` and `AccountHolder` data models, allowing payment providers to save payment methods for a customer, if the payment provider supports it.

This link is available starting from Medusa `v2.5.0`.

### Retrieve with Query

To retrieve the account holder associated with a customer with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `customer.*` in `fields`:

### query.graph

```ts
const { data: customers } = await query.graph({
  entity: "customer",
  fields: [
    "account_holder_link.account_holder.*",
  ],
})

// customers[0].account_holder_link?.[0]?.account_holder
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: customers } = useQueryGraphStep({
  entity: "customer",
  fields: [
    "account_holder_link.account_holder.*",
  ],
})

// customers[0].account_holder_link?.[0]?.account_holder
```

### Manage with Link

To manage the account holders of a customer, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.CUSTOMER]: {
    customer_id: "cus_123",
  },
  [Modules.PAYMENT]: {
    account_holder_id: "acchld_123",
  },
})
```

### createRemoteLinkStep

```ts
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.CUSTOMER]: {
    customer_id: "cus_123",
  },
  [Modules.PAYMENT]: {
    account_holder_id: "acchld_123",
  },
})
```

A customer can have many account holders, but each account holder belongs to only one customer. If you try to link an account holder that already belongs to another customer, Medusa throws a `Cannot create multiple links between 'customer' and 'payment'` error. To transfer an account holder to a different customer, remove the existing link first, then create the new one.

***

## Cart Module

Medusa defines a read-only link between the [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `Cart` data model and the `Customer` data model. Because the link is read-only from the `Cart`'s side, you can only retrieve the customer of a cart, and not the other way around.

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

// carts.customer
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

// carts.customer
```

***

## Order Module

Medusa defines a read-only link between the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `Order` data model and the `Customer` data model. Because the link is read-only from the `Order`'s side, you can only retrieve the customer of an order, and not the other way around.

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

// orders.customer
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

// orders.customer
```
