# Cart Concepts

In this document, you’ll learn about the main concepts related to carts in Medusa.

## Cart

A cart is the selection of product variants that a customer intends to purchase. It is represented by the [Cart data model](https://docs.medusajs.com/references/cart/models/Cart).

A cart holds information about:

- The items the customer wants to buy.
- The customer's shipping and billing addresses.
- The shipping methods used to fulfill the items after purchase.
- The payment method and information necessary to complete the purchase.
  - These are stored and handled by the [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment).

### Cart Locale

Cart locale is available starting [Medusa v2.12.3](https://github.com/medusajs/medusa/releases/tag/v2.12.3).

The `Cart` data model has a `locale` property that indicates the locale of the cart. This locale is in the [IETF BCP 47 standard](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1) format, such as `en-US` for American English or `fr-FR` for French (France).

When creating a cart, you can set the `locale` property to specify the desired locale for the cart. The information of the items in the cart, such as product titles and descriptions, will be displayed in the specified locale if translations are available.

Refer to the [Translation Module](https://docs.medusajs.com/resources/commerce-modules/translation) to learn more about how translations and locales work.

***

## Line Items

A line item, represented by the [LineItem](https://docs.medusajs.com/references/cart/models/LineItem) data model, is a quantity of a product variant added to the cart. A cart has multiple line items.

In the Medusa application, a product variant is implemented in the [Product Module](https://docs.medusajs.com/resources/commerce-modules/product).

A line item stores some of the product variant’s properties, such as the `product_title` and `product_description`. It also stores data related to the item’s quantity and price.

***

## Shipping and Billing Addresses

A cart has a shipping and billing address. Both of these addresses are represented by the [Address data model](https://docs.medusajs.com/references/cart/models/Address).

![A diagram showcasing the relation between the Cart and Address data models](https://res.cloudinary.com/dza7lstvk/image/upload/v1711532392/Medusa%20Resources/cart-addresses_ls6qmv.jpg)

***

## Shipping Methods

A shipping method, represented by the [ShippingMethod data model](https://docs.medusajs.com/references/cart/models/ShippingMethod), is used to fulfill the items in the cart after the order is placed. A cart can have multiple shipping methods, which is useful when items have different shipping profiles or require different fulfillment providers.

In the Medusa application, the shipping method is created from a shipping option, available through the [Fulfillment Module](https://docs.medusajs.com/resources/commerce-modules/fulfillment). Its ID is stored in the `shipping_option_id` property of the method.

Adding multiple shipping methods in a single request is available since Medusa [v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0).

### data Property

After an order is placed, you can use a third-party fulfillment provider to fulfill its shipments.

If the fulfillment provider requires additional custom data to be passed along from the checkout process, set this data in the `ShippingMethod`'s `data` property.

The `data` property is an object used to store custom data relevant later for fulfillment.
