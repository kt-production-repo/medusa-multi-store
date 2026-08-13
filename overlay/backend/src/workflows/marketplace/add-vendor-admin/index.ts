import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import createVendorAdminStep from "../create-vendor/steps/create-vendor-admin"

export type AddVendorAdminWorkflowInput = {
  email: string
  first_name?: string
  last_name?: string
  vendor_id: string
}

const addVendorAdminWorkflow = createWorkflow(
  "add-vendor-admin",
  function (input: AddVendorAdminWorkflowInput) {
    const vendorAdmin = createVendorAdminStep(input)

    return new WorkflowResponse({
      vendor_admin: vendorAdmin,
    })
  }
)

export default addVendorAdminWorkflow