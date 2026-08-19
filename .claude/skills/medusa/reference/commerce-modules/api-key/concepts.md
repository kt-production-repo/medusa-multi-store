# API Key Concepts

In this guide, you’ll learn about the different types of API keys, their expiration and verification.

## API Key Types

There are two types of API keys:

- `publishable`: A public key used in client applications, such as a storefront.
  - This API key is useful for operations that do not require authentication, such as fetching product data or categories.
- `secret`: A secret key used for authentication and verification purposes, such as an admin user’s authentication token or a password reset token.
  - This API key is useful for operations that require authentication, such as creating orders or managing products as an admin user.

The API key’s type is stored in the `type` property of the [ApiKey data model](https://docs.medusajs.com/references/api-key/models/ApiKey).

### Default Scopes and Permissions

In your Medusa application, a `publishable` API key is only useful to send requests to the [Store API routes](https://docs.medusajs.com/api/store). Learn more about it in the [Publishable API Keys](https://docs.medusajs.com/resources/commerce-modules/sales-channel/publishable-api-keys) guide.

In addition, a `secret` API key allows you to access the [Admin API routes](https://docs.medusajs.com/api/admin) and perform actions as the admin user that the key was created for. The `created_by` property of the [ApiKey data model](https://docs.medusajs.com/references/api-key/models/ApiKey) indicates the ID of the associated admin user.

To authenticate using a secret API key, pass it with HTTP Basic authentication in the `Authorization` header:

```bash
curl -X GET http://localhost:9000/admin/products \
-H 'Authorization: Basic {secret_api_key}'
```

Secret API keys must be sent using HTTP Basic authentication, not as a Bearer token. Sending a secret API key as `Authorization: Bearer {secret_api_key}` returns a `401` error.

***

## API Key Creation

When using the [Medusa Admin](https://docs.medusajs.com/user-guide/settings/developer) or [API routes](https://docs.medusajs.com/api/admin/api-keys), only admin users can create API keys.

You can also create API keys in your customizations using the [createApiKeysWorkflow](https://docs.medusajs.com/references/medusa-workflows/createApiKeysWorkflow).

***

## API Key Tokens

The API key data model has a `token` property that contains the actual key used for authentication.

This token is created using the `salt` property in the data model, which is a random string generated when the API key is created. The salt is a `64`-character hexadecimal string generated randomly using the `crypto` module in Node.js.

For display purposes, the API key data model also has a `redacted` property that contains the first six characters of the token, followed by `...`, then the last three characters of the token. You can use this property to show the API key in the UI without revealing the full token.

***

## API Key Expiration

An API key expires when it’s revoked using the [revokeApiKeysWorkflow](https://docs.medusajs.com/references/medusa-workflows/revokeApiKeysWorkflow). This method will set the following properties in the API key:

- `revoked_at`: The date and time when the API key was revoked.
- `revoked_by`: The ID of the user who revoked the API key.

The associated token is no longer usable or verifiable.

***

## Token Verification

To verify a token received as an input or in a request, use the [authenticate method of the module’s main service](https://docs.medusajs.com/references/api-key/authenticate) which validates the token against all non-expired tokens.
