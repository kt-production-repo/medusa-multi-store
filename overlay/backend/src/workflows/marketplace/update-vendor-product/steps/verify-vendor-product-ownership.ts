import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"

type VerifyVendorProductOwnershipStepInput = {
  product_vendor_id: string | undefined
  caller_vendor_id: string
}

const verifyVendorProductOwnershipStep = createStep(
  "verify-vendor-product-ownership",
  async ({ product_vendor_id, caller_vendor_id }: VerifyVendorProductOwnershipStepInput) => {
    if (!product_vendor_id || product_vendor_id !== caller_vendor_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can only update products of your own vendor"
      )
    }

    return new StepResponse({ ok: true })
  }
)

export default verifyVendorProductOwnershipStep
