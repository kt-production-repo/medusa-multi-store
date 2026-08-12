import { MedusaError } from "@medusajs/framework/utils"

type MeilisearchOptions = {
  host: string
  apiKey: string
  productIndexName: string
}

export type MeilisearchIndexType = "product"

type IndexedDocument = {
  id: string
  [key: string]: unknown
}

type MeilisearchClient = Awaited<ReturnType<typeof createClient>>

async function createClient(host: string, apiKey: string) {
  const { Meilisearch } = await import("meilisearch")
  return new Meilisearch({ host, apiKey })
}

export default class MeilisearchModuleService {
  private options: MeilisearchOptions
  private clientPromise: Promise<MeilisearchClient> | undefined

  constructor(_container: unknown, options: MeilisearchOptions) {
    if (!options.host || !options.apiKey || !options.productIndexName) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Meilisearch options are required"
      )
    }
    this.options = options
  }

  private async getClient() {
    if (!this.clientPromise) {
      this.clientPromise = createClient(this.options.host, this.options.apiKey)
    }
    return this.clientPromise
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
    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    const documents = data.map((item) => ({
      ...item,
      id: item.id,
    }))

    await index.addDocuments(documents)
  }

  async retrieveFromIndex(
    documentIds: string[],
    type: MeilisearchIndexType = "product"
  ) {
    const client = await this.getClient()
    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    const results = await Promise.all(
      documentIds.map(async (id) => {
        try {
          return await index.getDocument(id)
        } catch (error) {
          // Document not found, return null
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
    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    await index.deleteDocuments(documentIds)
  }

  async search(query: string, type: MeilisearchIndexType = "product") {
    const client = await this.getClient()
    const indexName = await this.getIndexName(type)
    const index = client.index(indexName)

    return await index.search(query)
  }
}