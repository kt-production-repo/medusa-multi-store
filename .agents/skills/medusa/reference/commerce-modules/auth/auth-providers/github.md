# GitHub Auth Module Provider

In this guide, you’ll learn about the GitHub Auth Module Provider and how to configure it.

The GitHub Auth Module Provider allows you to authenticate users with their GitHub account.

## Register the GitHub Auth Module Provider

### Prerequisites

- [Register a GitHub App. When setting the Callback URL, set it to a URL in your frontend that later uses Medusa's callback route to validate the authentication.](https://docs.github.com/en/apps/creating-github-apps/setting-up-a-github-app/creating-a-github-app)
- [Retrieve the client ID and client secret of your GitHub App](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28#using-basic-authentication)

To use the GitHub Auth Module Provider, add the module to the array of providers passed to the Auth Module in your `medusa-config.ts`:

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
            resolve: "@medusajs/medusa/auth-github",
            id: "github",
            options: {
              clientId: process.env.GITHUB_CLIENT_ID,
              clientSecret: process.env.GITHUB_CLIENT_SECRET,
              callbackUrl: process.env.GITHUB_CALLBACK_URL,
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
GITHUB_CLIENT_ID=<YOUR_GITHUB_CLIENT_ID>
GITHUB_CLIENT_SECRET=<YOUR_GITHUB_CLIENT_SECRET>
GITHUB_CALLBACK_URL=<YOUR_GITHUB_CALLBACK_URL>
```

### Module Options

|Configuration|Description|Required|
|---|---|---|---|---|
|\`clientId\`|A string indicating the client ID of your GitHub app.|Yes|
|\`clientSecret\`|A string indicating the client secret of your GitHub app.|Yes|
|\`callbackUrl\`|A string indicating the URL to redirect to in your frontend after the user completes their authentication in GitHub.|Yes|

***

## Override Callback URL During Authentication

In many cases, you may have different callback URLs for actor types. For example, you may redirect admin users to a different URL than customers after authentication.

The [Authenticate or Login API Route](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route) accepts a `callback_url` body parameter to override the provider's `callbackUrl` option. Learn more in the [Auth Flows with Routes guide](https://docs.medusajs.com/resources/commerce-modules/auth/authentication-route#login-route).

***

## Examples

- [How to implement third-party / social login in the storefront](https://docs.medusajs.com/resources/storefront-development/customers/third-party-login)
