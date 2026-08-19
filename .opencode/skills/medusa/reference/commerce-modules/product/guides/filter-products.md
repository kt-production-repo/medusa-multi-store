# Filter Products using Query

In this guide, you'll learn about the different ways you can filter products in the Medusa server using [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query).

Refer to the [Product Filtering in Storefront guide](https://docs.medusajs.com/resources/storefront-development/products/list#filter-products) to learn how to implement product filtering in your storefront.

## Filter Products by Field Values

You can filter products based on specific field values by passing them to Query's `filters` parameter.

For example, to filter products by their IDs:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
  ],
  filters: {
    id: [
      "prod_123",
      "prod_456",
    ],
  },
})
```

### useQueryGraphStep

```ts
const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
  ],
  filters: {
    id: [ 
      "prod_123",
      "prod_456",
    ],
  },
})
```

***

## Filter Products by Options

This feature is available since [Medusa v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0).

You can filter products based on whether any of their variants have specific options, such as size or color.

For example:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
    "options",
  ],
  filters: {
    options: {
      id: ["opt_123", "opt_456"],
    },
  },
})
```

### useQueryGraphStep

```ts
const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
    "options",
  ],
  filters: {
    options: {
      id: ["opt_123", "opt_456"],
    },
  },
})
```

In this example, only products that have at least one variant with either the `opt_123` or `opt_456` option will be returned.

***

## Filter Products by Option Values

This feature is available since [Medusa v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0).

You can filter products based on whether any of their variants have specific option values, such as "Red" or "Large".

For example:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
    "options.values.*",
  ],
  filters: {
    options: {
      values: {
        id: ["optval_123", "optval_456"],
      },
    },
  },
})
```

### useQueryGraphStep

```ts
const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
    "options.values.*",
  ],
  filters: {
    options: {
      values: {
        id: ["optval_123", "optval_456"],
      },
    },
  },
})
```

In this example, only products that have at least one variant with either the `optval_123` or `optval_456` option value will be returned.

***

## Filter Products by Category

You can filter products based on the categories they belong to.

For example:

### query.graph

```ts
const { data: products } = await query.graph({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
  ],
  filters: {
    // @ts-ignore
    categories: ["cat_123", "cat_456"],
  },
})
```

### useQueryGraphStep

```ts
const { data: products } = useQueryGraphStep({
  entity: "product",
  fields: [
    "id",
    "title",
    "handle",
  ],
  filters: {
    // @ts-ignore
    categories: ["cat_123", "cat_456"],
  },
})
```

In this example, only products that belong to either the `cat_123` or `cat_456` category will be returned.
