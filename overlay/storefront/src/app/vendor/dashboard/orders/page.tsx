import { listVendorOrders } from "@lib/data/vendor"
import OrderList from "@modules/vendor/components/order-list"

export default async function VendorOrdersPage() {
  const orders = await listVendorOrders()

  return (
    <div className="flex flex-col gap-6" data-testid="vendor-orders-page">
      <h1 className="text-2xl-semi text-ui-fg-base">Orders</h1>
      <OrderList orders={orders} />
    </div>
  )
}