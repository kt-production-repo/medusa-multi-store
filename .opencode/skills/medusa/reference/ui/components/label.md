# Label

A component that renders an accessible label associated with input fields.

In this guide, you'll learn how to use the Label component.

```tsx
import { Label } from "@medusajs/ui"

export default function LabelDemo() {
  return <Label>Regular label</Label>
}

```

## Usage

```tsx
import { Label } from "@medusajs/ui"
```

```tsx
<Label>Label</Label>
```

***

## API Reference

### Label Props

This component is based on the \[Radix UI Label]\(https://www.radix-ui.com/primitives/docs/components/label) primitive.

- size: (union) The label's size. Default: "base"
- weight: (union) The label's font weight. Default: "regular"

***

## Examples

### Label Sizes

```tsx
import { Label } from "@medusajs/ui"

export default function LabelAllSizes() {
  return (
    <div className="flex gap-8 items-center">
      <div className="flex flex-col gap-1">
        <Label size="xsmall" weight="regular">
          XSmall - Regular
        </Label>
        <Label size="xsmall" weight="plus">
          XSmall - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="small" weight="regular">
          Small - Regular
        </Label>
        <Label size="small" weight="plus">
          Small - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="base" weight="regular">
          Base - Regular
        </Label>
        <Label size="base" weight="plus">
          Base - Plus
        </Label>
      </div>
      <div className="flex flex-col gap-1">
        <Label size="large" weight="regular">
          Large - Regular
        </Label>
        <Label size="large" weight="plus">
          Large - Plus
        </Label>
      </div>
    </div>
  )
}

```

### Label with Form Inputs

```tsx
import { Label, Input } from "@medusajs/ui"
import { Textarea, RadioGroup } from "@medusajs/ui"

export default function LabelWithInputs() {
  return (
    <form className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Label htmlFor="text-input">Text Input</Label>
        <Input id="text-input" placeholder="Enter text" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="checkbox-input">Checkbox</Label>
        <Input id="checkbox-input" type="checkbox" />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="textarea-input">Textarea</Label>
        <Textarea
          id="textarea-input"
          placeholder="Enter details"
          className="border rounded p-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Radio Group</Label>
        <RadioGroup defaultValue="option-1" className="flex gap-4">
          <div className="flex items-center gap-1">
            <RadioGroup.Item id="radio-1" value="option-1" />
            <Label htmlFor="radio-1">Option 1</Label>
          </div>
          <div className="flex items-center gap-1">
            <RadioGroup.Item id="radio-2" value="option-2" />
            <Label htmlFor="radio-2">Option 2</Label>
          </div>
        </RadioGroup>
      </div>
    </form>
  )
}

```
