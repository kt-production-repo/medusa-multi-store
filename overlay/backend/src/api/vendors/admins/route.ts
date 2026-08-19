import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import addVendorAdminWorkflow from "../../../workflows/marketplace/add-vendor-admin"

export const PostVendorAddAdminSchema = z.strictObject({
  email: z.email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

type RequestBody = z.infer<typeof PostVendorAddAdminSchema>

export const POST = async (
  req: AuthenticatedMedusaRequest<RequestBody>,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [vendorAdmin] } = await query.graph({
    entity: "vendor_admin",
    fields: ["vendor_id"],
    filters: {
      id: [req.auth_context.actor_id],
    },
  })

  const { result } = await addVendorAdminWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      vendor_id: vendorAdmin.vendor_id,
    },
  })

  res.json({
    vendor_admin: result.vendor_admin,
  })
}