# Commerce Automation Recipe

This recipe provides the general steps to implement commerce automation with Medusa.

## Overview

Commerce automation is essential for businesses to save costs, provide a better user experience, and avoid manual, repetitive tasks that lead to human errors. Businesses utilize automation in different domains, including marketing, customer support, and order management.

Medusa provides the necessary architecture and tools to implement commerce automation for order management, customer service, and more. You can perform an asynchronous action when an event is triggered, schedule a job that runs at a specified interval, and more.

***

## Re-Stock Notifications

Customers may be interested in a product that is currently out of stock. Instead of losing their interest, you can allow them to subscribe to receive a notification when the product is back in stock.

Then, you can listen to product-related events and notify subscribed customers when a product variant is back in stock.

The following guide explains how to add restock notifications in your Medusa application:

[Restock Notification Guide](https://docs.medusajs.com/recipes/commerce-automation/restock-notification): Learn how to implement restock notifications in the Medusa application.

***

## Automated Customer Support

Customer support is essential to build a store's brand and customer loyalty. However, to provide an efficient customer support, you often need to integrate with third-party services, like Zendesk, and automate customer notifications.

### Integrate with Third-Party Services

To provide customer support, you can Integrate with third-party services, such as ticket systems or chat bots in the storefront.

Medusa allows you to easily integrate with third-party services by creating a custom module, then build workflows for your business logic that perform actions with the third-party service.

This approach allows you to interact with the third-party service within custom and existing flows, while maintaining data consistency across systems. You can then execute the wokflow when an event is triggered, such as when a customer places an order or requests a return.

- [Create Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn about how to create a custom module.
- [Create Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.

### Automate Customer Notifications

You can also automate sending notifications to customers when changes happen related to their orders, returns, exchanges, and more.

Medusa's Notification Module allows you to send notifications when an event is triggered, such as when a customer's order is updated. You can use third-party services, like [SendGrid](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid), to send emails to customers.

- [Notification Module](https://docs.medusajs.com/infrastructure-modules/notification): Learn about the Notification Module.
- [Create Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber to handle events.

***

## Automatic Data Synchronization

As your commerce store grows, you'll likely need to synchronize data across different systems. For example, you need to synchronize data with an ERP system or a data warehouse.

Refer to the [ERP](https://docs.medusajs.com/resources/recipes/erp) recipe for a focused guide on how to integrate with an ERP system.

To implement that, you can:

- Create a workflow that implements the synchronization steps, along with retry and rollback logic. By using a workflow, you ensure data consistency across systems.
- Create a scheduled job that executes the workflow automatically at the specified time pattern.

- [Create Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.
- [Create a Scheduled Job](https://docs.medusajs.com/docs/learn/fundamentals/scheduled-jobs): Learn how to create a scheduled job.

***

## Order Management Automation

Medusa's architecture, Commerce Modules, and Framework for customizations facilitate automating a large amount of order management functionalities.

For example, you can automatically:

- Create a fulfillment when an order is placed.
- Create a refund when an item is returned.
- Send a notification when an order is shipped.

To handle events within an order flow and automate actions, you can create a subscriber that listens to the relevant event. For example, you can create a subscriber that listens to the `order.placed` event and automatically creates a fulfillment if predefined conditions are met.

- [Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber in Medusa.
- [Events Reference](https://docs.medusajs.com/references/events): Check out triggered events by each Commerce Module.

***

## Automated RMA Flow

Businesses must optimize their Return Merchandise Authorization (RMA) flow to ensure a good customer experience and service. By automating the flow, customers request to return their received items, and businesses quickly support them.

Medusa's commerce features are geared towards automating RMA flows and ensuring a good customer experience:

- Customers can create order returns from the storefront. Merchants then receive a notification and handle the return from the Medusa Admin.
- Merchants can make order changes and request the customer's approval for them. The customer can also send any additional payment if necessary.
- Every order-related action triggers an event, which you can listen to with a subscriber. This allows you to handle order events to automate actions.

- [Order Module](https://docs.medusajs.com/commerce-modules/order): Learn about the Order Module and its features.
- [Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber in Medusa.

***

## Customer Segmentation

Businesses use customer segmentation to organize customers into different groups and then apply different price rules to these groups.

Medusa's Commerce Modules provide the necessary features to implement this use case:

- The Customer Module allows you to organize customers into customer groups.
- The Pricing Module allows you to specify prices based on a condition, such as the group of the customer.

For example, to group customers with over twenty orders:

1. Create a subscriber that listens to the `order.placed` event.
2. If the customer has more than 20 orders, add them to the VIP customer group.

- [Customer Module](https://docs.medusajs.com/commerce-modules/customer): Learn about the Customer Module and its features.
- [Pricing Module](https://docs.medusajs.com/commerce-modules/pricing): Learn about the Pricing Module and its features.
- [Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber in Medusa.
- [Events Reference](https://docs.medusajs.com/references/events): Check out triggered events by each Commerce Module.

***

## Marketing Automation

In your commerce store, you may utilize marketing strategies that encourage customers to make purchases. For example, you send a newsletter when new products are added to your store.

To do that, create a subscriber that listens to the `product.created`, and send an email to subscribed customers with tools like [SendGrid](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid).

You can also create a scheduled job that checks whether the number of new products has exceeded a set threshold, then sends out the newsletter.

- [Create a Subscriber](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber in Medusa.
- [Scheduled Jobs](https://docs.medusajs.com/docs/learn/fundamentals/scheduled-jobs): Learn how to create a scheduled job in Medusa.
