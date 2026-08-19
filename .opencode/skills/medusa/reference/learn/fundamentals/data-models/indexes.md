# Data Model Database Index

In this chapter, you’ll learn how to define a database index on a data model.

You can also define an index on a property as explained in the [Properties chapter](https://docs.medusajs.com/learn/fundamentals/data-models/properties#define-database-index-on-property).

## Define Database Index on Data Model

A data model has an `indexes` method that defines database indices on its properties.

The index can be on multiple columns (composite index). For example:

```ts
import { model } from "@medusajs/framework/utils"

const MyCustom = model.define("my_custom", {
  id: model.id().primaryKey(),
  name: model.text(),
  age: model.number(),
}).indexes([
  {
    on: ["name", "age"],
  },
])

export default MyCustom
```

The `indexes` method receives an array of indices as a parameter. Each index is an object with a required `on` property indicating the properties to apply the index on.

In the above example, you define a composite index on the `name` and `age` properties.

### Index Conditions

An index can have conditions. For example:

```ts
import { model } from "@medusajs/framework/utils"

const MyCustom = model.define("my_custom", {
  id: model.id().primaryKey(),
  name: model.text(),
  age: model.number(),
}).indexes([
  {
    on: ["name", "age"],
    where: {
      age: 30,
    },
  },
])

export default MyCustom
```

The index object passed to `indexes` accepts a `where` property whose value is an object of conditions. The object's key is a property's name, and its value is the condition on that property.

In the example above, the composite index is created on the `name` and `age` properties when the `age`'s value is `30`.

A property's condition can be a negation. For example:

```ts
import { model } from "@medusajs/framework/utils"

const MyCustom = model.define("my_custom", {
  id: model.id().primaryKey(),
  name: model.text(),
  age: model.number().nullable(),
}).indexes([
  {
    on: ["name", "age"],
    where: {
      age: {
        $ne: null,
      },
    },
  },
])

export default MyCustom
```

A property's value in `where` can be an object having a `$ne` property. `$ne`'s value indicates what the specified property's value shouldn't be.

In the example above, the composite index is created on the `name` and `age` properties when `age`'s value is not `null`.

### Unique Database Index

The object passed to `indexes` accepts a `unique` property indicating that the created index must be a unique index.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const MyCustom = model.define("my_custom", {
  id: model.id().primaryKey(),
  name: model.text(),
  age: model.number(),
}).indexes([
  {
    on: ["name", "age"],
    unique: true,
  },
])

export default MyCustom
```

This creates a unique composite index on the `name` and `age` properties.
