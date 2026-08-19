# Digital Products Recipe

This recipe provides the general steps to implement digital products in your Medusa application.

Follow the step-by-step [Digital Products Example](https://docs.medusajs.com/resources/recipes/digital-products/examples/standard) to learn how to implement digital products in your Medusa application.

## Overview

Digital products are products that are stored and delivered electronically. Examples include e-books, software, and digital art.

When the customer buys a digital product, an email is sent to them where they can download the product.

To implement digital products in Medusa, you create a Digital Product Module that introduces the concept of a digital product and link it to existing product concepts in the Product Module.

***

## Install a File Module Provider

A file module provider handles storage functionalities in Medusa. This includes uploading, retrieving, and downloading files, among other features.

You can use a file module provider to store and manage your digital products.

During development, you can use the Local File Module Provider, which is installed by default in your store. For production, you can use module providers like [S3](https://docs.medusajs.com/resources/infrastructure-modules/file/s3) or create your own.

- [File Module Providers](https://docs.medusajs.com/infrastructure-modules/file): Check out available file module providers.
- [Create a File Module Provider](https://docs.medusajs.com/references/file-provider-module): Learn how to create a file module provider.

***

## Create Digital Product Module

Your custom features and functionalities are implemented inside modules. The module is integrated into the Medusa application without any implications on existing functionalities.

You can create a custom module for digital products that holds your custom data models and the service implementing digital-product-related features.

[How to Create a Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.

### Create Custom Data Model

A data model represents a table in the database. You can define in your module data models to store data related to your custom features, such as a digital product.

Then, you can link your custom data model to data models from other modules. For example, you can link the digital product model to the Product Module's `ProductVariant` data model.

- [How to Create a Data Model](https://docs.medusajs.com/docs/learn/fundamentals/modules#1-create-data-model): Learn how to create a data model.
- [Define Module Links](https://docs.medusajs.com/docs/learn/fundamentals/module-links): Define links between data models.

### Implement Data Management Features

Your module’s main service holds data-management and other related features. Then, in other resources, such as an API route, you can resolve the service from the Medusa container and use its functionalities.

Medusa facilitates implementing data-management features using the service factory. Your module's main service can extend this service factory, and it generates data-management methods for your data models.

[Service Factory](https://docs.medusajs.com/docs/learn/fundamentals/modules/service-factory): Learn about the service factory and how to use it.

***

## Build Flows for Digital Products

Your use case most likely has flows, such as creating digital products, that require multiple steps.

Create workflows to implement these flows, then utilize these workflows in other resources, such as an API route.

In the workflow's steps, you can resolve the Digital Product Module's service and use its data-management methods to manage digital products.

[Workflows](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.

***

## Add Custom API Routes

API routes expose your features to external applications, such as the admin dashboard or the storefront.

You can create custom admin API routes that allow merchants to list and create digital products, and store API routes that allow customers to purchase and download digital products.

[API Routes](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create an API route.

***

## Customize Admin Dashboard

Based on your use case, you may need to customize the Medusa Admin to add new widgets or pages.

For example, you can create a page that lists all digital products or a widget that allows merchants to view the digital data associated with a product.

The Medusa Admin is an extensible application within your Medusa application. You can customize it by:

- **Widgets**: Adding widgets to existing pages, such as the product page.
- **UI Routes**: Adding new pages to the Medusa Admin, such as a page to manage digital products.
- **Settings Pages**: Adding new pages to the Medusa Admin settings, such as a page to manage digital product settings.

- [Create Admin Widget](https://docs.medusajs.com/docs/learn/fundamentals/admin/widgets): Add widgets into existing admin pages.
- [Create Admin UI Routes](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes): Add new pages to your Medusa Admin.

[Create Admin Setting Page](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes#create-settings-page): Add new page to the Medusa Admin settings.

***

## Deliver Digital Products to the Customer

When a customer purchases a digital product, they should receive a link to download it.

The Fulfillment Module handles all logic related to fulfilling orders. It also supports using fulfillment module providers that implement the logic of fulfilling orders with third-party services.

You can create a custom fulfillment module provider that implements the logic of delivering digital products to customers based on your use case.

- [Fulfillment Module](https://docs.medusajs.com/commerce-modules/fulfillment): Learn about the Fulfillment Module.
- [Create Fulfillment Module Provider](https://docs.medusajs.com/references/fulfillment/provider): Learn how to create a fulfillment module provider.

***

## Customize or Build Storefront

Customers use your storefront to browse your digital products and purchase them. You can also provide other helpful features, such as previewing the digital product before purchase.

Medusa provides a Next.js Starter Storefront with standard commerce features including listing products, placing orders, and managing accounts. You can customize the storefront and cater its functionalities to support digital products.

Alternatively, you can build your own storefront using the Medusa APIs. This headless approach gives you the flexibility to build a custom storefront without limitations on which tech stack you use, or the design of the storefront.

- [Next.js Starter Storefront](https://docs.medusajs.com/nextjs-starter): Learn how to install and use the Next.js Starter Storefront.
- [Storefront Guides](https://docs.medusajs.com/storefront-development): Find guides to build your own storefront.
