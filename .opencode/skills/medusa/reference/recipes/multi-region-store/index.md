# Multi-Region Store Recipe

This recipe provides the general steps to build a multi-region store with Medusa.

## Overview

A multi-regional store allows merchants to sell across different countries. This includes supporting each country's tax rules, currency, available shipping and payment options, and more.

Medusa comes with multi-regional support out of the box. This recipe explains how to benefit from Medusa's features to create a multi-regional store.

***

## Multi-Region Setup

In Medusa, you can create unlimited regions in your store. Each region has configurations managed through the Medusa Admin or the Admin REST APIs.

### Currency

Merchants specify the currency of each region. Multiple regions can have the same currency, but a region has only one currency.

When customers view your products from a region, they see the prices in the region’s currency.

### Tax Regions and Rates

Merchants can define tax regions, which are tax-related settings for a specific country. For each tax region, merchants can set a default tax rate and override it with tax rates for specific conditions, such as product types.

During checkout, Medusa calculates the taxes using the tax region settings of the customer's region and selected country in their shipping address.

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/settings/tax-regions): Learn how to manage tax regions in the Medusa Admin
- [Using Admin APIs](https://docs.medusajs.com/api/admin/tax-regions/create-tax-region): Manage tax regions using the Admin APIs.

### Payment and Fulfillment Providers

Merchants choose which payment providers are available in each region. For example, one region can use Payment Provider A and B while another only uses Payment Provider B.

Merchants can also choose the fulfillment providers available in each stock location, and provide shipping options using the providers in those locations.

During checkout, customers only see the payment providers configured for the region, and they can only choose shipping options that can be used to fulfill items to their shipping address. This allows merchants to give customers a localized experience that feels familiar and instills trust.

Medusa provides official module providers for payment and fulfillment. You can also create custom module providers.

- [Manage Payment Providers in Medusa Admin](https://docs.medusajs.com/user-guide/settings/regions): Learn how to manage providers in a region.
- [Manage Fulfillment Providers in Medusa Admin](https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations#manage-fulfillment-providers): Learn how to manage providers in a location.
- [Integrations](https://docs.medusajs.com/integrations): Check out available integrations, including payment module providers.
- [Create Fulfillment Module Provider](https://docs.medusajs.com/references/fulfillment/provider): Learn how to create a fulfillment module provider.

***

## Prices Per Region and Currency

Merchants set the price of shipping options and product variants per currency and region. This also applies to adding sales or overriding prices for specific conditions.

Using the tax-inclusive feature, merchants can also specify prices including taxes per currency and region. Medusa then calculates the tax amount applied to a line item in the cart based on the region's tax configurations.

- [Setting Variant Prices in Medusa Admin](https://docs.medusajs.com/user-guide/products/variants#edit-product-variant-prices): Learn how to set a variant's prices in Medusa Admin.
- [Display Variant Price in Storefront](https://docs.medusajs.com/storefront-development/products/price): Learn how to display the correct product price in a storefront.

***

## Multi-Warehouse Support

Medusa's [Inventory](https://docs.medusajs.com/resources/commerce-modules/inventory) and [Stock Location](https://docs.medusajs.com/resources/commerce-modules/stock-location) Modules provide multi-warehouse features that allow merchants to manage inventory across different locations. Merchants then control which location an item in an order is fulfilled from, allowing them to keep a correct inventory count across locations and sales channels.

A multi-regional setup lets merchants manage their inventory through Medusa across the different regions they serve. Customers are always shown accurate inventory information based on the location associated with their sales channel.

- [Manage Stock Locations](https://docs.medusajs.com/user-guide/settings/locations-and-shipping/locations): Learn how to manage stock locations in the Medusa Admin.
- [Manage Inventory](https://docs.medusajs.com/user-guide/inventory): Learn how to manage inventory in the Medusa Admin.

***

## Multi-Lingual Setup

Medusa's [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation) allows merchants to manage translations for product-related resources through Medusa's Store API routes.

This enables merchants to provide a localized experience for customers in different regions by serving translated content in their storefront applications.

Future versions of the Translation Module will expand translation support to additional resources beyond product-related ones.

- [Manage Translations](https://docs.medusajs.com/user-guide/settings/translations): Learn how to manage translations in the Medusa Admin.
- [Localizing Storefronts](https://docs.medusajs.com/storefront-development/localization): Learn how to localize your storefront applications.
