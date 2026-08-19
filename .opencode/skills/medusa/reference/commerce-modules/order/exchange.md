# Order Exchange

In this guide, you’ll learn about order exchanges.

Refer to this [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/orders/exchanges) to learn how to manage an order's exchanges using the dashboard.

## What is an Exchange?

An exchange is the replacement of an item that the customer ordered with another item.

A merchant creates the exchange, specifying which items to return and which new items to send.

The [OrderExchange data model](https://docs.medusajs.com/references/order/models/OrderExchange) represents an exchange.

***

## Returned and New Items

When an exchange is created, a return, represented by the [Return data model](https://docs.medusajs.com/references/order/models/Return), is also created to handle receiving the items back from the customer.

Refer to the [Returns guide](https://docs.medusajs.com/resources/commerce-modules/order/return) to learn more about returns and how they work.

The [OrderExchangeItem data model](https://docs.medusajs.com/references/order/models/OrderExchangeItem) represents the new items to be sent to the customer. It's associated with the `OrderExchange` data model.

***

## Exchange Shipping Methods

An exchange has shipping methods used to send the new items to the customer. They’re represented by the [OrderShippingMethod data model](https://docs.medusajs.com/references/order/models/OrderShippingMethod).

The shipping methods for the returned items are associated with the exchange's return, as explained in the [Returns guide](https://docs.medusajs.com/resources/commerce-modules/order/return#return-shipping-methods).

***

## Exchange Payment

The `OrderExchange` data model has a `difference_due` property that stores the outstanding amount.

|Condition|Result|
|---|---|
|\`difference\_due \< 0\`|The merchant owes the customer a refund of the |
|\`difference\_due > 0\`|The merchant requires additional payment from the customer of the |
|\`difference\_due = 0\`|No payment processing is required.|

Any payments or refunds made are stored in the [OrderTransaction data model](https://docs.medusajs.com/references/order/models/OrderTransaction).

***

## How Exchanges Impact an Order’s Version

When an exchange is confirmed, the order’s [version](https://docs.medusajs.com/resources/commerce-modules/order/order-versioning) is incremented.
