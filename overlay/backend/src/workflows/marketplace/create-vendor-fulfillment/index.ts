import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
  createOrderFulfillmentWorkflow,
} from "@medusajs/medusa/core-flows"
import verifyVendorOrderOwnershipStep from "./steps/verify-vendor-order-ownership"
import vendorOrderLink from "../../../links/vendor-order"

export type CreateVendorFulfillmentWorkflowInput = {
  vendor_admin_id: string
  order_id: string
  fulfillment: {
    items: {
      id: string
      quantity: number
    }[]
    location_id?: string | null
    shipping_option_id?: string
    no_notification?: boolean
    metadata?: Record<string, unknown> | null
  }
}

const createVendorFulfillmentWorkflow = createWorkflow(
  "create-vendor-fulfillment",
  function (input: CreateVendorFulfillmentWorkflowInput) {
    const { data: vendorAdmins } = useQueryGraphStep({
      entity: "vendor_admin",
      fields: ["vendor.id"],
      filters: {
        id: input.vendor_admin_id,
      },
    }).config({ name: "retrieve-vendor-admins" })

    const { data: orderVendors } = useQueryGraphStep({
      entity: vendorOrderLink.entryPoint,
      fields: ["vendor_id"],
      filters: {
        order_id: input.order_id,
      },
    }).config({ name: "retrieve-order-vendors" })

    const ownership = transform(
      { vendorAdmins, orderVendors },
      (data) => {
        return {
          caller_vendor_id: data.vendorAdmins[0]?.vendor?.id,
          order_vendor_id: data.orderVendors[0]?.vendor_id,
        }
      }
    )

    verifyVendorOrderOwnershipStep(ownership)

    const fulfillmentInput = transform(
      { input },
      (data) => ({
        ...data.input.fulfillment,
        order_id: data.input.order_id,
      })
    )

    const fulfillment = createOrderFulfillmentWorkflow.runAsStep({
      input: fulfillmentInput as any,
    })

    return new WorkflowResponse({
      fulfillment,
    })
  }
)

export default createVendorFulfillmentWorkflow