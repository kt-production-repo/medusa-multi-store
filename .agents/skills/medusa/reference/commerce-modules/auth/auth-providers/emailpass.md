# Emailpass Auth Module Provider

In this guide, you’ll learn about the Emailpass Auth Module Provider and how to configure it.

By using the Emailpass Auth Module Provider, you allow users to register and log in with an email and password.

## Register the Emailpass Auth Module Provider

The Emailpass Auth Module Provider is registered by default with the Auth Module.

If you want to pass options to the provider, add the provider to the `providers` option of the Auth Module in your `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        mfa: {
          encryption_key: process.env.AUTH_MFA_ENCRYPTION_KEY,
        },
        providers: [
          // other providers...
          {
            resolve: "@medusajs/medusa/auth-emailpass",
            id: "emailpass",
            options: {
              // options...
            },
          },
        ],
      },
    },
  ],
})
```

### Module Options

The `require_verification` option was removed since Medusa [v2.16.0](https://github.com/medusajs/medusa/releases/tag/v2.16.0). Use the [authVerificationsPerActor configuration](https://docs.medusajs.com/docs/learn/configurations/medusa-config#httpauthVerificationsPerActor) instead.

|Configuration|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`hashConfig\`|An object of configurations for hashing the user's
password. Refer to |No|\`\`\`ts
const hashConfig = \{
&#x20; logN: 15,
&#x20; r: 8,
&#x20; p: 1
}
\`\`\`|

***

## Related Guides

- [How to register a customer using email and password](https://docs.medusajs.com/resources/storefront-development/customers/register)
- [Implement email verification](https://docs.medusajs.com/resources/commerce-modules/auth/email-verification)
