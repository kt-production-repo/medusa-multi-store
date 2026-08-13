import { useState } from "react"
import { useNavigate, useSearchParams, Link, useParams } from "react-router-dom"
import {
  Heading,
  Text,
  Button,
  Container,
  Tabs,
  Skeleton,
  FocusModal,
  Drawer,
  Input,
  Label,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../../lib/client"
import type { Vendor } from "../../../types"
import { ArrowLeft, PencilSquare, Plus, Trash } from "@medusajs/icons"

interface VendorDetailResponse {
  vendor: Vendor
}

interface AddAdminFormProps {
  vendorId: string
  onSuccess: () => void
}

function AddAdminForm({ vendorId, onSuccess }: AddAdminFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
  })
  const [emailError, setEmailError] = useState<string | undefined>()

  const addAdmin = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/vendors/admins", {
        method: "POST",
        body: {
          vendor_id: vendorId,
          email: formData.email,
          first_name: formData.first_name || undefined,
          last_name: formData.last_name || undefined,
        },
      }),
    onSuccess: () => {
      toast.success("Vendor admin added")
      onSuccess()
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add vendor admin")
    },
  })

  const handleSubmit = () => {
    if (!formData.email) {
      setEmailError("Email is required")
      return
    }
    addAdmin.mutate()
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label>Email *</Label>
        <Input
          value={formData.email}
          placeholder="admin@example.com"
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value })
            setEmailError(undefined)
          }}
        />
        {emailError && (
          <Text size="small" className="text-ui-fg-error">
            {emailError}
          </Text>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-2">
          <Label>First name</Label>
          <Input
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Last name</Label>
          <Input
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </div>
      </div>
      <Button size="small" onClick={handleSubmit} isLoading={addAdmin.isPending}>
        Save
      </Button>
    </div>
  )
}

interface EditVendorDrawerProps {
  vendor: Vendor
  onSuccess: () => void
}

function EditVendorDrawer({ vendor, onSuccess }: EditVendorDrawerProps) {
  const [formData, setFormData] = useState({
    name: vendor.name,
    handle: vendor.handle || "",
    logo: vendor.logo || "",
  })
  const [nameError, setNameError] = useState<string | undefined>()

  const updateVendor = useMutation({
    mutationFn: () =>
      sdk.client.fetch(`/admin/vendors/${vendor.id}`, {
        method: "POST",
        body: {
          name: formData.name,
          handle: formData.handle || undefined,
          logo: formData.logo || null,
        },
      }),
    onSuccess: () => {
      toast.success("Vendor updated")
      onSuccess()
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update vendor")
    },
  })

  const handleSubmit = () => {
    if (!formData.name) {
      setNameError("Name is required")
      return
    }
    updateVendor.mutate()
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value })
            setNameError(undefined)
          }}
        />
        {nameError && (
          <Text size="small" className="text-ui-fg-error">
            {nameError}
          </Text>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>Handle</Label>
        <Input
          value={formData.handle}
          placeholder="acme"
          onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <Label>Logo URL</Label>
        <Input
          value={formData.logo}
          placeholder="https://..."
          onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
        />
      </div>
    </div>
  )
}

export default function VendorDetailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [addAdminOpen, setAddAdminOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const activeTab = searchParams.get("tab") || "overview"

  const invalidateVendor = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-vendor", id] })
  }

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
        <Skeleton className="h-8 w-64" />
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
        <Button
          size="small"
          variant="secondary"
          className="ml-auto"
          onClick={() => setEditOpen(true)}
        >
          <PencilSquare />
          Edit
        </Button>
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
            <div className="flex items-center justify-between px-6 py-4">
              <Heading level="h2">Vendor admins</Heading>
              <Button size="small" onClick={() => setAddAdminOpen(true)}>
                <Plus />
                Add admin
              </Button>
            </div>
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

      <FocusModal open={addAdminOpen} onOpenChange={setAddAdminOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header>
              <div className="flex items-center justify-end gap-x-2">
                <FocusModal.Close asChild>
                  <Button size="small" variant="secondary">
                    Cancel
                  </Button>
                </FocusModal.Close>
              </div>
            </FocusModal.Header>
            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="flex h-full flex-col gap-y-6 overflow-y-auto px-6 py-6">
                <Heading level="h2">Add vendor admin</Heading>
                <AddAdminForm
                  vendorId={vendor.id}
                  onSuccess={() => {
                    setAddAdminOpen(false)
                    invalidateVendor()
                  }}
                />
              </div>
            </FocusModal.Body>
          </div>
        </FocusModal.Content>
      </FocusModal>

      <Drawer open={editOpen} onOpenChange={setEditOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edit vendor</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex-1 overflow-auto p-4">
            <EditVendorDrawer
              vendor={vendor}
              onSuccess={() => {
                setEditOpen(false)
                invalidateVendor()
              }}
            />
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary">
                  Cancel
                </Button>
              </Drawer.Close>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </div>
  )
}
