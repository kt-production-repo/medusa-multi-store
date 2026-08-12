import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteProductsFromMeilisearchStep } from "./steps/delete-products-from-meilisearch"

type DeleteProductsFromMeilisearchWorkflowInput = {
  ids: string[]
}

const deleteProductsFromMeilisearchWorkflow = createWorkflow(
  "delete-products-from-meilisearch",
  (input: DeleteProductsFromMeilisearchWorkflowInput) => {
    deleteProductsFromMeilisearchStep(input)
  }
)

export default deleteProductsFromMeilisearchWorkflow