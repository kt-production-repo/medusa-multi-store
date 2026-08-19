# Text

A component that displays text using the typography styles from Medusa's design system.

In this guide, you'll learn how to use the Text component.

```tsx
import { Text } from "@medusajs/ui"

export default function TextDemo() {
  return <Text>Text</Text>
}

```

## Usage

```tsx
import { Text } from "@medusajs/ui"
```

```tsx
<Text>Text</Text>
```

***

## API Reference

### Text Props

This component is based on the \`p\` element and supports all of its props

- asChild: (boolean) Whether to remove the wrapper \`button\` element and use the
  passed child element instead. Default: false
- as: (union) The wrapper element to use when \`asChild\` is disabled. Default: "p"
- size: (union) The text's size. Default: "base"
- weight: (union) The text's font weight. Default: "regular"
- family: (union) The text's font family. Default: "sans"
- leading: (union) The text's line height. Default: "normal"

***

## Examples

### Text Sizes

```tsx
import { Text } from "@medusajs/ui"

export default function TextSizes() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text size="base">Base size</Text>
      <Text size="large">Large size</Text>
      <Text size="xlarge">XLarge size</Text>
    </div>
  )
}

```

### Text Weights

```tsx
import { Text } from "@medusajs/ui"

export default function TextWeights() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text weight="regular">Regular weight</Text>
      <Text weight="plus">Plus weight</Text>
    </div>
  )
}

```

### Text Fonts

```tsx
import { Text } from "@medusajs/ui"

export default function TextFonts() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text family="sans">Sans font</Text>
      <Text family="mono">Mono font</Text>
    </div>
  )
}

```

### Text Leading

```tsx
import { Text } from "@medusajs/ui"

export default function TextLeading() {
  return (
    <div className="flex flex-col gap-y-2">
      <Text leading="normal">Normal leading</Text>
      <Text leading="compact">Compact leading</Text>
    </div>
  )
}

```
