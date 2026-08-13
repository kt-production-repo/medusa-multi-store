import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import updateVendorStep from "./steps/update-vendor"

export type UpdateVendorWorkflowInput = {
  id: string
  name?: string
  handle?: string
  logo?: string | null
}

const updateVendorWorkflow = createWorkflow(
  "update-vendor",
  function (input: UpdateVendorWorkflowInput) {
    const vendor = updateVendorStep(input)

    return new WorkflowResponse({
      vendor,
    })
  }
)

export default updateVendorWorkflow