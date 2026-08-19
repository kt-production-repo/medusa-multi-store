# Links between API Key Module and Other Modules

This document showcases the module links defined between the API Key Module and other Commerce Modules.

## Summary

The API Key Module has the following links to other modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|ApiKey|SalesChannel|Stored - many-to-many|Learn more|

***

## Sales Channel Module

You can create a publishable API key and associate it with a sales channel. Medusa defines a link between the `ApiKey` and the `SalesChannel` data models.

![A diagram showcasing an example of how data models from the API Key and Sales Channel modules are linked](https://res.cloudinary.com/dza7lstvk/image/upload/v1709812064/Medusa%20Resources/sales-channel-api-key_zmqi2l.jpg)

This is useful to avoid passing the sales channel's ID as a parameter of every request, and instead pass the publishable API key in the header of any request to the Store API route.

Learn more about this in the [Sales Channel Module's documentation](https://docs.medusajs.com/resources/commerce-modules/sales-channel/publishable-api-keys).

### Retrieve with Query

To retrieve the sales channels of an API key with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `sales_channels.*` in `fields`:

### query.graph

```ts
const { data: apiKeys } = await query.graph({
  entity: "api_key",
  fields: [
    "sales_channels.*",
  ],
})

// apiKeys[0].sales_channels
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: apiKeys } = useQueryGraphStep({
  entity: "api_key",
  fields: [
    "sales_channels.*",
  ],
})

// apiKeys[0].sales_channels
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
