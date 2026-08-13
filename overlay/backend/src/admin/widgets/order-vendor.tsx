import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Text } from "@medusajs/ui"
import { BuildingStorefront, TriangleRightMini } from "@medusajs/icons"
import { sdk } from "../lib/client"

interface OrderVendorResponse {
  vendor: {
    id: string
    name: string
    handle?: string | null
  } | null
}

const OrderVendorWidget = ({ data }: DetailWidgetProps<{ id: string }>) => {
  const { data: response, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<OrderVendorResponse>(`/admin/orders/${data.id}/vendor`),
    queryKey: ["order-vendor", data.id],
    enabled: !!data.id,
    retry: false,
  })

  const vendor = response?.vendor

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-y-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Vendor
        </Text>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Loading...
        </Text>
      </Container>
    )
  }

  if (!vendor) {
    return null
  }

  return (
    <Container className="flex flex-col gap-y-2 px-6 py-4">
      <Text size="small" leading="compact" weight="plus">
        Vendor
      </Text>
      <Link
        to={`/vendors/${vendor.id}`}
        className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md [&:hover>div]:bg-ui-bg-component-hover"
      >
        <div className="shadow-elevation-card-rest bg-ui-bg-component flex items-center gap-3 rounded-md px-4 py-3 transition-colors">
          <BuildingStorefront className="text-ui-fg-muted" />
          <div className="flex flex-1 flex-col">
            <Text size="small" leading="compact" weight="plus">
              {vendor.name}
            </Text>
            {vendor.handle && (
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {vendor.handle}
              </Text>
            )}
          </div>
          <div className="size-7 flex items-center justify-center">
            <TriangleRightMini className="text-ui-fg-muted rtl:rotate-180" />
          </div>
        </div>
      </Link>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details",
})

export default OrderVendorWidget