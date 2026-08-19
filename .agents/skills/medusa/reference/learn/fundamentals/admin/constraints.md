# Admin Development Constraints

This chapter lists some development constraints of admin widgets and UI routes.

## Arrow Functions

Widget and UI route components must be created as arrow functions. Otherwise, Medusa doesn't register them correctly.

```ts
// Don't
function ProductWidget() {
  // ...
}

// Do
const ProductWidget = () => {
  // ...
}
```

***

## Widget Zone

A widget zone's value must be wrapped in double or single quotes. It can't be a template literal or a variable. Otherwise, Medusa doesn't register the widget correctly.

```ts
// Don't
export const config = defineWidgetConfig({
  zone: `product.details`,
})

// Don't
const ZONE = "product.details"
export const config = defineWidgetConfig({
  zone: ZONE,
})

// Do
export const config = defineWidgetConfig({
  zone: "product.details",
})
```
