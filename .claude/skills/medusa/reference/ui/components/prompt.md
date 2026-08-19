# Prompt

A component that displays a dialog prompting the user for their approval. It's useful when confirming destructive actions.

This component is useful if you want to control the prompt's content, format, and design. For a simpler approach that follows Medusa's prompt format, refer to the [usePrompt hook](https://docs.medusajs.com/ui/hooks/use-prompt).

In this guide, you'll learn how to use the Prompt component.

```tsx
import { Button, Prompt } from "@medusajs/ui"

export default function PromptDemo() {
  return (
    <Prompt>
      <Prompt.Trigger asChild>
        <Button>Open</Button>
      </Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>Delete something</Prompt.Title>
          <Prompt.Description>
            Are you sure? This cannot be undone.
          </Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Prompt.Action>Delete</Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  )
}

```

## Usage

```tsx
import { Prompt } from "@medusajs/ui"
```

```tsx
<Prompt>
  <Prompt.Trigger>Trigger</Prompt.Trigger>
  <Prompt.Content>
    <Prompt.Header>
      <Prompt.Title>Title</Prompt.Title>
      <Prompt.Description>Description</Prompt.Description>
    </Prompt.Header>
    <Prompt.Footer>
      <Prompt.Cancel>Cancel</Prompt.Cancel>
      <Prompt.Action>Delete</Prompt.Action>
    </Prompt.Footer>
  </Prompt.Content>
</Prompt>
```

***

## API Reference

### Prompt Props

This component is based on the \[Radix UI Alert Dialog]\(https://www.radix-ui.com/primitives/docs/components/alert-dialog) primitives.

- variant: (union) The variant of the prompt. Default: "danger"

### Prompt.Header Props

This component is based on the \`div\` element and supports all of its props



### Prompt.Footer Props

This component is based on the \`div\` element and supports all of its props



***

## Examples

### Confirmation Prompt Variant

The `confirmation` variant is useful when confirming an operation that isn't destructive, such as deleting an item.

```tsx
import { Button, Prompt } from "@medusajs/ui"

export default function PromptConfirmation() {
  return (
    <Prompt variant="confirmation">
      <Prompt.Trigger asChild>
        <Button>Open Confirmation</Button>
      </Prompt.Trigger>
      <Prompt.Content>
        <Prompt.Header>
          <Prompt.Title>Confirm Action</Prompt.Title>
          <Prompt.Description>
            Are you sure you want to proceed? This action can be undone.
          </Prompt.Description>
        </Prompt.Header>
        <Prompt.Footer>
          <Prompt.Cancel>Cancel</Prompt.Cancel>
          <Prompt.Action>Confirm</Prompt.Action>
        </Prompt.Footer>
      </Prompt.Content>
    </Prompt>
  )
}

```
