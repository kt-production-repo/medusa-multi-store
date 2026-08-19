# Radio Group

A component that renders a group of radio buttons using Medusa's design system.

In this guide, you'll learn how to use the Radio Group component.

```tsx
import { Label, RadioGroup } from "@medusajs/ui"

export default function RadioGroupDemo() {
  return (
    <RadioGroup>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="1" id="radio_1" />
        <Label htmlFor="radio_1" weight="plus">
          Radio 1
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="2" id="radio_2" />
        <Label htmlFor="radio_2" weight="plus">
          Radio 2
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="3" id="radio_3" />
        <Label htmlFor="radio_3" weight="plus">
          Radio 3
        </Label>
      </div>
    </RadioGroup>
  )
}

```

## Usage

```tsx
import { RadioGroup } from "@medusajs/ui"
```

```tsx
<RadioGroup>
  <RadioGroup.Item value="1" id="radio_1" />
  <RadioGroup.Item value="2" id="radio_2" />
  <RadioGroup.Item value="3" id="radio_3" />
</RadioGroup>
```

***

## API Reference

### RadioGroup Props

This component is based on the \[Radix UI Radio Group]\(https://www.radix-ui.com/primitives/docs/components/radio-group) primitives.



***

## Examples

### Radio Group with Descriptions

```tsx
import { Label, RadioGroup, Text } from "@medusajs/ui"

export default function RadioGroupDescriptions() {
  return (
    <RadioGroup>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="1" id="radio_1_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_1_descriptions" weight="plus">
            Radio 1
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="2" id="radio_2_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_2_descriptions" weight="plus">
            Radio 2
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <RadioGroup.Item value="3" id="radio_3_descriptions" />
        <div className="flex flex-col gap-y-0.5">
          <Label htmlFor="radio_3_descriptions" weight="plus">
            Radio 3
          </Label>
          <Text className="text-ui-fg-subtle">
            The quick brown fox jumps over the lazy dog.
          </Text>
        </div>
      </div>
    </RadioGroup>
  )
}

```

### Controlled Radio Group

```tsx
import { Label, RadioGroup } from "@medusajs/ui"
import * as React from "react"

export default function RadioGroupControlled() {
  const [value, setValue] = React.useState("1")
  return (
    <div className="flex flex-col gap-2 items-center">
      <RadioGroup value={value} onValueChange={setValue}>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="1" id="radio_1_controlled" />
          <Label htmlFor="radio_1_controlled" weight="plus">
            Radio 1
          </Label>
        </div>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="2" id="radio_2_controlled" />
          <Label htmlFor="radio_2_controlled" weight="plus">
            Radio 2
          </Label>
        </div>
        <div className="flex items-center gap-x-3">
          <RadioGroup.Item value="3" id="radio_3_controlled" />
          <Label htmlFor="radio_3_controlled" weight="plus">
            Radio 3
          </Label>
        </div>
      </RadioGroup>
      <div className="txt-small text-ui-fg-muted">Selected value: {value}</div>
    </div>
  )
}

```

### Radio Group with a Disabled Item

```tsx
import { Label, RadioGroup } from "@medusajs/ui"

export default function RadioGroupDisabled() {
  return (
    <RadioGroup>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="1" id="radio_1_disabled" />
        <Label htmlFor="radio_1_disabled" weight="plus">
          Radio 1
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="2" id="radio_2_disabled" />
        <Label htmlFor="radio_2_disabled" weight="plus">
          Radio 2
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item value="3" id="radio_3_disabled" disabled={true} />
        <Label htmlFor="radio_3_disabled" weight="plus">
          Radio 3
        </Label>
      </div>
    </RadioGroup>
  )
}

```

***

## Radio Choice Box

The `RadioGroup.ChoiceBox` component allows you to show a group of radio buttons, each in a box with a label and description.

```tsx
import { RadioGroup } from "@medusajs/ui"

export default function RadioGroupChoiceBox() {
  return (
    <RadioGroup defaultValue="option1">
      <RadioGroup.ChoiceBox
        value="option1"
        label="Option 1"
        description="This is the first option."
      />
      <RadioGroup.ChoiceBox
        value="option2"
        label="Option 2"
        description="This is the second option."
      />
      <RadioGroup.ChoiceBox
        value="option3"
        label="Option 3"
        description="This is the third option."
      />
    </RadioGroup>
  )
}

```

### Choice Box API Reference

### RadioGroup.ChoiceBox Props

This component is based on the \[Radix UI Radio Group Item]\(https://www.radix-ui.com/primitives/docs/components/radio-group#item) primitives.

- label: (string) The label for the radio button.
- description: (string) The description for the radio button.
- value: (string) The value of the radio button.
