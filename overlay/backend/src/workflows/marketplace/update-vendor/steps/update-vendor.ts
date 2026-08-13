import { 
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import MarketplaceModuleService from "../../../../modules/marketplace/service"
import { MARKETPLACE_MODULE } from "../../../../modules/marketplace"

type UpdateVendorStepInput = {
  id: string
  name?: string
  handle?: string
  logo?: string | null
}

const updateVendorStep = createStep(
  "update-vendor-step",
  async (input: UpdateVendorStepInput, { container }) => {
    const marketplaceModuleService: MarketplaceModuleService = 
      container.resolve(MARKETPLACE_MODULE)

    const vendor = await marketplaceModuleService.retrieveVendor(input.id)

    const updateData = {
      id: input.id,
      ...(input.name !== undefined && { name: input.name }),
      ...(input.handle !== undefined && { handle: input.handle }),
      ...(input.logo !== undefined && { logo: input.logo }),
    }

    const updatedVendor = await marketplaceModuleService.updateVendors(
      updateData
    )

    return new StepResponse(updatedVendor, vendor)
  },
  async (previousVendor, { container }) => {
    if (!previousVendor) {
      return
    }

    const marketplaceModuleService: MarketplaceModuleService = 
      container.resolve(MARKETPLACE_MODULE)

    const restoreData = {
      id: previousVendor.id,
      ...(previousVendor.name !== undefined && {
        name: previousVendor.name,
      }),
      ...(previousVendor.handle !== undefined && {
        handle: previousVendor.handle,
      }),
      ...(previousVendor.logo !== undefined && {
        logo: previousVendor.logo,
      }),
    }

    await marketplaceModuleService.updateVendors(restoreData)
  }
)

export default updateVendorStep
