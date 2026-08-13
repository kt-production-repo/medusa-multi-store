import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { MEILISEARCH_MODULE } from "../../../../modules/meilisearch"
import MeilisearchModuleService, {
  MeilisearchSearchOptions,
} from "../../../../modules/meilisearch/service"

export const PostStoreProductSearchSchema = z.strictObject({
  q: z.string().trim().min(1),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type PostStoreProductSearchBody = z.infer<
  typeof PostStoreProductSearchSchema
>

export const POST = async (
  req: MedusaRequest<PostStoreProductSearchBody>,
  res: MedusaResponse
) => {
  const meilisearchModuleService = req.scope.resolve<MeilisearchModuleService>(
    MEILISEARCH_MODULE
  )

  const { q, limit, offset } = req.validatedBody

  const searchOptions: MeilisearchSearchOptions = {
    ...(limit !== undefined ? { limit } : {}),
    ...(offset !== undefined ? { offset } : {}),
  }

  const result = await meilisearchModuleService.search(q, "product", searchOptions)

  res.json({
    hits: result.hits,
    estimatedTotalHits: result.estimatedTotalHits,
    query: result.query,
    processingTimeMs: result.processingTimeMs,
  })
}
