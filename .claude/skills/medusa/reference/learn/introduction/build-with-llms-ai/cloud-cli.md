# Agentic Deployment with Cloud CLI

In this guide, you'll learn how the [Cloud CLI](https://docs.medusajs.com/cloud/cli) supports deployment and debugging through AI agents.

## What is the Cloud CLI?

The Cloud CLI is a command-line interface tool that allows you to manage resources in your applications deployed on [Cloud](https://docs.medusajs.com/cloud). You can view logs, manage deployments, and perform various operations to ensure your application runs smoothly.

***

## Using the Cloud CLI with AI Agents

The Cloud CLI is designed to optimize your agentic development. By combining the Cloud CLI with AI agents, you can automate deployment processes and debug issues more efficiently. AI agents can analyze logs, identify potential issues, and even suggest fixes, making it easier for you to maintain your application.

The Cloud CLI optimizes your agentic development workflow by:

- Providing a scriptable interface to manage your Cloud resources.
- Allowing AI agents to interact with your Cloud environment for tasks like fetching logs, managing deployments, and more.
- Enabling automation of routine tasks in CI/CD pipelines.
- Integrating with AI agents to enhance debugging and deployment processes.

***

## Get Started with the Cloud CLI

To get started with the Cloud CLI with AI agents, copy the following prompt to your agent to get started:

```markdown title="Prompt"
Fetch https://docs.medusajs.com/cloud/cli/agents and set up the Medusa Cloud CLI.
```

You can also install the instructions in that document as a skill in your agent:

### Claude Code

```bash
claude # start claude code
/plugin marketplace add medusajs/medusa-agent-skills
/plugin install medusa-cloud@medusa
```

### Other AI Agents

```bash
npx skills add medusajs/medusa-agent-skills
# choose the following skill:
# - using-medusa-cloud
```

See the [Agentic Deployment with Cloud CLI](https://docs.medusajs.com/cloud/cli/agents) guide for more details.
