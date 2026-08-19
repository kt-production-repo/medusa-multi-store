# Order Claim

In this guide, you'll learn about order claims.

Refer to this [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/orders/claims) to learn how to manage an order's claims using the dashboard.

## What is a Claim?

When a customer receives a defective or incorrect item, the merchant can create a claim to refund or replace that item.

A claim is represented by the [OrderClaim data model](https://docs.medusajs.com/references/order/models/OrderClaim).

***

## Claim Type

The `Claim` data model has a `type` property that indicates the type of claim:

- `refund`: The items are returned and the customer receives a refund.
- `replace`: The items are returned and the customer receives new items.

***

## Old and Replacement Items

When you create a claim, a return is also created to handle receiving the old items from the customer. The return is represented by the [Return data model](https://docs.medusajs.com/references/order/models/Return).

Refer to the [Returns](https://docs.medusajs.com/resources/commerce-modules/order/return) guide to learn more about returns.

If the claim's type is `replace`, the replacement items are represented by the [ClaimItem data model](https://docs.medusajs.com/references/order/models/OrderClaimItem).

***

## Claim Shipping Methods

A claim uses shipping methods to send replacement items to the customer. These methods are represented by the [OrderShippingMethod data model](https://docs.medusajs.com/references/order/models/OrderShippingMethod).

The shipping methods for returned items are linked to the claim's return, as explained in the [Returns](https://docs.medusajs.com/resources/commerce-modules/order/return#return-shipping-methods) guide.

***

## Claim Refund

If the claim's type is `refund`, the refund amount is stored in the `refund_amount` property.

The [Transaction data model](https://docs.medusajs.com/references/order/models/OrderTransaction) represents the refunds made for the claim.

***

## How Claims Impact an Order's Version

When you confirm a claim, the order's version increases.

Learn more about order versions in the [Order Versioning](https://docs.medusajs.com/resources/commerce-modules/order/order-versioning) guide.
