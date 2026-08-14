import { MedusaError } from "@medusajs/framework/utils"

type MeilisearchOptions = {
  host: string
  apiKey: string
  productIndexName: string
}

export type MeilisearchIndexType = "product"

type MeilisearchClient = Awaited<ReturnType<typeof createClient>>
type MeilisearchIndex = Awaited<ReturnType<MeilisearchClient["index"]>>

// The meilisearch package is ESM-only and Medusa compiles src/ to CommonJS,
// so a static `import type` fails TS1541. The type is derived from the
// lazily-loaded client instead; the API layer stays decoupled via this re-export.
export type MeilisearchSearchOptions = NonNullable<
  Parameters<MeilisearchIndex["search"]>[1]
>

type IndexedDocument = {
  id: string
  [key: string]: unknown
}

type LoggerLike = {
  warn: (msg: string, ...args: unknown[]) => void
  info: (msg: string, ...args: unknown[]) => void
}

async function createClient(host: string, apiKey: string) {
  const { Meilisearch } = await import("meilisearch")
  return new Meilisearch({ host, apiKey })
}

function extractLogger(container: unknown): LoggerLike {
  try {
    const c = container as { resolve?: (key: string) => unknown }
    const logger = c?.resolve?.("logger") as LoggerLike | undefined
    if (logger !== undefined) return logger
  } catch {}
  return {
    warn: (msg: string, ...args: unknown[]) => console.warn(msg, ...args),
    info: (msg: string, ...args: unknown[]) => console.info(msg, ...args),
  }
}

export default class MeilisearchModuleService {
  private options: MeilisearchOptions
  private clientPromise: Promise<MeilisearchClient> | undefined
  private clientError: Error | undefined
  private indexConfigured = false
  private logger: LoggerLike

  constructor(container: unknown, options: MeilisearchOptions) {
    if (!options.host || !options.apiKey || !options.productIndexName) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Meilisearch options are required"
      )
    }
    this.options = options
    this.logger = extractLogger(container)
  }

  private async getClient(): Promise<MeilisearchClient | undefined> {
    if (this.clientError) {
      return undefined
    }
    if (!this.clientPromise) {
      this.clientPromise = createClient(this.options.host, this.options.apiKey)
        .then(async (client) => {
          await this.configureIndex(client)
          return client
        })
        .catch((e: unknown) => {
          this.clientError = e instanceof Error ? e : new Error(String(e))
          this.logger.warn(
            "Failed to create Meilisearch client — search will return empty results",
            this.clientError
          )
          return undefined as never
        })
    }
    return this.clientPromise
  }

  private async configureIndex(client: MeilisearchClient) {
    if (this.indexConfigured) return
    try {
      const indexName = await this.getIndexName("product")
      const index = client.index(indexName)
      const task = index.updateSettings({
        searchableAttributes: [
          "title",
          "description",
          "tags.value",
          "categories.name",
        ],
        filterableAttributes: ["id", "categories.id", "tags.id"],
        displayedAttributes: [
          "id",
          "title",
          "description",
          "handle",
          "thumbnail",
          "categories",
          "tags",
          "status",
        ],
      })
      await task.waitTask()
      this.indexConfigured = true
      this.logger.info("Meilisearch index configured with settings")
    } catch (e: unknown) {
      this.logger.warn("Failed to configure Meilisearch index — continuing with defaults", e)
    }
  }

  async getIndexName(type: MeilisearchIndexType) {
    switch (type) {
      case "product":
        return this.options.productIndexName
      default:
        throw new Error(`Invalid index type: ${type}`)
    }
  }

  async indexData(
    data: Record<string, unknown>[],
    type: MeilisearchIndexType = "product"
  ) {
    const client = await this.getClient()
    if (!client) return

    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    try {
      const task = index.addDocuments(data)
      await task.waitTask()
    } catch (e: unknown) {
      this.logger.warn("Failed to index data to Meilisearch", e)
    }
  }

  async retrieveFromIndex(
    documentIds: string[],
    type: MeilisearchIndexType = "product"
  ) {
    const client = await this.getClient()
    if (!client) return []

    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    const results = await Promise.all(
      documentIds.map(async (id) => {
        try {
          return await index.getDocument(id)
        } catch {
          return null
        }
      })
    )

    return results.filter((r): r is IndexedDocument => r !== null)
  }

  async deleteFromIndex(
    documentIds: string[],
    type: MeilisearchIndexType = "product"
  ) {
    const client = await this.getClient()
    if (!client) return

    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    try {
      const task = index.deleteDocuments(documentIds)
      await task.waitTask()
    } catch (e: unknown) {
      this.logger.warn("Failed to delete from Meilisearch", e)
    }
  }

  async search(
    query: string,
    type: MeilisearchIndexType = "product",
    options?: MeilisearchSearchOptions
  ) {
    const client = await this.getClient()
    if (!client) {
      return {
        hits: [],
        estimatedTotalHits: 0,
        query,
        processingTimeMs: 0,
      }
    }

    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    try {
      return await index.search(query, options)
    } catch (e: unknown) {
      this.logger.warn("Meilisearch search failed — returning empty results", e)
      return {
        hits: [],
        estimatedTotalHits: 0,
        query,
        processingTimeMs: 0,
      }
    }
  }
}
