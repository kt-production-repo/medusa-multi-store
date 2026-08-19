# Input

A component that renders a form input field using Medusa's design system.

In this guide, you'll learn how to use the Input component.

```tsx
import { Input } from "@medusajs/ui"

export default function InputDemo() {
  return (
    <div className="w-[250px]">
      <Input placeholder="Sales Channel Name" id="sales-channel-name" />
    </div>
  )
}

```

## Usage

```tsx
import { Input } from "@medusajs/ui"
```

```tsx
<Input placeholder="Placeholder" id="input-id" />
```

***

## API Reference

### Input Props

This component is based on the \`input\` element and supports all of its props

- size: (union) The input's size. Default: "base"

***

## Examples

### Password

```tsx
import { Input } from "@medusajs/ui"

export default function InputPassword() {
  return (
    <div className="w-[250px]">
      <Input id="password" type="password" defaultValue="supersecret" />
    </div>
  )
}

```

### Search

```tsx
import { Input } from "@medusajs/ui"

export default function InputSearch() {
  return (
    <div className="w-[250px]">
      <Input placeholder="Search" id="search-input" type="search" />
    </div>
  )
}

```

### Disabled

```tsx
import { Input } from "@medusajs/ui"

export default function InputDisabled() {
  return (
    <div className="w-[250px]">
      <Input placeholder="Disabled" id="disabled-input" disabled />
    </div>
  )
}

```

### Small Size

```tsx
import { Input } from "@medusajs/ui"

export default function InputSmall() {
  return (
    <div className="w-[250px]">
      <Input placeholder="First name" id="first-name" size="small" />
    </div>
  )
}

```

### Controlled

```tsx
import { Input } from "@medusajs/ui"
import { useState } from "react"

export default function InputControlled() {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter name"
        id="controlled-input"
      />
      {value && <span>Hello, {value}!</span>}
    </div>
  )
}

```

### Error State

You can leverage the native `aria-invalid` property to show an error state on your input:

```tsx
import { Input } from "@medusajs/ui"

export default function InputError() {
  return (
    <div className="w-[250px]">
      <Input
        placeholder="Sales Channel Name"
        id="sales-channel-name"
        aria-invalid={true}
      />
    </div>
  )
}

```
