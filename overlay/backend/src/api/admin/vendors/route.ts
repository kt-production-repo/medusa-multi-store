import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"
import createAdminVendorWorkflow from "../../../workflows/marketplace/create-admin-vendor"

export const AdminCreateVendorSchema = z.strictObject({
  name: z.string(),
  handle: z.string().optional(),
  logo: z.string().optional(),
  admin: z.strictObject({
    email: z.email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
  }),
})

export type AdminCreateVendorBody = z.infer<typeof AdminCreateVendorSchema>
export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data, metadata } = await query.graph({
    entity: "vendor",
    fields: [
      "id",
      "name",
      "handle",
      "logo",
      "admins.*",
      "products.*",
      "orders.*",
    ],
    pagination: {
      skip: req.validatedQuery.offset,
      take: req.validatedQuery.limit,
    },
    ...(req.validatedQuery.q
      ? {
          filters: {
            $or: [
              { name: { $ilike: `%${req.validatedQuery.q}%` } },
              { handle: { $ilike: `%${req.validatedQuery.q}%` } },
            ],
          },
        }
      : {}),
  })

  res.json({
    vendors: data,
    count: metadata?.count || data.length,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateVendorBody>,
  res: MedusaResponse
) => {
  const { result } = await createAdminVendorWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.json({
    vendor: result.vendor,
  })
}