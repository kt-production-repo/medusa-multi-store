import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { MEILISEARCH_MODULE } from "../../../../modules/meilisearch"
import MeilisearchModuleService from "../../../../modules/meilisearch/service"

export const PostStoreProductSearchSchema = z.object({
  q: z.string().trim().min(1),
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

  const { q } = req.validatedBody
  const hits = await meilisearchModuleService.search(q)

  res.json({ hits })
}