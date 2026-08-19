# Links between Inventory Module and Other Modules

This document showcases the module links defined between the Inventory Module and other Commerce Modules.

## Summary

The Inventory Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|ProductVariant|InventoryItem|Stored - many-to-many|Learn more|
|InventoryLevel|StockLocation|Read-only - has many|Learn more|

***

## Product Module

Each product variant has different inventory details. Medusa defines a link between the `ProductVariant` and `InventoryItem` data models.

![A diagram showcasing an example of how data models from the Inventory and Product Module are linked.](https://res.cloudinary.com/dza7lstvk/image/upload/v1709658720/Medusa%20Resources/inventory-product_ejnray.jpg)

A product variant whose `manage_inventory` property is enabled has an associated inventory item. Through that inventory's items relations in the Inventory Module, you can manage and check the variant's inventory quantity.

Learn more about product variant's inventory management in [this guide](https://docs.medusajs.com/resources/commerce-modules/product/variant-inventory).

### Retrieve with Query

To retrieve the product variants of an inventory item with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `variants.*` in `fields`:

### query.graph

```ts
const { data: inventoryItems } = await query.graph({
  entity: "inventory_item",
  fields: [
    "variants.*",
  ],
})

// inventoryItems[0].variants
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: inventoryItems } = useQueryGraphStep({
  entity: "inventory_item",
  fields: [
    "variants.*",
  ],
})

// inventoryItems[0].variants
```

### Manage with Link

To manage the variants of an inventory item, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

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

## Stock Location Module

Medusa defines a read-only link between the `InventoryLevel` data model and the [Stock Location Module](https://docs.medusajs.com/resources/commerce-modules/stock-location)'s `StockLocation` data model. This means you can retrieve the details of an inventory level's stock locations, but you don't manage the links in a pivot table in the database. The stock location of an inventory level is determined by the `location_id` property of the `InventoryLevel` data model.

### Retrieve with Query

To retrieve the stock locations of an inventory level with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `stock_locations.*` in `fields`:

### query.graph

```ts
const { data: inventoryLevels } = await query.graph({
  entity: "inventory_level",
  fields: [
    "stock_locations.*",
  ],
})

// inventoryLevels[0].stock_locations
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: inventoryLevels } = useQueryGraphStep({
  entity: "inventory_level",
  fields: [
    "stock_locations.*",
  ],
})

// inventoryLevels[0].stock_locations
```
