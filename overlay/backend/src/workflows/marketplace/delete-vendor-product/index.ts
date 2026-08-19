import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import verifyVendorProductOwnershipStep from "./steps/verify-vendor-product-ownership"
import vendorProductLink from "../../../links/vendor-product"

export type DeleteVendorProductWorkflowInput = {
  vendor_admin_id: string
  product_id: string
}

const deleteVendorProductWorkflow = createWorkflow(
  "delete-vendor-product",
  function (input: DeleteVendorProductWorkflowInput) {
    const { data: vendorAdmins } = useQueryGraphStep({
      entity: "vendor_admin",
      fields: ["vendor.id"],
      filters: {
        id: input.vendor_admin_id,
      },
    }).config({ name: "retrieve-vendor-admins" })

    const { data: productVendors } = useQueryGraphStep({
      entity: vendorProductLink.entryPoint,
      fields: ["vendor_id"],
      filters: {
        product_id: input.product_id,
      },
    }).config({ name: "retrieve-product-vendors" })

    const ownership = transform(
      { vendorAdmins, productVendors },
      (data) => {
        return {
          caller_vendor_id: data.vendorAdmins[0]?.vendor?.id,
          product_vendor_id: data.productVendors[0]?.vendor_id,
        }
      }
    )

    verifyVendorProductOwnershipStep(ownership)

    deleteProductsWorkflow.runAsStep({
      input: {
        ids: [input.product_id],
      },
    })

    return new WorkflowResponse({
      id: input.product_id,
    })
  }
)

export default deleteVendorProductWorkflow