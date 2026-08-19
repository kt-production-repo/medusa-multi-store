# Stripe Module Provider

In this document, you’ll learn about the Stripe Module Provider and how to configure it in the Payment Module.

Your technical team must install the Stripe Module Provider in your Medusa application first. Then, refer to [this user guide](https://docs.medusajs.com/user-guide/settings/regions#edit-region-details) to learn how to enable the Stripe payment provider in a region using the Medusa Admin dashboard.

## Register the Stripe Module Provider

### Prerequisites

- [Stripe account](https://stripe.com/)
- [Stripe Secret API Key](https://support.stripe.com/questions/locate-api-keys-in-the-dashboard)
- [For deployed Medusa applications, a Stripe webhook secret. Refer to the end of this guide for details on the URL and events.](https://docs.stripe.com/webhooks#add-a-webhook-endpoint)

The Stripe Module Provider is installed by default in your application. To use it, add it to the array of providers passed to the Payment Module in `medusa-config.ts`:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
        ],
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the necessary environment variables for the above options in `.env`:

```bash
STRIPE_API_KEY=<YOUR_STRIPE_API_KEY>
```

### Module Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`apiKey\`|A string indicating the Stripe Secret API key.|Yes|-|
|\`webhookSecret\`|A string indicating the Stripe webhook secret. This is only useful for deployed Medusa applications.|Yes|-|
|\`capture\`|Whether to automatically capture payment after authorization.|No|\`false\`|
|\`automatic\_payment\_methods\`|A boolean value indicating whether to enable Stripe's automatic payment methods. This is useful if you integrate services like Apple pay or Google pay.|No|\`false\`|
|\`payment\_description\`|A string used as the default description of a payment if none is available in cart.context.payment\_description.|No|-|
|\`oxxoExpiresDays\`|The number of days before an OXXO payment expires. Only applicable if you plan to use OXXO as a payment method.|No|\`3\`|
|\`paymentMethodConfiguration\`|A string indicating the ID of a Stripe |No|-|

***

## Enable Stripe Providers in a Region

Before customers can use Stripe to complete their purchases, you must enable the Stripe payment provider(s) in the region where you want to offer this payment method.

Refer to the [user guide](https://docs.medusajs.com/user-guide/settings/regions#edit-region-details) to learn how to edit a region and enable the Stripe payment provider.

***

## Stripe Payment Provider IDs

When you register the Stripe Module Provider, it registers different providers, such as basic Stripe payment, Bancontact, and more.

Each provider is registered and referenced by a unique ID made up of the format `pp_{identifier}_{id}`, where:

- `{identifier}` is the ID of the payment provider as defined in the Stripe Module Provider.
- `{id}` is the ID of the Stripe Module Provider as set in the `medusa-config.ts` file. For example, `stripe`.

Assuming you set the ID of the Stripe Module Provider to `stripe` in `medusa-config.ts`, the Medusa application will register the following payment providers:

|Provider Name|Provider ID|
|---|---|---|
|Basic Stripe Payment|\`pp\_stripe\_stripe\`|
|Bancontact Payments|\`pp\_stripe-bancontact\_stripe\`|
|BLIK Payments|\`pp\_stripe-blik\_stripe\`|
|giropay Payments|\`pp\_stripe-giropay\_stripe\`|
|iDEAL Payments|\`pp\_stripe-ideal\_stripe\`|
|Przelewy24 Payments|\`pp\_stripe-przelewy24\_stripe\`|
|PromptPay Payments|\`pp\_stripe-promptpay\_stripe\`|
|OXXO Payments (Available since |\`pp\_stripe-oxxo\_stripe\`|

***

## Setup Stripe Webhooks

For production applications, you must set up webhooks in Stripe that inform Medusa of changes and updates to payments. Refer to [Stripe's documentation](https://docs.stripe.com/webhooks#add-a-webhook-endpoint) on how to setup webhooks.

### Webhook URL

Medusa has a `{server_url}/hooks/payment/{provider_id}` API route that you can use to register webhooks in Stripe, where:

- `{server_url}` is the URL to your deployed Medusa application in server mode.
- `{provider_id}` is the ID of the provider as explained in the [Stripe Payment Provider IDs](#stripe-payment-provider-ids) section, without the `pp_` prefix.

The Stripe Module Provider supports the following payment types, and the webhook endpoint URL is different for each:

|Stripe Payment Type|Webhook Endpoint URL|
|---|---|---|
|Basic Stripe Payment|\`\{server\_url}/hooks/payment/stripe\_stripe\`|
|Bancontact Payments|\`\{server\_url}/hooks/payment/stripe-bancontact\_stripe\`|
|BLIK Payments|\`\{server\_url}/hooks/payment/stripe-blik\_stripe\`|
|giropay Payments|\`\{server\_url}/hooks/payment/stripe-giropay\_stripe\`|
|iDEAL Payments|\`\{server\_url}/hooks/payment/stripe-ideal\_stripe\`|
|Przelewy24 Payments|\`\{server\_url}/hooks/payment/stripe-przelewy24\_stripe\`|
|PromptPay Payments|\`\{server\_url}/hooks/payment/stripe-promptpay\_stripe\`|
|OXXO Payments (Available since |\`\{server\_url}/hooks/payment/stripe-oxxo\_stripe\`|

### Webhook Events

When you set up the webhook in Stripe, choose the following events to listen to:

- `payment_intent.amount_capturable_updated`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `payment_intent.partially_funded` (Since [v2.8.5](https://github.com/medusajs/medusa/releases/tag/v2.8.5))

***

## Useful Guides

- [Storefront guide: Add Stripe payment method during checkout](https://docs.medusajs.com/resources/storefront-development/checkout/payment/stripe).
- [Integrate in Next.js Starter](https://docs.medusajs.com/resources/nextjs-starter#stripe-integration).
- [Customize Stripe Integration in Next.js Starter](https://docs.medusajs.com/resources/nextjs-starter/guides/customize-stripe).
- [Add Saved Payment Methods with Stripe](https://docs.medusajs.com/resources/how-to-tutorials/tutorials/saved-payment-methods).
