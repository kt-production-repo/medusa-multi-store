# Get Product Variant Prices using Query

In this document, you'll learn how to retrieve product variant prices in the Medusa application using [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query).

The Product Module doesn't provide pricing functionalities. The Medusa application links the Product Module's `ProductVariant` data model to the Pricing Module's `PriceSet` data model.

So, to retrieve data across the linked records of the two modules, you use Query.

## Retrieve All Product Variant Prices

To retrieve all product variant prices, retrieve the product using Query and include among its fields `variants.prices.*`.

For example:

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "*",
    "variants.*",
    "variants.prices.*",
  ],
  filters: {
    id: [
      "prod_123",
    ],
  },
})
```

Each variant in the retrieved products has a `prices` array property with all the product variant prices. Each price object has the properties of the [Pricing Module's Price data model](https://docs.medusajs.com/references/pricing/models/Price).

***

## Retrieve Calculated Price for a Context

The Pricing Module can calculate prices of a variant based on a [context](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation#calculation-context), such as the region ID or the currency code.

Learn more about prices calculation in [this Pricing Module documentation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation).

To retrieve calculated prices of variants based on a context, retrieve the products using Query and:

- Pass `variants.calculated_price.*` in the `fields` property.
- Pass a `context` property in the object parameter. Its value is an object of objects that sets the context for the retrieved fields.

For example:

```ts
import { QueryContext } from "@medusajs/framework/utils"

// ...

const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "*",
    "variants.*",
    "variants.calculated_price.*",
  ],
  filters: {
    id: "prod_123",
  },
  context: {
    variants: {
      calculated_price: QueryContext({
        region_id: "reg_01J3MRPDNXXXDSCC76Y6YCZARS",
        currency_code: "eur",
      }),
    },
  },
})
```

For the context of the product variant's calculated price, you pass an object to `context` with the property `variants`, whose value is another object with the property `calculated_price`.

`calculated_price`'s value is created using `QueryContext` from the Modules SDK, passing it a [calculation context object](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation#calculation-context).

Each variant in the retrieved products has a `calculated_price` object. Learn more about its properties in [this Pricing Module guide](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation#returned-price-object).
