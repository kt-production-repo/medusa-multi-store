import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import createVendorAdminStep from "../create-vendor/steps/create-vendor-admin"
import createVendorStep from "../create-vendor/steps/create-vendor"

export type CreateAdminVendorWorkflowInput = {
  name: string
  handle?: string
  logo?: string
  admin: {
    email: string
    first_name?: string
    last_name?: string
  }
}

const createAdminVendorWorkflow = createWorkflow(
  "create-admin-vendor",
  function (input: CreateAdminVendorWorkflowInput) {
    const vendor = createVendorStep({
      name: input.name,
      handle: input.handle,
      logo: input.logo,
    })

    const vendorAdminData = transform(
      { input, vendor },
      (data) => {
        return {
          ...data.input.admin,
          vendor_id: data.vendor.id,
        }
      }
    )

    createVendorAdminStep(vendorAdminData)

    const { data: vendorWithAdmin } = useQueryGraphStep({
      entity: "vendor",
      fields: ["id", "name", "handle", "logo", "admins.*"],
      filters: {
        id: vendor.id,
      },
    })

    return new WorkflowResponse({
      vendor: vendorWithAdmin[0],
    })
  }
)

export default createAdminVendorWorkflow
