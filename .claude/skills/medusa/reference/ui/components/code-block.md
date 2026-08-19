# Code Block

A component for displaying code snippets with syntax highlighting and copy functionality.

In this guide, you'll learn how to use the Code Block component.

```tsx
import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "cURL",
    language: "bash",
    code: `curl 'http://localhost:9000/store/products/PRODUCT_ID'\n -H 'x-publishable-key: YOUR_API_KEY'`,
    hideLineNumbers: true,
  },
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `const { product } = await medusa.store.products.retrieve("prod_123")\nconsole.log(product.id)`,
  },
]

export default function CodeBlockDemo() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}

```

## Usage

```tsx
import { CodeBlock } from "@medusajs/ui"
```

```tsx
<CodeBlock 
  snippets={[
    { 
      language: "tsx", 
      label: "Label", 
      code: "import { useProduct } from \"medusa-react\"",
    },
  ]}
>
  <CodeBlock.Header />
  <CodeBlock.Body />
</CodeBlock>
```

***

## API Reference

### CodeBlock Props

This component is based on the \`div\` element and supports all of its props

- snippets: (Array) The code snippets.

### CodeBlock.Header Props

This component is based on the \`div\` element and supports all of its props

- hideLabels: (boolean) Whether to hide the code snippets' labels. Default: false

### CodeBlock.Header.Meta Props

This component is based on the \`div\` element and supports all of its props



### CodeBlock.Body Props

This component is based on the \`div\` element and supports all of its props



***

## Usage Outside Medusa Admin

If you're using the `CodeBlock` component in a project other than the Medusa Admin, make sure to include the `TooltipProvider` somewhere up in your component tree, as the `CodeBlock.Header` component uses a [Tooltip](https://docs.medusajs.com/ui/components/tooltip#usage-outside-medusa-admin):

```tsx
<TooltipProvider>
  <CodeBlock 
    snippets={[
      { 
        language: "tsx", 
        label: "Label", 
        code: "import { useProduct } from \"medusa-react\"",
      },
    ]}
  >
    <CodeBlock.Header />
    <CodeBlock.Body />
  </CodeBlock>
</TooltipProvider>
```

***

## Examples

### Single Snippet

If you want to only show a code sample for one language or API, you can choose to hide the snippet labels:

```tsx
import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
  },
]

export default function CodeBlockSingle() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header hideLabels={true}>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}

```

### No Header

You can also omit the header entirely:

```tsx
import { CodeBlock } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
  },
]

export default function CodeBlockNoHeader() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}

```

### No Line Numbers

```tsx
import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, ")\n\nconsole.log("World!")`,
    hideLineNumbers: true,
  },
]

export default function CodeBlockNoLines() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}

```

### No Copy Button

```tsx
import { CodeBlock, Label } from "@medusajs/ui"

const snippets = [
  {
    label: "Medusa JS SDK",
    language: "jsx",
    code: `console.log("Hello, World!")`,
    hideCopy: true,
  },
]

export default function CodeBlockNoCopy() {
  return (
    <div className="w-full">
      <CodeBlock snippets={snippets}>
        <CodeBlock.Header>
          <CodeBlock.Header.Meta>
            <Label weight={"plus"}>/product-detail.js</Label>
          </CodeBlock.Header.Meta>
        </CodeBlock.Header>
        <CodeBlock.Body />
      </CodeBlock>
    </div>
  )
}

```
