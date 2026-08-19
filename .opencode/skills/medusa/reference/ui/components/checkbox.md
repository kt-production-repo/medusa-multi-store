# Checkbox

A component for rendering checkbox inputs using Medusa's design system.

In this guide, you'll learn how to use the Checkbox component.

```tsx
import { Checkbox, Label } from "@medusajs/ui"

export default function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="billing-shipping" />
      <Label htmlFor="billing-shipping">
        Billing address same as shipping address
      </Label>
    </div>
  )
}

```

## Usage

```tsx
import { Checkbox } from "@medusajs/ui"
```

```tsx
<Checkbox />
```

***

## API Reference

### Checkbox Props

This component is based on the \[Radix UI Checkbox]\(https://www.radix-ui.com/primitives/docs/components/checkbox) primitive.



***

## Examples

### Checkbox All States

```tsx
import { Checkbox, Label } from "@medusajs/ui"

export default function CheckboxAllStates() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-1">
        <Checkbox id="default" />
        <Label htmlFor="default">Default</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="checked" checked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-1">
        <Checkbox id="indeterminate" checked="indeterminate" />
        <Label htmlFor="indeterminate">Indeterminate</Label>
      </div>
    </div>
  )
}

```

### Controlled Checkbox

```tsx
import { Checkbox, CheckboxCheckedState, Label } from "@medusajs/ui"
import { useState } from "react"

export default function CheckboxControlled() {
  const [checked, setChecked] = useState<CheckboxCheckedState>(false)

  const handleToggle = () => {
    switch (checked) {
      case "indeterminate":
        setChecked(true)
        return
      case true:
        setChecked(false)
        return
      default:
        setChecked("indeterminate")
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <span className="txt-small text-center w-3/4">
        The following checkbox will move from unchecked, to indeterminate, and
        finally checked each time you click it
      </span>
      <div className="flex items-center gap-2">
        <Checkbox
          id="controlled-checkbox"
          checked={checked}
          onCheckedChange={handleToggle}
        />
        <Label htmlFor="controlled-checkbox">
          Controlled Checkbox: (
          {checked === "indeterminate"
            ? "Indeterminate"
            : checked
              ? "Checked"
              : "Unchecked"}
          )
        </Label>
      </div>
    </div>
  )
}

```
