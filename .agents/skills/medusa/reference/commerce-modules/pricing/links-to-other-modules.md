# Links between Pricing Module and Other Modules

This document showcases the module links defined between the Pricing Module and other Commerce Modules.

## Summary

The Pricing Module has the following links to other modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|ShippingOption|PriceSet|Stored - one-to-one|Learn more|
|ProductVariant|PriceSet|Stored - one-to-one|Learn more|

***

## Fulfillment Module

The Fulfillment Module provides fulfillment-related functionalities, including shipping options that the customer chooses from when they place their order. However, it doesn't provide pricing-related functionalities for these options.

Medusa defines a link between the `PriceSet` and `ShippingOption` data models. A shipping option's price is stored as a price set.

![A diagram showcasing an example of how data models from the Pricing and Fulfillment modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716561747/Medusa%20Resources/pricing-fulfillment_spywwa.jpg)

### Retrieve with Query

To retrieve the shipping option of a price set with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `shipping_option.*` in `fields`:

### query.graph

```ts
const { data: priceSets } = await query.graph({
  entity: "price_set",
  fields: [
    "shipping_option.*",
  ],
})

// priceSets[0].shipping_option
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: priceSets } = useQueryGraphStep({
  entity: "price_set",
  fields: [
    "shipping_option.*",
  ],
})

// priceSets[0].shipping_option
```

### Manage with Link

To manage the price set of a shipping option, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.FULFILLMENT]: {
    shipping_option_id: "so_123",
  },
  [Modules.PRICING]: {
    price_set_id: "pset_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.FULFILLMENT]: {
    shipping_option_id: "so_123",
  },
  [Modules.PRICING]: {
    price_set_id: "pset_123",
  },
})
```

***

## Product Module

The Product Module doesn't store or manage the prices of product variants.

Medusa defines a link between the `ProductVariant` and the `PriceSet`. A product variant’s prices are stored as prices belonging to a price set.

![A diagram showcasing an example of how data models from the Pricing and Product Module are linked. The PriceSet is linked to the ProductVariant of the Product Module.](https://res.cloudinary.com/dza7lstvk/image/upload/v1709651039/Medusa%20Resources/pricing-product_m4xaut.jpg)

So, when you want to add prices for a product variant, you create a price set and add the prices to it.

You can then benefit from adding rules to prices or using the `calculatePrices` method to retrieve the price of a product variant within a specified context.

### Retrieve with Query

To retrieve the variant of a price set with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `variant.*` in `fields`:

### query.graph

```ts
const { data: priceSets } = await query.graph({
  entity: "price_set",
  fields: [
    "variant.*",
  ],
})

// priceSets[0].variant
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: priceSets } = useQueryGraphStep({
  entity: "price_set",
  fields: [
    "variant.*",
  ],
})

// priceSets[0].variant
```

### Manage with Link

To manage the price set of a variant, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.PRODUCT]: {
    variant_id: "variant_123",
  },
  [Modules.PRICING]: {
    price_set_id: "pset_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.PRODUCT]: {
    variant_id: "variant_123",
  },
  [Modules.PRICING]: {
    price_set_id: "pset_123",
  },
})
```
