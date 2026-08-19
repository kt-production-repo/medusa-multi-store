# Links between Translation Module and Other Modules

This document showcases the module links that Medusa defines between the Translation Module and other Commerce Modules.

## Summary

Medusa defines the following links between the Translation Module and other Commerce Modules:

|First Data Model|Second Data Model|Type|Description|
|---|---|---|---|
|Product|Translation|Read-only - one-to-many|Learn more|
|ProductVariant|Translation|Read-only - one-to-many|Learn more|
|ProductCategory|Translation|Read-only - one-to-many|Learn more|
|ProductCollection|Translation|Read-only - one-to-many|Learn more|
|ProductTag|Translation|Read-only - one-to-many|Learn more|
|ProductType|Translation|Read-only - one-to-many|Learn more|
|ProductOption|Translation|Read-only - one-to-many|Learn more|
|ProductOptionValue|Translation|Read-only - one-to-many|Learn more|
|StoreLocale|Locale|Read-only - has many|Learn more|

***

## Product Module

Medusa defines the following read-only links between the Translation and Product Modules:

|Data Model|Link Type|Description|
|---|---|---|
|Product|One-to-many (bidirectional)|Retrieve translations associated with a product and vice versa.|
|ProductVariant|One-to-many (read-only)|Retrieve translations of a product variant only.|
|ProductCategory|One-to-many (read-only)|Retrieve translations of a product category only.|
|ProductCollection|One-to-many (read-only)|Retrieve translations of a product collection only.|
|ProductTag|One-to-many (read-only)|Retrieve translations of a product tag only.|
|ProductType|One-to-many (read-only)|Retrieve translations of a product type only.|
|ProductOption|One-to-many (read-only)|Retrieve translations of a product option only.|
|ProductOptionValue|One-to-many (read-only)|Retrieve translations of a product option value only.|

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

***

## Store Module

The [Store Module](https://docs.medusajs.com/resources/commerce-modules/store) has a `StoreLocale` data model that stores the supported locales of a store. However, these locales don't hold all the details of a locale, such as its name.

Instead, Medusa defines a read-only link from the Store Module's `StoreLocale` data model to the Translation Module's `Locale` data model. This means you can retrieve the details of a store's supported locales, but you don't manage the links in a pivot table in the database.

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
