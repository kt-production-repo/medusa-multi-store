# Progress Accordion

A component that renders a set of expandable content, specifically designed for implementing multi-step tasks.

In this guide, you'll learn how to use the Progress Accordion component.

```tsx
import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionDemo() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}

```

## Usage

```tsx
import { ProgressAccordion } from "@medusajs/ui"
```

```tsx
<ProgressAccordion type="single">
  <ProgressAccordion.Item value="general">
    <ProgressAccordion.Header>
      General
    </ProgressAccordion.Header>
    <ProgressAccordion.Content>
       {/* Content */}
    </ProgressAccordion.Content>
  </ProgressAccordion.Item>
  <ProgressAccordion.Item value="shipping">
    <ProgressAccordion.Header>
      Shipping
    </ProgressAccordion.Header>
    <ProgressAccordion.Content>
        {/* Content */}
    </ProgressAccordion.Content>
  </ProgressAccordion.Item>
</ProgressAccordion>
```

***

## API Reference

### ProgressAccordion Props

This component is based on the \[Radix UI Accordion]\(https://radix-ui.com/primitives/docs/components/accordion) primitves.



### ProgressAccordion.Header Props

- status: (union) The current status. Default: "not-started"

***

## Examples

### Only One Accordion Open

```tsx
import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionSingle() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}

```

### Allow Multiple Accordions to Open

```tsx
import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionSingle() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="multiple">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                ornare, tortor nec commodo ultrices, diam leo porttitor eros,
                eget ultricies mauris nisl nec nisl. Donec quis magna euismod,
                lacinia ipsum id, varius velit.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}

```

### Set Status Indicator

```tsx
import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionStatus() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header status="not-started">
            General
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step has not started yet.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header status="in-progress">
            Shipping
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is in progress.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="payment">
          <ProgressAccordion.Header status="completed">
            Payment
          </ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is completed.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}

```

### Controlled Accordion Open State

```tsx
import { ProgressAccordion, Text, Button } from "@medusajs/ui"
import * as React from "react"

export default function ProgressAccordionControlled() {
  const [open, setOpen] = React.useState<string>("general")
  const steps = ["general", "shipping", "payment"]
  const currentIndex = steps.indexOf(open)

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      setOpen(steps[currentIndex + 1])
    }
  }
  const handlePrev = () => {
    if (currentIndex > 0) {
      setOpen(steps[currentIndex - 1])
    }
  }

  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <ProgressAccordion type="single" value={open} onValueChange={setOpen}>
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the General step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping">
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the Shipping step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="payment">
          <ProgressAccordion.Header>Payment</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6 flex flex-col gap-2">
              <Text size="small">This is the Payment step.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
      <div className="mt-4 flex gap-2 self-end">
        <Button
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Prev
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

```

### Disabled Accordion Item

```tsx
import { ProgressAccordion, Text } from "@medusajs/ui"

export default function ProgressAccordionDisabled() {
  return (
    <div className="w-full px-4">
      <ProgressAccordion type="single">
        <ProgressAccordion.Item value="general">
          <ProgressAccordion.Header>General</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">This step is enabled.</Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
        <ProgressAccordion.Item value="shipping" disabled>
          <ProgressAccordion.Header>Shipping</ProgressAccordion.Header>
          <ProgressAccordion.Content>
            <div className="pb-6">
              <Text size="small">
                This step is disabled and cannot be opened.
              </Text>
            </div>
          </ProgressAccordion.Content>
        </ProgressAccordion.Item>
      </ProgressAccordion>
    </div>
  )
}

```
