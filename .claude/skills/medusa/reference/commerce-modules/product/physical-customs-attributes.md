# Product and Variant Physical and Customs Attributes

In this guide, you'll learn how physical and customs attributes behave when set on a product and its variants, and which of these attributes fulfillment providers and inventory items use.

## Overview of Physical and Customs Attributes

Both the [Product](https://docs.medusajs.com/references/product/models/Product) and [ProductVariant](https://docs.medusajs.com/references/product/models/ProductVariant) data models define the following physical and customs attributes:

|Attribute|Description|
|---|---|
|\`weight\`|The item's weight.|
|\`length\`|The item's length.|
|\`height\`|The item's height.|
|\`width\`|The item's width.|
|\`origin\_country\`|The item's country of origin.|
|\`hs\_code\`|The item's Harmonized System (HS) code.|
|\`mid\_code\`|The item's Manufacturer Identification (MID) code.|
|\`material\`|The item's material.|

These attributes are defined independently on each data model, and every attribute is nullable on both models.

***

## Attributes Are Not Inherited by Variants

The physical and customs attributes on a product and those on its variants are separate values. Medusa doesn't copy, inherit, or merge them:

- Setting an attribute on a product doesn't set or change it on the product's variants.
- A variant's attribute is `null` unless you explicitly set it on the variant, even if the parent product has a value for that attribute.
- In Store and Admin API responses, a variant's attributes always reflect the variant's own stored values. They never fall back to the product's values.
- Medusa doesn't apply a universal precedence or fallback rule, such as `variant.weight ?? product.weight`, when reading these attributes.

So, if you want a value to be available on a variant, set it on the variant. The value you set on the product is only stored on the product.

Set physical and customs attributes on your variants if you use them for fulfillment or shipping integrations, as explained in the [What Fulfillment Providers Read](#what-fulfillment-providers-read) section.

***

## Attributes in the Automatically Created Inventory Item

When you create a variant that has `manage_inventory` enabled without specifying inventory items, Medusa automatically creates an [inventory item](https://docs.medusajs.com/resources/commerce-modules/product/variant-inventory) and links it to the variant.

Medusa copies the following attributes from the variant to the created inventory item:

- `weight`
- `length`
- `height`
- `width`
- `origin_country`,
- `hs_code`
- `mid_code`
- `material`

The product's attributes aren't used when creating the inventory item.

Medusa copies these attributes from the product variant to the inventory item only when it creates the item. This is a one-time snapshot: later changes to the variant's attributes don't propagate to the inventory item, and changes to the inventory item's attributes don't propagate back to the variant. To keep them in sync, update both.

***

## What Fulfillment Providers Read

Fulfillment providers receive the physical and customs attributes as part of the data Medusa passes to them, but Medusa doesn't merge the product's and variant's attributes for you.

When Medusa calculates a shipping option's price, it passes each item's variant attributes (`weight`, `length`, `height`, `width`, and `material`) to the fulfillment provider.

When Medusa creates a fulfillment, it passes the order to the fulfillment provider with both the variant's attributes (`weight`, `length`, `height`, `width`, `material`, `hs_code`, and `origin_country`) and the product's attributes (`origin_country`, `hs_code`, `mid_code`, and `material`) available on each item.

Since Medusa doesn't apply a fallback, a fulfillment provider that wants to use a product's value when a variant's value isn't set must implement that fallback itself. For example, a provider can read `variant.weight ?? product.weight`.

Learn how to create a fulfillment provider in the [Create Fulfillment Provider](https://docs.medusajs.com/references/fulfillment/provider) guide.
