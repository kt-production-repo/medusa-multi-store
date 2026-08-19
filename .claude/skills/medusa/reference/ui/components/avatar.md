# Avatar

A component for displaying user avatars with a fallback option.

In this guide, you'll learn how to use the Avatar component.

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarDemo() {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/10656202?v=4"
      fallback="M"
    />
  )
}

```

## Usage

```tsx
import { Avatar } from "@medusajs/ui"
```

```tsx
<Avatar
  src="https://avatars.githubusercontent.com/u/10656202?v=4"
  fallback="M"
/>
```

***

## API Reference

### Avatar Props

This component is based on the \[Radix UI Avatar]\(https://www.radix-ui.com/primitives/docs/components/avatar) primitive.

- src: (string) The URL of the image used in the Avatar.
- fallback: (string) Text to show in the avatar if the URL provided in \`src\` can't be opened.
- variant: (union) The style of the avatar. Default: "rounded"
- size: (union) The size of the avatar's border radius. Default: "base"

***

## Examples

### Avatar Variants

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarVariants() {
  return (
    <div className="flex gap-4">
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        variant="rounded"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        variant="squared"
      />
    </div>
  )
}

```

### Avatar Sizes

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarSizes() {
  return (
    <div className="flex gap-4 items-center">
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="2xsmall"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="xsmall"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="small"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="base"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="large"
      />
      <Avatar
        src="https://avatars.githubusercontent.com/u/10656202?v=4"
        fallback="M"
        size="xlarge"
      />
    </div>
  )
}

```

### Avatar Fallback Only

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarFallback() {
  return <Avatar fallback="JD" />
}

```

### Avatar Custom Styling

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarCustomStyle() {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/10656202?v=4"
      fallback="M"
      style={{
        boxShadow: "0 0 0 3px #fdba74, 0 1px 2px 0 rgba(0,0,0,0.05)",
        border: "none",
      }}
    />
  )
}

```

### Avatar Accessibility

You can add the `aria-label` prop to the Avatar component for better accessibility.

```tsx
import { Avatar } from "@medusajs/ui"

export default function AvatarAccessible() {
  return (
    <Avatar
      src="https://avatars.githubusercontent.com/u/10656202?v=4"
      fallback="M"
      aria-label="Medusa User"
    />
  )
}

```
