# Links between Sales Channel Module and Other Modules

This document showcases the module links defined between the Sales Channel Module and other Commerce Modules.

## Summary

The Sales Channel Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|ApiKey|SalesChannel|Stored - many-to-many|Learn more|
|Cart|SalesChannel|Read-only - has one|Learn more|
|Order|SalesChannel|Read-only - has one|Learn more|
|Product|SalesChannel|Stored - many-to-many|Learn more|
|SalesChannel|StockLocation|Stored - many-to-many|Learn more|

***

## API Key Module

A publishable API key allows you to easily specify the sales channel scope in a client request.

Medusa defines a link between the `ApiKey` and the `SalesChannel` data models.

![A diagram showcasing an example of how resources from the Sales Channel and API Key modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1709812064/Medusa%20Resources/sales-channel-api-key_zmqi2l.jpg)

### Retrieve with Query

To retrieve the API keys associated with a sales channel with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `publishable_api_keys.*` in `fields`:

### query.graph

```ts
const { data: salesChannels } = await query.graph({
  entity: "sales_channel",
  fields: [
    "publishable_api_keys.*",
  ],
})

// salesChannels[0].publishable_api_keys
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: salesChannels } = useQueryGraphStep({
  entity: "sales_channel",
  fields: [
    "publishable_api_keys.*",
  ],
})

// salesChannels[0].publishable_api_keys
```

### Manage with Link

To manage the sales channels of an API key, use [Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links/link):

### link.create

```ts
import { Modules } from "@medusajs/framework/utils"

// ...

await link.create({
  [Modules.API_KEY]: {
    publishable_key_id: "apk_123",
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
  [Modules.API_KEY]: {
    publishable_key_id: "apk_123",
  },
  [Modules.SALES_CHANNEL]: {
    sales_channel_id: "sc_123",
  },
})
```

***

## Cart Module

Medusa defines a read-only link between the [Cart Module](https://docs.medusajs.com/resources/commerce-modules/cart)'s `Cart` data model and the `SalesChannel` data model. Because the link is read-only from the `Cart`'s side, you can only retrieve the sales channel of a cart, and not the other way around.

### Retrieve with Query

To retrieve the sales channel of a cart with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channel.*` in `fields`:

### query.graph

```ts
const { data: carts } = await query.graph({
  entity: "cart",
  fields: [
    "sales_channel.*",
  ],
})

// carts[0].sales_channel
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: carts } = useQueryGraphStep({
  entity: "cart",
  fields: [
    "sales_channel.*",
  ],
})

// carts[0].sales_channel
```

***

## Order Module

Medusa defines a read-only link between the [Order Module](https://docs.medusajs.com/resources/commerce-modules/order)'s `Order` data model and the `SalesChannel` data model. Because the link is read-only from the `Order`'s side, you can only retrieve the sales channel of an order, and not the other way around.

### Retrieve with Query

To retrieve the sales channel of an order with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channel.*` in `fields`:

### query.graph

```ts
const { data: orders } = await query.graph({
  entity: "order",
  fields: [
    "sales_channel.*",
  ],
})

// orders.sales_channel
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: orders } = useQueryGraphStep({
  entity: "order",
  fields: [
    "sales_channel.*",
  ],
})

// orders.sales_channel
```

***

## Product Module

A product has different availability for different sales channels. Medusa defines a link between the `Product` and the `SalesChannel` data models.

![A diagram showcasing an example of how resources from the Sales Channel and Product modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1709809833/Medusa%20Resources/product-sales-channel_t848ik.jpg)

A product can be available in more than one sales channel. You can retrieve only the products of a sales channel.

### Retrieve with Query

To retrieve the products of a sales channel with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `products.*` in `fields`:

### query.graph

```ts
const { data: salesChannels } = await query.graph({
  entity: "sales_channel",
  fields: [
    "products.*",
  ],
})

// salesChannels[0].products
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: salesChannels } = useQueryGraphStep({
  entity: "sales_channel",
  fields: [
    "products.*",
  ],
})

// salesChannels[0].products
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

## Stock Location Module

A stock location is associated with a sales channel. This scopes inventory quantities associated with that stock location by the associated sales channel.

Medusa defines a link between the `SalesChannel` and `StockLocation` data models.

![A diagram showcasing an example of how resources from the Sales Channel and Stock Location modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1716796872/Medusa%20Resources/sales-channel-location_cqrih1.jpg)

### Retrieve with Query

To retrieve the stock locations of a sales channel with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `stock_locations.*` in `fields`:

### query.graph

```ts
const { data: salesChannels } = await query.graph({
  entity: "sales_channel",
  fields: [
    "stock_locations.*",
  ],
})

// salesChannels[0].stock_locations
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: salesChannels } = useQueryGraphStep({
  entity: "sales_channel",
  fields: [
    "stock_locations.*",
  ],
})

// salesChannels[0].stock_locations
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
