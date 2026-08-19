# Dropdown Menu

A component for rendering dropdown menus that display a set of actions or options to users.

In this guide, you'll learn how to use the Dropdown Menu component.

```tsx
import { EllipsisHorizontal, PencilSquare, Plus, Trash } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item className="gap-x-2">
          <PencilSquare className="text-ui-fg-subtle" />
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item className="gap-x-2">
          <Plus className="text-ui-fg-subtle" />
          Add
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item className="gap-x-2">
          <Trash className="text-ui-fg-subtle" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

```

## Usage

```tsx
import { DropdownMenu } from "@medusajs/ui"
```

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>Trigger</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Edit</DropdownMenu.Item>
    <DropdownMenu.Item>Add</DropdownMenu.Item>
    <DropdownMenu.Item>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>
```

***

## API Reference

### DropdownMenu Props

This component is based on the \[Radix UI Dropdown Menu]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu) primitive.



### DropdownMenu.Trigger Props

This component is based on the \[Radix UI Dropdown Menu Trigger]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu#trigger) primitive.



### DropdownMenu.Content Props

This component is based on the \[Radix UI Dropdown Menu Content]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu#content) primitive.

- sideOffset: (undefined) The space in pixels between the dropdown menu and its trigger element. Default: 8
- collisionPadding: (undefined) The distance in pixels from the boundary edges where collision detection should occur. Default: 8
- align: (undefined) The alignment of the dropdown menu relative to its trigger element.

  @defaultValue center Default: "center"

### DropdownMenu.Item Props

This component is based on the \[Radix UI Dropdown Menu Item]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu#item) primitive.



### DropdownMenu.Shortcut Props

This component is based on the \`span\` element and supports all of its props



### DropdownMenu.Hint Props

This component is based on the \`span\` element and supports all of its props



### DropdownMenu.RadioGroup Props

This component is based on the \[Radix UI Dropdown Menu RadioGroup]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radiogroup) primitive.



### DropdownMenu.RadioItem Props

This component is based on the \[Radix UI Dropdown Menu RadioItem]\(https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radioitem) primitive.



***

## Examples

### Sorting

This example shows how to display collection sorting choices using a Dropdown Menu.

```tsx
import { EllipsisHorizontal } from "@medusajs/icons"
import { DropdownMenu, IconButton } from "@medusajs/ui"
import React from "react"

type SortingState = "asc" | "desc" | "alpha" | "alpha-reverse" | "none"

export default function DropdownMenuSorting() {
  const [sort, setSort] = React.useState<SortingState>("none")

  return (
    <div className="flex flex-col items-center gap-y-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-[300px]">
          <DropdownMenu.RadioGroup
            value={sort}
            onValueChange={(v) => setSort(v as SortingState)}
          >
            <DropdownMenu.RadioItem value="none">
              No Sorting
            </DropdownMenu.RadioItem>
            <DropdownMenu.Separator />
            <DropdownMenu.RadioItem value="alpha">
              Alphabetical
              <DropdownMenu.Hint>A-Z</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="alpha-reverse">
              Reverse Alphabetical
              <DropdownMenu.Hint>Z-A</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="asc">
              Created At - Ascending
              <DropdownMenu.Hint>1 - 30</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="desc">
              Created At - Descending
              <DropdownMenu.Hint>30 - 1</DropdownMenu.Hint>
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu>
      <span className="txt-small text-ui-fg-muted">Sorting: {sort}</span>
    </div>
  )
}

```

### Dropdown with Submenu

```tsx
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { BarsArrowDown } from "@medusajs/icons"

export default function DropdownMenuSubmenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <BarsArrowDown />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.SubMenu>
          <DropdownMenu.SubMenuTrigger>
            More Actions
          </DropdownMenu.SubMenuTrigger>
          <DropdownMenu.SubMenuContent>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
            <DropdownMenu.Item>Archive</DropdownMenu.Item>
          </DropdownMenu.SubMenuContent>
        </DropdownMenu.SubMenu>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

```

### Disabled Items and Using Icons

```tsx
import { DropdownMenu, IconButton } from "@medusajs/ui"
import { Trash, BarsThree } from "@medusajs/icons"

export default function DropdownMenuDisabledAndIcons() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton>
          <BarsThree />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item disabled>
          <Trash className="mr-2" />
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

```

### Keyboard Shortcuts (with handling)

This example shows how to visually display keyboard shortcuts in the menu and handle them in your application logic.

You can use the <Kbd>E</Kbd> and <Kbd>D</Kbd> shortcuts to trigger the actions of the dropdown items.

```tsx
import { useEffect, useCallback } from "react"
import { DropdownMenu, IconButton, toast, Toaster } from "@medusajs/ui"
import { Keyboard } from "@medusajs/icons"

function getOsShortcut() {
  const isMacOs =
    typeof navigator !== "undefined"
      ? navigator.userAgent.toLowerCase().indexOf("mac") !== 0
      : true

  return isMacOs ? "⌘" : "Ctrl"
}

export default function DropdownMenuWithShortcuts() {
  const osShortcut = getOsShortcut()
  const handleEdit = useCallback(() => {
    toast.success("Success", {
      description: "Edit shortcut triggered!",
    })
  }, [])

  const handleDelete = useCallback(() => {
    toast.success("Success", {
      description: "Delete shortcut triggered!",
    })
  }, [])

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.metaKey && e.key.toLowerCase() === "e") {
        e.preventDefault()
        handleEdit()
      }
      if (e.metaKey && e.key.toLowerCase() === "d") {
        e.preventDefault()
        handleDelete()
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [handleEdit, handleDelete])

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton>
            <Keyboard />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={handleEdit}>
            Edit
            <DropdownMenu.Shortcut>{osShortcut}E</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleDelete}>
            Delete
            <DropdownMenu.Shortcut>{osShortcut}D</DropdownMenu.Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Toaster />
    </>
  )
}

```
