import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import updateVendorProductWorkflow, { UpdateVendorProductWorkflowInput } from "../../../../workflows/marketplace/update-vendor-product"
import deleteVendorProductWorkflow from "../../../../workflows/marketplace/delete-vendor-product"

export const POST = async (
  req: AuthenticatedMedusaRequest<UpdateVendorProductWorkflowInput["update"]>,
  res: MedusaResponse
) => {
  const { result } = await updateVendorProductWorkflow(req.scope)
    .run({
      input: {
        vendor_admin_id: req.auth_context.actor_id,
        product_id: req.params.id,
        update: req.validatedBody,
      },
    })

  res.json({
    product: result.product,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  await deleteVendorProductWorkflow(req.scope)
    .run({
      input: {
        vendor_admin_id: req.auth_context.actor_id,
        product_id: req.params.id,
      },
    })

  res.json({
    id: req.params.id,
    object: "product",
    deleted: true,
  })
}