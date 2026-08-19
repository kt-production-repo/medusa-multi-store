# B2B Recipe

This recipe provides the general steps to implement a B2B store with Medusa.

Medusa has a ready-to-use B2B starter that you can install and use. Refer to the [B2B Starter GitHub repository](https://github.com/medusajs/b2b-starter) for more details.

## Overview

In a B2B store, you provide different types of customers with relevant pricing, products, shopping experience, and more.

Medusa’s Commerce Modules, including [Sales Channel](https://docs.medusajs.com/resources/commerce-modules/sales-channel), [Customer](../../commerce-modules/), and [Pricing](https://docs.medusajs.com/resources/commerce-modules/pricing) modules enable this setup out-of-the-box:

- **Sales Channel**: Use sales channels to set product availability per channel. In this case, create a B2B sales channel that includes only B2B products.
- **Customer**: Use customer groups to organize your customers into different groups. Then, you can apply different prices for each group.
- **Pricing**: Use price lists to set different prices for each B2B customer group, among other conditions.

In addition, Medusa’s extensible architecture and Framework for customization allow you to scope existing and custom features to specific customer groups or sales channels.

[Visionary: Frictionless B2B ecommerce with Medusa](https://medusajs.com/blog/visionary/)

***

## Create B2B Sales Channel

Sales channels allow you to set product availability per channel. For B2B use cases, you can create a B2B sales channel that includes only B2B products.

Then, on the storefront, you retrieve only the B2B products for B2B customers, which is explained more in the next section.

You can create a sales channel through the Medusa Admin or Admin REST APIs.

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/settings/sales-channels): Create the sales channel using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/sales-channels/create-sales-channel): Create the sales channel using the REST APIs.

***

## Create a Publishable API Key

A publishable API key allows you to specify the context of client requests:

- You associate the publishable API key with one or more sales channels, such as the B2B sales channel.
- In a client such as a storefront, you pass the publishable API key in the header of your requests.

So, if you use the publishable API key associated with the B2B sales channel in your storefront, the Medusa server will only return products that are available in the B2B sales channel.

You can create a publishable API key through the Medusa Admin or the Admin REST APIs, then associate it with the B2B sales channel. Then, you can use this key when developing your B2B storefront.

### Create Publishable API Key

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/settings/developer/publishable-api-keys): Create the API key using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/api-keys/create-api-key): Create the API key using the REST APIs.

### Associate Key with Sales Channel

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/settings/developer/publishable-api-keys#manage-publishable-api-keys-sales-channels): Associate the key with the sales channel using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/api-keys/manage-sales-channels): Associate the key with the sales channel using the REST APIs.

***

## Add Products to B2B Sales Channel

You can manage products to be available in specific sales channels. For B2B, this allows you to add products that are only available to B2B customers.

You can create new products or add existing ones to the B2B sales channel using the Medusa Admin or Admin REST APIs.

### Create Products

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/products/create): Create the products using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/products/create-product): Create the products using the REST APIs.

### Add Products to Sales Channel

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/settings/sales-channels#manage-products-in-sales-channel): Create the products using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/sales-channels/manage-products): Add the products to the sales channel using the REST APIs.

***

## Add B2B Customers and Groups

Customer groups allow you to organize your customers into different groups. Then, you can apply different prices for each group.

This is useful for B2B sales, as you often negotiate special prices with each customer or company.

You can create a customer group for each B2B company, then add customers of that company to the group.

### Create Customers

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/customers/manage): Create customers using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/customers/create-customer): Create customers using the REST APIs.

### Assign Customers to Groups

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/customers/manage#manage-customers-groups): Assign customer to groups using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/customer-groups/manage-customers): Assign customer to groups using the REST APIs.

### Flexible Customizations: Create Custom Module

B2B use cases often require more complex customer management, such as managing roles in a company with employees having different privileges.

For more complex use cases, you can create a custom module that introduces data models like `Company`, `Employee`, and other relevant models.

Then, you can link those companies to existing customers and groups, allowing you to benefit from existing features like price lists for specific customer groups.

- [Create Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.
- [Define Module Links](https://docs.medusajs.com/docs/learn/fundamentals/module-links): Define links between data models.

***

## Create B2B Price List

Price lists allow you to set different prices for each customer group, among other conditions. They're useful to override prices for custom use cases.

For B2B use cases, you can use price lists to set different prices for each B2B customer group. Then, B2B customers can see different prices on the storefront based on their group.

You can create a price list using the Medusa Admin or the Admin REST APIs. Make sure to set the B2B customer group(s) as a condition.

- [Using Medusa Admin](https://docs.medusajs.com/user-guide/price-lists/create): Create price list using the Medusa Admin.
- [Using Admin API](https://docs.medusajs.com/api/admin/price-lists/create-price-list): Create price list using the REST APIs.

***

## Customize Medusa Admin

Based on your use case, you may need to customize the Medusa Admin to add new widgets or pages.

For example, you may want to add a page to manage companies and their employees, or you may want to add a widget to show the company associated with a customer group.

The Medusa Admin is an extensible application within your Medusa application. You can customize it by:

- **Widgets**: Adding widgets to existing pages, such as the customer group page.
- **UI Routes**: Adding new pages to the Medusa Admin, such as a page to manage companies and employees.
- **Settings Pages**: Adding new pages to the Medusa Admin settings, such as a page to manage company settings.

- [Create Admin Widget](https://docs.medusajs.com/docs/learn/fundamentals/admin/widgets): Add widgets into existing admin pages.
- [Create Admin UI Routes](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes): Add new pages to your Medusa Admin.

[Create Admin Setting Page](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes#create-settings-page): Add new page to the Medusa Admin settings.

***

## Customize or Build Storefront

Medusa provides a Next.js Starter Storefront to use with your application. You can customize it for your B2B use case, such as adding a login page for B2B customers or expanding the profile page to show the company associated with the customer.

Alternatively, you can build your own storefront using the Medusa APIs. This headless approach gives you the flexibility to build a custom storefront without limitations on which tech stack you use, or the design of the storefront.

In your storefront, you can use the publishable API key you associated with your B2B sales channel to ensure only B2B products are retrieved.

- [Next.js Starter Storefront](https://docs.medusajs.com/nextjs-starter): Learn how to install and customize the Next.js Starter Storefront.
- [Storefront Development](https://docs.medusajs.com/storefront-development): Find guides to build your own storefront.

[Use Publishable API Keys](https://docs.medusajs.com/api/store/publishable-api-key): Learn how to use the publishable API key in client requests.
