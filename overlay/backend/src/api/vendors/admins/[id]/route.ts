import {
  AuthenticatedMedusaRequest,
  MedusaResponse
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { deleteVendorAdminWorkflow } from "../../../../workflows/marketplace/delete-vendor-admin"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [caller]
  } = await query.graph({
    entity: "vendor_admin",
    fields: ["vendor_id"],
    filters: { id: req.auth_context.actor_id }
  })

  await deleteVendorAdminWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      vendor_id: caller?.vendor_id
    }
  })

  res.json({ message: "success" })
}