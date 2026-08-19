import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import createVendorShipmentWorkflow, { CreateVendorShipmentWorkflowInput } from "../../../../../workflows/marketplace/create-vendor-shipment"

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateVendorShipmentWorkflowInput["shipment"] & { fulfillment_id: string }>,
  res: MedusaResponse
) => {
  const { fulfillment_id, ...shipment } = req.validatedBody

  const { result } = await createVendorShipmentWorkflow(req.scope)
    .run({
      input: {
        vendor_admin_id: req.auth_context.actor_id,
        order_id: req.params.id,
        fulfillment_id,
        shipment,
      },
    })

  res.json({
    fulfillment: result.fulfillment,
  })
}