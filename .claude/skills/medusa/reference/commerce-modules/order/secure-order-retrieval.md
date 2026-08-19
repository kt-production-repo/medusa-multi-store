# Restrict Order Retrieval

In this guide, you'll learn how Medusa handles access to the [Get an Order API route](https://docs.medusajs.com/api/store/orders/get-an-order), and how to restrict access to it in your Medusa application.

## How Medusa Handles Order Retrieval

The `GET /store/orders/:id` API route doesn't require customer authentication. Any request that includes a valid [publishable API key](https://docs.medusajs.com/resources/storefront-development/publishable-api-keys) and a correct order ID receives the order's details.

Medusa applies this behavior intentionally. Guest customers place orders without an account, so they have no session or token to authenticate with. After they complete the cart, the storefront redirects them to an order confirmation page that retrieves the order by its ID. Requiring authentication would break that page.

The order's ID acts as the credential in this flow. Medusa generates order IDs randomly, so guessing an ID requires brute forcing a value from an address space large enough to make the attempt impractical.

The [List Orders API route](https://docs.medusajs.com/api/store/orders/list-orders), which lists a customer's orders, does require customer authentication. Only the retrieval route accepts unauthenticated requests.

***

## Restrict Access to the Route

If your store doesn't allow guest checkout, you may want stricter access rules. You can add access rules with [middlewares](https://docs.medusajs.com/docs/learn/fundamentals/api-routes/middlewares). Middlewares that you apply to an existing API route run in addition to the route's original middlewares, so you don't have to replicate the route.

For example, add the [authenticate middleware](https://docs.medusajs.com/docs/learn/fundamentals/api-routes/protected-routes#protect-custom-api-routes) to the route:

```ts title="src/api/middlewares.ts"
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/orders/:id",
      method: ["GET"],
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
      ],
    },
  ],
})
```

A request without an authenticated customer now receives a `401` error, while a logged-in customer still retrieves the order.

This middleware only checks that a customer is authenticated. It doesn't check that the customer owns the order, so any logged-in customer can retrieve any order. Refer to the [next section](#restrict-the-route-to-the-orders-customer) to also check ownership.

### Restrict the Route to the Order's Customer

To allow only the customer that placed the order to retrieve it, add a custom middleware that compares the authenticated customer's ID to the order's `customer_id`.

Create the file `src/api/middlewares/ensure-order-owner.ts` with the following content:

```ts title="src/api/middlewares/ensure-order-owner.ts"
import {
  AuthenticatedMedusaRequest,
  MedusaNextFunction,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

export async function ensureOrderOwner(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) {
  const query = req.scope.resolve(
    ContainerRegistrationKeys.QUERY
  )

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: {
      id: req.params.id,
    },
  })

  if (order?.customer_id !== req.auth_context.actor_id) {
    return next(
      new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        "You're not allowed to retrieve this order."
      )
    )
  }

  next()
}
```

The middleware retrieves the order's `customer_id` with [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query). The `auth_context.actor_id` property holds the ID of the customer that the `authenticate` middleware authenticated. If the two IDs don't match, the middleware rejects the request with a `401` error.

Then, apply the middleware after the `authenticate` middleware:

```ts title="src/api/middlewares.ts"
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"
import {
  ensureOrderOwner,
} from "./middlewares/ensure-order-owner"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/orders/:id",
      method: ["GET"],
      middlewares: [
        authenticate("customer", ["session", "bearer"]),
        ensureOrderOwner,
      ],
    },
  ],
})
```

The order of the middlewares matters. The `authenticate` middleware must run first, since `ensureOrderOwner` reads the customer that it authenticated.

Now, only the customer that placed the order can retrieve it. Other logged-in customers receive a `401` error.
