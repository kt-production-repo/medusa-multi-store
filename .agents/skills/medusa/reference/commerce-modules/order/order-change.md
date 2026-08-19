# Order Change

In this document, you'll learn what an order change is and the related concepts.

## OrderChange Data Model

The [OrderChange data model](https://docs.medusajs.com/references/order/models/OrderChange) represents any kind of change to an order, such as a [return](https://docs.medusajs.com/resources/commerce-modules/order/return), [exchange](https://docs.medusajs.com/resources/commerce-modules/order/exchange), or [edit](https://docs.medusajs.com/resources/commerce-modules/order/edit). Each of these is essentially an order change that is confirmed to apply changes to the original order.

The `OrderChange` model's `change_type` property indicates the purpose of the order change:

1. `edit`: The order change is making edits to the order, as explained in the [Order Edit](https://docs.medusajs.com/resources/commerce-modules/order/edit) guide.
2. `exchange`: The order change is associated with an exchange, which you can learn about in the [Order Exchange](https://docs.medusajs.com/resources/commerce-modules/order/exchange) guide.
3. `claim`: The order change is associated with a claim, which you can learn about in the [Order Claim](https://docs.medusajs.com/resources/commerce-modules/order/claim) guide.
4. `return_request` or `return_receive`: The order change is associated with a return, which you can learn about in the [Order Return](https://docs.medusajs.com/resources/commerce-modules/order/return) guide.

Once the order change is confirmed, its changes are applied to the order.

***

## Order Change Actions

The actions performed on the original order by an order change, such as adding an item, are represented by the [OrderChangeAction data model](https://docs.medusajs.com/references/order/models/OrderChangeAction).

The `OrderChangeAction` has an `action` property that indicates the type of action to perform on the order, and a `details` property that holds additional information related to the action.

The following table lists the possible `action` values that Medusa uses and the corresponding `details` they carry.

|Action|Description|Details|
|---|---|---|---|---|
|\`ITEM\_ADD\`|Add an item to the order. The item is only added after the change is confirmed.|\`details\`|
|\`ITEM\_UPDATE\`|Update an item in an order change. It's only applied to the order after the change is confirmed.|\`details\`|
|\`ITEM\_REMOVE\`|Remove an item from an order change. This can happen when a claim or an exchange is canceled.|\`details\`|
|\`RETURN\_ITEM\`|Set an item to be returned.|\`details\`|
|\`RECEIVE\_RETURN\_ITEM\`|Mark a return item as received.|\`details\`|
|\`RECEIVE\_DAMAGED\_RETURN\_ITEM\`|Mark a return item that's damaged as received.|\`details\`|
|\`CANCEL\_RETURN\_ITEM\`|Cancel the return of an item. This can happen when a return is canceled.|\`details\`|
|\`SHIPPING\_ADD\`|Add a shipping method to an order change. It's only added to the order after the change is confirmed.|No details added. The ID to the shipping method is added in the |
|\`SHIPPING\_REMOVE\`|Remove a shipping method from an order change. This can happen when a claim or an exchange is canceled.|No details added. The ID to the shipping method is added in the |
|\`SHIP\_ITEM\`|Mark an item's quantity as shipped.|\`details\`|
|\`FULFILL\_ITEM\`|Fulfill an item's quantity as part of a change.|\`details\`|
|\`DELIVER\_ITEM\`|Mark an item's quantity as delivered.|\`details\`|
|\`WRITE\_OFF\_ITEM\`|Remove an item's quantity from an order change, without adding the quantity back to the item variant's inventory. The quantity isn't removed from the order until the change is confirmed.|\`details\`|
|\`REINSTATE\_ITEM\`|Reinstate an item's quantity in an order change that was previously written off. The quantity is added back to the item variant's inventory when the change is confirmed.|\`details\`|
|\`TRANSFER\_CUSTOMER\`|Transfer an order to another customer. The order is not removed from the original customer until the change is confirmed.|No details added. The ID to the new customer is added in the |
|\`UPDATE\_ORDER\_PROPERTIES\`|Update the properties of an order, such as customer information or shipping address. The properties are not updated on the original order until the change is confirmed.|\`details\`|
|\`PROMOTION\_ADD\`|Add a promotion to an order. The promotion is not added to the original order until the change is confirmed.|No details added. The ID to the promotion is added in the |
|\`PROMOTION\_REMOVE\`|Remove a promotion from an order. The promotion is not removed from the original order until the change is confirmed.|No details added. The ID to the promotion is added in the |
|\`ITEM\_ADJUSTMENTS\_REPLACE\`|Replace item adjustments with new adjustments. The adjustments are not updated on the original order until the change is confirmed.|\`details\`|
|\`SHIPPING\_ADJUSTMENTS\_REPLACE\`|Replace shipping method adjustments with new adjustments. The adjustments are not updated on the original order until the change is confirmed.|\`details\`|
|\`CREDIT\_LINE\_ADD\`|Add a credit line to an order. The credit line is not added to the original order until the change is confirmed.|No details added. The ID to the associated payment is added in the |
