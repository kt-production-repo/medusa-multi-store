import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "vendor.id", "vendor.name", "vendor.handle", "vendor.logo"],
    filters: {
      id: req.params.id,
    },
  })

  const vendor = data[0]?.vendor

  if (!vendor) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `No vendor linked to product ${req.params.id}`
    )
  }

  res.json({
    vendor,
  })
}
