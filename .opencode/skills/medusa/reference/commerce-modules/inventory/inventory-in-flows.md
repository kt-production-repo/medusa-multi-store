# Inventory Module in Medusa Flows

In this guide, you'll learn how Medusa uses the Inventory Module in its commerce flows, including product variant creation, adding to cart, order placement, order fulfillment, and order return.

## Product Variant Creation

When a product variant is created and its `manage_inventory` property's value is `true` and the variant's `inventory_items` are set, the Medusa application creates an inventory item associated with that product variant.

This flow is implemented within the [createProductVariantsWorkflow](https://docs.medusajs.com/references/medusa-workflows/createProductVariantsWorkflow)

![A diagram showcasing how the Inventory Module is used in the product variant creation flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1709661511/Medusa%20Resources/inventory-product-create_khz2hk.jpg)

***

## Add to Cart

When a product variant with `manage_inventory` set to `true` is added to the cart, the Medusa application checks whether there's sufficient stocked quantity. If not, an error is thrown and the product variant won't be added to the cart.

This flow is implemented within the [addToCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/addToCartWorkflow)

![A diagram showcasing how the Inventory Module is used in the add to cart flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1709711645/Medusa%20Resources/inventory-cart-flow_achwq9.jpg)

***

## Order is Placed

When an order is placed, the Medusa application creates a reservation item for each product variant with `manage_inventory` set to `true`.

This flow is implemented within the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow)

![A diagram showcasing how the Inventory Module is used in the order placement flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1709712005/Medusa%20Resources/inventory-order-placed_qdxqdn.jpg)

***

## Order Fulfillment

When an item in an order is fulfilled and the associated variant has its `manage_inventory` property set to `true`, the Medusa application:

- Subtracts the `reserved_quantity` from the `stocked_quantity` in the inventory level associated with the variant's inventory item.
- Resets the `reserved_quantity` to `0`.
- Deletes the associated reservation item.

This flow is implemented within the [createOrderFulfillmentWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderFulfillmentWorkflow)

Each fulfilled item whose variant has `manage_inventory` enabled must have an associated inventory reservation, otherwise the [createOrderFulfillmentWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderFulfillmentWorkflow) throws an error. Reservations are created automatically when an order is placed through the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow). If you create an order with a workflow that doesn't create reservations, such as [createOrderWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderWorkflow), use the [createReservationsWorkflow](https://docs.medusajs.com/references/medusa-workflows/createReservationsWorkflow) to create reservations before fulfilling the order, and set each reservation's `line_item_id` to the order item's ID.

![A diagram showcasing how the Inventory Module is used in the order fulfillment flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1709712390/Medusa%20Resources/inventory-order-fulfillment_o9wdxh.jpg)

***

## Order Return

When an item in an order is returned and the associated variant has its `manage_inventory` property set to `true`, the Medusa application increments the `stocked_quantity` of the inventory item's level with the returned quantity.

This flow is implemented within the [confirmReturnReceiveWorkflow](https://docs.medusajs.com/references/medusa-workflows/confirmReturnReceiveWorkflow)

![A diagram showcasing how the Inventory Module is used in the order return flow](https://res.cloudinary.com/dza7lstvk/image/upload/v1709712457/Medusa%20Resources/inventory-order-return_ihftyk.jpg)

### Dismissed Returned Items

If a returned item is considered damaged or is dismissed, its quantity doesn't increment the `stocked_quantity` of the inventory item's level.
