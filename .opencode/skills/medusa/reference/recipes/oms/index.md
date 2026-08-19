# Order Management System (OMS) Recipe

This recipe provides an overview of Medusa's features and how to use it as an Order Management System (OMS).

## Overview

Building or integrating an OMS brings certain challenges: accepting orders from different sales channels, tracking inventory across the sales channels, integrating third-party fulfillment and payment providers with the OMS, and more.

Medusa's Commerce Modules and [Framework](https://docs.medusajs.com/docs/learn/fundamentals/framework) for customizations allows you to integrate it within a larger ecosystem. The Commerce Modules provide features to allow businesses to accept orders from any sales channel, benefit from multi-warehouse inventory features, and integrate third-party services for fulfillment, payment, and more.

[How Siam Makro used Medusa an OMS](https://medusajs.com/blog/makro-pro/).

***

## Source Orders into Medusa

Sales channels in your commerce ecosystem must route their orders into the OMS.

![Routing orders into Medusa OMS](https://res.cloudinary.com/dza7lstvk/image/upload/v1709032160/Medusa%20Book/oms-orders_zf5ta9.jpg)

Medusa's [Store REST APIs](https://docs.medusajs.com/api/store) let you integrate a checkout experience in any storefront. Alternatively, you can use Medusa's [Draft Order APIs](https://docs.medusajs.com/api/admin/draft-orders) to place an order without direct involvement from the customer, such as when placing an order through a POS.

In addition, you can customize the Medusa application to accept orders through a third-party checkout system. This gives you more flexibility over adding orders to Medusa.

For example, you can support importing orders into Medusa through a custom API Route that allows batch-inserting orders. Another example is creating a scheduled job that runs at a specified interval and imports orders from a third-party service.

- [Store REST APIs](https://docs.medusajs.com/api/store/carts): Learn how to use the Store REST APIs to create an order.
- [Create API Route](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create a custom API Route.

[Create Scheduled Jobs](https://docs.medusajs.com/docs/learn/fundamentals/scheduled-jobs): Learn how to create a scheduled job.

***

## Route Orders to Third-party Fulfillment Services

To integrate third-party fulfillment providers with the Medusa application, you can create a fulfillment module provider.

Medusa uses the Fulfillment Module whenever a fulfillment action is performed, such as when a fulfillment is created for items in an order. The methods of the module's main service use the associated fulfillment module provider to handle the desired fulfillment actions.

![Fulfilling orders with Medusa OMS](https://res.cloudinary.com/dza7lstvk/image/upload/v1709032184/Medusa%20Book/oms-fulfillment_qfrpdd.jpg)

In addition, you can create a subscriber that listens to fulfillment-related events, such as the `order.fulfillment_created` event, to perform actions with the third-party fulfillment provider.

- [Create a Fulfillment Module Provider](https://docs.medusajs.com/references/fulfillment/provider): Learn how to create a fulfillment provider in Medusa.
- [Order Events](https://docs.medusajs.com/references/order/events): Learn about the events emitted related to the Order Module

[Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn about create a subscriber

***

## Process Payment with Third-Party Providers

To integrate third-party payment providers with the Medusa application, you can create a payment module provider. Customers can pay for their orders using this providers, and admins can process order payments using it.

In addition, you can create a subscriber that listen to payment-related events, such as the `payment.captured` event, to perform actions in the third-party payment provider.

- [Create a Payment Module Provider](https://docs.medusajs.com/references/payment/provider): Learn how to create a payment module provider.
- [Payment Events](https://docs.medusajs.com/references/payment/events): Learn about the events emitted related to the Payment Module

[Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn about create a subscriber

***

## Track Inventory Across Sales Channels

Medusa's Inventory, Stock Location, and Sales Channel modules allow merchants to track inventory levels tied to sales channels across stock locations.

When an order is placed, the item's quantity is reserved from the stock location associated with the order's sales channel.

Once the item is fulfilled, the reserved quantity is deducted from the item's inventory quantity.

- [Inventory Module](https://docs.medusajs.com/commerce-modules/inventory): Learn about the Inventory Module's concepts and features.
- [Stock Location Module](https://docs.medusajs.com/commerce-modules/stock-location): Learn about the Stock Location Module's concepts and features.

[Sales Channel Module](https://docs.medusajs.com/commerce-modules/sales-channel): Learn about the Sales Channel Module's concepts and features.

***

## Handle Returns, Exchanges, and Changes

Customers can return or exchange items in an order. A merchant can also edit an order to add, update, or delete items.

When changes are made to an order by any of the mentioned actions, the changes are reflected on the order's totals and associated inventory. The integrated fulfillment and payment module providers are used if fulfillment or payment actions are required, such as fulfilling exchanged items.

Medusa also emits events related to these actions, such as `order.return_requested`. So, you can build a workflow that performs actions with the third-party fulfillment and payment providers, then execute it in a subscriber that's triggered whenever the event is emitted.

- [Order Changes](https://docs.medusajs.com/commerce-modules/order/order-change): Learn about how to use order changes.
- [Order Events](https://docs.medusajs.com/references/order/events): Learn about the events emitted related to the Order Module
- [Create a Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.
- [Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn about create a subscriber
