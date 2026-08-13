import { 
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"
import { DeleteVendorAdminWorkflow } from ".."

const deleteVendorAdminStep = createStep(
  "delete-vendor-admin-step",
  async ({ id, vendor_id }: DeleteVendorAdminWorkflow, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService = 
      container.resolve(MARKETPLACE_MODULE)

    const vendorAdmin = await marketplaceModuleService.retrieveVendorAdmin(id)

    // When called from the vendor-facing route, the caller may only remove an
    // admin of their own vendor. Admin-scoped calls omit vendor_id.
    if (vendor_id && vendorAdmin.vendor_id !== vendor_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot remove a vendor admin of another vendor"
      )
    }

    await marketplaceModuleService.deleteVendorAdmins(id)

    return new StepResponse(
      undefined,
      vendorAdmin
    )
  },
  async (vendorAdmin, { container }) => {
    if (!vendorAdmin) {
      return
    }
    const marketplaceModuleService: MarketplaceModuleService = 
      container.resolve(MARKETPLACE_MODULE)

    const { vendor: _, ...vendorAdminData } = vendorAdmin

    await marketplaceModuleService.createVendorAdmins(vendorAdminData)
  }
)

export default deleteVendorAdminStep