import Link from "next/link"
import { retrieveVendor } from "@lib/data/vendor"

export default async function VendorDashboardOverview() {
  const vendor = await retrieveVendor()

  if (!vendor) {
    return null
  }

  const stats = vendor.stats ?? { product_count: 0, order_count: 0 }

  return (
    <div className="flex flex-col gap-6" data-testid="vendor-overview">
      <h1 className="text-2xl-semi text-ui-fg-base">Overview</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded border border-ui-border-base p-4 flex flex-col gap-1">
          <span className="text-small-regular text-ui-fg-muted">Products</span>
          <span className="text-2xl-semi text-ui-fg-base">
            {stats.product_count}
          </span>
        </div>
        <div className="rounded border border-ui-border-base p-4 flex flex-col gap-1">
          <span className="text-small-regular text-ui-fg-muted">Orders</span>
          <span className="text-2xl-semi text-ui-fg-base">
            {stats.order_count}
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <Link
          href="/vendor/dashboard/products"
          className="text-small-regular text-ui-fg-base underline"
        >
          Manage products
        </Link>
        <Link
          href="/vendor/dashboard/orders"
          className="text-small-regular text-ui-fg-base underline"
        >
          Manage orders
        </Link>
      </div>
    </div>
  )
}