# Links between Currency Module and Other Modules

This document showcases the module links defined between the Currency Module and other Commerce Modules.

## Summary

The Currency Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|StoreCurrency|Currency|Read-only - has one|Learn more|

***

## Store Module

The Store Module has a `Currency` data model that stores the supported currencies of a store. However, these currencies don't hold all the details of a currency, such as its name or symbol.

Instead, Medusa defines a read-only link between the [Store Module](https://docs.medusajs.com/resources/commerce-modules/store)'s `StoreCurrency` data model and the Currency Module's `Currency` data model. Because the link is read-only from the `Store`'s side, you can only retrieve the details of a store's supported currencies, and not the other way around.

### Retrieve with Query

To retrieve the details of a store's currencies with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `supported_currencies.currency.*` in `fields`:

### query.graph

```ts
const { data: stores } = await query.graph({
  entity: "store",
  fields: [
    "supported_currencies.currency.*",
  ],
})

// stores[0].supported_currencies[0].currency
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: stores } = useQueryGraphStep({
  entity: "store",
  fields: [
    "supported_currencies.currency.*",
  ],
})

// stores[0].supported_currencies[0].currency
```
