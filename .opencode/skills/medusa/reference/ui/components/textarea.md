# Textarea

A component that displays a textarea field using Medusa's design system.

In this guide, you'll learn how to use the Textarea component.

```tsx
import { Textarea } from "@medusajs/ui"

export default function TextAreaDemo() {
  return <Textarea placeholder="Product description ..." />
}

```

## Usage

```tsx
import { Textarea } from "@medusajs/ui"
```

```tsx
<Textarea />
```

***

## API Reference

### Textarea Props

This component is based on the \`textarea\` element and supports all of its props



***

## Examples

### Controlled Textarea

```tsx
import { useState } from "react"
import { Textarea } from "@medusajs/ui"

export default function TextareaControlled() {
  const [value, setValue] = useState("")
  return (
    <div className="flex flex-col gap-y-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write your feedback..."
        aria-label="Feedback"
      />
      <div className="text-ui-fg-muted txt-compact-small">
        {value.length} characters
      </div>
    </div>
  )
}

```

### Disabled Textarea

```tsx
import { Textarea } from "@medusajs/ui"

export default function TextareaDisabled() {
  return (
    <Textarea
      disabled
      placeholder="Disabled textarea"
      aria-label="Disabled textarea"
    />
  )
}

```
