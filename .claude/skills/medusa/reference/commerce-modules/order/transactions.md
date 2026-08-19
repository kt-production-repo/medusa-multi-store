# Transactions

In this guide, you’ll learn about order transactions, how to check an order’s outstanding amount, and how transactions relate to payments and refunds.

## What is a Transaction?

A transaction represents any order payment process, such as capturing or refunding an amount. It’s represented by the [OrderTransaction data model](https://docs.medusajs.com/references/order/models/OrderTransaction).

The transaction’s main purpose is to ensure a correct balance between paid and outstanding amounts.

Transactions are also associated with returns, claims, and exchanges when additional payment or refunds are required.

***

## Checking Outstanding Amount

The order’s total amounts are stored in the `OrderSummary`'s `totals` property, which is a JSON object holding the total details of the order.

```json
{
  "totals": {
    "total": 30,
    "subtotal": 30,
    // ...
  }
}
```

To check the outstanding amount of an order, the transaction amounts from the `Transaction` records are summed. Then, the following conditions are evaluated:

|Condition|Result|
|---|---|---|
|summary’s total - transaction amounts total = 0|There’s no outstanding amount.|
|summary’s total - transaction amounts total > 0|The customer owes additional payment to the merchant.|
|summary’s total - transaction amounts total \< 0|The merchant owes the customer a refund.|

***

## Transaction Reference

The Order Module doesn’t provide payment processing functionalities, so it doesn’t store payments that can be processed. Payment functionalities are provided by the [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment).

The `OrderTransaction` data model has two properties that determine which data model and record holds the actual payment’s details:

- `reference`: indicates the table’s name in the database. For example, `capture` from the [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment).
- `reference_id`: indicates the ID of the record in the table. For example, `capt_123`.

### Refund Transactions

When a refund is created for an order, an `OrderTransaction` record is created with its `reference` property set to `refund`. The `reference_id` property is set to the ID of the refund record in the [Payment Module](https://docs.medusajs.com/resources/commerce-modules/payment).

The transaction's `amount` for refunds will be a negative value, indicating that the merchant owes the customer a refund.

#### Example: Retrieve Order's Refunds

To retrieve an order's refunds, you can retrieve the order's transactions using [Query](https://docs.medusajs.com/docs/learn/fundamentals/module-links/query) and filter the transactions by their `reference` property.

For example:

```ts
const query = container.resolve("query") // or req.scope.resolve("query")

const { data: [order] } = await query.graph({
  entity: "order",
  fields: ["*", "transactions.*"],
  filters: {
    id: "order_123",
  },
})

const refundTransactions = order.transactions?.filter(
  (t) => t?.reference === "refund"
)

// calculate total refunded amount as a positive value
const totalRefunded = refundTransactions?.reduce((acc, t) => acc + Math.abs(t!.amount || 0), 0)
```
