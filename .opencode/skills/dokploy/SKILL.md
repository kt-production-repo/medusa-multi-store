---
name: dokploy
description: Reference documentation for Dokploy core — open-source self-hostable PaaS alternative to Heroku, Vercel, Netlify. Covers installation, applications, databases, Docker Compose, environment variables, domains, monitoring, and troubleshooting.
license: MIT
compatibility: opencode
metadata:
  source: https://docs.dokploy.com/docs/core
  category: reference
  project: medusa-multi-store
---

# Dokploy Core Reference

This skill contains the official Dokploy core documentation, saved locally for offline reference. Dokploy is the deployment platform used by this project (medusa-multi-store) for deploying the multi-vendor marketplace to a self-hosted server via Dokploy on gitea.ktola.org.

---

## Overview

**Dokploy** is an open-source alternative to Heroku, Vercel, and Netlify. It's a stable, easy-to-use deployment solution designed to simplify application management, leveraging the robustness of **Docker** and the flexibility of **Traefik**.

### Why Choose Dokploy?

- **Simplicity**: Easy setup and management of deployments
- **Flexibility**: Supports a wide range of applications and databases
- **Open Source**: Free and open-source software, available for anyone to use

---

## Core Documentation Sections

### Getting Started
| Section | Description |
|---------|-------------|
| [Architecture](https://docs.dokploy.com/docs/core/architecture) | Overview of core architecture components |
| [Features](https://docs.dokploy.com/docs/core/features) | Complete feature list |
| [Comparison](https://docs.dokploy.com/docs/core/comparison) | vs Heroku, Vercel, Netlify, etc. |
| [Installation](https://docs.dokploy.com/docs/core/installation) | Standard installation guide |
| [Manual Installation](https://docs.dokploy.com/docs/core/manual-installation) | Manual setup steps |
| [Reset Password & 2FA](https://docs.dokploy.com/docs/core/reset-password) | Authentication recovery |
| [Uninstall](https://docs.dokploy.com/docs/core/uninstall) | Clean removal |
| [Videos](https://docs.dokploy.com/docs/core/videos) | Video tutorials |
| [Goodies](https://docs.dokploy.com/docs/core/goodies) | Extra utilities |
| [Multi-Tenancy](https://docs.dokploy.com/docs/core/multi-tenancy) | Multi-tenant deployments |

### Interface & Cloud
- [Interface Overview](https://docs.dokploy.com/docs/core/interface-overview) — UI walkthrough
- [Dokploy Cloud](https://docs.dokploy.com/docs/core/cloud) — Managed cloud offering
- [Monitoring](https://docs.dokploy.com/docs/core/monitoring) — Metrics and observability
- [Cloud vs Self-Hosted](https://docs.dokploy.com/docs/core/differences) — Comparison

### Server Features
- [AI Assistant](https://docs.dokploy.com/docs/core/ai) — AI-powered deployment help
- [S3 Destinations](https://docs.dokploy.com/docs/core/s3-destinations) — Backup storage
- [Git Sources](https://docs.dokploy.com/docs/core/git-sources) — Repository integrations
- [Users](https://docs.dokploy.com/docs/core/users) — User management
- [Notifications](https://docs.dokploy.com/docs/core/notifications) — Alert systems
- [Registry](https://docs.dokploy.com/docs/core/registry) — Container registry
- [SSH Keys](https://docs.dokploy.com/docs/core/ssh-keys) — Key management
- [Certificates](https://docs.dokploy.com/docs/core/certificates) — SSL/TLS
- [Backups](https://docs.dokploy.com/docs/core/backups) — Backup strategies
- [Concurrent Builds](https://docs.dokploy.com/docs/core/concurrent-builds) — Parallel builds

### Services (Core Deployment)
| Service | Docs Link | Purpose |
|---------|-----------|---------|
| **Environment Variables** | [variables](https://docs.dokploy.com/docs/core/variables) | App/config secrets, build-time vs runtime |
| **Domains** | [domains](https://docs.dokploy.com/docs/core/domains) | Custom domains, Traefik routing |
| **Applications** | [applications](https://docs.dokploy.com/docs/core/applications) | Deploy apps (Node, Python, Go, etc.) |
| **Docker Compose** | [docker-compose](https://docs.dokploy.com/docs/core/docker-compose) | Multi-container deployments |
| **Databases** | [databases](https://docs.dokploy.com/docs/core/databases) | PostgreSQL, MySQL, MongoDB, Redis, etc. |

### Automation & Operations
- [Auto Deploy](https://docs.dokploy.com/docs/core/auto-deploy) — Git push deployments
- [Schedule Jobs](https://docs.dokploy.com/docs/core/schedule-jobs) — Cron-like tasks
- [Patches](https://docs.dokploy.com/docs/core/patches) — Hotfixes
- [Volume Backups](https://docs.dokploy.com/docs/core/volume-backups) — Persistent data backups
- [Providers](https://docs.dokploy.com/docs/core/providers) — Cloud provider integrations
- [Watch Paths](https://docs.dokploy.com/docs/core/watch-paths) — File change triggers

### Remote Servers
- [Deployment Options](https://docs.dokploy.com/docs/core/deployment-options) — Overview
- [Introduction](https://docs.dokploy.com/docs/core/remote-servers) — Remote server setup
- [Deploy Server](https://docs.dokploy.com/docs/core/remote-servers/instructions) — Target server config
- [Build Server](https://docs.dokploy.com/docs/core/remote-servers/build-server) — Separate build machines
- [Deployments](https://docs.dokploy.com/docs/core/remote-servers/deployments) — Remote deployment flows
- [Security](https://docs.dokploy.com/docs/core/remote-servers/security) — Hardening
- [Validate](https://docs.dokploy.com/docs/core/remote-servers/validate) — Connection testing

### Advanced
- [Cluster](https://docs.dokploy.com/docs/core/cluster) — Multi-node clusters

### Enterprise
- [Introduction](https://docs.dokploy.com/docs/core/enterprise)
- [License Keys](https://docs.dokploy.com/docs/core/enterprise/license-keys)
- [SSO](https://docs.dokploy.com/docs/core/enterprise/sso)
- [SCIM Provisioning](https://docs.dokploy.com/docs/core/enterprise/scim)
- [Whitelabeling](https://docs.dokploy.com/docs/core/enterprise/whitelabeling)
- [Custom Roles](https://docs.dokploy.com/docs/core/enterprise/custom-roles)
- [Audit Logs](https://docs.dokploy.com/docs/core/enterprise/audit-logs)

### Troubleshooting
| Issue Area | Guide |
|------------|-------|
| General | [Troubleshooting](https://docs.dokploy.com/docs/core/troubleshooting) |
| Domains & Traefik | [Domains](https://docs.dokploy.com/docs/core/troubleshooting/domains) |
| Volumes & Mounts | [Volumes](https://docs.dokploy.com/docs/core/troubleshooting/volumes-mounts) |
| Networking & DNS | [Networking](https://docs.dokploy.com/docs/core/troubleshooting/networking) |
| Logs & Monitoring | [Logs](https://docs.dokploy.com/docs/core/troubleshooting/logs-monitoring) |
| Instance Issues | [Instance](https://docs.dokploy.com/docs/core/troubleshooting/instance) |

### Guides
- [Cloudflare Tunnels](https://docs.dokploy.com/docs/core/guides/cloudflare-tunnels)
- [Tailscale](https://docs.dokploy.com/docs/core/guides/tailscale)
- [GitHub](https://github.com/Dokploy/dokploy)

---

## CLI Reference

Source: https://docs.dokploy.com/docs/cli

The Dokploy CLI is a command-line tool for remotely managing your Dokploy server. It simplifies creating, deploying, and managing applications and databases.

### Installation

```bash
npm install -g @dokploy/cli
```

### Usage

```bash
dokploy COMMAND
```

Get help on a specific command:

```bash
dokploy COMMAND --help
```

### CLI Commands

| Command | Description | Docs |
|---------|-------------|------|
| `application` | Manage applications (create, deploy, logs, etc.) | [Application](https://docs.dokploy.com/docs/cli/application) |
| `authentication` | Login, logout, token management | [Authentication](https://docs.dokploy.com/docs/cli/authentication) |
| `databases` | Manage databases (PostgreSQL, MySQL, MongoDB, Redis, etc.) | [Databases](https://docs.dokploy.com/docs/cli/databases) |
| `enviroment` | Manage environment variables | [Environment](https://docs.dokploy.com/docs/cli/enviroment) |
| `project` | Manage projects (create, list, delete) | [Project](https://docs.dokploy.com/docs/cli/project) |

### Quick CLI Examples

```bash
# Login to Dokploy server
dokploy auth login

# List projects
dokploy project list

# Create a new project
dokploy project create --name my-project

# Deploy an application
dokploy application deploy --project my-project --name my-app

# View application logs
dokploy application logs --project my-project --name my-app

# Set environment variable
dokploy enviroment set --project my-project --name my-app --key KEY --value VALUE

# Create a PostgreSQL database
dokploy database create postgres --project my-project --name my-db
```

---

## API Reference

Source: https://docs.dokploy.com/docs/api

The Dokploy API provides programmatic access to all platform features. By default, the OpenAPI base URL is `http://localhost:3000/api` (replace with your Dokploy instance IP or domain).

### Authentication

The API uses **JWT tokens** for authentication.

**For Administrators:**
1. Access Swagger UI at `your-vps-ip:3000/swagger`
2. Restricted to authenticated administrators only

**For Users:**
1. No direct API access by default
2. Administrators can grant access via `/settings/profile` → API/CLI Section → Generate Token
3. Use the generated token as `x-api-key` header

### Authenticated Request Example

```bash
curl -X 'GET' \
  'https://your-dokploy-instance.com/api/project.all' \
  -H 'accept: application/json' \
  -H 'x-api-key: YOUR-GENERATED-API-KEY'
```

### API Endpoints Reference

| Category | Endpoints | Description |
|----------|-----------|-------------|
| **Admin** | [admin](https://docs.dokploy.com/docs/api/admin) | Admin-only operations |
| **AI** | [ai](https://docs.dokploy.com/docs/api/ai) | AI assistant features |
| **Application** | [application](https://docs.dokploy.com/docs/api/application) | App CRUD, deploy, logs, domains |
| **Backup** | [backup](https://docs.dokploy.com/docs/api/backup) | Backup management |
| **Bitbucket** | [bitbucket](https://docs.dokploy.com/docs/api/bitbucket) | Bitbucket Git integration |
| **Certificates** | [certificates](https://docs.dokploy.com/docs/api/certificates) | SSL/TLS certificates |
| **Cluster** | [cluster](https://docs.dokploy.com/docs/api/cluster) | Multi-node clustering |
| **Compose** | [compose](https://docs.dokploy.com/docs/api/compose) | Docker Compose projects |
| **Deployment** | [deployment](https://docs.dokploy.com/docs/api/deployment) | Deployment operations |
| **Destination** | [destination](https://docs.dokploy.com/docs/api/destination) | Backup destinations (S3, etc.) |
| **Docker** | [docker](https://docs.dokploy.com/docs/api/docker) | Docker image/registry ops |
| **Domain** | [domain](https://docs.dokploy.com/docs/api/domain) | Custom domain management |
| **Environment** | [environment](https://docs.dokploy.com/docs/api/environment) | Environment variables |
| **Gitea** | [gitea](https://docs.dokploy.com/docs/api/gitea) | Gitea Git integration |
| **GitHub** | [github](https://docs.dokploy.com/docs/api/github) | GitHub integration |
| **GitLab** | [gitlab](https://docs.dokploy.com/docs/api/gitlab) | GitLab integration |
| **Git Provider** | [git-provider](https://docs.dokploy.com/docs/api/git-provider) | Generic Git provider |
| **MariaDB** | [mariadb](https://docs.dokploy.com/docs/api/mariadb) | MariaDB databases |
| **MongoDB** | [mongodb](https://docs.dokploy.com/docs/api/mongodb) | MongoDB databases |
| **Monitoring** | [monitoring](https://docs.dokploy.com/docs/api/monitoring) | Metrics & monitoring |
| **MySQL** | [mysql](https://docs.dokploy.com/docs/api/mysql) | MySQL databases |
| **Notification** | [notification](https://docs.dokploy.com/docs/api/notification) | Notification systems |
| **PostgreSQL** | [postgres](https://docs.dokploy.com/docs/api/postgres) | PostgreSQL databases |
| **Project** | [project](https://docs.dokploy.com/docs/api/project) | Project CRUD |
| **Redis** | [redis](https://docs.dokploy.com/docs/api/redis) | Redis databases |
| **Registry** | [registry](https://docs.dokploy.com/docs/api/registry) | Container registry |
| **Remote Server** | [remote-server](https://docs.dokploy.com/docs/api/remote-server) | Remote deploy targets |
| **Schedule** | [schedule](https://docs.dokploy.com/docs/api/schedule) | Cron job scheduling |
| **Server** | [server](https://docs.dokploy.com/docs/api/server) | Server management |
| **Settings** | [settings](https://docs.dokploy.com/docs/api/settings) | Global settings |
| **SSH Keys** | [ssh-keys](https://docs.dokploy.com/docs/api/ssh-keys) | SSH key management |
| **User** | [user](https://docs.dokploy.com/docs/api/user) | User management |
| **Volume** | [volume](https://docs.dokploy.com/docs/api/volume) | Persistent volumes |
| **Watch Path** | [watch-path](https://docs.dokploy.com/docs/api/watch-path) | File watch triggers |

### Common API Operations

**List all projects:**
```bash
GET /api/project.all
```

**Create a project:**
```bash
POST /api/project.create
Content-Type: application/json
{
  "name": "my-project",
  "description": "My Medusa marketplace"
}
```

**Deploy an application:**
```bash
POST /api/application.deploy
Content-Type: application/json
{
  "projectId": "project-id",
  "applicationId": "app-id"
}
```

**Manage environment variables:**
```bash
# Get env vars
GET /api/environment.getAll?projectId=xxx&applicationId=xxx

# Set env var
POST /api/environment.create
{
  "projectId": "xxx",
  "applicationId": "xxx",
  "key": "NEXT_PUBLIC_API_URL",
  "value": "https://api.example.com"
}
```

---

## Key Concepts for This Project

### Deployment Topology (medusa-multi-store)
This project deploys to Dokploy as separate container services:
1. **Databases** → PostgreSQL (vendors, marketplace data)
2. **Meilisearch** → Search engine
3. **Backend Server** → Medusa backend API
4. **Backend Worker** → Background jobs
5. **Storefront** → Next.js Medusa storefront

**Order matters**: Databases → Meilisearch → Backend Server → Backend Worker → Storefront

### Environment Variables (Critical)
From the project's AGENTS.md:
- `NEXT_PUBLIC_*` — Inlined at build time **AND** checked at boot → Set as **both** Build Time Arguments and Runtime Environment Variables in Dokploy
- `MEDUSA_BACKEND_URL` (storefront) — Public domain at build time, internal service name at runtime
- Admin `backendUrl` — Compiled into admin bundle → Must be a Build Arg on backend server service

### Build-time vs Runtime
Getting this wrong causes silent production failures. The project has been bitten by this before.

---

## Quick Reference Commands

### Using Dokploy CLI (if available)
```bash
# Deploy project
dokploy deploy

# View logs
dokploy logs <service>

# Manage env vars
dokploy env:set KEY=value
dokploy env:get KEY
```

### Via Dokploy UI
1. Navigate to your project in Dokploy dashboard
2. Configure services: Applications, Databases, Docker Compose
3. Set Environment Variables (Build Time + Runtime as needed)
4. Configure Domains with Traefik
5. Enable Auto Deploy from Git (gitea.ktola.org)
6. Monitor via built-in Monitoring

---

## Related Project Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local development stack |
| `deploy/backend/Dockerfile` | Backend container image |
| `deploy/backend/entrypoint.sh` | Backend startup script |
| `deploy/storefront/Dockerfile` | Storefront container image |
| `deploy/meilisearch/Dockerfile` | Meilisearch container image |
| `env/*.env.example` | Environment variable templates |
| `scripts/bootstrap.sh` | Initialization script |
| `AGENTS.md` | Project rules (overlay architecture, deployment order) |

---

## Source

This reference was saved from: https://docs.dokploy.com/docs/core (last updated: Aug 14, 2026)