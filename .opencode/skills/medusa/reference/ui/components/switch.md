# Switch

A component for toggling between two states, typically on and off. It's essentially a checkbox in the form of a switch.

In this guide, you'll learn how to use the Switch component.

```tsx
import { Label, Switch } from "@medusajs/ui"

export default function SwitchDemo() {
  return (
    <div className="flex items-center gap-x-2">
      <Switch id="manage-inventory" />
      <Label htmlFor="manage-inventory">Manage Inventory</Label>
    </div>
  )
}

```

## Usage

```tsx
import { Switch } from "@medusajs/ui"
```

```tsx
<Switch />
```

***

## API Reference

### Switch Props

This component is based on the \[Radix UI Switch]\(https://www.radix-ui.com/primitives/docs/components/switch) primitive.

- size: (union) The switch's size. Default: "base"

***

## Examples

### Switch Sizes

```tsx
import { Label, Switch } from "@medusajs/ui"

export default function SwitchAllSizes() {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <Switch id="switch-small" size="small" />
        <Label htmlFor="switch-small" size="small">
          Small switch
        </Label>
      </div>
      <div className="flex items-center gap-x-2">
        <Switch id="switch-base" size="base" />
        <Label htmlFor="switch-base" size="base">
          Base switch
        </Label>
      </div>
    </div>
  )
}

```

### Controlled Switch

```tsx
import { useState } from "react"
import { Label, Switch } from "@medusajs/ui"

export default function SwitchControlled() {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-x-2">
        <Switch
          id="manage-inventory-controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="manage-inventory-controlled">Manage Inventory</Label>
      </div>
      <div className="txt-small text-ui-fg-muted">
        {checked
          ? "You are managing inventory"
          : "You are not managing inventory"}
      </div>
    </div>
  )
}

```

### Disabled Switch

```tsx
import { Label, Switch } from "@medusajs/ui"

export default function SwitchDisabled() {
  return (
    <div className="flex items-center gap-x-2">
      <Switch id="manage-inventory-disabled" disabled={true} />
      <Label htmlFor="manage-inventory-disabled">Manage Inventory</Label>
    </div>
  )
}

```
