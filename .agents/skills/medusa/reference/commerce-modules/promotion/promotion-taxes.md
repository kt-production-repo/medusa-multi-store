# Tax-Inclusive Promotions

In this guide, you’ll learn how taxes are applied to promotions in a cart.

This feature is available from [Medusa v2.8.5](https://github.com/medusajs/medusa/releases/tag/v2.8.5).

## What are Tax-Inclusive Promotions?

By default, promotions are tax-exclusive, meaning that the discount amount is applied as-is to the cart before taxes are calculated and applied to the cart total.

A tax-inclusive promotion is a promotion for which taxes are calculated from the discount amount entered by the merchant.

When a promotion is tax-inclusive, the discount amount is reduced by the calculated tax amount based on the [tax region's rate](https://docs.medusajs.com/resources/commerce-modules/tax/tax-region). The reduced discount amount is then applied to the cart total.

Tax-inclusiveness doesn't apply to Buy X Get Y promotions.

### When to Use Tax-Inclusive Promotions

Tax-inclusive promotions are most useful when using [tax-inclusive prices](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing) for items in the cart.

In this scenario, Medusa applies taxes consistently across the cart, ensuring that the total price reflects the taxes and promotions correctly.

You can see this in action in the [examples below](#tax-inclusiveness-examples).

***

## What Makes a Promotion Tax-Inclusive?

The [Promotion data model](https://docs.medusajs.com/references/promotion/models/Promotion) has an `is_tax_inclusive` property that determines whether the promotion is tax-inclusive.

If `is_tax_inclusive` is disabled (which is the default), the promotion's discount amount will be applied as-is to the cart, before taxes are calculated. See an example in the [Tax-Exclusive Promotion Example](#tax-exclusive-promotion-example) section.

If `is_tax_inclusive` is enabled, the promotion's discount amount will first be reduced by the calculated tax amount (based on the [tax region's rate](https://docs.medusajs.com/resources/commerce-modules/tax/tax-region)). The reduced discount amount is then applied to the cart total. See an example in the [Tax-Inclusive Promotion Example](#tax-inclusive-promotion-example) section.

***

## How to Set a Promotion as Tax-Inclusive

You can enable tax-inclusiveness for a promotion when [creating it in the Medusa Admin](https://docs.medusajs.com/user-guide/promotions/create).

You can set the `is_tax_inclusive` property when creating a promotion by using either the [Promotion workflows](https://docs.medusajs.com/resources/commerce-modules/promotion/workflows) or the [Promotion Module's service](https://docs.medusajs.com/references/promotion).

For most use cases, it's recommended to use [workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows) instead of directly using the module's service, as they implement the necessary rollback mechanisms in case of errors.

For example, if you're creating a promotion with the [createPromotionsWorkflow](https://docs.medusajs.com/references/medusa-workflows/createPromotionsWorkflow) in an API route:

```ts
import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createPromotionsWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { result } = await createPromotionsWorkflow(req.scope)
    .run({
      input: {
        promotionsData: [{
          code: "10OFF",
          // ...
          is_tax_inclusive: true,
        }],
      },
    })

  res.send(result)
}
```

In the above example, you set the `is_tax_inclusive` property to `true` when creating the promotion, making it tax-inclusive.

### Updating a Promotion's Tax-Inclusiveness

A promotion's tax-inclusiveness cannot be updated after it has been created. If you need to change a promotion's tax-inclusiveness, you must delete the existing promotion and create a new one with the desired `is_tax_inclusive` value.

***

## Tax-Inclusiveness Examples

The following sections provide examples of how tax-inclusive promotions work in different scenarios, including both tax-exclusive and tax-inclusive promotions.

These examples will help you understand how tax-inclusive promotions affect the cart total, allowing you to decide when to use them effectively.

### Tax-Exclusive Promotion Example

Consider the following scenario:

- A tax-exclusive promotion gives a `$10` discount on the cart's total.
- The cart's tax region has a `25%` tax rate.
- The cart total before applying the promotion is `$100`.
- [The prices in the cart's tax region are tax-exclusive](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing).

The result:

1. Apply `$10` discount to cart total: `$100` - `$10` = `$90`
2. Calculate tax on discounted total: `$90` x `25%` = `$22.50`
3. Final total: `$90` + `$22.50` = `$112.50`

### Tax-Inclusive Promotion Example

Consider the following scenario:

- A tax-inclusive promotion gives a `$10` discount on the cart's total.
- The cart's tax region has a `25%` tax rate.
- The cart total before applying the promotion is `$100`.
- [The prices in the cart's tax region are tax-exclusive](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing).

The result:

1. Calculate actual discount (removing tax): `$10` ÷ `1.25` = `$8`
2. Apply discount to cart total: `$100` - `$8` = `$92`
3. Calculate tax on discounted total: `$92` x `25%` = `$23`
4. Final total: `$92` + `$23` = `$115`

### Tax-Inclusive Promotions with Tax-Inclusive Prices

Consider the following scenario:

- A tax-inclusive promotion gives a `$10` discount on the cart's total.
- The cart's tax region has a `25%` tax rate.
- The cart total before applying the promotion is `$100`.
- [The prices in the cart's tax region are tax-inclusive](https://docs.medusajs.com/resources/commerce-modules/pricing/tax-inclusive-pricing).

The result:

1. Calculate actual discount (removing tax): `$10` ÷ `1.25` = `$8`
2. Calculate cart total without tax: `$100` ÷ `1.25` = `$80`
3. Apply discount to cart total without tax: `$80` - `$8` = `$72`
4. Add tax back to total: `$72` x `1.25` = `$90`

The final total is `$90`, which correctly applies both the tax-inclusive promotion and tax-inclusive pricing.
