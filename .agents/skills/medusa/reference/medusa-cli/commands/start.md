# start Command - Medusa CLI Reference

Start the Medusa application in production.

```bash
npx medusa start
```

## Options

|Option|Description|Default|
|---|---|---|---|---|
|\`-H \<host>\`|Set host of the Medusa server.|\`localhost\`|
|\`-p \<port>\`|Set port of the Medusa server.|\`9000\`|
|\`--cluster \<string> \[--workers \<string>] \[--servers \<string>]\`|Start Medusa in cluster mode. Learn more in the |Cluster mode is disabled by default. If the option is passed but no number or percentage is passed, Medusa will try to consume all available CPU cores.|

***

## Starting Medusa in Cluster Mode

Prior to [Medusa v2.11.0](https://github.com/medusajs/medusa/releases/tag/v2.11.0), the `--cluster` option accepted a number value only. You can now pass either a number or a percentage value, and you can also specify the number of servers and workers.

Medusa supports starting the Node.js server in [cluster mode](https://expressjs.com/en/advanced/best-practice-performance.html#run-your-app-in-a-cluster), which significantly improves performance as the workload and tasks are distributed among all available instances instead of a single one.

Cluster mode is disabled by default. To enable it, pass the `--cluster` option when starting Medusa:

```bash
npx medusa start --cluster
```

When the `--cluster` option is passed without a number or percentage value, Medusa will try to consume all available CPU cores.

### Specify Number or Percentage of CPU Cores

You can specify the number or percentage of CPU cores to be used by passing a number or percentage value to the `--cluster` option:

```bash
npx medusa start --cluster 2       # Use 2 CPU cores
npx medusa start --cluster 50%      # Use 50% of available CPU
```

### Specify Number of Servers and Workers

When running Medusa in cluster mode, you can specify the number or percentage of instances that are [servers or workers](https://docs.medusajs.com/docs/learn/production/worker-mode) by passing the `--servers` and `--workers` options:

```bash
npx medusa start --cluster 4 --servers 25% --workers 75% # Use 4 CPU cores, with 25% as servers and 75% as workers
npx medusa start --cluster 4 --servers 1 --workers 3       # Use 4 CPU cores, with 1 as server and 3 as workers
npx medusa start --cluster 4 --servers 1 --workers 1      # Use 4 CPU cores, with 1 as server and 1 as worker (the remaining 2 will run in shared mode)
```

When the number or percentage of servers and workers don't add up to the total number of instances in cluster mode, the remaining instances will run in shared mode.

Learn more in the [Worker Mode](https://docs.medusajs.com/docs/learn/production/worker-mode) guide.
