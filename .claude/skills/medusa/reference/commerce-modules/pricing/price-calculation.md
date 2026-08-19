# Prices Calculation

In this guide, you'll learn how prices are calculated when you use the [calculatePrices method](https://docs.medusajs.com/references/pricing/calculatePrices) of the Pricing Module's main service.

## calculatePrices Method

The [calculatePrices method](https://docs.medusajs.com/references/pricing/calculatePrices) accepts the ID of one or more price sets and a context as parameters.

It returns a price object with the best-matching price for each price set.

The `calculatePrices` method is useful for retrieving the prices of a product variant or a shipping option that matches a specific context, such as a currency code, in your backend customizations.

### Calculation Context

The calculation context is an optional object passed as the second parameter to the `calculatePrices` method. It accepts rules as key-value pairs to restrict the selected prices in the price set.

For example:

```ts
const price = await pricingModuleService.calculatePrices(
  { id: [priceSetId] },
  {
    context: {
      currency_code: "eur",
      region_id: "reg_123",
    },
  }
)
```

In this example, you retrieve the prices in a price set for the specified currency code and region ID.

### Returned Price Object

For each price set, the `calculatePrices` method selects two prices:

- A calculated price: Either a price that belongs to a price list and best matches the specified context, or the same as the original price.
- An original price, which is either:
  - The same price as the calculated price if it belongs to a price list of type `override`;
  - Otherwise, a price that doesn't belong to a price list and [best matches](#original-price-selection-logic) the specified context.

Both prices are returned in an object with the following properties:

- id: (\`string\`) The ID of the price set from which the price was selected.
- is\_calculated\_price\_price\_list: (\`boolean\`) Whether the calculated price belongs to a price list.
- calculated\_amount: (\`number\`) The amount of the calculated price, or \`null\` if there isn't a calculated price. This is the amount shown to the customer.
- is\_original\_price\_price\_list: (\`boolean\`) Whether the original price belongs to a price list.
- original\_amount: (\`number\`) The amount of the original price, or \`null\` if there isn't an original price. This amount is useful for comparing with the \`calculated\_amount\`, such as to check for a discounted value. It's \`null\` when the price set has no default price and only prices from price lists of type \`sale\` match the context.
- currency\_code: (\`string\`) The currency code of the calculated price, or \`null\` if there isn't a calculated price.
- is\_calculated\_price\_tax\_inclusive: (\`boolean\`) Whether the calculated price is tax inclusive. Learn more about tax inclusivity in \[this document]\(../tax-inclusive-pricing/page.mdx)
- is\_original\_price\_tax\_inclusive: (\`boolean\`) Whether the original price is tax inclusive. Learn more about tax inclusivity in \[this document]\(../tax-inclusive-pricing/page.mdx)
- calculated\_price: (\`object\`) The calculated price's price details.

  - id: (\`string\`) The ID of the price.

  - price\_list\_id: (\`string\`) The ID of the associated price list.

  - price\_list\_type: (\`string\`) The price list's type. For example, \`sale\`.

  - min\_quantity: (\`number\`) The price's minimum quantity condition.

  - max\_quantity: (\`number\`) The price's maximum quantity condition.
- original\_price: (\`object\`) The original price's price details.

  - id: (\`string\`) The ID of the price.

  - price\_list\_id: (\`string\`) The ID of the associated price list.

  - price\_list\_type: (\`string\`) The price list's type. For example, \`sale\`.

  - min\_quantity: (\`number\`) The price's minimum quantity condition.

  - max\_quantity: (\`number\`) The price's maximum quantity condition.

### Original Price Selection Logic

When the calculated price isn't from a price list of type `override`, the original price is selected based on the following logic:

![Diagram illustrating the original price selection logic](https://res.cloudinary.com/dza7lstvk/image/upload/v1757058523/Medusa%20Resources/original-price-calculation_sxjw3l.jpg)

1. If the context doesn't have any rules, select the default price (the price without any rules).
2. If the context has rules and there's a price that matches all the rules, select that price.
3. If the context has rules and there's no price that matches all the rules:
   - Find all the prices whose rules match at least one rule in the context.
   - Sort the matched prices by the number of matched rules in descending order.
   - Select the first price in the sorted list (the one that matches the most rules).

Prices from price lists of type `sale` are never selected as the original price, since the original price represents the customer's reference (non-sale) price.

### When the Original Price is Null

The `original_amount` and `original_price` are `null` when the calculation finds no original price. This happens when both of the following are true:

- The price set has no default price (a price that doesn't belong to a price list) matching the context.
- Only prices from price lists of type `sale` match the context. If a price from a price list of type `override` matches, it's used as the original price instead.

In this case, the `calculated_amount` still holds the matching sale price, but there's no reference price to compare it against.

***

## Examples

Consider the following price set, which has a default price, prices with rules, and tiered pricing:

```ts
const priceSet = await pricingModuleService.createPriceSets({
  prices: [
    // default price
    {
      amount: 5,
      currency_code: "eur",
      rules: {},
    },
    // prices with rules
    {
      amount: 4,
      currency_code: "eur",
      rules: {
        region_id: "reg_123",
      },
    },
    {
      amount: 4.5,
      currency_code: "eur",
      rules: {
        city: "krakow",
      },
    },
    {
      amount: 3.5,
      currency_code: "eur",
      rules: {
        city: "warsaw",
        region_id: "reg_123",
      },
    },
    // tiered price
    {
      amount: 2,
      currency_code: "eur",
      min_quantity: 100,
    },
  ],
})
```

### Default Price Selection

### Code

```ts
const price = await pricingModuleService.calculatePrices(
  { id: [priceSet.id] },
  {
    context: {
      currency_code: "eur"
    }
  }
)
```

### Result

### Calculate Prices with Exact Match

### Code

```ts
const price = await pricingModuleService.calculatePrices(
  { id: [priceSet.id] },
  {
    context: {
      currency_code: "eur",
      region_id: "reg_123",
      city: "warsaw"
    }
  }
)
```

### Result

### Calculate Prices with Partial Match

### Code

```ts
const price = await pricingModuleService.calculatePrices(
  { id: [priceSet.id] },
  {
    context: {
      currency_code: "eur",
      region_id: "reg_123",
      city: "krakow"
    }
  }
)
```

### Result

### Tiered Pricing Selection

### Code

```ts
const price = await pricingModuleService.calculatePrices(
  { id: [priceSet.id] },
  {
    context: {
      cart: {
        items: [
          {
            id: "item_1",
            quantity: 150,
            // assuming the price set belongs to this variant
            variant_id: "variant_1",
            // ...
          }
        ],
        // ...
      }
    }
  }
)
```

### Result

### Price Selection with Price List

### Code

```ts
const priceList = pricingModuleService.createPriceLists([{
  title: "Summer Price List",
  description: "Price list for summer sale",
  starts_at: Date.parse("01/10/2023").toString(),
  ends_at: Date.parse("31/10/2023").toString(),
  rules: {
    region_id: ['region_123', 'region_456'],
  },
  type: "sale",
  prices: [
    {
      amount: 2,
      currency_code: "eur",
      price_set_id: priceSet.id,
    },
    {
      amount: 1.5,
      currency_code: "usd",
      price_set_id: priceSet.id,
    }
  ],
}]);

const price = await pricingModuleService.calculatePrices(
  { id: [priceSet.id] },
  {
    context: {
      currency_code: "eur",
      region_id: "reg_123",
      city: "krakow"
    }
  }
)
```

### Result
