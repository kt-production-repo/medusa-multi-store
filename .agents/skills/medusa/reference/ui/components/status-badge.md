# Status Badge

A component that displays the status of an item in a badge style. It's useful to indicate states like "Active", "Published", or "Draft".

In this guide, you'll learn how to use the Status Badge component.

```tsx
import { StatusBadge } from "@medusajs/ui"

export default function StatusBadgeDemo() {
  return <StatusBadge>Draft</StatusBadge>
}

```

## Usage

```tsx
import { StatusBadge } from "@medusajs/ui"
```

```tsx
<StatusBadge color="green">Active</StatusBadge>
```

***

## API Reference

### StatusBadge Props

This component is based on the span element and supports all of its props

- color: (union) The status's color. Default: "grey"

***

## Examples

### Status Badge Colors

```tsx
import { StatusBadge } from "@medusajs/ui"

export default function StatusBadgeAllColors() {
  return (
    <div className="flex flex-wrap gap-2">
      <StatusBadge color="green">Active</StatusBadge>
      <StatusBadge color="red">Error</StatusBadge>
      <StatusBadge color="orange">Pending</StatusBadge>
      <StatusBadge color="blue">Info</StatusBadge>
      <StatusBadge color="purple">Archived</StatusBadge>
      <StatusBadge color="grey">Draft</StatusBadge>
    </div>
  )
}

```
