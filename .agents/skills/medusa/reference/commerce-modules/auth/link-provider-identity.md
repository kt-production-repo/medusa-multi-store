# Link an Additional Auth Provider to an Existing Actor

In this guide, you'll learn how to allow an existing actor (such as a customer) to authenticate with an additional authentication provider. This is useful when you want to let a customer who registered with the Emailpass provider also log in with Google or a Magic Link, for example.

### Prerequisites

- [Custom authentication provider registered for the actor type.](https://docs.medusajs.com/references/auth/provider)

## Why an Additional Provider Doesn't Resolve to the Actor

Each authentication provider creates its own [auth identity](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types) for an actor. The auth identity holds an `app_metadata` property that associates it with an actor, such as a customer, using the key `{actor_type}_id`:

```json
{
  "app_metadata": {
    "customer_id": "cus_123"
  }
}
```

When an actor registers with the Emailpass provider, its auth identity has the `{actor_type}_id` key set to the associated actor's ID. So, authenticating with Emailpass resolves to that actor.

However, when the same actor authenticates with a different provider for the first time, that provider creates a separate auth identity. This new auth identity has an empty `app_metadata`, so it isn't associated with any actor yet:

```json
{
  "app_metadata": {}
}
```

Since the new auth identity isn't associated with an actor, Medusa treats the authentication as if a new actor is registering, rather than an existing actor logging in. So, authenticating with the new provider returns a token that has an `auth_identity_id` but no `actor_id`. As a result, requests to protected routes, such as `GET /store/customers/me`, are rejected with a `401` error.

To allow the new provider to resolve to the existing customer, you must set the `{actor_type}_id` key of the new auth identity's `app_metadata` to the existing actor's ID. You do that with the [setAuthAppMetadataStep](https://docs.medusajs.com/references/medusa-workflows/steps/setAuthAppMetadataStep).

The rest of this guide uses the `customer` actor type as an example, but the same approach applies to admin users and [custom actor types](https://docs.medusajs.com/resources/commerce-modules/auth/create-actor-type). Replace `customer` with the relevant actor type.

***

## Step 1: Create the Linking Workflow

Create a [workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows) that finds the existing customer matching the new auth identity and associates the auth identity with that customer.

Create the file `src/workflows/link-customer-identity.ts` with the following content:

```ts title="src/workflows/link-customer-identity.ts"
import {
  createWorkflow,
  createStep,
  StepResponse,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  setAuthAppMetadataStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import { CustomerDTO } from "@medusajs/framework/types"

type WorkflowInput = {
  auth_identity_id: string
}

type AuthIdentityData = {
  provider_identities?: { entity_id: string }[]
}[]

const getIdentityEmailStep = createStep(
  "get-identity-email",
  ({ authIdentities }: { authIdentities: AuthIdentityData }) => {
    const email =
      authIdentities[0]?.provider_identities?.[0]?.entity_id

    if (!email) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Couldn't determine the identity's email."
      )
    }

    return new StepResponse(email)
  }
)

const validateCustomerExistsStep = createStep(
  "validate-customer-exists",
  ({
    customers,
    email,
  }: {
    customers: CustomerDTO[]
    email: string
  }) => {
    if (!customers.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No customer found with email ${email}`
      )
    }

    return new StepResponse(customers[0])
  }
)

