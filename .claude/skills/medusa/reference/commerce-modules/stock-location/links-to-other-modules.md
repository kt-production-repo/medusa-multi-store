# Links between Stock Location Module and Other Modules

This document showcases the module links defined between the Stock Location Module and other Commerce Modules.

## Summary

The Stock Location Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|FulfillmentSet|StockLocation|Stored - many-to-one|Learn more|
|FulfillmentProvider|StockLocation|Stored - many-to-many|Learn more|
|InventoryLevel|StockLocation|Read-only - has many|Learn more|
|SalesChannel|StockLocation|Stored - many-to-many|Learn more|

***

## Fulfillment Module

A fulfillment set can be conditioned to a specific stock location.

Medusa defines a link between the `FulfillmentSet` and `StockLocation` data models.

![A diagram showcasing an example of how data models from the Fulfillment and Stock Location modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1712567101/Medusa%20Resources/fulfillment-stock-location_nlkf7e.jpg)

Medusa also defines a link between the `FulfillmentProvider` and `StockLocation` data models to indicate the providers that can be used in a location.

![A diagram showcasing an example of how data models from the Fulfillment and Stock Location modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1728399492/Medusa%20Resources/fulfillment-provider-stock-location_b0mulo.jpg)

### Retrieve with Query

To retrieve the fulfillment sets of a stock location with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `fulfillment_sets.*` in `fields`:

To retrieve the fulfillment providers, pass `fulfillment_providers.*` in `fields`.

### query.graph

```ts
const { data: stockLocations } = await query.graph({
  entity: "stock_location",
  fields: [
    "fulfillment_sets.*",
  ],
})

// stockLocations[0].fulfillment_sets
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: stockLocations } = useQueryGraphStep({
  entity: "stock_location",
  fields: [
    "fulfillment_sets.*",
  ],
})

// stockLocations[0].fulfillment_sets
```

### Manage with Link

To manage the stock location of a fulfillment set, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.STOCK_LOCATION]: {
    stock_location_id: "sloc_123",
  },
  [Modules.FULFILLMENT]: {
    fulfillment_set_id: "fset_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.STOCK_LOCATION]: {
    stock_location_id: "sloc_123",
  },
  [Modules.FULFILLMENT]: {
    fulfillment_set_id: "fset_123",
  },
})
```

***

## Inventory Module

Medusa defines a read-only link between the [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory)'s `InventoryLevel` data model and the `StockLocation` data model. Because the link is read-only from the `InventoryLevel`'s side, you can only retrieve the stock location of an inventory level, and not the other way around.

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

***

## Sales Channel Module

A stock location is associated with a sales channel. This scopes inventory quantities in a stock location by the associated sales channel.

Medusa defines a link between the `SalesChannel` and `StockLocation` data models.

![A diagram showcasing an example of how resources from the Sales Channel and Stock Location modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716796872/Medusa%20Resources/sales-channel-location_cqrih1.jpg)

### Retrieve with Query

To retrieve the sales channels of a stock location with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channels.*` in `fields`:

### query.graph

```ts
const { data: stockLocations } = await query.graph({
  entity: "stock_location",
  fields: [
    "sales_channels.*",
  ],
})

// stockLocations[0].sales_channels
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: stockLocations } = useQueryGraphStep({
  entity: "stock_location",
  fields: [
    "sales_channels.*",
  ],
})

// stockLocations[0].sales_channels
```

### Manage with Link

To manage the stock locations of a sales channel, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123",
  },
  [Modules.STOCK_LOCATION]: {
    sales_channel_id: "sloc_123",
  },
})
```

### createRemoteLinkStep

```ts
import { Modules } from "@medusajs/framework/utils"
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows"

// ...

createRemoteLinkStep({
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123",
  },
  [Modules.STOCK_LOCATION]: {
    sales_channel_id: "sloc_123",
  },
})
```
