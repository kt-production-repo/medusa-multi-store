# Local File Module Provider

The Local File Module Provider stores files uploaded to your Medusa application in the `/uploads` directory.

- The Local File Module Provider is only for development purposes. Use the [S3 File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file/s3) in production instead.
- The Local File Module Provider will only read files uploaded through Medusa. It will not read files uploaded manually to the `static` (or other configured) directory.

***

## Register the Local File Module

The Local File Module Provider is registered by default in your application.

Add the module into the `providers` array of the File Module:

The File Module accepts one provider only.

```ts title="medusa-config.ts"
import { Modules } from "@medusajs/framework/utils"

// ...

module.exports = {
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              // provider options...
            },
          },
        ],
      },
    },
  ],
}
```

### Local File Module Options

|Option|Description|Default|
|---|---|---|---|---|
|\`upload\_dir\`|The directory to upload files to. Medusa exposes the content of the |\`static\`|
|\`backend\_url\`|The URL that serves the files.|\`http://localhost:9000/static\`|
