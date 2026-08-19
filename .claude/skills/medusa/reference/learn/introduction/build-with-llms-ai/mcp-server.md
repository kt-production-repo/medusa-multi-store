# Medusa MCP Remote Server

The Medusa documentation provides a remote Model Context Protocol (MCP) server that allows you to find information from the Medusa documentation right in your IDEs or AI tools, such as Cursor.

Medusa hosts a Streamable HTTP MCP server at `https://docs.medusajs.com/mcp` that you can add to AI agents supporting MCP server connections.

## Authentication

This MCP server is available for [Cloud](https://docs.medusajs.com/cloud) users only. It requires authenticating with your Cloud account to use it.

The MCP server supports two authentication methods:

1. OAuth: This is the recommended authentication method. It allows you to authenticate with your Cloud account without generating a token manually. When you connect to the MCP server, you will be prompted to log into your Cloud account in a browser window to authenticate.
2. [Personal Access Key](https://docs.medusajs.com/cloud/access-keys#manage-personal-access-keys): Use your Cloud personal access key as a Bearer token in the Authorization header when connecting to the MCP server. This method is useful if you face issues with OAuth or prefer to use a token for authentication.

***

## Connect to the Medusa MCP Server

### Prerequisites

- [Cloud account](https://docs.medusajs.com/cloud)

### Claude Code

To connect to the Medusa MCP server in Claude Code, run the following command in your terminal:

### OAuth

```bash
claude mcp add --transport http medusa https://docs.medusajs.com/mcp
```

### Personal Access Key

```bash
claude mcp add --transport http medusa https://docs.medusajs.com/mcp --header "Authorization: Bearer {token}"
```

Then, start Claude Code and authenticate with your Cloud account:

```sh
claude
/mcp # for oauth
```

If you're connecting with OAuth, select the `medusa` MCP server and choose "Authenticate". This will open a browser window where you can log into your Cloud account to authenticate.

### Codex

To connect to the Medusa MCP server in Codex, use one of the following methods:

### OAuth

```bash
codex mcp add medusa --url https://docs.medusajs.com/mcp
```

### Personal Access Key

```toml title="~/.codex/config.toml"
[mcp_servers.medusa]
url = "https://docs.medusajs.com/mcp"
bearer_token_env_var = "{token}"
```

If you're connecting with OAuth, run the following command in your terminal to authenticate with your Cloud account:

```bash
codex mcp login medusa
```

This will open a browser window where you can log into your Cloud account to authenticate.

### Cursor

Add the following to your `.cursor/mcp.json` file or Cursor settings, as explained in the [Cursor documentation](https://cursor.com/docs/mcp):

### OAuth

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "medusa": {
      "url": "https://docs.medusajs.com/mcp"
    }
  }
}
```

### Personal Access Key

```json title=".cursor/mcp.json"
{
  "mcpServers": {
    "medusa": {
      "url": "https://docs.medusajs.com/mcp",
      "headers": {
        "Authorization": "Bearer {token}"
      }
    }
  }
}
```

If you're connecting with OAuth, open Settings -> Tools & MCPs and click "Connect" next to the `medusa` MCP server. This will open a browser window where you can log into your Cloud account to authenticate.

### VS Code

<Link href="https://vscode.dev/redirect/mcp/install?name=medusa&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fdocs.medusajs.com%2Fmcp%22%7D" target="_blank" rel="noopener noreferrer" variant="content">Click here</Link> to add the Medusa MCP server to VSCode.

To manually connect to the Medusa MCP server in VSCode, add the following to your `.vscode/mcp.json` file in your workspace:

### OAuth

```json title=".vscode/mcp.json"
{
  "servers": {
    "medusa": {
      "type": "http",
      "url": "https://docs.medusajs.com/mcp"
    }
  }
}
```

### Personal Access Key

```json title=".vscode/mcp.json"
{
  "servers": {
    "medusa": {
      "type": "http",
      "url": "https://docs.medusajs.com/mcp",
      "headers": {
        "Authorization": "Bearer {token}"
      }
    }
  }
}
```

If you're connecting with OAuth, once you start the MCP server connection, you will be prompted to authenticate with your Cloud account in a browser window. Log in to authenticate and start using the Medusa MCP server in VSCode.

### OpenCode

Add the following to your [OpenCode config file](https://opencode.ai/docs/config/) (for example, `~/.config/opencode/opencode.json`):

### OAuth

```json title="~/.config/opencode/opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "medusa": {
      "type": "remote",
      "url": "https://docs.medusajs.com/mcp"
    }
  },
}
```

### Personal Access Key

```json title="~/.config/opencode/opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "medusa": {
      "type": "remote",
      "url": "https://docs.medusajs.com/mcp",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "oauth": false
    }
  },
}
```

If you're connecting with OAuth, run the following command in your terminal to authenticate with your Cloud account:

```bash
opencode mcp auth medusa
```

This will open a browser window where you can log into your Cloud account to authenticate.

***

## How to Use the MCP Server

After connecting to the Medusa MCP server in your AI tool or IDE, you can start asking questions or requesting your AI assistant to build Medusa customizations. It will fetch the relevant information from the Medusa documentation and provide you with accurate answers, code snippets, and explanations.

For example, you can ask:

1. "Create a Product Review module for Medusa. Refer to the Medusa documentation for information."
2. "How to update Medusa to the latest version?"
3. "Explain the Medusa workflow system."
4. "Integrate Medusa with X provider. Refer to the Medusa documentation for information."

***

## MCP Server Tools

Beyond answering questions from the documentation, the MCP server provides tools that return curated, step-by-step implementation guides for common tasks. These guides tell your AI agent exactly which Medusa APIs and patterns to use, so it doesn't have to infer them.

The following chapters cover each tool, who it's useful for, and how to use it:
