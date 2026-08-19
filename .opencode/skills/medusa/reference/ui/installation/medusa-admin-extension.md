# Install Medusa UI for Medusa Admin Customizations

In this guide, you'll learn how to use Medusa UI for building Medusa Admin customizations.

## Use Medusa UI in Medusa Admin

The `@medusajs/ui` and `@medusajs/icons` packages are already installed as dependencies of the `@medusajs/admin-sdk` package in your Medusa project. They're installed by default in your Medusa plugins as well.

So, you can import the packages and use them in your Medusa Admin customizations without any additional installation steps.

For example, to use the UI and icon packages in a UI route:

```tsx title="src/admin/routes/custom/page.tsx"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Container, Heading } from "@medusajs/ui"

const CustomPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">This is my custom route</Heading>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Custom Route",
  icon: ChatBubbleLeftRight,
})

export default CustomPage
```

In this example, you use the [Container](https://docs.medusajs.com/ui/components/container) and [Heading](https://docs.medusajs.com/ui/components/heading) components in the UI route. You also use the `ChatBubbleLeftRight` icon from the [Icons package](https://docs.medusajs.com/ui/icons/overview) for the UI route's sidebar item.

***

## Related Resources

If you're building Medusa Admin customizations, check out the following documentation guides:

- [Admin Widgets](https://docs.medusajs.com/docs/learn/fundamentals/admin/widgets): Insert custom components into existing Medusa Admin pages.
- [Admin UI Routes](https://docs.medusajs.com/docs/learn/fundamentals/admin/ui-routes): Add new pages to the Medusa Admin.
- [Admin Components & Layouts](https://docs.medusajs.com/resources/admin-components): Use Medusa UI to implement common Medusa Admin components and layouts for a consistent design in your customizations.
