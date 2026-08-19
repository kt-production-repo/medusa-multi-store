# Links between Product Module and Other Modules

This document showcases the module links defined between the Product Module and other Commerce Modules.

## Summary

The Product Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|LineItem|Product|Read-only - has one|Learn more|
|Product|ShippingProfile|Stored - many-to-one|Learn more|
|ProductVariant|InventoryItem|Stored - many-to-many|Learn more|
|OrderLineItem|Product|Read-only - has one|Learn more|
|ProductVariant|PriceSet|Stored - one-to-one|Learn more|
|Product|SalesChannel|Stored - many-to-many|Learn more|
|Product|Translation|Read-only - one-to-many|Learn more|
|ProductVariant|Translation|Read-only - one-to-many|Learn more|
|ProductCategory|Translation|Read-only - one-to-many|Learn more|
|ProductCollection|Translation|Read-only - one-to-many|Learn more|
|ProductTag|Translation|Read-only - one-to-many|Learn more|
|ProductType|Translation|Read-only - one-to-many|Learn more|
|ProductOption|Translation|Read-only - one-to-many|Learn more|
|ProductOptionValue|Translation|Read-only - one-to-many|Learn more|

***

## Cart Module

Medusa defines read-only links between:

- The [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `LineItem` data model and the `Product` data model. Because the link is read-only from the `LineItem`'s side, you can only retrieve the product of a line item, and not the other way around.
- The `ProductVariant` data model and the [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `LineItem` data model. Because the link is read-only from the `LineItem`'s side, you can only retrieve the variant of a line item, and not the other way around.

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

// lineItems[0].variant
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

// lineItems[0].variant
```

***

## Fulfillment Module

Medusa defines a link between the `Product` data model and the `ShippingProfile` data model of the Fulfillment Module. Each product must belong to a shipping profile.

This link is introduced in [Medusa v2.5.0](https://github.com/medusajs/medusa/releases/tag/v2.5.0).

### Retrieve with Query

To retrieve the shipping profile of a product with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `shipping_profile.*` in `fields`:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "shipping_profile.*",
  ],
})

// products[0].shipping_profile
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "shipping_profile.*",
  ],
})

// products[0].shipping_profile
```

### Manage with Link

To manage the shipping profile of a product, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.PRODUCT]: {
    product_id: "prod_123",
  },
  [Modules.FULFILLMENT]: {
    shipping_profile_id: "sp_123",
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
    product_id: "prod_123",
  },
  [Modules.FULFILLMENT]: {
    shipping_profile_id: "sp_123",
  },
})
```

***

## Inventory Module

The Inventory Module provides inventory-management features for any stock-kept item.

Medusa defines a link between the `ProductVariant` and `InventoryItem` data models. Each product variant has different inventory details.

![A diagram showcasing an example of how data models from the Product and Inventory modules are linked.](https://res.cloudinary.com/dza7lstvk/image/upload/v1709652779/Medusa%20Resources/product-inventory_kmjnud.jpg)

When the `manage_inventory` property of a product variant is enabled, you can manage the variant's inventory in different locations through this relation.

Learn more about product variant's inventory management in [this guide](https://docs.medusajs.com/resources/commerce-modules/product/variant-inventory).

### Retrieve with Query

To retrieve the inventory items of a product variant with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `inventory_items.inventory.*` in `fields`. The `inventory_items` relation holds link records, so use `inventory_items.inventory` to access the actual `InventoryItem` data:

### query.graph

```ts
const { data: variants } = await query.graph({
  entity: "variant",
  fields: [
    "inventory_items.inventory.*",
  ],
})

// variants[0].inventory_items[0].inventory
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: variants } = useQueryGraphStep({
  entity: "variant",
  fields: [
    "inventory_items.inventory.*",
  ],
})

// variants[0].inventory_items[0].inventory
```

You can also traverse from the `product` entity through its variants to their inventory items:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "variants.inventory_items.inventory.id",
  ],
})

// products[0].variants[0].inventory_items[0].inventory.id
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "variants.inventory_items.inventory.id",
  ],
})

// products[0].variants[0].inventory_items[0].inventory.id
```

