# Copy

A component that wraps content in a button with copy functionality. It is useful for quickly copying text to the clipboard, such as code snippets or configuration commands.

In this guide, you'll learn how to use the Copy component.

```tsx
import { Copy } from "@medusajs/ui"

export default function CopyDemo() {
  return <Copy content="yarn add @medusajs/ui" />
}

```

## Usage

```tsx
import { Copy } from "@medusajs/ui"
```

```tsx
<Copy content="yarn add @medusajs/ui" />
```

***

## API Reference

### Copy Props

This component is based on the \`button\` element and supports all of its props

- content: (string) The content to copy.
- variant: (union) The variant of the copy button. Default: "default"
- asChild: (boolean) Whether to remove the wrapper \`button\` element and use the
  passed child element instead. Default: false

***

## Usage Outside Medusa Admin

If you're using the `Copy` component in a project other than the Medusa Admin, make sure to include the `TooltipProvider` somewhere up in your component tree, as the `Copy` component uses a [Tooltip](https://docs.medusajs.com/ui/components/tooltip#usage-outside-medusa-admin):

```tsx
<TooltipProvider>
  <Copy content="yarn add @medusajs/ui" />
</TooltipProvider>
```

***

## Examples

### Copy with Custom Display

```tsx
import { Code, Copy } from "@medusajs/ui"

export default function CopyDemo() {
  return (
    <Copy content="yarn add @medusajs/ui">
      <Code>yarn add @medusajs/ui</Code>
    </Copy>
  )
}

```

### Copy Display As Child

Using the `asChild` prop, you can render the `<Copy/>` as its child. This is useful if you want to render a custom button, to prevent rendering a button inside a button.

```tsx
import { PlusMini } from "@medusajs/icons"
import { Copy, IconButton, Text } from "@medusajs/ui"

export default function CopyAsChild() {
  return (
    <div className="flex items-center gap-x-2">
      <Text>Copy command</Text>
      <Copy content="yarn add @medusajs/ui" asChild>
        <IconButton>
          <PlusMini />
        </IconButton>
      </Copy>
    </div>
  )
}

```
