# Tax Region

In this document, you’ll learn about tax regions and how to use them with the Region Module.

Refer to this [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/settings/tax-regions) to learn how to manage tax regions using the dashboard.

## What is a Tax Region?

A tax region, represented by the [TaxRegion data model](https://docs.medusajs.com/references/tax/models/TaxRegion), stores tax settings related to a region that your store serves.

Tax regions can inherit settings and rules from a parent tax region.

***

## Tax Rules in a Tax Region

Tax rules define the tax rates and behavior within a tax region. They specify:

- The tax rate percentage.
- Which products the tax applies to.
- Other custom rules to determine tax applicability.

Learn more about tax rules in the [Tax Rates and Rules](https://docs.medusajs.com/resources/commerce-modules/tax/tax-rates-and-rules) guide.

***

## Tax Provider

Each tax region can have a default tax provider. The tax provider is responsible for calculating the tax lines for carts and orders in that region.

You can use Medusa's default tax provider or create a custom one, allowing you to integrate with third-party tax services or implement your own tax calculation logic.

Learn more about tax providers in the [Tax Provider](https://docs.medusajs.com/resources/commerce-modules/tax/tax-provider) guide.
