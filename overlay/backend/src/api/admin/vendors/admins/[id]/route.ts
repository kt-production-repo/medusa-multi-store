import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { MARKETPLACE_MODULE } from "../../../modules/marketplace"
import MarketplaceModuleService from "../../../modules/marketplace/service"
import deleteVendorAdminWorkflow from "../../../workflows/marketplace/delete-vendor-admin"

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const marketplaceService: MarketplaceModuleService = req.scope.resolve(
    MARKETPLACE_MODULE
  )

  const vendorAdmin = await marketplaceService
    .retrieveVendorAdmin(req.params.id)
    .catch(() => null)

  if (!vendorAdmin) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Vendor admin with id ${req.params.id} not found`
    )
  }

  await deleteVendorAdminWorkflow(req.scope).run({
    input: { id: req.params.id },
  })

  res.json({
    id: req.params.id,
    deleted: true,
  })
}
