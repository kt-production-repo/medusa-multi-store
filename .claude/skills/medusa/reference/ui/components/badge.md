# Badge

A component for displaying labels or indicators in a badge style.

In this guide, you'll learn how to use the Badge component.

```tsx
import { Badge } from "@medusajs/ui"

export default function BadgeDemo() {
  return <Badge>Badge</Badge>
}

```

## Usage

```tsx
import { Badge } from "@medusajs/ui"
```

```tsx
<Badge>Badge</Badge>
```

***

## API Reference

### Badge Props

This component is based on the \`div\` element and supports all of its props

- asChild: (boolean) Whether to remove the wrapper \`span\` element and use the
  passed child element instead. Default: false
- size: (union) The badge's size. Default: "base"
- rounded: (union) The style of the badge's border radius. Default: "base"
- color: (union) The badge's color. Default: "grey"

***

## Examples

### Badge Colors

```tsx
import { Badge } from "@medusajs/ui"

export default function BadgeAllColors() {
  return (
    <div className="flex gap-3">
      <Badge color="grey">Grey</Badge>
      <Badge color="red">Red</Badge>
      <Badge color="green">Green</Badge>
      <Badge color="blue">Blue</Badge>
      <Badge color="orange">Orange</Badge>
      <Badge color="purple">Purple</Badge>
    </div>
  )
}

```

### Badge Sizes

```tsx
import { Badge } from "@medusajs/ui"

export default function BadgeAllSizes() {
  return (
    <div className="flex gap-3 items-center">
      <Badge size="2xsmall">2xsmall</Badge>
      <Badge size="xsmall">xsmall</Badge>
      <Badge size="small">small</Badge>
      <Badge size="base">base</Badge>
      <Badge size="large">large</Badge>
    </div>
  )
}

```

### Badge Rounded Variants

```tsx
import { Badge } from "@medusajs/ui"

export default function BadgeAllRounded() {
  return (
    <div className="flex gap-3">
      <Badge rounded="base">Base Rounded</Badge>
      <Badge rounded="full">Full Rounded</Badge>
    </div>
  )
}

```
