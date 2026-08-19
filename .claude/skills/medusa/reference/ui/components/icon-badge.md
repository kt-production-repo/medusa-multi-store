# Icon Badge

A component that displays an icon in a badge.

In this guide, you'll learn how to use the Icon Badge component.

```tsx
import { BuildingTax } from "@medusajs/icons"
import { IconBadge } from "@medusajs/ui"

export default function IconBadgeDemo() {
  return (
    <IconBadge>
      <BuildingTax />
    </IconBadge>
  )
}

```

## Usage

```tsx
import { IconBadge } from "@medusajs/ui"
import { BuildingTax } from "@medusajs/icons"
```

```tsx
<IconBadge>
  <BuildingTax />
</IconBadge>
```

***

## API Reference

### IconBadge Props

This component is based on the \`span\` element and supports all of its props

- asChild: (boolean) Whether to remove the wrapper \`span\` element and use the
  passed child element instead. Default: false
- color: (union) The badge's color. Default: "grey"
- size: (union) The badge's size. Default: "base"

***

## Examples

### Colors

```tsx
import { IconBadge } from "@medusajs/ui"
import { BuildingTax } from "@medusajs/icons"

export default function IconBadgeAllColors() {
  return (
    <div className="flex gap-3">
      <IconBadge color="grey">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="purple">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="orange">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="red">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="blue">
        <BuildingTax />
      </IconBadge>
      <IconBadge color="green">
        <BuildingTax />
      </IconBadge>
    </div>
  )
}

```

### Sizes

```tsx
import { IconBadge } from "@medusajs/ui"
import { BuildingTax } from "@medusajs/icons"

export default function IconBadgeAllSizes() {
  return (
    <div className="flex gap-3 items-center">
      <IconBadge size="base">
        <BuildingTax />
      </IconBadge>
      <IconBadge size="large">
        <BuildingTax />
      </IconBadge>
    </div>
  )
}

```
