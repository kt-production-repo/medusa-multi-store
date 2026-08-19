# Tooltip

A component that displays a pop-up with additional information when hovering over or focusing on an element.

In this guide, you'll learn how to use the Tooltip component.

```tsx
import { InformationCircleSolid } from "@medusajs/icons"
import { Tooltip } from "@medusajs/ui"

export default function TooltipDemo() {
  return (
    <Tooltip content="The quick brown fox jumps over the lazy dog.">
      <InformationCircleSolid />
    </Tooltip>
  )
}

```

## Usage

```tsx
import { Tooltip } from "@medusajs/ui"
```

```tsx
<Tooltip content="Tooltip content">Trigger</Tooltip>
```

***

## API Reference

### Tooltip Props

This component is based on the \[Radix UI Tooltip]\(https://www.radix-ui.com/primitives/docs/components/tooltip) primitive.

- content: (ReactReactNode) The content to display in the tooltip.
- onClick: (ReactMouseEventHandler) A function that is triggered when the tooltip is clicked.
- side: (union) The side to position the tooltip.

  &#x20;Default: top
- maxWidth: (number) The maximum width of the tooltip. Default: 220
- sideOffset: (number) The distance in pixels between the tooltip and its trigger. Default: 8
- children: (undefined) The element to trigger the tooltip.
- open: (boolean) Whether the tooltip is currently open.
- defaultOpen: (boolean) Whether the tooltip is open by default.
- onOpenChange: (signature) A function that is called when the tooltip's open state changes.
- delayDuration: (number) The time in milliseconds to delay the tooltip's appearance.

***

## Usage Outside Medusa Admin with TooltipProvider

If you're using the `Tooltip` component in a project other than the Medusa Admin, make sure to include the `TooltipProvider` somewhere up in your component tree:

```tsx
<TooltipProvider>
  <Tooltip content="Tooltip content">Trigger</Tooltip>
</TooltipProvider>
```

### TooltipProvider Reference

### TooltipProvider Props

- delayDuration: (number) The duration from when the pointer enters the trigger until the tooltip gets opened. Default: 100
- skipDelayDuration: (number) How much time a user has to enter another trigger without incurring a delay again. Default: 300
- disableHoverableContent: (boolean) When \`true\`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.

***

## Examples

### Changing Tooltip Side

```tsx
import { Tooltip } from "@medusajs/ui"
import {
  ArrowLongDown,
  ArrowLongLeft,
  ArrowLongRight,
  ArrowLongUp,
} from "@medusajs/icons"

export default function TooltipSides() {
  return (
    <div className="flex gap-8 items-center justify-center">
      <Tooltip content="Top" side="top">
        <ArrowLongUp />
      </Tooltip>
      <Tooltip content="Bottom" side="bottom">
        <ArrowLongDown />
      </Tooltip>
      <Tooltip content="Left" side="left">
        <ArrowLongLeft />
      </Tooltip>
      <Tooltip content="Right" side="right">
        <ArrowLongRight />
      </Tooltip>
    </div>
  )
}

```

### Set Tooltip Max Width

```tsx
import { Tooltip } from "@medusajs/ui"
import { InformationCircleSolid } from "@medusajs/icons"

export default function TooltipMaxWidth() {
  return (
    <Tooltip
      content="This is a very long tooltip message that demonstrates how you can use the maxWidth prop to control the width of the tooltip."
      maxWidth={320}
      className="text-center"
    >
      <InformationCircleSolid />
    </Tooltip>
  )
}

```