Creating a product variant with `manage_inventory` enabled creates an inventory item automatically, but does not create inventory levels. You must create inventory levels separately to set the stocked quantity at a specific location. Refer to the [Inventory Module's documentation](https://docs.medusajs.com/resources/commerce-modules/inventory) for details.

### Manage with Link

To manage the inventory items of a variant, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.PRODUCT]: {
    variant_id: "variant_123",
  },
  [Modules.INVENTORY]: {
    inventory_item_id: "iitem_123",
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
  [Modules.INVENTORY]: {
    inventory_item_id: "iitem_123",
  },
})
```

***

## Order Module

Medusa defines read-only links between:

- the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `OrderLineItem` data model and the `Product` data model. Because the link is read-only from the `OrderLineItem`'s side, you can only retrieve the product of an order line item, and not the other way around.
- the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `OrderLineItem` data model and the `ProductVariant` data model. Because the link is read-only from the `OrderLineItem`'s side, you can only retrieve the variant of an order line item, and not the other way around.

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

// lineItems[0].variant
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

// lineItems[0].variant
```

***

## Pricing Module

The Product Module doesn't provide pricing-related features.

Instead, Medusa defines a link between the `ProductVariant` and the `PriceSet` data models. A product variant’s prices are stored belonging to a price set.

![A diagram showcasing an example of how data models from the Pricing and Product Module are linked.](https://res.cloudinary.com/dza7lstvk/image/upload/v1709651464/Medusa%20Resources/product-pricing_vlxsiq.jpg)

So, to add prices for a product variant, create a price set and add the prices to it.

### Retrieve with Query

To retrieve the price set of a variant with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `price_set.*` in `fields`:

### query.graph

```ts
const { data: variants } = await query.graph({
  entity: "variant",
  fields: [
    "price_set.*",
  ],
})

// variants[0].price_set
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: variants } = useQueryGraphStep({
  entity: "variant",
  fields: [
    "price_set.*",
  ],
})

// variants[0].price_set
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

***

## Sales Channel Module

The Sales Channel Module provides functionalities to manage multiple selling channels in your store.

Medusa defines a link between the `Product` and `SalesChannel` data models. A product can have different availability in different sales channels.

![A diagram showcasing an example of how data models from the Product and Sales Channel modules are linked.](https://res.cloudinary.com/dza7lstvk/image/upload/v1709651840/Medusa%20Resources/product-sales-channel_t848ik.jpg)

### Retrieve with Query

To retrieve the sales channels of a product with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channels.*` in `fields`:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "sales_channels.*",
  ],
})

// products[0].sales_channels
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "sales_channels.*",
  ],
})

// products[0].sales_channels
```

### Manage with Link

To manage the sales channels of a product, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.PRODUCT]: {
    product_id: "prod_123",
  },
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123",
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
    product_id: "prod_123",
  },
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123",
  },
})
```

***

## Translation Module

### Prerequisites



Medusa defines read-only links from several data models in the Product Module to the [Translation](https://docs.medusajs.com/references/translation/models/Translation) data model in the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation):

- `Product` (one-to-many) to `Translation`, and vice versa.
- `ProductVariant` (one-to-many) to `Translation`. You can only retrieve the translations of a product variant, and not the other way around.
- `ProductCategory` (one-to-many) to `Translation`. You can only retrieve the translations of a product category, and not the other way around.
- `ProductCollection` (one-to-many) to `Translation`. You can only retrieve the translations of a product collection, and not the other way around.
- `ProductTag` (one-to-many) to `Translation`. You can only retrieve the translations of a product tag, and not the other way around.
- `ProductType` (one-to-many) to `Translation`. You can only retrieve the translations of a product type, and not the other way around.
- `ProductOption` (one-to-many) to `Translation`. You can only retrieve the translations of a product option, and not the other way around.
- `ProductOptionValue` (one-to-many) to `Translation`. You can only retrieve the translations of a product option value, and not the other way around.

### Retrieve with Query

To retrieve the translations of a product with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `translations.*` in `fields`:

You can pass the `translations.*` field when querying any of the above-mentioned data models to retrieve their associated translations.

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "translations.*",
  ],
})

// products[0].translations
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "translations.*",
  ],
})

// products[0].translations
```
