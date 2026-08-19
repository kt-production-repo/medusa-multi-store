import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  useQueryGraphStep,
  createOrderShipmentWorkflow,
} from "@medusajs/medusa/core-flows"
import verifyVendorOrderOwnershipStep from "./steps/verify-vendor-order-ownership"
import vendorOrderLink from "../../../links/vendor-order"

export type CreateVendorShipmentWorkflowInput = {
  vendor_admin_id: string
  order_id: string
  fulfillment_id: string
  shipment: {
    items: {
      id: string
      quantity: number
    }[]
    labels?: {
      tracking_number: string
      tracking_url: string
      label_url: string
    }[]
    no_notification?: boolean
    metadata?: Record<string, unknown> | null
  }
}

const createVendorShipmentWorkflow = createWorkflow(
  "create-vendor-shipment",
  function (input: CreateVendorShipmentWorkflowInput) {
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

    const shipmentInput = transform(
      { input },
      (data) => ({
        ...data.input.shipment,
        order_id: data.input.order_id,
        fulfillment_id: data.input.fulfillment_id,
      })
    )

    const fulfillment = createOrderShipmentWorkflow.runAsStep({
      input: shipmentInput as any,
    })

    return new WorkflowResponse({
      fulfillment,
    })
  }
)

export default createVendorShipmentWorkflow