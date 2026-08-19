# Currency Input

A component for rendering form inputs for money amounts, showing the currency in the input.

In this guide, you'll learn how to use the Currency Input component.

```tsx
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputDemo() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput symbol="$" code="usd" />
    </div>
  )
}

```

## Usage

```tsx
import { CurrencyInput } from "@medusajs/ui"
```

```tsx
<CurrencyInput symbol="$" code="usd" />
```

***

## API Reference

### CurrencyInput Props

This component is based on the input element and supports all of its props

- symbol: (string) The symbol to show in the input.
- code: (string) The currency code to show in the input.
- size: (union) The input's size. Default: "base"
- disabled: (boolean) Whether the input is disabled.


  &#x20;Default: false
- onInvalid: (undefined) A function that is triggered when the input is invalid.

***

## Examples

### Controlled Currency Input

```tsx
import { useState } from "react"
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputControlled() {
  const [value, setValue] = useState<string | undefined>("")
  const formatValue = (val: string | undefined) => {
    if (!val) {
      return ""
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(val))
  }
  return (
    <div className="max-w-[250px]">
      <CurrencyInput
        symbol="$"
        code="usd"
        value={value}
        onValueChange={setValue}
        aria-label="Amount"
      />
      <div className="mt-2 text-xs text-ui-fg-muted">
        Value: {formatValue(value)}
      </div>
    </div>
  )
}

```

### Disabled Currency Input

```tsx
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputDisabled() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput
        symbol="€"
        code="eur"
        disabled
        value={"100"}
        aria-label="Amount"
      />
    </div>
  )
}

```

### Currency Input with Error State

```tsx
import { useState } from "react"
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputError() {
  const [value, setValue] = useState<string | undefined>("0")
  const [touched, setTouched] = useState(false)
  const isError = touched && (!value || parseFloat(value) <= 0)
  return (
    <div className="max-w-[250px]">
      <CurrencyInput
        symbol="$"
        code="usd"
        value={value}
        onValueChange={(val) => setValue(val)}
        aria-label="Amount"
        aria-invalid={isError}
        onBlur={() => setTouched(true)}
        min={0.01}
      />
      {isError && (
        <div className="mt-2 text-xs text-ui-fg-error">
          Amount must be greater than 0
        </div>
      )}
    </div>
  )
}

```

### Currency Input Sizes

#### Base

```tsx
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputBase() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput size="base" symbol="$" code="usd" />
    </div>
  )
}

```

#### Small

```tsx
import { CurrencyInput } from "@medusajs/ui"

export default function CurrencyInputSmall() {
  return (
    <div className="max-w-[250px]">
      <CurrencyInput size="small" symbol="$" code="usd" />
    </div>
  )
}

```
