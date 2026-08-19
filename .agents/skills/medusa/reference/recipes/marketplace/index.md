# Marketplace Recipe

This recipe provides the general steps to implement a marketplace in your Medusa application.

## Example Guides

## Overview

A marketplace is an online commerce store that allows different vendors to sell their products within the same commerce system. Customers can purchase products from any of these vendors, and vendors can manage their orders separately.

Medusa's [Framework](https://docs.medusajs.com/docs/learn/fundamentals/framework) for customizations facilitates building a marketplace. You can create a Marketplace Module that implements custom data models, such as vendors or sellers, and link those data models to existing ones such as products and orders. You also expose custom features using API routes, and implement complex flows using workflows.

[How Foraged built a custom marketplace with Medusa](https://medusajs.com/blog/foraged/).

***

## Create Custom Module with Data Models

In a marketplace, a business or a vendor has a user, and they can use that user to authenticate and manage the vendor's data.

You can create a marketplace module that implements data models for vendors, their admins, and any other data models that fit your use case.

- [Create a Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.
- [Create Data Models](https://docs.medusajs.com/docs/learn/fundamentals/modules#1-create-data-model): Create data models in the module.

***

## Link Custom and Existing Data Models

Since a vendor has products, orders, and other models based on your use case, you can define module links between your module's data models and the Commerce Module's data models.

For example, if you defined a vendor data model in a marketplace module, you can define a module link between the vendor and the Product Module's product data model. This builds an association between a vendor and their products, allowing you to query and manage products based on the vendor.

[Define a Module Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links): Learn how to define a module link.

***

## Create Vendor API Routes

Your marketplace will most likely provide custom features for vendors, such as managing their products and orders. You can create API routes that expose these features to the vendors.

When you build these API routes, it's essential that you protect them to only allow authenticated vendors. For example, only a vendor's admin should be able to manage their products and orders.

Medusa supports creating custom actor types that can be authenticated with your custom API routes.

- [Create API Routes](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create an API Route in Medusa.
- [Create an Actor Type](https://docs.medusajs.com/commerce-modules/auth/create-actor-type): Learn how to create an actor type and authenticate it.

***

## Split Orders Based on Vendors

If your use case allows a customer's orders to have items from different vendors, you can replicate the [Complete Cart API route](https://docs.medusajs.com/api/store/carts/complete-cart) to customize the order creation process.

In the API route, you can create a workflow that splits the order into multiple orders, one for each vendor. A workflow is a series of steps that provide features like rollback and retry mechanisms.

- [Replicate API Routes](https://docs.medusajs.com/docs/learn/fundamentals/api-routes/override): Learn how to replicate an existing API route.
- [Create a Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow in Medusa.

***

## Customize Admin Dashboard

Based on your use case, you may need to customize the Medusa Admin to add new widgets or pages.

For example, you can create a page that lists all vendors or a widget that shows a product's vendor information.

The Medusa Admin is an extensible application within your Medusa application. You can customize it by:

- **Widgets**: Adding widgets to existing pages, such as the product page.
- **UI Routes**: Adding new pages to the Medusa Admin, such as a page to manage vendors.
- **Settings Pages**: Adding new pages to the Medusa Admin settings, such as a page to manage marketplace settings.

- [Create Admin Widget](https://docs.medusajs.com/docs/learn/fundamentals/admin/widgets): Add widgets into existing admin pages.
- [Create Admin UI Routes](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes): Add new pages to your Medusa Admin.

[Create Admin Setting Page](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes#create-settings-page): Add new page to the Medusa Admin settings.

***

## Build Dashboard for Vendors

For more complex use cases, customizing the Medusa Admin may not be enough to allow vendors to manage their data.

In that case, you can build a custom dashboard for vendors that allows them to manage their data. This dashboard can interact with Medusa's Admin API and the custom API routes you created for vendors to provide a seamless experience.

[Medusa Admin APIs](https://docs.medusajs.com/api/admin): Learn about available APIs for the Medusa Admin.

***

## Customize or Build Storefront

Medusa provides a Next.js Starter Storefront to use with your application. You can customize it for your marketplace use case, such as showing products by vendor.

Alternatively, you can build your own storefront using the Medusa APIs. This headless approach gives you the flexibility to build a custom storefront without limitations on which tech stack you use, or the design of the storefront.

- [Next.js Starter Storefront](https://docs.medusajs.com/nextjs-starter): Learn how to install and customize the Next.js Starter Storefront.
- [Storefront Development](https://docs.medusajs.com/storefront-development): Find useful guides for creating a custom storefront.
