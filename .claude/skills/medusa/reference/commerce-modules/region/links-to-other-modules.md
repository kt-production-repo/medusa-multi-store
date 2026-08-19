# Links between Region Module and Other Modules

This document showcases the module links defined between the Region Module and other Commerce Modules.

## Summary

The Region Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Cart|Region|Read-only - has one|Learn more|
|Order|Region|Read-only - has one|Learn more|
|Region|PaymentProvider|Stored - many-to-many|Learn more|

***

## Cart Module

Medusa defines a read-only link between the [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `Cart` data model and the `Region` data model. Because the link is read-only from the `Cart`'s side, you can only retrieve the region of a cart, and not the other way around.

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

## Order Module

Medusa defines a read-only link between the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `Order` data model and the `Region` data model. Because the link is read-only from the `Order`'s side, you can only retrieve the region of an order, and not the other way around.

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

## Payment Module

You can specify for each region which payment providers are available for use.

Medusa defines a module link between the `PaymentProvider` and the `Region` data models.

![A diagram showcasing an example of how resources from the Payment and Region modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1711569520/Medusa%20Resources/payment-region_jyo2dz.jpg)

### Retrieve with Query

To retrieve the payment providers of a region with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `payment_providers.*` in `fields`:

### query.graph

```ts
const { data: regions } = await query.graph({
  entity: "region",
  fields: [
    "payment_providers.*",
  ],
})

// regions[0].payment_providers
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: regions } = useQueryGraphStep({
  entity: "region",
  fields: [
    "payment_providers.*",
  ],
})

// regions[0].payment_providers
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