export const linkCustomerIdentityWorkflow = createWorkflow(
  "link-customer-identity",
  (input: WorkflowInput) => {
    const { data: authIdentities } = useQueryGraphStep({
      entity: "auth_identity",
      fields: ["provider_identities.entity_id"],
      filters: {
        id: input.auth_identity_id,
      },
    })

    const email = getIdentityEmailStep({ authIdentities })

    const { data: customers } = useQueryGraphStep({
      entity: "customer",
      fields: ["id"],
      filters: {
        email,
      },
    }).config({ name: "get-customer" })

    const customer = validateCustomerExistsStep({
      customers,
      email,
    })

    const stepInput = transform(
      { input, customer },
      ({ input, customer }) => ({
        authIdentityId: input.auth_identity_id,
        actorType: "customer",
        value: customer.id,
      })
    )

    setAuthAppMetadataStep(stepInput)

    return new WorkflowResponse({
      customer_id: customer.id,
    })
  }
)
```

The workflow accepts the ID of the auth identity created by the new provider. Then, it:

1. Retrieves the auth identity with its provider identity using [useQueryGraphStep](https://docs.medusajs.com/references/helper-steps/useQueryGraphStep). The provider identity's `entity_id` holds the identifier the provider authenticated the customer with, such as the email.
2. Extracts and validates the email using the `getIdentityEmailStep`, throwing an error if the identity has no email.
3. Finds the existing customer by that email using `useQueryGraphStep` again. Adjust the `filters` if your provider identifies customers by a property other than the email.
4. Validates that a customer was found using the `validateCustomerExistsStep`, throwing an error if not.
5. Prepares the step's input using `transform`, then associates the new auth identity with the existing customer using the `setAuthAppMetadataStep`.

Since you call `useQueryGraphStep` twice in the same workflow, you must set a unique name for the second call with `.config({ name: "get-customer" })`. Otherwise, the workflow throws an error for having two steps with the same ID.

Derive the email from the authenticated auth identity, as shown above, rather than accepting it in the request body. Otherwise, a customer could link their auth identity to another customer's account by passing a different email.

The `setAuthAppMetadataStep` throws an error if the auth identity is already associated with the same actor type. So, this workflow only succeeds for a new auth identity that isn't linked to a customer yet.

***

## Step 2: Create the Linking API Route

Next, create an [API route](https://docs.medusajs.com/docs/learn/fundamentals/api-routes) that executes the workflow after the customer authenticates with the new provider.

Create the file `src/api/auth/link/route.ts` with the following content:

```ts title="src/api/auth/link/route.ts"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { linkCustomerIdentityWorkflow } from "../../../workflows/link-customer-identity"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  // The auth identity is already linked to a customer.
  if (req.auth_context.actor_id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Auth identity is already linked to a customer."
    )
  }

  const { result } = await linkCustomerIdentityWorkflow(req.scope)
    .run({
      input: {
        auth_identity_id: req.auth_context.auth_identity_id,
      },
    })

  res.status(200).json(result)
}
```

In the API route, you:

1. Reject the request if the auth identity is already linked to a customer, indicated by the `actor_id` property in the request's `auth_context`.
2. Execute the `linkCustomerIdentityWorkflow`, passing it the authenticated auth identity's ID from the request's `auth_context`.

Refer to the [Auth Flow with Routes](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route) guide to learn how the `auth_context` is set on the request.

***

## Step 3: Protect the API Route

The customer hasn't been linked to an actor yet when they access the linking route, so you must allow unregistered auth identities to access it.

To do that, apply the [authenticate middleware](https://docs.medusajs.com/docs/learn/fundamentals/api-routes/protected-routes) to the route with the `allowUnregistered` option enabled.

Create the file `src/api/middlewares.ts` with the following content, or add the route to your existing middlewares:

```ts title="src/api/middlewares.ts"
import {
  defineMiddlewares,
  authenticate,
} from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/auth/link",
      method: "POST",
      middlewares: [
        authenticate("customer", ["bearer"], {
          allowUnregistered: true,
        }),
      ],
    },
  ],
})
```

This protects the `/auth/link` route so that only auth identities of the `customer` actor type, including unregistered ones, can access it.

***

## Test the Linking Flow

To link the new provider to an existing customer:

1. Authenticate the customer with the new provider to obtain a token. Refer to the [Auth Flow with Routes](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route) guide for the authentication steps.
2. Send a `POST` request to `/auth/link` with the token in the `Authorization` header:

```bash
curl -X POST http://localhost:9000/auth/link \
  -H "Authorization: Bearer {token}"
```

Afterwards, the customer can authenticate with the new provider and their token will resolve to the existing customer.

Only link providers that verify the customer owns the identity, such as an email the provider confirmed. Otherwise, a customer could link their auth identity to another customer's account and gain access to it.

***

## Unlink a Provider

To remove the association between an auth identity and a customer, such as when a customer disconnects a provider, pass `null` as the `value` to the `setAuthAppMetadataStep`:

```ts
setAuthAppMetadataStep({
  authIdentityId: "au_123",
  actorType: "customer",
  value: null,
})
```

Learn more about the `setAuthAppMetadataStep` in the [setAuthAppMetadataWorkflow reference](https://docs.medusajs.com/references/medusa-workflows/setAuthAppMetadataWorkflow).
