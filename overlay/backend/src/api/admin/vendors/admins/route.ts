import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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
