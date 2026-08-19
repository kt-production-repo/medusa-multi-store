# Promotions Adjustments in Carts

In this document, you’ll learn how a promotion is applied to a cart’s line items and shipping methods using adjustment lines.

## What are Adjustment Lines?

An adjustment line indicates a change to an item or a shipping method’s amount. It’s used to apply promotions or discounts on a cart.

The [LineItemAdjustment](https://docs.medusajs.com/references/cart/models/LineItemAdjustment) data model represents changes on a line item, and the [ShippingMethodAdjustment](https://docs.medusajs.com/references/cart/models/ShippingMethodAdjustment) data model represents changes on a shipping method.

![A diagram showcasing the relations between other data models and adjustment line models](https://res.cloudinary.com/dza7lstvk/image/upload/v1711534248/Medusa%20Resources/cart-adjustments_k4sttb.jpg)

The `amount` property of the adjustment line indicates the amount to be discounted from the original amount. Also, the ID of the applied promotion is stored in the `promotion_id` property of the adjustment line.

***

## Discountable Option

The [LineItem](https://docs.medusajs.com/references/cart/models/LineItem) data model has an `is_discountable` property that indicates whether promotions can be applied to the line item. It’s enabled by default.

When disabled, a promotion can’t be applied to a line item. In the context of the Promotion Module, the promotion isn’t applied to the line item even if it matches its rules.

***

## Promotion Actions

When using the Cart and Promotion modules together, such as in the Medusa application, use the [computeActions method of the Promotion Module’s main service](https://docs.medusajs.com/references/promotion/computeActions). It retrieves the actions of line items and shipping methods.

Learn more about actions in the [Promotion Module’s documentation](https://docs.medusajs.com/resources/commerce-modules/promotion/actions).

For example:

```ts
import {
  ComputeActionAdjustmentLine,
  ComputeActionItemLine,
  ComputeActionShippingLine,
  // ...
} from "@medusajs/framework/types"

// retrieve the cart
const cart = await cartModuleService.retrieveCart("cart_123", {
  relations: [
    "items.adjustments",
    "shipping_methods.adjustments",
  ],
})

// retrieve line item adjustments
const lineItemAdjustments: ComputeActionItemLine[] = []
cart.items.forEach((item) => {
  const filteredAdjustments = item.adjustments?.filter(
    (adjustment) => adjustment.code !== undefined
  ) as unknown as ComputeActionAdjustmentLine[]
  if (filteredAdjustments.length) {
    lineItemAdjustments.push({
      ...item,
      adjustments: filteredAdjustments,
    })
  }
})

// retrieve shipping method adjustments
const shippingMethodAdjustments: ComputeActionShippingLine[] =
  []
cart.shipping_methods.forEach((shippingMethod) => {
  const filteredAdjustments =
    shippingMethod.adjustments?.filter(
      (adjustment) => adjustment.code !== undefined
    ) as unknown as ComputeActionAdjustmentLine[]
  if (filteredAdjustments.length) {
    shippingMethodAdjustments.push({
      ...shippingMethod,
      adjustments: filteredAdjustments,
    })
  }
})

// compute actions
const actions = await promotionModuleService.computeActions(
  ["promo_123"],
  {
    items: lineItemAdjustments,
    shipping_methods: shippingMethodAdjustments,
  }
)
```

The `computeActions` method accepts the existing adjustments of line items and shipping methods to compute the actions accurately.

Then, use the returned `addItemAdjustment` and `addShippingMethodAdjustment` actions to set the cart’s line item and the shipping method’s adjustments.

```ts
import {
  AddItemAdjustmentAction,
  AddShippingMethodAdjustment,
  // ...
} from "@medusajs/framework/types"

// ...

await cartModuleService.setLineItemAdjustments(
  cart.id,
  actions.filter(
    (action) => action.action === "addItemAdjustment"
  ) as AddItemAdjustmentAction[]
)

await cartModuleService.setShippingMethodAdjustments(
  cart.id,
  actions.filter(
    (action) =>
      action.action === "addShippingMethodAdjustment"
  ) as AddShippingMethodAdjustment[]
)
```
