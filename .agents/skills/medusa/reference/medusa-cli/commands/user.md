# user Command - Medusa CLI Reference

Create a new admin user.

```bash
npx medusa user --email <email> [--password <password>]
```

## Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`-e \<email>\`|The user's email.|Yes|-|
|\`-p \<password>\`|The user's password.|No|-|
|\`-i \<id>\`|The user's ID.|No|An automatically generated ID is used.|
|\`--invite\`|Whether to create a user invite instead of directly creating a user. Learn more in the |No|\`false\`|

***

## Create User Invite with Medusa CLI

The `user` command accepts the `--invite` option to create a user invite. The user must accept the invite before they can log into the Medusa Admin.

For example:

```bash
npx medusa user --email user@example.com --invite
```

The command will create a user invite and output the invite token. You can then either:

- Accept the invite in the Medusa Admin at the path `/app/invite?token=<invite_token>`
- Accept the invite using the [Accept Invite API route](https://docs.medusajs.com/api/admin/invites/accept-invite).
