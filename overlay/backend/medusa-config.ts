import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "production", process.cwd())

/**
 * Dokploy / multi-vendor configuration.
 *
 * This file is copied OVER apps/backend/medusa-config.ts inside the Docker
 * image only. The upstream file on disk is never modified, so
 * `git subtree pull` stays conflict-free.
 *
 * It is a superset of the upstream starter config:
 *   - upstream: databaseUrl + http CORS/secrets
 *   - added:    workerMode, admin disable/backendUrl, redisUrl,
 *               Redis infra modules, and the Marketplace module.
 */

const REDIS_URL = process.env.REDIS_URL

// Dokploy's internal Postgres does not terminate TLS. Set DATABASE_SSL=true
// only when pointing at an external managed database that requires it.
const DATABASE_SSL = process.env.DATABASE_SSL === "true"

const redisModules = REDIS_URL
  ? [
      {
        resolve: "@medusajs/medusa/caching",
        options: {
          providers: [
            {
              resolve: "@medusajs/caching-redis",
              id: "caching-redis",
              is_default: true,
              options: {
                redisUrl: process.env.CACHE_REDIS_URL || REDIS_URL,
              },
            },
          ],
        },
      },
      {
        resolve: "@medusajs/medusa/event-bus-redis",
        options: {
          redisUrl: REDIS_URL,
        },
      },
      {
        resolve: "@medusajs/medusa/workflow-engine-redis",
        options: {
          redis: {
            redisUrl: REDIS_URL,
          },
        },
      },
      {
        resolve: "@medusajs/medusa/locking",
        options: {
          providers: [
            {
              resolve: "@medusajs/medusa/locking-redis",
              id: "locking-redis",
              is_default: true,
              options: {
                redisUrl: process.env.LOCKING_REDIS_URL || REDIS_URL,
              },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: DATABASE_SSL
      ? { ssl: { rejectUnauthorized: false } }
      : { ssl: false, sslmode: "disable" },
    redisUrl: REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as
      | "shared"
      | "worker"
      | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules: [
    ...redisModules,
    // Multi-vendor marketplace (official Medusa examples/marketplace recipe)
    {
      resolve: "./src/modules/marketplace",
    },
    // Self-hosted Meilisearch search (meilisearch JS client is yarn-added
    // inside the image only — apps/backend/package.json stays upstream).
    {
      resolve: "./src/modules/meilisearch",
      options: {
        host: process.env.MEILISEARCH_HOST!,
        apiKey: process.env.MEILISEARCH_API_KEY!,
        productIndexName: process.env.MEILISEARCH_PRODUCT_INDEX_NAME!,
      },
    },
  ],
})
