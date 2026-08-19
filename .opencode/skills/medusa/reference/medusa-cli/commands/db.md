# db Commands - Medusa CLI Reference

Commands in the Medusa CLI starting with `db:` perform actions on the database.

## db:setup

Creates a database for the Medusa application with the specified name, if it doesn't exist. Then, it runs migrations and syncs links.

It also updates your `.env` file with the database name.

```bash
npx medusa db:setup --db <name>
```

Use this command if you're setting up a Medusa project or database manually.

### Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`--db \<name>\`|The database name.|Yes|-|
|\`--skip-links\`|Skip syncing links to the database.|No|Links are synced by default.|
|\`--execute-safe-links\`|Skip prompts when syncing links and execute only safe actions.|No|Prompts are shown for unsafe actions, by default.|
|\`--execute-all-links\`|Skip prompts when syncing links and execute all (including unsafe) actions.|No|Prompts are shown for unsafe actions, by default.|
|\`--no-interactive\`|Disable the command's prompts.|No|-|

***

## db:create

Creates a database for the Medusa application with the specified name, if it doesn't exist.

It also updates your `.env` file with the database name.

```bash
npx medusa db:create --db <name>
```

Use this command if you want to only create a database.

### Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`--db \<name>\`|The database name.|Yes|-|
|\`--no-interactive\`|Disable the command's prompts.|No|-|

***

## db:generate

Generate a migration file for the latest changes in one or more modules.

```bash
npx medusa db:generate <module_names...>
```

### Arguments

|Argument|Description|Required|
|---|---|---|---|---|
|\`module\_names\`|The name of one or more modules (separated by spaces) to generate migrations for. For example, |Yes|

***

## db:migrate

Run the latest migrations to reflect changes on the database, sync link definitions with the database, and run migration data scripts.

```bash
npx medusa db:migrate
```

Use this command if you've updated the Medusa packages, or you've created customizations and want to reflect them in the database.

### Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`--skip-links\`|Skip syncing links to the database.|No|Links are synced by default.|
|\`--skip-scripts\`|Skip running data migration scripts. This option is added starting from
|No|Data migration scripts are run by default starting from
|
|\`--execute-safe-links\`|Skip prompts when syncing links and execute only safe actions.|No|Prompts are shown for unsafe actions, by default.|
|\`--execute-all-links\`|Skip prompts when syncing links and execute all (including unsafe) actions.|No|Prompts are shown for unsafe actions, by default.|

***

## db:rollback

Revert the last migrations run on one or more modules.

```bash
npx medusa db:rollback <module_names...>
```

### Arguments

|Argument|Description|Required|
|---|---|---|---|---|
|\`module\_names\`|The name of one or more modules (separated by spaces) to rollback their migrations for. For example, |Yes|

***

## db:sync-links

Sync the database with the link definitions in your application, including the definitions in Medusa's modules.

```bash
npx medusa db:sync-links
```

### Options

|Option|Description|Required|Default|
|---|---|---|---|---|---|---|
|\`--execute-safe\`|Skip prompts when syncing links and execute only safe actions.|No|Prompts are shown for unsafe actions, by default.|
|\`--execute-all\`|Skip prompts when syncing links and execute all (including unsafe) actions.|No|Prompts are shown for unsafe actions, by default.|

***

## Reset the Database

The Medusa CLI does not provide a dedicated command to drop or reset the database. To reset your database, drop it manually using PostgreSQL tools, then run `db:setup` to recreate and reinitialize it.

Dropping the database permanently deletes all data. Make sure to back up any data you want to keep before running these commands.

For example, using the `psql` command:

```bash
psql -c "DROP DATABASE <db_name>;"
```

Then, run `db:setup` to create the database and run all migrations:

```bash
npx medusa db:setup --db <db_name>
```
