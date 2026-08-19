import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import createVendorFulfillmentWorkflow, { CreateVendorFulfillmentWorkflowInput } from "../../../../../workflows/marketplace/create-vendor-fulfillment"

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateVendorFulfillmentWorkflowInput["fulfillment"]>,
  res: MedusaResponse
) => {
  const { result } = await createVendorFulfillmentWorkflow(req.scope)
    .run({
      input: {
        vendor_admin_id: req.auth_context.actor_id,
        order_id: req.params.id,
        fulfillment: req.validatedBody,
      },
    })

  res.json({
    fulfillment: result.fulfillment,
  })
}