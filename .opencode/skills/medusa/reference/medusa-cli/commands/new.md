# new Command - Medusa CLI Reference

Create a new Medusa application. Unlike the `create-medusa-app` CLI tool, this command provides more flexibility for experienced Medusa developers in creating and configuring their project. It creates a monorepo structure with your Medusa backend in the `apps/backend` directory.

```bash
medusa new [<dir_name>]
```

## Arguments

|Argument|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`dir\_name\`|The name of the directory to create the Medusa application in. If not provided, you'll be prompted to enter a project name.|No|-|

## Options

|Option|Description|
|---|---|---|
|\`-y\`|Skip all prompts, such as database prompts. A database might not be created if default PostgreSQL credentials don't work.|
|\`--skip-db\`|Skip database creation.|
|\`--skip-env\`|Skip populating |
|\`--db-user \<user>\`|The database user to use for database setup.|
|\`--db-database \<database>\`|The name of the database used for database setup.|
|\`--db-pass \<password>\`|The database password to use for database setup.|
|\`--db-port \<port>\`|The database port to use for database setup.|
|\`--db-host \<host>\`|The database host to use for database setup.|
|\`--skip-migrations\`|Skip running migrations and seeding.|
|\`--branch \<branch>\`|The branch to clone from the starter repository.|

## Example

```bash
medusa new my-medusa-store
```

After running the command, navigate to your project directory and start the development server:

```bash
cd my-medusa-store
npm run dev
```
