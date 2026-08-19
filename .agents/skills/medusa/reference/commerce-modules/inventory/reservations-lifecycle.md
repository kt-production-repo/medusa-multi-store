# Reservations Lifecycle

In this guide, you'll learn about the lifecycle of a reservation in Medusa: when Medusa creates a reservation, how a reservation affects available stock, and when Medusa releases or deletes a reservation.

## What is a Reservation?

A reservation, represented by the [ReservationItem data model](https://docs.medusajs.com/references/inventory-next/models/ReservationItem), is a reserved quantity of an inventory item in a location. A reservation holds stock for a purchase that isn't fulfilled yet.

A reservation affects the [InventoryLevel](https://docs.medusajs.com/resources/commerce-modules/inventory/concepts#inventorylevel) of the reserved inventory item in the associated location:

- Its `reserved_quantity` increases by the reserved amount.
- Its `stocked_quantity` stays the same. The reserved quantity is still physically in stock, but it's unavailable when Medusa checks whether an item can be purchased.

So, the available quantity of an inventory item in a location is its `stocked_quantity` minus its `reserved_quantity`.

Medusa only manages reservations for inventory items whose variants have `manage_inventory` enabled. Variants with `manage_inventory` disabled don't have reservations, and Medusa doesn't track their stock.

***

## When Medusa Creates a Reservation

### Order Placement

Medusa creates a reservation for each of the order's inventory items when an order is placed by completing a cart. This is implemented in the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow).

The reservation is created in the location associated with the order's sales channel, and its quantity is the ordered quantity.

Some workflows that create an order, such as the [createOrderWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderWorkflow), only check that there's sufficient stock without creating a reservation. If you create an order with one of these workflows, the [createOrderFulfillmentWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderFulfillmentWorkflow) throws an error for items whose variants have `manage_inventory` enabled, since they don't have an associated reservation. Create the reservations manually before fulfilling the order, as explained in the next section.

### Custom Reservations

You can also create a reservation for custom use cases, such as reserving stock for an offline sale. Use the [createReservationsWorkflow](https://docs.medusajs.com/references/medusa-workflows/createReservationsWorkflow) to create one or more reservations.

To associate a reservation with an order's item so that the fulfillment flow can find it, set the reservation's `line_item_id` to the order item's ID.

***

## When Medusa Releases a Reservation

A reservation is temporary. Medusa releases the reservation, making the quantity available again, in the following cases.

### Order Fulfillment

When an order's item is fulfilled, Medusa performs the following for each of the item's inventory items, as implemented in the [createOrderFulfillmentWorkflow](https://docs.medusajs.com/references/medusa-workflows/createOrderFulfillmentWorkflow):

- Subtracts the fulfilled quantity from the `stocked_quantity` of the inventory level.
- Decreases the `reserved_quantity` of the inventory level by the fulfilled quantity.
- Deletes the reservation if its full quantity is fulfilled, or decreases the reservation's quantity if only part of it is fulfilled.

So, fulfillment turns reserved stock into consumed stock: the quantity leaves both the stocked and reserved counts.

These inventory changes are managed by Medusa's core workflow, independent of the fulfillment provider. The fulfillment provider handles the shipping side of the fulfillment, such as creating a shipping label, but it doesn't affect how Medusa decrements stock or deletes reservations. So, the stock changes happen the same way regardless of the fulfillment provider you use.

### Order or Item Cancellation

When an order or its items are canceled before fulfillment, Medusa deletes the associated reservations. The reserved quantity becomes available again for other purchases.

If a fulfillment is canceled, Medusa restores the reservations that were released when the fulfillment was created.

### Custom Deletion

You can also delete reservations manually, such as when a custom reservation is no longer needed. Use the [deleteReservationsWorkflow](https://docs.medusajs.com/references/medusa-workflows/deleteReservationsWorkflow) to delete one or more reservations.

***

## Reservations for Inventory Kits

A variant can be linked to multiple inventory items, forming an [inventory kit](https://docs.medusajs.com/resources/commerce-modules/inventory/inventory-kit). This is useful for use cases like multi-part or bundled products.

When a variant has an inventory kit, Medusa creates a reservation for each of the variant's inventory items. The reserved quantity of each inventory item is the ordered quantity multiplied by the inventory item's `required_quantity`.

For example, if a bicycle variant requires two wheel inventory items, ordering one bicycle reserves two units of the wheel inventory item.

The same lifecycle applies to each reservation in the kit: Medusa releases every reservation of the kit when the item is fulfilled or canceled.

Since inventory items can be shared across variants and products, a reservation on a shared inventory item reduces the available quantity for all variants that use that inventory item.
