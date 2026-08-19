# Links between Payment Module and Other Modules

This document showcases the module links defined between the Payment Module and other Commerce Modules.

## Summary

The Payment Module has the following links to other modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Cart|PaymentCollection|Stored - one-to-one|Learn more|
|Customer|AccountHolder|Stored - many-to-many|Learn more|
|Order|PaymentCollection|Stored - one-to-many|Learn more|
|OrderClaim|PaymentCollection|Stored - one-to-many|Learn more|
|OrderExchange|PaymentCollection|Stored - one-to-many|Learn more|
|Region|PaymentProvider|Stored - many-to-many|Learn more|

***

## Cart Module

The Cart Module provides cart-related features, but not payment processing.

Medusa defines a link between the `Cart` and `PaymentCollection` data models. A cart has a payment collection which holds all the authorized payment sessions and payments made related to the cart.

Learn more about this relation in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-collection#usage-with-the-cart-module).

### Retrieve with Query

To retrieve the cart associated with the payment collection with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `cart.*` in `fields`:

### query.graph

```ts
const { data: paymentCollections } = await query.graph({
  entity: "payment_collection",
  fields: [
    "cart.*",
  ],
})

// paymentCollections[0].cart
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: paymentCollections } = useQueryGraphStep({
  entity: "payment_collection",
  fields: [
    "cart.*",
  ],
})

// paymentCollections[0].cart
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

## Customer Module

Medusa defines a link between the `Customer` and `AccountHolder` data models, allowing payment providers to save payment methods for a customer, if the payment provider supports it.

This link is available starting from Medusa `v2.5.0`.

### Retrieve with Query

To retrieve the customer associated with an account holder with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `customer.*` in `fields`:

### query.graph

```ts
const { data: accountHolders } = await query.graph({
  entity: "account_holder",
  fields: [
    "customer.*",
  ],
})

// accountHolders[0].customer
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: accountHolders } = useQueryGraphStep({
  entity: "account_holder",
  fields: [
    "customer.*",
  ],
})

// accountHolders[0].customer
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

## Order Module

An order's payment details are stored in a payment collection. This also applies for claims and exchanges.

So, Medusa defines links between the `PaymentCollection` data model and the `Order`, `OrderClaim`, and `OrderExchange` data models.

![A diagram showcasing an example of how data models from the Order and Payment modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716554726/Medusa%20Resources/order-payment_ubdwok.jpg)

### Retrieve with Query

To retrieve the order of a payment collection with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `order.*` in `fields`:

### query.graph

```ts
const { data: paymentCollections } = await query.graph({
  entity: "payment_collection",
  fields: [
    "order.*",
  ],
})

// paymentCollections[0].order
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: paymentCollections } = useQueryGraphStep({
  entity: "payment_collection",
  fields: [
    "order.*",
  ],
})

// paymentCollections[0].order
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

## Region Module

You can specify for each region which payment providers are available. The Medusa application defines a link between the `PaymentProvider` and the `Region` data models.

![A diagram showcasing an example of how resources from the Payment and Region modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1711569520/Medusa%20Resources/payment-region_jyo2dz.jpg)

This increases the flexibility of your store. For example, you only show during checkout the payment providers associated with the cart's region.

### Retrieve with Query

To retrieve the regions of a payment provider with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `regions.*` in `fields`:

### query.graph

```ts
const { data: paymentProviders } = await query.graph({
  entity: "payment_provider",
  fields: [
    "regions.*",
  ],
})

// paymentProviders[0].regions
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: paymentProviders } = useQueryGraphStep({
  entity: "payment_provider",
  fields: [
    "regions.*",
  ],
})

// paymentProviders[0].regions
```

### Manage with Link

To manage the payment providers in a region, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.REGION]: {
    region_id: "reg_123",
  },
  [Modules.PAYMENT]: {
    payment_provider_id: "pp_stripe_stripe",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.REGION]: {
    region_id: "reg_123",
  },
  [Modules.PAYMENT]: {
    payment_provider_id: "pp_stripe_stripe",
  },
})
```
