# Localization in API Routes

In this chapter, you'll learn how to handle localization in API routes of your Medusa application to serve content in different languages.

### Prerequisites

- [Medusa v2.12.4 or later](https://github.com/medusajs/medusa/releases/tag/v2.12.4)
- [Translation Module Configured](https://docs.medusajs.com/resources/commerce-modules/translation#configure-translation-module)

## Overview

Localization in API routes allows you to serve translated content based on the user's preferred language. The Medusa application provides built-in support for handling locale information in API requests and retrieving localized data.

When a locale is specified in a request, you can use it to retrieve translated versions of your data models' fields, providing a seamless multilingual experience for your users.

Learn more about translation, how to manage translations, and how to translate custom data models in the [Translation Module documentation](https://docs.medusajs.com/resources/commerce-modules/translation).

***

## Routes with Localization Enabled by Default

The Medusa application automatically supports retrieving localized content from all routes under the `/store` prefix, including both core and custom store API routes.

For example, the following store routes have localization enabled by default:

- `/store/products` -> Get products with translated fields
- `/store/collections` -> Get collections with translated fields
- `/store/categories` -> Get categories with translated fields

Refer to the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation#supported-module-translations) documentation for a list of supported core data models with localization support.

### Apply Localization to Custom Routes

If you're creating custom API routes outside the `/store` prefix, you must manually apply the `applyLocale` [middleware](https://docs.medusajs.com/learn/fundamentals/api-routes/middlewares) to enable localization support.

To apply the `applyLocale` middleware to all HTTP methods for a route, add it to the `src/api/middlewares.ts` file:

```ts title="src/api/middlewares.ts"
import { applyLocale, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom*",
      middlewares: [applyLocale],
    },
  ],
})
```

This applies the `applyLocale` middleware to all routes matching `/custom*`, regardless of the HTTP method.

Alternatively, you can apply the middleware only to specific HTTP methods using the `method` property:

```ts title="src/api/middlewares.ts"
import { applyLocale, defineMiddlewares } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/custom*",
      method: ["GET"],
      middlewares: [applyLocale],
    },
  ],
})
```

Learn more about middlewares in the [Middlewares](https://docs.medusajs.com/learn/fundamentals/api-routes/middlewares) chapter.

***

## How to Pass Locale in API Requests

You can pass the locale in API requests to routes that support localization using either of the following methods:

1. The `locale` query parameter
2. The `x-medusa-locale` request header

The query parameter takes priority over the header if both are provided.

The locale must follow the [IETF BCP 47 standard](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1), such as `en-US` for English (United States) or `fr-FR` for French (France).

Refer to the [JS SDK reference](https://docs.medusajs.com/resources/js-sdk#localization-with-js-sdk) for details on how to pass locale.

For example:

### Query Parameter

```bash
curl "http://localhost:9000/store/products?locale=fr-FR" \
-H 'x-publishable-api-key: {your_publishable_api_key}'
```

### Header

```bash
curl "http://localhost:9000/store/products" \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'x-medusa-locale: fr-FR'
```

The above examples retrieve products with their fields translated to French (France) if translations are available. If no translations exist for the requested locale, the original content stored in the data model is returned.

Store API routes require a publishable API key in the request header. Learn more in the [Store API reference](https://docs.medusajs.com/api/store/publishable-api-key).

***

## Access Request Locale in API Routes

After applying the `applyLocale` middleware, you can access the request's locale from the `locale` property of the `MedusaRequest` object.

For example:

```ts title="src/api/custom/route.ts"
import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const locale = req.locale

  // use locale to retrieve localized data...
}
```

The `req.locale` property contains the locale value from either the query parameter or the request header. If no locale is specified in the request, `req.locale` is `undefined`.

### Retrieve Localized Data with Query

To retrieve data models with translated fields, pass the `locale` property in the second parameter object of [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query) when querying your data.

For example, to retrieve products with translated names and descriptions:

```ts title="src/api/store/products/route.ts"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve("query")

  const { data: products } = await query.graph(
    {
      entity: "product",
      fields: ["id", "title", "description"],
    },
    {
      locale: req.locale,
    }
  )

  res.json({ products })
}
```

In this example, the products are retrieved with their `title` and `description` fields translated to the locale specified in the request.

Learn more in the [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query#retrieve-localized-data) chapter.

### Retrieve Localized Data for Custom Models

You can also retrieve localized data for custom data models. Learn more in the [Translate Custom Data Models](https://docs.medusajs.com/resources/commerce-modules/translation/custom-data-models) guide.
