# Button

A component for rendering buttons using Medusa's design system.

In this guide, you'll learn how to use the Button component.

```tsx
import { Button } from "@medusajs/ui"

export default function ButtonDemo() {
  return <Button>Button</Button>
}

```

***

## Usage

```tsx
import { Button } from "@medusajs/ui"
```

```tsx
<Button>Button</Button>
```

***

## API Reference

### Button Props

This component is based on the \`button\` element and supports all of its props

- isLoading: (boolean) Whether to show a loading spinner. Default: false
- asChild: (boolean) Whether to remove the wrapper \`button\` element and use the
  passed child element instead. Default: false
- variant: (union) The button's style. Default: "primary"
- size: (union) The button's size. Default: "base"

***

## Examples

### Button Variants

```tsx
import { Button } from "@medusajs/ui"

export default function ButtonAllVariants() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="transparent">Transparent</Button>
      <Button variant="danger">Danger</Button>
    </div>
  )
}

```

### Button Sizes

```tsx
import { Button } from "@medusajs/ui"

export default function ButtonAllSizes() {
  return (
    <div className="flex gap-4 items-center">
      <Button size="small">Small</Button>
      <Button size="base">Base</Button>
      <Button size="large">Large</Button>
      <Button size="xlarge">XLarge</Button>
    </div>
  )
}

```

### Button Loading State

```tsx
import { Button } from "@medusajs/ui"

export default function ButtonLoading() {
  return <Button isLoading={true}>Button</Button>
}

```

### Button with Icon

```tsx
import { PlusMini } from "@medusajs/icons"
import { Button } from "@medusajs/ui"

export default function ButtonWithIcon() {
  return (
    <Button>
      Button <PlusMini />
    </Button>
  )
}

```

### Button as Link

```tsx
import { Button } from "@medusajs/ui"

export default function ButtonAsLink() {
  return (
    <Button asChild>
      <a href="https://medusajs.com" target="_blank" rel="noopener noreferrer">
        Open Medusa Website
      </a>
    </Button>
  )
}

```
