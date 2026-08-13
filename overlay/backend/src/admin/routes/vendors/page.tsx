import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Heading,
  Text,
  Button,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  DataTableRowSelectionState,
  Skeleton,
  FocusModal,
  Input,
  Label,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront, Plus } from "@medusajs/icons"
import { sdk } from "../../lib/client"
import type { Vendor } from "../../types"

export const config = defineRouteConfig({
  label: "Vendors",
  icon: BuildingStorefront,
})

const columnHelper = createDataTableColumnHelper<Vendor>()

interface VendorsResponse {
  vendors: Vendor[]
  count: number
}

interface CreateVendorFormProps {
  onSuccess: () => void
}

function CreateVendorForm({ onSuccess }: CreateVendorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    adminEmail: "",
    adminFirstName: "",
    adminLastName: "",
  })
  const [errors, setErrors] = useState<{ name?: string; adminEmail?: string }>({})

  const createVendor = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/vendors", {
        method: "POST",
        body: {
          name: formData.name,
          handle: formData.handle || undefined,
          admin: {
            email: formData.adminEmail,
            first_name: formData.adminFirstName || undefined,
            last_name: formData.adminLastName || undefined,
          },
        },
      }),
    onSuccess: () => {
      toast.success("Vendor created")
      onSuccess()
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create vendor")
    },
  })

  const handleSubmit = () => {
    const newErrors: { name?: string; adminEmail?: string } = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.adminEmail) newErrors.adminEmail = "Admin email is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    createVendor.mutate()
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
        <Label>Name *</Label>
        <Input
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value })
            setErrors({ ...errors, name: undefined })
          }}
        />
        {errors.name && (
          <Text size="small" className="text-ui-fg-error">
            {errors.name}
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
        <Label>Admin email *</Label>
        <Input
          value={formData.adminEmail}
          placeholder="vendor@example.com"
          onChange={(e) => {
            setFormData({ ...formData, adminEmail: e.target.value })
            setErrors({ ...errors, adminEmail: undefined })
          }}
        />
        {errors.adminEmail && (
          <Text size="small" className="text-ui-fg-error">
            {errors.adminEmail}
          </Text>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-2">
          <Label>First name</Label>
          <Input
            value={formData.adminFirstName}
            onChange={(e) =>
              setFormData({ ...formData, adminFirstName: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>Last name</Label>
          <Input
            value={formData.adminLastName}
            onChange={(e) =>
              setFormData({ ...formData, adminLastName: e.target.value })
            }
          />
        </div>
      </div>
      <Button
        size="small"
        onClick={handleSubmit}
        isLoading={createVendor.isPending}
      >
        Save
      </Button>
    </div>
  )
}

const columns = [
  columnHelper.select(),
  columnHelper.accessor("name", {
    header: "Name",
    cell: ({ row }) => (
      <Link to={`/vendors/${row.original.id}`}>
        <Text
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-base hover:underline"
        >
          {row.original.name}
        </Text>
      </Link>
    ),
  }),
  columnHelper.accessor("handle", {
    header: "Handle",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {getValue() || "-"}
      </Text>
    ),
  }),
  columnHelper.accessor("admins", {
    header: "Admins",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue().length}
      </Text>
    ),
  }),
  columnHelper.accessor("products", {
    header: "Products",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue().length}
      </Text>
    ),
  }),
  columnHelper.accessor("orders", {
    header: "Orders",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue().length}
      </Text>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "Created",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {new Date(getValue()).toLocaleDateString()}
      </Text>
    ),
  }),
]

export default function VendorsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })
  const [createOpen, setCreateOpen] = useState(false)
  const queryClient = useQueryClient()

  const limit = useMemo(() => pagination.pageSize, [pagination])
  const offset = useMemo(
    () => pagination.pageIndex * limit,
    [pagination.pageIndex, limit]
  )

  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<VendorsResponse>("/admin/vendors", {
        query: {
          limit,
          offset,
          q: searchValue || undefined,
        },
      }),
    queryKey: ["admin-vendors", limit, offset, searchValue],
    keepPreviousData: true,
  })

  const table = useDataTable({
    columns,
    data: data?.vendors || [],
    getRowId: (vendor) => vendor.id,
    rowCount: data?.count || 0,
    isLoading,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    search: {
      state: searchValue,
      onSearchChange: setSearchValue,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Skeleton className="h-8 w-64" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4 p-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Vendors</Heading>
        <Button size="small" onClick={() => setCreateOpen(true)}>
          <Plus />
          Create vendor
        </Button>
      </div>

      <DataTable instance={table}>
        <DataTable.Toolbar>
          <div className="flex items-center justify-between">
            <Text>
              {data?.count || 0} vendor{(data?.count || 0) === 1 ? "" : "s"}
            </Text>
            <DataTable.Search placeholder="Search vendors..." />
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>

      <FocusModal open={createOpen} onOpenChange={setCreateOpen}>
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
                <Heading level="h2">Create vendor</Heading>
                <CreateVendorForm
                  onSuccess={() => {
                    setCreateOpen(false)
                    queryClient.invalidateQueries({ queryKey: ["admin-vendors"] })
                  }}
                />
              </div>
            </FocusModal.Body>
          </div>
        </FocusModal.Content>
      </FocusModal>
    </div>
  )
}
