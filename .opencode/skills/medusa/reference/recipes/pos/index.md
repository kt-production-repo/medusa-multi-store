# Point-of-Sale (POS) Recipe

This recipe provides the general steps to build a Point of Sale (POS) system with Medusa.

## Overview

Building a POS system on top of an ecommerce engine introduces challenges related to the tech stack used, data sync across channels, and feature availability relevant to offline sales in a POS, not just online sales.

Medusa's modular architecture solves these challenges. Any frontend can utilize Medusa's commerce features, such as sales channels or multi-warehouse features, through its REST APIs.

[How Tekla built a POS system with Medusa](https://medusajs.com/blog/tekla-agilo-pos-case/).

***

## Freedom in Choosing Your POS Tech Stack

When you build a POS system, you choose the programming language or tool you want to use.

Medusa's modular architecture removes any restrictions you may have while making this choice. Any client or frontend can connect to the Medusa application using its headless REST APIs.

![POS Tech Stack](https://res.cloudinary.com/dza7lstvk/image/upload/v1709034046/Medusa%20Book/pos-tech-stack_fy8uiu.jpg)

[Admin REST APIs](https://docs.medusajs.com/api/admin): Check out available Admin REST APIs in Medusa.

***

## Integrate a Barcode Scanner

POS systems make the checkout process smoother by integrating a barcode scanner. Merchants scan a product by its barcode to check its details or add it to the customer's purchase.

The Product Module's [ProductVariant](https://docs.medusajs.com/references/product/models/ProductVariant) data model has the properties to implement this integration, mainly the `barcode` attribute. Other notable properties include `ean`, `upc`, and `hs_code`, among others.

To search through product variants by their barcode, create a custom API Route and call it within your POS.

![Example flow of integrating a barcode scanner](https://res.cloudinary.com/dza7lstvk/image/upload/v1709034282/Medusa%20Book/pos-scan-barcode_a8j8ew.jpg)

- [Product Module](https://docs.medusajs.com/commerce-modules/product): Learn about the Product Module.
- [Create API Route](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create an API Route.

***

## Access Accurate Inventory Details

As you manage an online and offline store, it's essential to separate inventory quantity across different locations.

Medusa's [Inventory](https://docs.medusajs.com/resources/commerce-modules/inventory), [Stock Location](https://docs.medusajs.com/resources/commerce-modules/stock-location), and [Sales Channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel) modules allow merchants to manage the inventory items and their availability across locations and sales channels.

![Using Multi-warehouse features with POS](https://res.cloudinary.com/dza7lstvk/image/upload/v1709034731/Medusa%20Book/pos-multiwarehouse_r1z48x.jpg)

Merchants can create a sales channel for their online store and a sales channel for their POS system, then manage the inventory quantity of product variants in each channel.

This also opens the door for other business opportunities, such as an endless aisle experience.

Suppose a product isn't available in-store but is available in different warehouses. You can allow customers to purchase that item in-store and deliver it to their address.

- [Inventory Module](https://docs.medusajs.com/commerce-modules/inventory): Learn about the Inventory Module.
- [Stock Location Module](https://docs.medusajs.com/commerce-modules/stock-location): Learn about the Stock Location Module.

[Sales Channel Module](https://docs.medusajs.com/commerce-modules/sales-channel): Learn about the Sales Channel Module.

***

## Build an Omni-channel Customer Experience

Using Medusa's [Customer Module](https://docs.medusajs.com/resources/commerce-modules/customer), you can retrieve a customer's details from the Medusa application and place an order on the POS under their account. The customer can then view their order details on their online profile as if they had placed the order online.

In addition, using Medusa's [Promotion Module](https://docs.medusajs.com/resources/commerce-modules/promotion), store operators can create promotions on the fly for customers using the POS system and apply them to their orders.

You can also create custom modules to provide features for a better customer experience, such as a rewards system or loyalty points.

- [Loyalty Points Tutorial](https://docs.medusajs.com/how-to-tutorials/tutorials/loyalty-points): Learn how to create a loyalty points system.
- [Customer Module](https://docs.medusajs.com/commerce-modules/customer): Learn about the Customer Module.
- [Promotion Module](https://docs.medusajs.com/commerce-modules/promotion): Learn about the Promotion Module.
- [Create a Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.

***

## Accept Payment, Place Order, and Use RMA Features

Medusa's architecture allows you to integrate any third-party payment provider for your POS and online storefront. For example, you can integrate [Stripe Terminal](https://stripe.com/terminal) to accept in-store payments.

Once you accept the payment, you can place an order in the POS system using the [Draft Order APIs](https://docs.medusajs.com/api/admin/draft-orders). Draft orders provide similar features to an online checkout experience, including discounts, payment processing, and more.

Then, merchants can view all orders coming from different sales channels using the Medusa Admin. This keeps logistics and order handling consistent between online and in-store customers.

- [Create a Payment Module Provider](https://docs.medusajs.com/references/payment/provider): Learn how to create a payment module provider.
- [Admin REST APIs](https://docs.medusajs.com/api/admin): Check out available Admin REST APIs.
