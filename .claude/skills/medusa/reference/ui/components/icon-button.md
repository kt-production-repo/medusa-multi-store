# Icon Button

A component that displays an icon in a button.

In this guide, you'll learn how to use the Icon Button component.

```tsx
import { PlusMini } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

export default function IconButtonDemo() {
  return (
    <IconButton>
      <PlusMini />
    </IconButton>
  )
}

```

## Usage

```tsx
import { IconButton } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
```

```tsx
<IconButton>
  <Plus />
</IconButton>
```

***

## API Reference

### IconButton Props

This component is based on the \`button\` element and supports all of its props

- asChild: (boolean) Whether to remove the wrapper \`button\` element and use the
  passed child element instead. Default: false
- isLoading: (boolean) Whether to show a loading spinner. Default: false
- variant: (union) The button's style. Default: "primary"
- size: (union) The button's size. Default: "base"

***

## Examples

### Icon Button Variants

```tsx
import { IconButton } from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"

export default function IconButtonAllVariants() {
  return (
    <div className="flex gap-2">
      <IconButton variant="primary">
        <PlusMini />
      </IconButton>
      <IconButton variant="transparent">
        <PlusMini />
      </IconButton>
    </div>
  )
}

```

### Icon Button Sizes

```tsx
import { IconButton } from "@medusajs/ui"
import { PlusMini } from "@medusajs/icons"

export default function IconButtonAllSizes() {
  return (
    <div className="flex gap-2 items-center">
      <IconButton size="2xsmall">
        <PlusMini />
      </IconButton>
      <IconButton size="xsmall">
        <PlusMini />
      </IconButton>
      <IconButton size="small">
        <PlusMini />
      </IconButton>
      <IconButton size="base">
        <PlusMini />
      </IconButton>
      <IconButton size="large">
        <PlusMini />
      </IconButton>
      <IconButton size="xlarge">
        <PlusMini />
      </IconButton>
    </div>
  )
}

```

### Icon Button Loading State

```tsx
import { PlusMini } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

export default function IconButtonLoading() {
  return (
    <IconButton isLoading className="relative">
      <PlusMini />
    </IconButton>
  )
}

```

### Disabled Icon Button

```tsx
import { PlusMini } from "@medusajs/icons"
import { IconButton } from "@medusajs/ui"

export default function IconButtonDisabled() {
  return (
    <IconButton disabled>
      <PlusMini />
    </IconButton>
  )
}

```
