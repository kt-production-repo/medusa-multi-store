# Drawer

A component for rendering a sliding panel that overlays the main content.

In this guide, you'll learn how to use the Drawer component.

```tsx
import { Button, Drawer, Text } from "@medusajs/ui"

export default function DrawerDemo() {
  return (
    <Drawer>
      <Drawer.Trigger asChild>
        <Button>Edit Variant</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Edit Variant</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-4">
          <Text>This is where you edit the variant&apos;s details</Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Drawer.Close asChild>
            <Button variant="secondary">Cancel</Button>
          </Drawer.Close>
          <Button>Save</Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  )
}

```

## Usage

```tsx
import { Drawer } from "@medusajs/ui"
```

```tsx
<Drawer>
  <Drawer.Trigger>Trigger</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Drawer Title</Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>Body</Drawer.Body>
    <Drawer.Footer>Footer</Drawer.Footer>
  </Drawer.Content>
</Drawer>
```

***

## API Reference

### Drawer Props

This component is based on the \[Radix UI Dialog]\(https://www.radix-ui.com/primitives/docs/components/dialog) primitives.



### Drawer.Trigger Props

This component is used to create the trigger button that opens the drawer.
It accepts props from the \[Radix UI Dialog Trigger]\(https://www.radix-ui.com/primitives/docs/components/dialog#trigger) component.



### Drawer.Content Props

This component wraps the content of the drawer.
It accepts props from the \[Radix UI Dialog Content]\(https://www.radix-ui.com/primitives/docs/components/dialog#content) component.

- overlayProps: (ReactComponentPropsWithoutRef) Props for the overlay component.
  It accepts props from the \[Radix UI Dialog Overlay]\(https://www.radix-ui.com/primitives/docs/components/dialog#overlay) component.
- portalProps: (ReactComponentPropsWithoutRef) Props for the portal component that wraps the drawer content.
  It accepts props from the \[Radix UI Dialog Portal]\(https://www.radix-ui.com/primitives/docs/components/dialog#portal) component.

### Drawer.Header Props

This component is used to wrap the header content of the drawer.
This component is based on the \`div\` element and supports all of its props.



### Drawer.Title Props

This component adds an accessible title to the drawer.
It accepts props from the \[Radix UI Dialog Title]\(https://www.radix-ui.com/primitives/docs/components/dialog#title) component.



### Drawer.Body Props

This component is used to wrap the body content of the drawer.
This component is based on the \`div\` element and supports all of its props



### Drawer.Footer Props

This component is used to wrap the footer content of the drawer.
This component is based on the \`div\` element and supports all of its props.



***

## Examples

### Drawer with Form

This example shows a simple form inside a Drawer, demonstrating how to use form elements and handle submission.

```tsx
import { useState } from "react"
import { Button, Drawer, Input, Label } from "@medusajs/ui"

export default function DrawerWithForm() {
  const [name, setName] = useState("")
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2 items-center">
      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <Button>Open Drawer</Button>
        </Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Simple Form</Drawer.Title>
          </Drawer.Header>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <Drawer.Body>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </Drawer.Body>
            <Drawer.Footer>
              <Drawer.Close asChild>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Drawer.Close>
              <Button type="submit">Submit</Button>
            </Drawer.Footer>
          </form>
        </Drawer.Content>
      </Drawer>
      {submitted && (
        <div className="text-ui-fg-muted">Form submitted with name {name}</div>
      )}
    </div>
  )
}

```
