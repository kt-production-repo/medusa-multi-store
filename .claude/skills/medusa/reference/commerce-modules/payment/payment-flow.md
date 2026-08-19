# Accept Payment in Checkout Flow

In this guide, you'll learn how to implement it using workflows or the Payment Module.

## Why Implement the Payment Flow?

Medusa already provides a built-in payment flow that allows you to accept payments from customers, which you can learn about in the [Accept Payment Flow in Checkout](https://docs.medusajs.com/resources/commerce-modules/payment/payment-checkout-flow) guide.

You may need to implement a custom payment flow if you have a different use case, or you're using the Payment Module separately from the Medusa application.

This guide will help you understand how to implement a payment flow using the Payment Module's main service or workflows.

You can also follow this guide to get a general understanding of how the payment flow works in the Medusa application.

***

## How to Implement the Accept Payment Flow?

For a guide on how to implement this flow in the storefront, check out [this guide](https://docs.medusajs.com/resources/storefront-development/checkout/payment).

It's highly recommended to use Medusa's workflows to implement this flow. Use the Payment Module's main service for more complex cases.

### 1. Create a Payment Collection

A payment collection holds all details related to a resource’s payment operations. So, you start off by creating a payment collection.

In the Medusa application, you associate the payment collection with a cart, which is the resource that the customer is trying to pay for.

For example:

### Using Workflow

```ts
import { createPaymentCollectionForCartWorkflow } from "@medusajs/medusa/core-flows"

// ...

await createPaymentCollectionForCartWorkflow(container)
  .run({
    input: {
      cart_id: "cart_123",
    },
  })
```

### Using Service

```ts
const paymentCollection =
  await paymentModuleService.createPaymentCollections({
    currency_code: "usd",
    amount: 5000,
  })
```

### 2. Show Payment Providers

Next, you'll show the customer the available payment providers to choose from.

In the Medusa application, you need to use [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query) to retrieve the available payment providers in a region.

### Using Query

```ts
const query = container.resolve("query")

const { data: regionPaymentProviders } = await query.graph({
  entryPoint: "region_payment_provider",
  variables: {
    filters: {
      region_id: "reg_123",
    },
  },
  fields: ["payment_providers.*"],
})

const paymentProviders = regionPaymentProviders.map(
  (relation) => relation.payment_providers
)
```

### Using Service

```ts
const paymentProviders = await paymentModuleService.listPaymentProviders()
```

### 3. Create Payment Sessions

The payment collection has one or more payment sessions, each being a payment amount to be authorized by a payment provider.

So, once the customer selects a payment provider, create a payment session for the selected payment provider.

This will also initialize the payment session in the third-party payment provider.

For example:

### Using Workflow

```ts
import { createPaymentSessionsWorkflow } from "@medusajs/medusa/core-flows"

// ...

const { result: paymentSession } = await createPaymentSessionsWorkflow(container)
  .run({
    input: {
      payment_collection_id: "paycol_123",
      provider_id: "pp_stripe_stripe",
    },
  })
```

### Using Service

```ts
const paymentSession =
  await paymentModuleService.createPaymentSession(
    paymentCollection.id,
    {
      provider_id: "pp_stripe_stripe",
      currency_code: "usd",
      amount: 5000,
      data: {
        // any necessary data for the
        // payment provider
      },
    }
  )
```

### 4. Authorize Payment Session

Once the customer places the order, you need to authorize the payment session with the third-party payment provider.

For example:

### Using Step

```ts
import { authorizePaymentSessionStep } from "@medusajs/medusa/core-flows"

// ...

authorizePaymentSessionStep({
  id: "payses_123",
  context: {},
})
```

### Using Service

```ts
const payment = await paymentModuleService.authorizePaymentSession(
  "payses_123",
  {}
)
```

When the payment authorization is successful, a payment is created and returned.

#### Handling Deferred Authorization

Some payment methods (for example, bank transfers, payment links, or vouchers like OXXO or boleto) don't authorize immediately. For these methods, the payment provider returns a `pending_authorization` status instead of `authorized`.

When this happens:

- `authorizePaymentSession` returns `null` instead of a payment object.
- The payment session's `status` is updated to `pending_authorization`.
- The cart can still be completed and an order is created with an "awaiting" payment status.
- Medusa will re-attempt authorization automatically when it receives a webhook event from the payment provider confirming the payment.
- Admins can also manually trigger a re-check from the order details page in the Medusa Admin.

Support for `pending_authorization` is available since Medusa [v2.17.2](https://github.com/medusajs/medusa/releases/tag/v2.17.2).

#### Handling Additional Action

If you used the `authorizePaymentSessionStep`, you don't need to implement this logic as it's implemented in the step.

If the payment authorization isn't successful, whether because it requires additional action or for another reason, the method updates the payment session with the new status and throws an error.

In that case, you can catch that error and, if the session's `status` property is `requires_more`, handle the additional action, then retry the authorization.

For example:

```ts
try {
  const payment =
    await paymentModuleService.authorizePaymentSession(
      paymentSession.id,
      {}
    )
} catch (e) {
  // retrieve the payment session again
  const updatedPaymentSession = (
    await paymentModuleService.listPaymentSessions({
      id: [paymentSession.id],
    })
  )[0]

  if (updatedPaymentSession.status === "requires_more") {
    // TODO perform required action
    // TODO authorize payment again.
  }
}
```

### 5. Payment Flow Complete

The payment flow is complete once the payment session is authorized and the payment is created.

You can then:

- Complete the cart using the [completeCartWorkflow](https://docs.medusajs.com/references/medusa-workflows/completeCartWorkflow) if you're using the Medusa application.
- Capture the payment either using the [capturePaymentWorkflow](https://docs.medusajs.com/references/medusa-workflows/capturePaymentWorkflow) or [capturePayment method](https://docs.medusajs.com/references/payment/capturePayment).
- Refund captured amounts using the [refundPaymentsWorkflow](https://docs.medusajs.com/references/medusa-workflows/refundPaymentsWorkflow) or [refundPayment method](https://docs.medusajs.com/references/payment/refundPayment).

Some payment providers allow capturing the payment automatically once it's authorized. In that case, you don't need to do it manually.

### Capture Payments

To capture a payment, use the `capturePaymentWorkflow` or the Payment Module's `capturePayment` method.

If you pass an `amount`, it must be greater than 0. If you omit the `amount`, Medusa captures the full payment amount.

Before [Medusa v2.18.0](https://github.com/medusajs/medusa/releases/tag/v2.18.0), passing `0` as the capture amount was treated as if no amount was provided, defaulting to the full payment amount. Now, passing `0` or a negative number throws an error.

***

### Refund Payments

If you need to refund a payment, use the `refundPaymentsWorkflow`.

If you pass an `amount`, it must be greater than 0. If you omit the `amount`, Medusa refunds the full payment amount.

Before [Medusa v2.18.0](https://github.com/medusajs/medusa/releases/tag/v2.18.0), passing `0` as the refund amount was treated as if no amount was provided, defaulting to the full payment amount. Now, passing `0` or a negative number throws an error.

For example:

### Using Workflow

```ts
import { refundPaymentsWorkflow } from "@medusajs/medusa/core-flows"

// ...

await refundPaymentsWorkflow(container)
  .run({
    input: [
      {
        payment_id: "pay_123",
        amount: 1000, // refund amount
        note: "Customer requested refund", // optional note
        metadata: { // optional custom data
          reason: "damaged_goods",
          return_id: "ret_456",
        },
      },
    ],
  })
```

### Using Service

```ts
const refund = await paymentModuleService.refundPayment({
  payment_id: "pay_123",
  amount: 1000,
  refund_reason_id: "rr_123",
  note: "Customer requested refund",
  metadata: {
    reason: "damaged_goods",
    return_id: "ret_456",
  },
})
```

The `metadata` property is available since Medusa [v2.15.0](https://github.com/medusajs/medusa/releases/tag/v2.15.0).
