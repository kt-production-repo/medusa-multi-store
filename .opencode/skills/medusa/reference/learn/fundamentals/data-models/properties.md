# Data Model Properties

In this chapter, you'll learn about the different property types you can use in a data model and how to configure a data model's properties.

## Data Model's Default Properties

By default, Medusa creates the following properties for every data model:

- `created_at`: A [dateTime](#dateTime) property that stores when a record of the data model was created.
- `updated_at`: A [dateTime](#dateTime) property that stores when a record of the data model was updated.
- `deleted_at`: A [dateTime](#dateTime) property that stores when a record of the data model was deleted. When you soft-delete a record, Medusa sets the `deleted_at` property to the current date.

***

## Property Types

This section covers the different property types you can define in a data model's schema using the `model` methods.

### id

The `id` method defines an automatically generated string ID property. The generated ID is a unique string that has a mix of letters and numbers.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id(),
  // ...
})

export default Post
```

### text

The `text` method defines a string property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  name: model.text(),
  // ...
})

export default Post
```

#### Limit Text Length

To limit the allowed length of a `text` property, use the [checks method](https://docs.medusajs.com/learn/fundamentals/data-models/check-constraints).

For example, to limit the `name` property to a maximum of 50 characters:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  name: model.text(),
  // ...
})
.checks([
  {
    name: "limit_name_length",
    expression: (columns) => `LENGTH(${columns.name}) <= 50`,
  },
])

export default Post
```

This will add a database check constraint that ensures the `name` property of a record does not exceed 50 characters. If a record with a longer `name` is attempted to be inserted, an error will be thrown.

### number

The `number` method defines a number property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  age: model.number(),
  // ...
})

export default Post
```

### float

This property is only available after [Medusa v2.1.2](https://github.com/medusajs/medusa/releases/tag/v2.1.2).

The `float` method defines a number property that allows for values with decimal places.

Use this property type when it's less important to have high precision for numbers with large decimal places. Alternatively, for higher precision, use the [bigNumber property](#bignumber).

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  rating: model.float(),
  // ...
})

export default Post
```

### bigNumber

The `bigNumber` method defines a number property that expects large numbers, such as prices.

Use this property type when it's important to have high precision for numbers with large decimal places. Alternatively, for less precision, use the [float property](#float).

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  price: model.bigNumber(),
  // ...
})

export default Post
```

Medusa stores along the `bigNumber` property a `raw_{property_name}` property that contains its raw value. Learn more in the [Big Number documentation](https://docs.medusajs.com/learn/fundamentals/data-models/big-numbers).

### boolean

The `boolean` method defines a boolean property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  hasAccount: model.boolean(),
  // ...
})

export default Post
```

### enum

The `enum` method defines a property whose value can only be one of the specified values.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  color: model.enum(["black", "white"]),
  // ...
})

export default Post
```

The `enum` method accepts an array of possible string values.

### dateTime

The `dateTime` method defines a timestamp property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  date_of_birth: model.dateTime(),
  // ...
})

export default Post
```

### json

The `json` method defines a property whose value is stored as a `jsonb` column in the database, supporting any JSON-serializable value.

By default, the property's TypeScript type is `Record<string, unknown>`. Pass a type parameter to use a different shape, such as an array of objects.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  metadata: model.json(),
  // ...
})

export default Post
```

To store an array of typed objects, pass a type argument:

The type argument is supported since [Medusa v2.19.0](https://github.com/medusajs/medusa/releases/tag/v2.19.0).

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  warnings: model.json<{ code: string; message: string }[]>(),
  // ...
})

export default Post
```

To store an array of strings, use the [array](#array) property type instead, which stores the value in a `text[]` column.

Learn more in the [JSON Properties](https://docs.medusajs.com/learn/fundamentals/data-models/json-properties) chapter.

### array

The `array` method defines an array of strings property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  names: model.array(),
  // ...
})

export default Post
```

### Properties Reference

Refer to the [Data Model Language (DML) reference](https://docs.medusajs.com/resources/references/data-model) for a full reference of the properties.

***

## Set Primary Key Property

To set any `id`, `text`, or `number` property as a primary key, use the `primaryKey` method.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  // ...
})

export default Post
```

In the example above, the `id` property is defined as the data model's primary key.

***

## Property Default Value

Use the `default` method on a property's definition to specify the default value of a property.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  color: model
    .enum(["black", "white"])
    .default("black"),
  age: model
    .number()
    .default(0),
  // ...
})

export default Post
```

In this example, you set the default value of the `color` enum property to `black`, and that of the `age` number property to `0`.

***

## Make Property Optional

Use the `nullable` method to indicate that a property’s value can be `null`. This is useful when you want a property to be optional.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  price: model.bigNumber().nullable(),
  // ...
})

export default Post
```

In the example above, the `price` property is configured to allow `null` values, making it optional.

***

## Unique Property

The `unique` method indicates that a property’s value must be unique in the database through a unique index.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const User = model.define("user", {
  email: model.text().unique(),
  // ...
})

export default User
```

In this example, multiple users can’t have the same email.

***

## Define Database Index on Property

Use the `index` method on a property's definition to define a database index.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  name: model.text().index(
    "IDX_MY_CUSTOM_NAME"
  ),
})

export default Post
```

The `index` method optionally accepts the name of the index as a parameter.

In this example, you define an index on the `name` property.

***

## Define a Searchable Property

Methods generated by the [service factory](https://docs.medusajs.com/learn/fundamentals/modules/service-factory) that accept filters, such as `list{ModelName}s`, accept a `q` property as part of the filters.

When the `q` filter is passed, the data model's searchable properties are queried to find matching records.

Use the `searchable` method on a `text` property to indicate that it's searchable.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  title: model.text().searchable(),
  // ...
})

export default Post
```

In this example, the `title` property is searchable.

### Searchable Relationship Properties

You can also make relationship properties searchable by adding the `searchable` method to relationship definitions like `hasMany`, `hasOne`, `belongsTo`, or `manyToMany`.

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Product = model.define("product", {
  variants: model.hasMany(() => ProductVariant, {
    mappedBy: "product",
  }).searchable(),
  // ...
})

export default Product
```

When a relationship property is marked as searchable, the related records' searchable text properties can be queried when using the `q` filter.

### Search Example

If you pass a `q` filter to the `listPosts` method:

```ts
const posts = await blogModuleService.listPosts({
  q: "New Products",
})
```

This retrieves records that include `New Products` in their `title` property.

***

## Make Property Translatable

### Prerequisites

- [Medusa v2.13.0+](https://github.com/medusajs/medusa/releases/tag/v2.13.0)
- [Translation Module Configured](https://docs.medusajs.com/resources/commerce-modules/translation#configure-translation-module)

Use the `translatable` method on a `text` property to indicate that the property can have different values per locale. This only works if the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation) is configured in your application.

When a property is marked as translatable, merchants can manage translations for these fields through the [Medusa Admin](https://docs.medusajs.com/user-guide/settings/translations).

For example:

```ts
import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  title: model.text().translatable(),
  description: model.text().translatable(),
  // ...
})

export default Post
```

In this example, the `title` and `description` properties are translatable. So, admin users can translate the values of these properties into different locales.

Learn more in the [Translate Custom Data Models](https://docs.medusajs.com/resources/commerce-modules/translation/custom-data-models) guide.
