# Auth Module Provider

In this guide, you’ll learn about the Auth Module Provider and how it's used.

## What is an Auth Module Provider?

An Auth Module Provider handles authenticating customers and users, either using custom logic or by integrating a third-party service.

For example, the EmailPass Auth Module Provider authenticates a user using their email and password, whereas the Google Auth Module Provider authenticates users using their Google account.

### Auth Providers List

- [Emailpass](https://docs.medusajs.com/commerce-modules/auth/auth-providers/emailpass)
- [Google](https://docs.medusajs.com/commerce-modules/auth/auth-providers/google)
- [GitHub](https://docs.medusajs.com/commerce-modules/auth/auth-providers/github)

***

## How to Create an Auth Module Provider?

An Auth Module Provider is a module whose service extends the `AbstractAuthModuleProvider` imported from `@medusajs/framework/utils`.

The module can have multiple auth provider services, where each is registered as a separate auth provider.

Refer to the [Create Auth Module Provider](https://docs.medusajs.com/references/auth/provider) guide to learn how to create an Auth Module Provider.

***

## Configure Allowed Auth Providers of Actor Types

By default, users of all actor types can authenticate with all installed Auth Module Providers.

To restrict the auth providers used for actor types, use the [authMethodsPerActor option](https://docs.medusajs.com/docs/learn/configurations/medusa-config#httpauthMethodsPerActor) in Medusa's configurations:

```ts title="medusa-config.ts"
module.exports = defineConfig({
  projectConfig: {
    http: {
      authMethodsPerActor: {
        user: ["google"],
        customer: ["emailpass"],
      },
      // ...
    },
    // ...
  },
})
```

When you specify the `authMethodsPerActor` configuration, it overrides the default. So, if you don't specify any providers for an actor type, users of that actor type can't authenticate with any provider.
