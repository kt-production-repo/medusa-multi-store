import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import addVendorAdminWorkflow from "../../../../workflows/marketplace/add-vendor-admin"

export const AdminAddVendorAdminSchema = z
  .object({
    vendor_id: z.string(),
    email: z.string(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  })
  .strict()

export type AdminAddVendorAdminBody = z.infer<typeof AdminAddVendorAdminSchema>

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "vendor_admin",
    fields: [
      "id",
      "email",
      "first_name",
      "last_name",
      "created_at",
      "vendor.id",
      "vendor.name",
      "vendor.handle",
    ],
    pagination: {
      skip: req.validatedQuery.offset,
      take: req.validatedQuery.limit,
    },
    ...(req.validatedQuery.q
      ? {
          filters: {
            $or: [
              { email: { $ilike: `%${req.validatedQuery.q}%` } },
              { vendor: { name: { $ilike: `%${req.validatedQuery.q}%` } } },
            ],
          },
        }
      : {}),
  })

  res.json({
    vendor_admins: data,
    count: metadata?.count || data.length,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminAddVendorAdminBody>,
  res: MedusaResponse
) => {
  const { result } = await addVendorAdminWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.json({
    vendor_admin: result.vendor_admin,
  })
}
