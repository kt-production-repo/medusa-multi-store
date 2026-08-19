# Get Product Variant Inventory Quantity

In this guide, you'll learn how to retrieve the available inventory quantity of a product variant in your Medusa application customizations. That includes API routes, workflows, subscribers, scheduled jobs, and any resource that can access the [Medusa container](https://docs.medusajs.com/docs/learn/fundamentals/medusa-container).

Refer to the [Retrieve Product Variant Inventory](https://docs.medusajs.com/resources/storefront-development/products/inventory) storefront guide.

## Understanding Product Variant Inventory Availability

Product variants have a `manage_inventory` boolean field that indicates whether the Medusa application manages the inventory of the product variant.

When `manage_inventory` is disabled, the Medusa application always considers the product variant to be in stock. So, you can't retrieve the inventory quantity for those products.

When `manage_inventory` is enabled, the Medusa application tracks the inventory of the product variant using the [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory). For example, when a customer purchases a product variant, the Medusa application decrements the stocked quantity of the product variant.

This guide explains how to retrieve the inventory quantity of a product variant when `manage_inventory` is enabled.

***

## Retrieve Product Variant Inventory

To retrieve the inventory quantity of a product variant, use the `getVariantAvailability` utility function imported from `@medusajs/framework/utils`. It returns the available quantity of the product variant.

For example:

```ts
import { getVariantAvailability } from "@medusajs/framework/utils"

// ...

// use req.scope instead of container in API routes
const query = container.resolve("query")

const availability = await getVariantAvailability(query, {
  variant_ids: ["variant_123"],
  sales_channel_id: "sc_123",
})
```

A product variant's inventory quantity is set per [stock location](https://docs.medusajs.com/resources/commerce-modules/stock-location). This stock location is linked to a [sales channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel).

So, to retrieve the inventory quantity of a product variant using `getVariantAvailability`, you need to also provide the ID of the sales channel to retrieve the inventory quantity in.

Refer to the [Retrieve Sales Channel to Use](#retrieve-sales-channel-to-use) section to learn how to retrieve the sales channel ID to use in the `getVariantAvailability` function.

### Parameters

The `getVariantAvailability` function accepts the following parameters:

- query: (Query) Instance of Query to retrieve the necessary data.
- options: (\`object\`) The options to retrieve the variant availability.

  - variant\_ids: (\`string\[]\`) The IDs of the product variants to retrieve their inventory availability.

  - sales\_channel\_id: (\`string\`) The ID of the sales channel to retrieve the variant availability in.

### Returns

The `getVariantAvailability` function resolves to an object whose keys are the IDs of each product variant passed in the `variant_ids` parameter.

The value of each key is an object with the following properties:

- availability: (\`number\`) The available quantity of the product variant in the stock location linked to the sales channel. If \`manage\_inventory\` is disabled, this value is \`0\`.
- sales\_channel\_id: (\`string\`) The ID of the sales channel that the availability is scoped to.

For example, the object may look like this:

```json title="Example result"
{
  "variant_123": {
    "availability": 10,
    "sales_channel_id": "sc_123"
  }
}
```

***

## Retrieve Sales Channel to Use

To retrieve the sales channel ID to use in the `getVariantAvailability` function, you can either:

- Use the sales channel of the request's scope.
- Use the sales channel that the variant's product is available in.

### Method 1: Use Sales Channel Scope in Store Routes

Requests sent to API routes starting with `/store` must include a [publishable API key in the request header](https://docs.medusajs.com/resources/commerce-modules/sales-channel/publishable-api-keys). This scopes the request to one or more sales channels associated with the publishable API key.

So, if you're retrieving the variant inventory availability in an API route starting with `/store`, you can access the sales channel using the `publishable_key_context.sales_channel_ids` property of the request object:

```ts
import { MedusaStoreRequest, MedusaResponse } from "@medusajs/framework/http"
import { getVariantAvailability } from "@medusajs/framework/utils"

export async function GET(
  req: MedusaStoreRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve("query")
  const sales_channel_ids = req.publishable_key_context.sales_channel_ids

  const availability = await getVariantAvailability(query, {
    variant_ids: ["variant_123"],
    sales_channel_id: sales_channel_ids[0],
  })

  res.json({
    availability,
  })
}
```

In this example, you retrieve the scope's sales channel IDs using `req.publishable_key_context.sales_channel_ids`, whose value is an array of IDs.

Then, you pass the first sales channel ID to the `getVariantAvailability` function to retrieve the inventory availability of the product variant in that sales channel.

Notice that the request object's type is `MedusaStoreRequest` instead of `MedusaRequest` to ensure the availability of the `publishable_key_context` property.

### Method 2: Use Product's Sales Channel

A product is linked to the sales channels it's available in. So, you can retrieve the details of the variant's product, including its sales channels.

For example:

```ts
import { getVariantAvailability } from "@medusajs/framework/utils"

// ...

// use req.scope instead of container in API routes
const query = container.resolve("query")

const { data: variants } = await query.graph({
  entity: "variant",
  fields: ["id", "product.sales_channels.*"],
  filters: {
    id: "variant_123",
  },
})

const availability = await getVariantAvailability(query, {
  variant_ids: ["variant_123"],
  sales_channel_id: variants[0].product!.sales_channels![0]!.id,
})
```

In this example, you retrieve the sales channels of the variant's product using [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query).

You pass the ID of the variant as a filter, and you specify `product.sales_channels.*` as the fields to retrieve. This retrieves the sales channels linked to the variant's product.

Then, you pass the first sales channel ID to the `getVariantAvailability` function to retrieve the inventory availability of the product variant in that sales channel.
