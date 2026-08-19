# Links between Store Module and Other Modules

This document showcases the module links defined between the Store Module and other Commerce Modules.

## Summary

The Store Module has the following links to other modules:

Read-only links are used to query data across modules, but the relations aren't stored in a pivot table in the database.

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|StoreCurrency|Currency|Read-only - has many|Learn more|
|StoreLocale|Locale|Read-only - has many|Learn more|

***

## Currency Module

The Store Module has a `StoreCurrency` data model that stores the supported currencies of a store. However, these currencies don't hold all the details of a currency, such as its name or symbol.

Instead, Medusa defines a read-only link from the Store Module's `StoreCurrency` data model to the [Currency Module](https://docs.medusajs.com/resources/commerce-modules/currency)'s `Currency` data model. This means you can retrieve the details of a store's supported currencies, but you don't manage the links in a pivot table in the database.

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

// stores[0].supported_currencies
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

// stores[0].supported_currencies
```

***

## Translation Module

### Prerequisites

- [Translation Module Configured](https://docs.medusajs.com/commerce-modules/translation#configure-translation-module)

The Store Module has a `StoreLocale` data model that stores the supported locales of a store. However, these locales don't hold all the details of a locale, such as its name.

Instead, Medusa defines a read-only link from the Store Module's `StoreLocale` data model to the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation)'s `Locale` data model. This means you can retrieve the details of a store's supported locales, but you don't manage the links in a pivot table in the database.

### Retrieve with Query

To retrieve the details of a store's locales with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query), pass `supported_locales.locale.*` in `fields`:

### query.graph

```ts
const { data: stores } = await query.graph({
  entity: "store",
  fields: [
    "supported_locales.locale.*",
  ],
})

// stores[0].supported_locales[0].locale
```

### useQueryGraphStep

```ts
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"

// ...

const { data: stores } = useQueryGraphStep({
  entity: "store",
  fields: [
    "supported_locales.locale.*",
  ],
})

// stores[0].supported_locales[0].locale
```
