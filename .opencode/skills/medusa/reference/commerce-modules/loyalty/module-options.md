# Loyalty Plugin Options

In this guide, you'll learn about the options you can pass to the Loyalty Plugin.

## Options Example

```js title="medusa-config.js"
module.exports = defineConfig({
  // ...
  plugins: [
    {
      resolve: "@medusajs/loyalty-plugin",
      options: {
        prefix: "GC",
        sections: 3,
      },
    },
  ],
})
```

### All Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`prefix\`|A string indicating the prefix added to auto-generated gift card codes. For example, setting |No|\`GIFT\`|
|\`sections\`|A number indicating how many 4-character sections the generated gift card code contains. For example, setting |No|\`4\`|
