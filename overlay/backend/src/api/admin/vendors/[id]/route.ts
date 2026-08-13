import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import updateVendorWorkflow from "../../../../workflows/marketplace/update-vendor"

export const AdminUpdateVendorSchema = z.strictObject({
  name: z.string().optional(),
  handle: z.string().optional(),
  logo: z.string().nullable().optional(),
})

export type AdminUpdateVendorBody = z.infer<typeof AdminUpdateVendorSchema>

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "vendor",
    fields: [
      "id",
      "name",
      "handle",
      "logo",
      "created_at",
      "updated_at",
      "admins.*",
      "products.id",
      "products.title",
      "products.thumbnail",
      "orders.id",
      "orders.items.*",
    ],
    filters: {
      id: req.params.id,
    },
  })

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Vendor with id ${req.params.id} not found`
    )
  }

  res.json({
    vendor: data[0],
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateVendorBody>,
  res: MedusaResponse
) => {
  const { result } = await updateVendorWorkflow(req.scope).run({
    input: {
      id: req.params.id,
      ...req.validatedBody,
    },
  })

  res.json({
    vendor: result.vendor,
  })
}