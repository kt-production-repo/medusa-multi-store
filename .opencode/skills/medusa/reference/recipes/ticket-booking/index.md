# Ticket Booking System Recipe

This recipe provides the general steps to implement a ticket booking system in your Medusa application.

Follow the step-by-step [Ticket Booking System Example](https://docs.medusajs.com/resources/recipes/ticket-booking/example) to learn how to implement a ticket booking system in your Medusa application.

## Overview

A ticket booking system allows customers to book tickets for events, such as shows or sports games. By using a ticket booking system, you can manage shows, venues, and seat availability, among other features.

Medusa's [Framework](https://docs.medusajs.com/docs/learn/fundamentals/framework) facilitates building a ticket booking system on top of the existing commerce functionalities, such as products, pricing, inventory, carts, and orders. All of these are provided by Medusa's [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules).

To support ticket-booking features, you can customize the Medusa application by creating a Ticket Booking Module, linking its data models to Medusa's existing models, and building flows around the module.

***

## Create Ticket Booking Module

Your custom features and functionalities are implemented inside modules. The module is integrated into the Medusa application without any implications on existing functionalities.

The module will hold your custom data models and the service implementing ticket-booking-related features.

[How to Create a Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.

### Create Custom Data Models

A data model represents a table in the database. You can define in your module data models to store data related to your custom features, such as shows, venues, and seats.

For example, you can define:

- A `Venue` model for the venue where the event takes place.
- A `TicketProduct` model for a show, and a `TicketProductVariant` model for the ticket variants (for example, different seating sections).
- A `TicketPurchase` model for a ticket purchase.

Then, you can link your custom data model to data models from other modules. For example, you can link:

- The `TicketProduct` model to the Product Module's `Product` data model, benefiting from existing features related to products and collections.
- The `TicketProductVariant` model to the Product Module's `ProductVariant` data model, benefiting from existing features related to inventory and pricing.
- The `TicketPurchase` model to the Order Module's `Order` data model, benefiting from existing features related to orders and payments.

- [How to Create a Data Model](https://docs.medusajs.com/docs/learn/fundamentals/modules#1-create-data-model): Learn how to create a data model.
- [Define Module Links](https://docs.medusajs.com/docs/learn/fundamentals/module-links): Define links between data models.

### Implement Data Management Features

Your module’s main service holds data-management and other related features. Then, in other resources, such as an API route, you can resolve the service from the Medusa container and use its functionalities.

Medusa facilitates implementing data-management features using the service factory. Your module's main service can extend this service factory, and it generates data-management methods for your data models.

[Service Factory](https://docs.medusajs.com/docs/learn/fundamentals/modules/service-factory): Learn about the service factory and how to use it.

***

## Implement Ticket Booking Business Flows

You can implement ticket-booking-related business logic in workflows. A workflow is a series of queries and actions, called steps, that complete a task.

By using workflows, you benefit from features like rollback mechanisms, error handling, and retrying failed steps. You can then execute workflows from other resources, such as an API route.

You can implement workflows that create venues and ticket products, complete carts with ticket products, and more. In the workflow's steps, you can resolve the Ticket Booking Module's service and use its data-management methods to manage ticket-booking-related data.

You can then utilize the API routes that execute these workflows in your client applications, such as your Medusa Admin customizations or your storefront.

- [Workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.
- [API Routes](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create API routes.

***

## Handle Ticket Products Inventory

By linking the `TicketProductVariant` model to the Product Module's `ProductVariant` model, you can leverage Medusa's inventory management features, implemented in the Inventory Module, to manage ticket product variants' inventory.

You can set up inventory items for ticket product variants based on show dates and seating sections. You can set the available quantity for each inventory item to reflect the number of seats available in that section for that show date.

This setup ensures that customers can only book tickets for available seats, preventing overbooking.

- [Inventory Module](https://docs.medusajs.com/commerce-modules/inventory): Learn about the Inventory Module and its features.
- [Product Variant Inventory](https://docs.medusajs.com/commerce-modules/product/variant-inventory): Learn how to manage product variant inventory.

***

## Disable Shipping on Ticket Product Variants

By default, Medusa product variants require shipping, which prompts the customer to provide a shipping address and choose a shipping method during checkout.

You can disable shipping on ticket product variants by setting the `requires_shipping` property of the product variant's inventory item to `false`.

Then, you can remove shipping-related steps from the checkout flow in the storefront.

[Configure Shipping Requirements](https://docs.medusajs.com/commerce-modules/product/selling-products#configure-shipping-requirements): Learn how to configure shipping requirements for product variants.

***

## Customize Admin Dashboard

You can extend the Medusa Admin to provide merchants with an interface to manage ticket-booking-related data, such as shows and venues. You can inject widgets into existing pages or create new pages.

In your customizations, you send requests to the API routes you created that execute the workflows implementing ticket-booking-related features.

- [Create a Widget](https://docs.medusajs.com/docs/learn/fundamentals/admin/widgets): Learn how to create a widget in the Medusa Admin.
- [Create UI Route](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes): Learn how to create a UI route in the Medusa Admin.

***

## Add Custom Validation on Cart Operations

Medusa's workflows provide hooks that allow you to inject custom logic at specific points in the workflow execution.

Specifically, workflows like `addToCartWorkflow` and `completeCartWorkflow` provide a `validate` hook that you can consume to add custom validation logic.

For example, you can consume the `validate` hook in the `addToCartWorkflow` to check if the selected seat is available before adding a ticket product variant to the cart.

[Workflow Hooks](https://docs.medusajs.com/docs/learn/fundamentals/workflows/workflow-hooks): Learn how to use workflow hooks.

***

## Send Order Confirmation Email with QR Code Ticket

When an order is placed, Medusa emits an `order.placed` event. You can listen to this event in a subscriber, which is an asynchronous function executed in the background when its associated event is emitted.

In the subscriber, you can send an email using the Notification Module. You can register a Notification Module Provider, such as [SendGrid](https://docs.medusajs.com/resources/infrastructure-modules/notification/sendgrid) or [Resend](https://docs.medusajs.com/resources/integrations/guides/resend), that sends the email.

You can include a QR code representing the ticket in the email, which you can generate using a library like `qrcode`.

You can also implement an API route that verifies the QR code at the event entrance.

- [Events and Subscribers](https://docs.medusajs.com/docs/learn/fundamentals/events-and-subscribers): Learn how to create a subscriber.
- [Notification Module](https://docs.medusajs.com/infrastructure-modules/notification): Learn about available Notification Module Providers.

***

## Customize or Build Storefront

Customers can book tickets through your storefront. They need features like listing shows, selecting show dates and seats, and placing orders through a checkout flow that supports ticket products.

Medusa provides a Next.js Starter Storefront with standard commerce features including listing products, placing orders, and managing accounts. You can customize the storefront and tailor its functionalities to support ticket booking features.

Alternatively, you can build the storefront with your preferred tech stack.

- [Next.js Starter Storefront](https://docs.medusajs.com/nextjs-starter): Learn how to install and use the Next.js Starter Storefront.
- [Storefront Guides](https://docs.medusajs.com/storefront-development): Learn how to build a storefront for your Medusa application.
