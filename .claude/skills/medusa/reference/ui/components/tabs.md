# Tabs

A component that displays tabbed content.

In this guide, you'll learn how to use the Tabs component.

```tsx
import { Tabs, Text } from "@medusajs/ui"

export default function TabsDemo() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">
              At ACME, we&apos;re dedicated to providing you with an exceptional
              shopping experience. Our wide selection of products caters to your
              every need, from fashion to electronics and beyond. We take pride
              in our commitment to quality, customer satisfaction, and timely
              delivery. Our friendly customer support team is here to assist you
              with any inquiries or concerns you may have. Thank you for
              choosing ACME as your trusted online shopping destination.
            </Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">
              Shipping is a crucial part of our service, designed to ensure your
              products reach you quickly and securely. Our dedicated team works
              tirelessly to process orders, carefully package items, and
              coordinate with reliable carriers to deliver your purchases to
              your doorstep. We take pride in our efficient shipping process,
              guaranteeing your satisfaction with every delivery.
            </Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">
              Our payment process is designed to make your shopping experience
              smooth and secure. We offer a variety of payment options to
              accommodate your preferences, from credit and debit cards to
              online payment gateways. Rest assured that your financial
              information is protected through advanced encryption methods.
              Shopping with us means you can shop with confidence, knowing your
              payments are safe and hassle-free.
            </Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the left and right arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}

```

## Usage

```tsx
import { Tabs } from "@medusajs/ui"
```

```tsx
<Tabs>
  <Tabs.List>
    <Tabs.Trigger value="1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="2">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="3">Tab 3</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="1">Panel 1</Tabs.Content>
  <Tabs.Content value="2">Panel 2</Tabs.Content>
  <Tabs.Content value="3">Panel 3</Tabs.Content>
</Tabs>
```

***

## API Reference

### Tabs Props

This component is based on the \[Radix UI Tabs]\(https://radix-ui.com/primitives/docs/components/tabs) primitves

- activationMode: (union) Whether a tab is activated automatically or manually.
- defaultValue: (string) The value of the tab to select by default, if uncontrolled
- dir: (Direction) The direction of navigation between toolbar items.
- onValueChange: (signature) A function called when a new tab is selected
- orientation: (union) The orientation the tabs are layed out.
  Mainly so arrow navigation is done accordingly (left & right vs. up & down)
- value: (string) The value for the selected tab, if controlled

***

## Examples

### Controlled Tabs

```tsx
import { Tabs, Text } from "@medusajs/ui"
import { useState } from "react"

export default function TabsControlled() {
  const [value, setValue] = useState("general")
  return (
    <div className="w-full px-4 flex flex-col">
      <Tabs value={value} onValueChange={setValue}>
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab (controlled).</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab (controlled).</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab (controlled).</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the left and right arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}

```

### Tabs with a Disabled Tab

```tsx
import { Tabs, Text } from "@medusajs/ui"

export default function TabsDisabled() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping" disabled>
            Shipping (Disabled)
          </Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab.</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">
              This is the Shipping tab (should be disabled).
            </Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab.</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the left and right arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}

```

### Tabs with Icons

```tsx
import { Tabs, Text } from "@medusajs/ui"
import { TruckFast, CreditCard, InformationCircle } from "@medusajs/icons"

export default function TabsIcons() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Trigger value="general">
            <InformationCircle className="mr-1.5 h-4 w-4" /> General
          </Tabs.Trigger>
          <Tabs.Trigger value="shipping">
            <TruckFast className="mr-1.5 h-4 w-4" /> Shipping
          </Tabs.Trigger>
          <Tabs.Trigger value="payment">
            <CreditCard className="mr-1.5 h-4 w-4" /> Payment
          </Tabs.Trigger>
        </Tabs.List>
        <div className="mt-2">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab with an icon.</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab with an icon.</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab with an icon.</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the left and right arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}

```

### Vertical Tabs

The `orientation` prop doesn't change the layout of the tabs, but it allows you to navigate between the tabs using the up and down arrow keys. You'll need to manually style the tabs vertically.

```tsx
import { Tabs, Text } from "@medusajs/ui"

export default function TabsVertical() {
  return (
    <div className="w-full px-4 flex flex-col gap-4">
      <Tabs defaultValue="general" orientation="vertical" className="flex">
        <Tabs.List className="flex-col min-w-[120px] border-r border-ui-border-base">
          <Tabs.Trigger value="general">General</Tabs.Trigger>
          <Tabs.Trigger value="shipping">Shipping</Tabs.Trigger>
          <Tabs.Trigger value="payment">Payment</Tabs.Trigger>
        </Tabs.List>
        <div className="ml-6 flex-1">
          <Tabs.Content value="general">
            <Text size="small">This is the General tab (vertical).</Text>
          </Tabs.Content>
          <Tabs.Content value="shipping">
            <Text size="small">This is the Shipping tab (vertical).</Text>
          </Tabs.Content>
          <Tabs.Content value="payment">
            <Text size="small">This is the Payment tab (vertical).</Text>
          </Tabs.Content>
        </div>
      </Tabs>
      <Text size="xsmall" className="text-ui-fg-muted">
        Use the up and down arrow keys to navigate between the tabs. You must
        focus on a tab first.
      </Text>
    </div>
  )
}

```
