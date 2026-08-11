import { useMemo, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import {
  Heading,
  Text,
  Button,
  Container,
  Tabs,
  Spinner,
  Trash,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import type { Vendor } from "../../../types"
import { ArrowLeft } from "@medusajs/icons"

interface VendorDetailResponse {
  vendor: Vendor
}

export default function VendorDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const vendorId = useSearchParams()[0].get?.("id")
  const { id } = useParams()
  const queryClient = useQueryClient()

  const activeTab = searchParams.get("tab") || "overview"

  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<VendorDetailResponse>(`/admin/vendors/${id}`),
    queryKey: ["admin-vendor", id],
    enabled: !!id,
    staleTime: 10000,
  })

  const deleteAdmin = useMutation({
    mutationFn: (adminId: string) =>
      sdk.client.fetch(`/admin/vendors/admins/${adminId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vendor", id] })
    },
  })

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    )
  }

  const vendor = data.vendor

  return (
    <div className="flex flex-col gap-y-4 p-6">
      <div className="flex items-center gap-x-2">
        <Button
          size="small"
          variant="secondary"
          onClick={() => navigate("/vendors")}
        >
          <ArrowLeft />
        </Button>
        <Heading level="h1">{vendor.name}</Heading>
      </div>

      <Tabs value={activeTab}>
        <Tabs.List>
          <Tabs.Trigger value="overview" asChild>
            <Link to={`?tab=overview`}>Overview</Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="admins" asChild>
            <Link to={`?tab=admins`}>Admins ({vendor.admins.length})</Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="products" asChild>
            <Link to={`?tab=products`}>
              Products ({vendor.products.length})
            </Link>
          </Tabs.Trigger>
          <Tabs.Trigger value="orders" asChild>
            <Link to={`?tab=orders`}>Orders ({vendor.orders.length})</Link>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview">
          <Container className="p-6">
            <div className="flex flex-col gap-y-4">
              <div>
                <Text size="small" leading="compact" weight="plus">
                  Name
                </Text>
                <Text size="small" leading="compact" className="text-ui-fg-subtle">
                  {vendor.name}
                </Text>
              </div>
              <div>
                <Text size="small" leading="compact" weight="plus">
                  Handle
                </Text>
                <Text size="small" leading="compact" className="text-ui-fg-subtle">
                  {vendor.handle || "-"}
                </Text>
              </div>
              <div>
                <Text size="small" leading="compact" weight="plus">
                  Created
                </Text>
                <Text size="small" leading="compact" className="text-ui-fg-subtle">
                  {new Date(vendor.created_at).toLocaleString()}
                </Text>
              </div>
            </div>
          </Container>
        </Tabs.Content>

        <Tabs.Content value="admins">
          <Container className="p-0">
            {vendor.admins.length === 0 ? (
              <div className="p-6">
                <Text size="small" leading="compact" className="text-ui-fg-subtle">
                  No vendor admins
                </Text>
              </div>
            ) : (
              <div className="divide-y">
                {vendor.admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <div className="flex flex-col">
                      <Text size="small" leading="compact" weight="plus">
                        {admin.first_name || admin.last_name
                          ? `${admin.first_name || ""} ${admin.last_name || ""}`.trim()
                          : admin.email}
                      </Text>
                      <Text size="small" leading="compact" className="text-ui-fg-subtle">
                        {admin.email}
                      </Text>
                    </div>
                    <Button
                      size="small"
                      variant="danger"
                      disabled={deleteAdmin.isPending}
                      onClick={() => deleteAdmin.mutate(admin.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Tabs.Content>

        <Tabs.Content value="products">
          {vendor.products.length === 0 ? (
            <div className="p-6">
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                No products linked to this vendor
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-6">
              {vendor.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md"
                >
                  <div className="shadow-elevation-card-rest bg-ui-bg-component flex items-center gap-3 rounded-md px-4 py-3 transition-colors hover:bg-ui-bg-component-hover">
                    <div className="flex flex-1 flex-col">
                      <Text size="small" leading="compact" weight="plus">
                        {product.title}
                      </Text>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Tabs.Content>

        <Tabs.Content value="orders">
          {vendor.orders.length === 0 ? (
            <div className="p-6">
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                No orders linked to this vendor
              </Text>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-6">
              {vendor.orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="outline-none focus-within:shadow-borders-interactive-with-focus rounded-md"
                >
                  <div className="shadow-elevation-card-rest bg-ui-bg-component flex items-center justify-between rounded-md px-4 py-3 transition-colors hover:bg-ui-bg-component-hover">
                    <div className="flex flex-col">
                      <Text size="small" leading="compact" weight="plus">
                        Order #{order.display_id || order.id.substring(0, 8)}
                      </Text>
                      <Text size="small" leading="compact" className="text-ui-fg-subtle">
                        {order.status} - {new Date(order.created_at).toLocaleDateString()}
                      </Text>
                    </div>
                    {order.total && (
                      <Text size="small" leading="compact" weight="plus">
                        {(order.total / 100).toFixed(2)} {order.currency_code?.toUpperCase()}
                      </Text>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Tabs.Content>
      </Tabs>
    </div>
  )
}

function useParams(): { id?: string } {
  const match = useSearchParams()
  return { id: undefined }
}
