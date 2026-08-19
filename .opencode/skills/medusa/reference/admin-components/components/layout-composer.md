# LayoutComposer

The `LayoutComposer` component provides a flexible layout composition system for building admin pages with widget support. It manages the rendering of widgets in specific sections and supports different layout structures.

The `LayoutComposer` is useful for plugins that want to create custom admin pages with a consistent layout and custom widget injection zones.

This component is available since Medusa [v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0).

## Basic Example

In the following example, the `LayoutComposer` is used to create a two-column layout for a custom brand details page:

```tsx
import { LayoutComposer } from "@medusajs/dashboard/components"

const BrandDetailsPage = () => {
  // retrieve brand...
  return (
    <LayoutComposer
      widgetsZonePrefix="brand.details"
      preferredLayoutId="core:two-column"
      data={brand}
      sections={{
        main: (
          <>
            <BrandGeneralSection brand={brand} />
            <BrandVariantsSection brand={brand} />
          </>
        ),
        side: (
          <>
            <BrandMediaSection brand={brand} />
            <BrandStatusSection brand={brand} />
          </>
        ),
      }}
    />
  )
}
```

The `widgetsZonePrefix` prop determines the widget injection zones for the page. In this example, the UI route exposes the following zones:

- `brand.details`: Widgets rendered in the main section of the brand details page.
- `brand.details.side`: Widgets rendered in the side section of the brand details page.

### Single Column Layout

The `LayoutComposer` also supports single-column layouts, which is useful for listing pages or pages with a single main content area. For example:

```tsx
import { LayoutComposer } from "@medusajs/dashboard/components"

const BrandListPage = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="brand.list"
      preferredLayoutId="core:single-column"
      sections={{
        main: (
          <BrandListSection />
        ),
      }}
    />
  )
}
```

The `widgetsZonePrefix` prop determines the widget injection zones for the page. In this example, the UI route exposes the following zone:

- `brand.list`: Widgets rendered in the main section of the brand list page.

***

## Props

|Prop|Type|Description|
|---|---|---|
|\`widgetsZonePrefix\`|\`string\`|The prefix used to determine widget injection zones for the page. For a two-column layout, the component exposes |
|\`preferredLayoutId\`|\`string\`|The ID of the preferred layout to use. By default, accepted values are |
|\`sections\`|\`Record\<string, ReactNode>\`|Object mapping section names to their content. The key is the name of the section, and the value is a |
|\`data\`|\`unknown\`|Data passed from the UI route to the |

## Custom Layouts

You can create custom layouts by adding a layout file under `src/admin/layouts/` in your plugin. A layout file must have a default export (the React component) and a named `config` export created with `defineLayoutConfig`.

For example, create the file `src/admin/layouts/three-column.tsx` with the following content:

```tsx title="src/admin/layouts/three-column.tsx"
import { defineLayoutConfig } from "@medusajs/admin-sdk"
import type { LayoutComponentProps } from "@medusajs/dashboard/components"

const ThreeColumnLayout = ({ sections }: LayoutComponentProps) => (
  <div className="grid grid-cols-3 gap-4">
    <div>{sections.main}</div>
    <div>{sections.side}</div>
    <div>{sections.extra}</div>
  </div>
)

export const config = defineLayoutConfig({
  id: "my-plugin:three-column",
  sections: [
    { id: "main", ordering: "list" },
    { id: "side", ordering: "list" },
    { id: "extra", ordering: "list" },
  ],
})

export default ThreeColumnLayout
```

To get type-safe section names when using your custom layout, augment the `LayoutSectionRegistry` interface in `@medusajs/admin-shared`:

```ts title="index.d.ts"
declare module "@medusajs/admin-shared" {
  interface LayoutSectionRegistry {
    "my-plugin:three-column": "main" | "side" | "extra"
  }
}
```

You can then use the custom layout in the `LayoutComposer`:

```tsx
import { LayoutComposer } from "@medusajs/dashboard/components"

const BrandPage = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="brand.list"
      preferredLayoutId="my-plugin:three-column"
      sections={{
        main: <BrandListSection />,
        side: <BrandFiltersSection />,
        extra: <BrandStatsSection />,
      }}
    />
  )
}
```
