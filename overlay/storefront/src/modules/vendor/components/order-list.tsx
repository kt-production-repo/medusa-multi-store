"use client"

import { fulfillVendorOrder, shipVendorOrder, VendorOrder } from "@lib/data/vendor"
import { useActionState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"

type OrderListProps = {
  orders: VendorOrder[]
}

const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div className="flex flex-col gap-4" data-testid="vendor-order-list">
      {orders.length === 0 && (
        <p className="text-small-regular text-ui-fg-muted">No orders yet.</p>
      )}
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  )
}

const OrderRow = ({ order }: { order: VendorOrder }) => {
  const [fulfillMessage, fulfillAction] = useActionState(fulfillVendorOrder, null)
  const [shipMessage, shipAction] = useActionState(shipVendorOrder, null)

  const canFulfill =
    order.fulfillment_status === "not_fulfilled" ||
    order.fulfillment_status === "partially_fulfilled"

  const lastFulfillment = order.fulfillments?.[order.fulfillments.length - 1]
  const canShip = canFulfill && lastFulfillment

  const fulfillError =
    fulfillMessage && typeof fulfillMessage === "object" && !fulfillMessage.success
      ? (fulfillMessage as { error: string }).error
      : null
  const shipError =
    shipMessage && typeof shipMessage === "object" && !shipMessage.success
      ? (shipMessage as { error: string }).error
      : null

  return (
    <div className="rounded border border-ui-border-base p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-base-semi text-ui-fg-base">
            #{order.display_id} ({order.currency_code?.toUpperCase()})
          </span>
          <span className="text-small-regular text-ui-fg-muted">
            {order.status} / {order.fulfillment_status} / {order.payment_status}
          </span>
        </div>
        <span className="text-base-semi text-ui-fg-base">{order.total}</span>
      </div>
      <div className="flex flex-col gap-1">
        {(order.items ?? []).map((item) => (
          <span key={item.id} className="text-small-regular text-ui-fg-base">
            {item.title} x {item.quantity}
          </span>
        ))}
      </div>

      {canFulfill && (
        <form
          action={fulfillAction}
          className="flex items-end gap-2"
          data-testid="vendor-fulfill-form"
        >
          <input type="hidden" name="order_id" value={order.id} />
          <div className="flex flex-col gap-1 flex-1">
            {(order.items ?? []).map((item) => (
              <input
                key={item.id}
                type="hidden"
                name="item_id"
                value={item.id}
              />
            ))}
            <span className="text-small-regular text-ui-fg-muted">
              Fulfill all items
            </span>
          </div>
          <SubmitButton data-testid="vendor-fulfill-button">Fulfill</SubmitButton>
        </form>
      )}
      <ErrorMessage error={fulfillError} data-testid="vendor-fulfill-error" />

      {canShip && (
        <form
          action={shipAction}
          className="flex flex-col gap-y-2"
          data-testid="vendor-ship-form"
        >
          <input type="hidden" name="order_id" value={order.id} />
          <input
            type="hidden"
            name="fulfillment_id"
            value={lastFulfillment.id}
          />
          {(order.items ?? []).map((item) => (
            <input key={item.id} type="hidden" name="item_id" value={item.id} />
          ))}
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border border-ui-border-base rounded p-2 text-small-regular"
              name="tracking_number"
              placeholder="Tracking number"
            />
            <input
              className="border border-ui-border-base rounded p-2 text-small-regular"
              name="tracking_url"
              placeholder="Tracking URL"
            />
          </div>
          <SubmitButton data-testid="vendor-ship-button">Ship</SubmitButton>
        </form>
      )}
      <ErrorMessage error={shipError} data-testid="vendor-ship-error" />
    </div>
  )
}

export default OrderList