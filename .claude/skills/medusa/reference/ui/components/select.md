# Select

A component that displays a select form input using Medusa's design system.

In this guide, you'll learn how to use the Select component.

```tsx
import { Select } from "@medusajs/ui"

export default function SelectDemo() {
  return (
    <div className="w-[256px]">
      <Select>
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

```

## Usage

```tsx
import { Select } from "@medusajs/ui"
```

```tsx
<Select>
  <Select.Trigger>
    <Select.Value placeholder="Placeholder" />
  </Select.Trigger>
  <Select.Content>
    {items.map((item) => (
      <Select.Item key={item.value} value={item.value}>
        {item.label}
      </Select.Item>
    ))}
  </Select.Content>
</Select>
```

***

## API Reference

### Select Props

This component is based on \[Radix UI Select]\(https://www.radix-ui.com/primitives/docs/components/select).
It also accepts all props of the HTML \`select\` component.

- size: (union) The select's size. Default: "base"

### Select.Trigger Props

The trigger that toggles the select.
It's based on \[Radix UI Select Trigger]\(https://www.radix-ui.com/primitives/docs/components/select#trigger).



### Select.Value Props

Displays the selected value, or a placeholder if no value is selected.
It's based on \[Radix UI Select Value]\(https://www.radix-ui.com/primitives/docs/components/select#value).



### Select.Group Props

Groups multiple items together.



### Select.Label Props

Used to label a group of items.
It's based on \[Radix UI Select Label]\(https://www.radix-ui.com/primitives/docs/components/select#label).



### Select.Item Props

An item in the select. It's based on \[Radix UI Select Item]\(https://www.radix-ui.com/primitives/docs/components/select#item)
and accepts its props.



### Select.Content Props

The content that appears when the select is open.
It's based on \[Radix UI Select Content]\(https://www.radix-ui.com/primitives/docs/components/select#content).

- position: (union) Whether to show the select items below (\`popper\`) or over (\`item-aligned\`) the select input. Default: "popper"
- sideOffset: (number) The distance of the content pop-up in pixels from the select input. Only available when position is set to popper. Default: 8
- collisionPadding: (union) The distance in pixels from the boundary edges where collision detection should occur. Only available when position is set to popper. Default: 24

***

## Examples

### Small Select

```tsx
import { Select } from "@medusajs/ui"

export default function SelectSmall() {
  return (
    <div className="w-[256px]">
      <Select size="small">
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

```

### Select Item-Aligned Position

```tsx
import { Select } from "@medusajs/ui"

export default function SelectItemAligned() {
  return (
    <div className="w-[256px]">
      <Select>
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content position="item-aligned">
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

```

### Disabled Select

```tsx
import { Select } from "@medusajs/ui"

export default function SelectDemo() {
  return (
    <div className="w-[256px]">
      <Select disabled>
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

```

### Select with Grouped Items

```tsx
import { Select } from "@medusajs/ui"

export default function SelectDemo() {
  return (
    <div className="w-[256px]">
      <Select>
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {data.map((group) => (
            <Select.Group key={group.label}>
              <Select.Label>{group.label}</Select.Label>
              {group.items.map((item) => (
                <Select.Item key={item.value} value={item.value}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Group>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const data = [
  {
    label: "Shirts",
    items: [
      {
        value: "dress-shirt-solid",
        label: "Solid Dress Shirt",
      },
      {
        value: "dress-shirt-check",
        label: "Check Dress Shirt",
      },
    ],
  },
  {
    label: "T-Shirts",
    items: [
      {
        value: "v-neck",
        label: "V-Neck",
      },
      {
        value: "crew-neck",
        label: "Crew Neck",
      },
      {
        value: "henley",
        label: "Henley",
      },
    ],
  },
]

```

### Controlled Select

```tsx
import { Select } from "@medusajs/ui"
import * as React from "react"

export default function SelectDemo() {
  const [value, setValue] = React.useState<string | undefined>()

  return (
    <div className="w-[256px]">
      <Select onValueChange={setValue} value={value}>
        <Select.Trigger>
          <Select.Value placeholder="Select a currency" />
        </Select.Trigger>
        <Select.Content>
          {currencies.map((item) => (
            <Select.Item key={item.value} value={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

const currencies = [
  {
    value: "eur",
    label: "EUR",
  },
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "dkk",
    label: "DKK",
  },
]

```

### Empty Values

A `Select.Item` can't have an empty string as its `value` prop. If you do, you'll get the error `A <Select.Item /> must have a value prop that is not an empty string`. This is because the Select reserves the empty string to clear the selection and show the placeholder.

To add an option like `None`, use a non-empty placeholder value, then convert it in your change handler:

```tsx
<Select
  onValueChange={(value) =>
    handleChange(value === "none" ? null : value)
  }
>
  <Select.Trigger>
    <Select.Value placeholder="Placeholder" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="none">None</Select.Item>
    {items.map((item) => (
      <Select.Item key={item.value} value={item.value}>
        {item.label}
      </Select.Item>
    ))}
  </Select.Content>
</Select>
```
