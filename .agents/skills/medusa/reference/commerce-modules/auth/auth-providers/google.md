# Google Auth Module Provider

In this guide, you’ll learn about the Google Auth Module Provider and how to install and use it in the Auth Module.

The Google Auth Module Provider allows you to authenticate users with their Google account.

## Register the Google Auth Module Provider

### Prerequisites

- [Create a project in Google Cloud.](https://cloud.google.com/resource-manager/docs/creating-managing-projects)
- [Create Oauth client ID credentials. When setting the Redirect Uri, set it to a URL in your frontend (for example, storefront) that later uses Medusa's callback route to validate the authentication.](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)

To use the Google Auth Module Provider, add the module to the array of providers passed to the Auth Module in your `medusa-config.ts`:

```ts title="medusa-config.ts"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

// ...

module.exports = defineConfig({
  // ...
  modules: [
    // ...
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
          },
          {
            resolve: "@medusajs/medusa/auth-google",
            id: "google",
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL,
            },
          },
        ],
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the necessary environment variables for the above options in `.env`:

```plain
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GOOGLE_CALLBACK_URL=<YOUR_GOOGLE_CALLBACK_URL>
```

### Module Options

|Configuration|Description|Required|
|---|---|---|---|---|
|\`clientId\`|A string indicating the |Yes|
|\`clientSecret\`|A string indicating the |Yes|
|\`callbackUrl\`|A string indicating the URL to redirect to in your frontend after the user completes their authentication in Google.|Yes|

***

## Override Callback URL During Authentication

In many cases, you may have different callback URLs for actor types. For example, you may redirect admin users to a different URL than customers after authentication.

The [Authenticate or Login API Route](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route) can accept a `callback_url` body parameter to override the provider's `callbackUrl` option. Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route).

***

## Examples

- [How to implement Google social login in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/third-party-login)
