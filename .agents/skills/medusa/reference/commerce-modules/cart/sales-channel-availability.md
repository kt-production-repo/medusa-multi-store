# Enforce Sales Channel Availability in Carts

In this guide, you'll learn how to reject product variants whose product isn't available in the cart's sales channel.

### Prerequisites

- [Medusa application set up](https://docs.medusajs.com/docs/learn/installation)

## Why Medusa Doesn't Enforce This by Default

A product's [availability in a sales channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel/links-to-other-modules#product-module) is a merchandising filter, not an authorization boundary.

Medusa applies it when you retrieve products. For example, the [List Products Store API route](https://docs.medusajs.com/api/store/products/list-products) only returns the products available in the sales channels of the publishable API key in the request. So, a product that you remove from a sales channel disappears from that channel's storefront.

Medusa doesn't apply that filter when a variant is added to a cart or when a cart is completed. A customer who knows a variant's ID can still add it to a cart scoped to a sales channel that the variant's product isn't available in.

Medusa doesn't enforce this by default because merchants use sales channels for merchandising, and rejecting items would break carts whenever a merchant changes a product's availability. If you rely on sales channels for legal or contractual restrictions, such as licensing agreements that forbid selling a product in a country, add the validation shown in this guide.

The inventory check that does run when you add an item to a cart, which the [confirmVariantInventoryWorkflow](https://docs.medusajs.com/references/medusa-workflows/confirmVariantInventoryWorkflow) performs, only checks the quantity available at the stock locations of the cart's sales channel. It doesn't check whether the variant's product is linked to that sales channel.

To enforce the availability, consume the `validate` [hook](https://docs.medusajs.com/docs/learn/fundamentals/workflows/workflow-hooks) of the workflows that add items to a cart and complete a cart. A workflow hook is a point in a workflow where you can inject custom functionality as a step function. If the step function throws an error, the workflow stops and the API route returns the error.

This guide doesn't cover draft orders that admin users create in the dashboard, as it's assumed that merchants don't need to enforce sales channel availability for them.

***

## Step 1: Create the Validation Function

Start by creating a function that finds the variants that aren't available in a sales channel. You'll reuse it in both hooks.

Create the file `src/utils/sales-channel-availability.ts` with the following content:

```ts title="src/utils/sales-channel-availability.ts"
import { MedusaContainer } from "@medusajs/framework/types"

export async function getUnavailableVariantIds({
  container,
  variantIds,
  salesChannelId,
}: {
  container: MedusaContainer
  variantIds: string[]
  salesChannelId: string
}) {
  const query = container.resolve("query")

  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "product.sales_channels.id"],
    filters: {
      id: variantIds,
    },
  })

  return variants
    .filter((variant) => {
      const salesChannels =
        variant.product?.sales_channels ?? []

      return !salesChannels.some(
        (salesChannel) =>
          salesChannel?.id === salesChannelId
      )
    })
    .map((variant) => variant.id)
}
```

The function uses [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query) to retrieve the variants with the sales channels of their product, then returns the IDs of the variants whose product isn't linked to the specified sales channel.

A product without any sales channels isn't available in any of them, so the function considers its variants unavailable.

***

## Step 2: Validate Items Added to the Cart

Next, consume the `validate` hook of the [addToCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/addToCartWorkflow), which the [Add Line Item Store API route](https://docs.medusajs.com/api/store/carts/add-line-item) executes.

Create the file `src/workflows/hooks/validate-add-to-cart.ts` with the following content:

```ts title="src/workflows/hooks/validate-add-to-cart.ts"
import { MedusaError } from "@medusajs/framework/utils"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"
import {
  getUnavailableVariantIds,
} from "../../utils/sales-channel-availability"

addToCartWorkflow.hooks.validate(
  async ({ input, cart }, { container }) => {
    if (!cart.sales_channel_id) {
      return
    }

    const variantIds = (input.items ?? [])
      .map((item) => item.variant_id)
      .filter(Boolean) as string[]

    if (!variantIds.length) {
      return
    }

    const unavailableIds = await getUnavailableVariantIds({
      container,
      variantIds,
      salesChannelId: cart.sales_channel_id,
    })

    if (unavailableIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The variants ${unavailableIds.join(", ")} aren't ` +
          `available in the cart's sales channel.`
      )
    }
  }
)
```

The hook receives the cart and the input passed to the workflow, which holds the items to add. You retrieve the IDs of the variants that aren't available in the cart's sales channel, then throw a `MedusaError` if there are any. The Add Line Item API route then returns a response with the `400` status code.

A cart isn't always associated with a sales channel. The example returns early in that case, since there's nothing to validate against.

***

## Step 3: Validate the Cart on Completion

A merchant can change a product's availability after a customer adds it to their cart. So, also consume the `validate` hook of the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow) to check the cart's items before Medusa creates the order.

Create the file `src/workflows/hooks/validate-complete-cart.ts` with the following content:

```ts title="src/workflows/hooks/validate-complete-cart.ts"
import { MedusaError } from "@medusajs/framework/utils"
import {
  completeCartWorkflow,
} from "@medusajs/medusa/core-flows"
import {
  getUnavailableVariantIds,
} from "../../utils/sales-channel-availability"

completeCartWorkflow.hooks.validate(
  async ({ cart }, { container }) => {
    if (!cart.sales_channel_id) {
      return
    }

    const variantIds = (cart.items ?? [])
      .map((item) => item.variant_id)
      .filter(Boolean) as string[]

    if (!variantIds.length) {
      return
    }

    const unavailableIds = await getUnavailableVariantIds({
      container,
      variantIds,
      salesChannelId: cart.sales_channel_id,
    })

    if (unavailableIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The variants ${unavailableIds.join(", ")} are no ` +
          `longer available in the cart's sales channel.`
      )
    }
  }
)
```

This stops the cart completion for carts that a customer created before the merchant changed a product's availability.

***

## Test it Out

To test out the validation:

1. Start the Medusa application.
2. In the Medusa Admin dashboard, add a product that doesn't belong to a sales channel, or remove a product from a sales channel, as explained in the [user guide](https://docs.medusajs.com/user-guide/settings/sales-channels#manage-products-in-sales-channel).
3. Create a cart associated with that sales channel using a publishable API key linked to it.
4. Send a request to the [Add Line Item Store API route](https://docs.medusajs.com/api/store/carts/add-line-item) with a variant of the product you removed.

The request returns a response with the `400` status code and the error message you specified.
