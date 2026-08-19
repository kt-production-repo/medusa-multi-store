import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"

type VerifyVendorOrderOwnershipStepInput = {
  order_vendor_id: string | undefined
  caller_vendor_id: string
}

const verifyVendorOrderOwnershipStep = createStep(
  "verify-vendor-order-ownership",
  async ({ order_vendor_id, caller_vendor_id }: VerifyVendorOrderOwnershipStepInput) => {
    if (!order_vendor_id || order_vendor_id !== caller_vendor_id) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You can only act on orders of your own vendor"
      )
    }

    return new StepResponse({ ok: true })
  }
)

export default verifyVendorOrderOwnershipStep