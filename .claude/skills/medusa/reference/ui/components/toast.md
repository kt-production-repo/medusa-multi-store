# Toaster and Toast Messages

A component and utility for displaying brief messages to users, typically used for notifications or alerts. Toast messages appear momentarily on top of the application UI.

You can display multiple toast messages at once, and they will be stacked neatly.

In this guide, you'll learn how to use the Toaster component.

```tsx
import { Button, Toaster, toast } from "@medusajs/ui"

export default function ToasterDemo() {
  return (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast.info("Info", {
            description: "The quick brown fox jumps over the lazy dog.",
          })
        }
      >
        Show
      </Button>
    </>
  )
}

```

## Usage

First, import the `toast` utility and `Toaster` component from `@medusajs/ui`:

```tsx
import { Toaster, toast } from "@medusajs/ui"
```

Then, add the `Toaster` component somewhere in your tree hierarchy. For example, in your main application layout:

```tsx
export default function AppLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

Finally, use the `toast` utility in your components to display a toast message:

```tsx
export default function MyComponent() {
  return (
    <Button 
      onClick={() => 
        toast.info("Toast title", {
          description: "Toast body",
        })
      }
    >
      Trigger
    </Button>
  )
}
```

***

## API Reference

### Toast Utility Functions

The `toast` utility has the following functions to display different variants of toast messages:

- `info`: Display a toast message with an informational style.
- `error`: Display a toast message with an error style.
- `success`: Display a toast message with a success style.
- `warning`: Display a toast message with a warning style.
- `loading`: Display a toast message with a loading style.

Each of these functions accept two parameters:

1. A string indicating the title of the toast.
2. An object of [Toast component props](#toast-props).

### Toast Props

This component is based on the \[Sonner]\(https://sonner.emilkowal.ski/toast) toast library.

- id: (union) Optional ID of the toast.
- description: (ReactReactNode) The toast's text.
- action: (signature) The toast's action buttons.

### Toaster Props

This component is based on the \[Toaster component of the Sonner library]\(https://sonner.emilkowal.ski/toaster).

- position: (union) The position of the created toasts. Default: "bottom-right"
- gap: (number) The gap between the toast components. Default: 12
- offset: (union) The space from the edges of the screen. Default: 24
- duration: (number) The time in milliseconds that a toast is shown before it's
  automatically dismissed.

  &#x20;Default: 4000

***

## Examples

### Toast Variants

The following example assumes you already have the `Toaster` component in [your application's tree](#usage).

```tsx
import {
  CheckCircle,
  ExclamationCircle,
  InformationCircle,
  Spinner,
  XCircle,
} from "@medusajs/icons"
import { Button, toast } from "@medusajs/ui"

export default function ToasterAllVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={() =>
          toast.info("Info", {
            description: "This is an info toast.",
          })
        }
      >
        <InformationCircle /> Info
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("Success", {
            description: "This is a success toast.",
          })
        }
      >
        <CheckCircle /> Success
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.error("Error", {
            description: "This is an error toast.",
          })
        }
      >
        <XCircle /> Error
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.warning("Warning", {
            description: "This is a warning toast.",
          })
        }
      >
        <ExclamationCircle /> Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.loading("Loading", {
            description: "This is a loading toast.",
          })
        }
      >
        <Spinner /> Loading
      </Button>
    </div>
  )
}

```

### Dismissable Toast

The following example assumes you already have the `Toaster` component in [your application's tree](#usage).

```tsx
import { Button, toast } from "@medusajs/ui"

export default function DismissableToaster() {
  return (
    <Button
      onClick={() =>
        toast.info("Info", {
          description: "The quick brown fox jumps over the lazy dog.",
          dismissable: true,
        })
      }
    >
      Show
    </Button>
  )
}

```

### Toast with Action

The following example assumes you already have the `Toaster` component in [your application's tree](#usage).

```tsx
import { Button, toast } from "@medusajs/ui"

export default function ToasterWithAction() {
  return (
    <Button
      onClick={() =>
        toast.success("Created Product", {
          description: "The product has been created.",
          action: {
            altText: "Undo product creation",
            onClick: () => {},
            label: "Undo",
          },
          duration: 10000,
        })
      }
    >
      Show
    </Button>
  )
}

```
