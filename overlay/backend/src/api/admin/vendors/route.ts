import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

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
