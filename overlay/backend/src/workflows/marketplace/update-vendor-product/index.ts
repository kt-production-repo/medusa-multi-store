import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows"
import verifyVendorProductOwnershipStep from "./steps/verify-vendor-product-ownership"
import vendorProductLink from "../../../links/vendor-product"

export type UpdateVendorProductWorkflowInput = {
  vendor_admin_id: string
  product_id: string
  update: Record<string, unknown>
}

const updateVendorProductWorkflow = createWorkflow(
  "update-vendor-product",
  function (input: UpdateVendorProductWorkflowInput) {
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

    const updateInput = transform(
      { input },
      (data) => ({
        products: [
          {
            id: data.input.product_id,
            ...data.input.update,
          },
        ],
      })
    )

    updateProductsWorkflow.runAsStep({
      input: updateInput as any,
    })

    const { data: products } = useQueryGraphStep({
      entity: "product",
      fields: ["*", "variants.*", "options.*"],
      filters: {
        id: input.product_id,
      },
    }).config({ name: "retrieve-updated-product" })

    return new WorkflowResponse({
      product: products[0],
    })
  }
)

export default updateVendorProductWorkflow
