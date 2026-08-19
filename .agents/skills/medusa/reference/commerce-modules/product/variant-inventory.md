# Product Variant Inventory

In this guide, you'll learn about the inventory management features related to product variants.

Refer to this [Medusa Admin User Guide](https://docs.medusajs.com/user-guide/products/variants#manage-product-variant-inventory) to learn how to manage inventory of product variants.

## Configure Inventory Management of Product Variants

A product variant, represented by the [ProductVariant](https://docs.medusajs.com/references/product/models/ProductVariant) data model, has a `manage_inventory` field that's disabled by default. This field indicates whether you'll manage the inventory quantity of the product variant in the Medusa application. You can also keep `manage_inventory` disabled if you manage the product's inventory in an external system, such as an ERP.

The Product Module doesn't provide inventory-management features. Instead, the Medusa application uses the [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory) to manage inventory for products and variants. When `manage_inventory` is disabled, the Medusa application always considers the product variant to be in stock. This is useful if your product's variants aren't items that can be stocked, such as digital products, or they don't have a limited stock quantity.

When `manage_inventory` is enabled, the Medusa application tracks the inventory of the product variant using the [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory). For example, when a customer purchases a product variant, the Medusa application decrements the stocked quantity of the product variant.

***

## How the Medusa Application Manages Inventory

When a product variant has `manage_inventory` enabled, the Medusa application creates an inventory item using the [Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory) and links it to the product variant.

![Diagram showcasing the link between a product variant and its inventory item](https://res.cloudinary.com/dza7lstvk/image/upload/v1709652779/Medusa%20Resources/product-inventory_kmjnud.jpg)

The inventory item has one or more locations, called inventory levels, that represent the stock quantity of the product variant at a specific location. This allows you to manage inventory across multiple warehouses, such as a warehouse in the US and another in Europe.

![Diagram showcasing the link between a variant and its inventory item, and the inventory item's level.](https://res.cloudinary.com/dza7lstvk/image/upload/v1738580390/Medusa%20Resources/variant-inventory-level_bbee2t.jpg)

Learn more about inventory concepts in the [Inventory Module's documentation](https://docs.medusajs.com/resources/commerce-modules/inventory/concepts).

The Medusa application represents and manages stock locations using the [Stock Location Module](https://docs.medusajs.com/resources/commerce-modules/stock-location). It creates a read-only link between the `InventoryLevel` and `StockLocation` data models so that it can retrieve the stock location of an inventory level.

![Diagram showcasing the read-only link between an inventory level and a stock location](https://res.cloudinary.com/dza7lstvk/image/upload/v1738582163/Medusa%20Resources/inventory-level-stock_amxfg5.jpg)

Learn more about the Stock Location Module in the [Stock Location Module's documentation](https://docs.medusajs.com/resources/commerce-modules/stock-location/concepts).

### Product Inventory in Storefronts

When a storefront sends a request to the Medusa application, it must always pass a [publishable API key](https://docs.medusajs.com/resources/commerce-modules/sales-channel/publishable-api-keys) in the request header. This API key specifies the sales channels, available through the [Sales Channel Module](https://docs.medusajs.com/resources/commerce-modules/sales-channel), of the storefront.

The Medusa application links sales channels to stock locations, indicating the locations available for a specific sales channel. So, all inventory-related operations are scoped by the sales channel and its associated stock locations.

For example, the availability of a product variant is determined by the `stocked_quantity` of its inventory level at the stock location linked to the storefront's sales channel.

![Diagram showcasing the overall relations between inventory, stock location, and sales channel concepts](https://res.cloudinary.com/dza7lstvk/image/upload/v1738582163/Medusa%20Resources/inventory-stock-sales_fknoxw.jpg)

***

## Variant Back Orders

Product variants have an `allow_backorder` field that's disabled by default. When enabled, the Medusa application allows customers to purchase the product variant even when it's out of stock. Use this when your product variant is available through on-demand or pre-order purchase.

You can also allow customers to subscribe to restock notifications of a product variant as explained in [this guide](https://docs.medusajs.com/resources/recipes/commerce-automation/restock-notification).

### Per-Item Back Order Override

This feature is available since Medusa [v2.19.0](https://github.com/medusajs/medusa/releases/tag/v2.19.0).

Workflows that add items to orders or carts support an `allow_backorder` field on each item. When set to `true`, the item bypasses the out-of-stock check for its variant even if the variant's own `allow_backorder` field is disabled.

This is useful when an admin adds a currently out-of-stock item to a draft order or an order edit on behalf of a customer.

The following workflows support the per-item `allow_backorder` field:

- Cart workflows: [addToCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/addToCartWorkflow), [createCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/createCartWorkflow)
- Order item workflows: [addOrderLineItemsWorkflow](https://docs.medusajs.com/references/medusa-workflows/addOrderLineItemsWorkflow), [orderEditAddNewItemWorkflow](https://docs.medusajs.com/references/medusa-workflows/orderEditAddNewItemWorkflow), [orderExchangeAddNewItemWorkflow](https://docs.medusajs.com/references/medusa-workflows/orderExchangeAddNewItemWorkflow), [orderClaimAddNewItemWorkflow](https://docs.medusajs.com/references/medusa-workflows/orderClaimAddNewItemWorkflow)

***

## Additional Resources

The following guides provide more details on inventory management in the Medusa application:

- [Physical and Customs Attributes](https://docs.medusajs.com/resources/commerce-modules/product/physical-customs-attributes): Learn how physical and customs attributes on products and variants relate to the inventory item created for a variant.
- [Inventory Kits in the Inventory Module](https://docs.medusajs.com/resources/commerce-modules/inventory/inventory-kit): Learn how you can implement bundled or multi-part products through the Inventory Module.
- [Retrieve Product Variant Inventory Quantity](https://docs.medusajs.com/resources/commerce-modules/product/guides/variant-inventory): Learn how to retrieve the available inventory quantity of a product variant.
- [Configure Selling Products](https://docs.medusajs.com/resources/commerce-modules/product/selling-products): Learn how to use inventory management to support different use cases when selling products.
- [Inventory in Flows](https://docs.medusajs.com/resources/commerce-modules/inventory/inventory-in-flows): Learn how Medusa utilizes inventory management in different flows.
- [Storefront guide: how to retrieve a product variant's inventory details](https://docs.medusajs.com/resources/storefront-development/products/inventory).
