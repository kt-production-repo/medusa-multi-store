# Personalized Products Recipe

This recipe provides the general steps to build personalized products in Medusa.

[Personalized Products Example](https://docs.medusajs.com/recipes/personalized-products/example): Find a complete example of personalized products in Medusa.

## Overview

Personalized products are products that customers can customize based on their need. For example, they can upload an image to print on a shirt or provide a message to include in a letter.

In Medusa, you can create a custom module defining data models related to personalization with the service to manage them. Then, you can link those data models to existing data models, such as products.

You also have freedom in how you choose to implement the storefront, allowing you to build a unique experience around your products.

***

## Store Personalized Data

The Cart Module's `LineItem` data model has a `metadata` property that holds any custom data. You can pass the customer's customization in the request body's `metadata` field when adding a product to the cart.

For example, if you’re asking customers to enter a message to put in a letter they’re purchasing, use the `metadata` attribute of the `LineItem` data model to set the personalized information entered by the customer:

```bash
curl -X POST '{backend_url}/store/carts/{id}/line-items' \
-H 'Content-Type: application/json' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
--data-raw '{
  "variant_id": "variant_123",
  "quantity": 1,
  "metadata": {
    "message": "Hello, World!"
  }
}'
```

Two line items in the cart having different `metadata` attributes are not considered the same item. So, each line item is managed separately and can have its own quantity.

In more complex cases, you can create a custom module that stores and manages the personalization data models. You can also create a link between these data models and the `LineItem` data model.

- [Create a Module](https://docs.medusajs.com/docs/learn/fundamentals/modules): Learn how to create a module.
- [Define Module Link](https://docs.medusajs.com/docs/learn/fundamentals/module-links): Define link between data models.

***

## Build a Custom Storefront

Medusa's modular architecture removes any restrictions on the your storefront's tech stack, design, and the experience you provide customers. The storefront connects to the Medusa application using the Store API Routes.

You can build a unique experience around your products that focuses on the customer’s personalization capabilities.

Medusa provides a Next.js Starter Storefront with basic ecommerce functionalities that can be customized. You can also build your own storefront and use Medusa’s client libraries or Store API Routes to communicate with the Medusa application.

- [Next.js Starter Storefront](https://docs.medusajs.com/nextjs-starter): Learn how to install the Next.js Starter Storefront.
- [Storefront Development](https://docs.medusajs.com/storefront-development): Find guides to build your own storefront.

***

## Pass Personalized Data to the Order

If you store the personalized data using a custom module, you can:

- Create a workflow that handles saving the personalization data.
- Create a custom API Route that executes the workflow.
- Call that API Route from the storefront after adding the item to the cart.
- Consume the `orderCreated` hook of the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow) to attach the personalized data to the Order Module's `LineItem` data model.

- [Create a Workflow](https://docs.medusajs.com/docs/learn/fundamentals/workflows): Learn how to create a workflow.
- [Create API Route](https://docs.medusajs.com/docs/learn/fundamentals/api-routes): Learn how to create an API route.
- [Consume a Hook](https://docs.medusajs.com/docs/learn/fundamentals/workflows/workflow-hooks): Learn how to create a hook.

***

## Fulfill Personalized Products in Orders

The Fulfillment Module handles all logic related to fulfilling orders. It also supports using fulfillment module providers that implement the logic of fulfilling orders with third-party services.

To fulfill your personalized products with a third-party service or custom logic, you can create a fulfillment module provider.

The Fulfillment Module registers your fulfillment module provider to use it to fulfill orders.

- [Fulfillment Module](https://docs.medusajs.com/commerce-modules/fulfillment): Learn about the Fulfillment Module.
- [Create Fulfillment Module Provider](https://docs.medusajs.com/references/fulfillment/provider): Learn how to create a fulfillment module provider.
