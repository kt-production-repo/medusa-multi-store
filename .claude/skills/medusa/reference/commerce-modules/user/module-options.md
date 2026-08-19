# User Module Options

In this guide, you'll learn about the options you can pass to the User Module.

## Options Example

```ts title="medusa-config.ts"
module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/user",
      options: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_public_key: process.env.JWT_PUBLIC_KEY,
        valid_duration: 60 * 60 * 24, // 24 hours
        jwt_options: {
          algorithm: process.env.JWT_ALGORITHM || "RS256",
          issuer: process.env.JWT_ISSUER || "medusa",
        },
        jwt_verify_options: {
          algorithms: [process.env.JWT_ALGORITHM || "RS256"],
          issuer: process.env.JWT_ISSUER || "medusa",
        },
      },
    },
  ],
})
```

### Environment Variables

Make sure to add the necessary environment variables for the above options to your `.env` file:

```bash
JWT_SECRET=supersecret
# Optional: For asymmetric key validation
JWT_PUBLIC_KEY=your_public_key_here
JWT_ALGORITHM=RS256
JWT_ISSUER=medusa
```

### All Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`jwt\_secret\`|A string indicating the secret used to sign the invite tokens.|Yes|-|
|\`jwt\_public\_key\`|A string indicating the public key used to verify JWT tokens when using asymmetric validation. Only used when the JWT secret is a private key for asymmetric signing.|No|-|
|\`valid\_duration\`|A number indicating the duration in seconds that an invite token is valid. This is used to set the expiration time for invite tokens.|No|\`86400\`|
|\`jwt\_options\`|An object containing options for signing JWT tokens when using asymmetric signing with a private/public key pair. Accepts any options from |No|\`\{}\`|
|\`jwt\_verify\_options\`|An object containing options for verifying JWT tokens when using asymmetric validation with a private/public key pair. Accepts any options from |No|Value of |
