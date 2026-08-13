import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Container,
  Heading,
  Text,
  DataTable,
  useDataTable,
  createDataTableColumnHelper,
  DataTablePaginationState,
  DataTableRowSelectionState,
  Skeleton,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Users } from "@medusajs/icons"
import { sdk } from "../../lib/client"
import type { VendorAdminListItem } from "../../types"

export const config = defineRouteConfig({
  label: "Vendor Admins",
  icon: Users,
})

const columnHelper = createDataTableColumnHelper<VendorAdminListItem>()

interface VendorAdminsResponse {
  vendor_admins: VendorAdminListItem[]
  count: number
}

const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    cell: ({ row }) => (
      <Link to={`/vendors/${row.original.vendor.id}`}>
        <Text
          size="small"
          leading="compact"
          weight="plus"
          className="text-ui-fg-base hover:underline"
        >
          {row.original.email}
        </Text>
      </Link>
    ),
  }),
  columnHelper.accessor("first_name", {
    header: "Name",
    cell: ({ row }) => {
      const { first_name, last_name } = row.original
      const name = [first_name, last_name].filter(Boolean).join(" ")
      return (
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {name || "-"}
        </Text>
      )
    },
  }),
  columnHelper.accessor("vendor.name", {
    header: "Vendor",
    cell: ({ row }) => (
      <Link to={`/vendors/${row.original.vendor.id}`}>
        <Text size="small" leading="compact" className="text-ui-fg-base hover:underline">
          {row.original.vendor.name}
        </Text>
      </Link>
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

export default function VendorAdminsPage() {
  const [searchValue, setSearchValue] = useState("")
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({})
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const limit = useMemo(() => pagination.pageSize, [pagination])
  const offset = useMemo(
    () => pagination.pageIndex * limit,
    [pagination.pageIndex, limit]
  )

  const { data, isLoading } = useQuery({
    queryFn: () =>
      sdk.client.fetch<VendorAdminsResponse>("/admin/vendors/admins", {
        query: {
          limit,
          offset,
          q: searchValue || undefined,
        },
      }),
    queryKey: ["admin-vendor-admins", limit, offset, searchValue],
    keepPreviousData: true,
  })

  const table = useDataTable({
    columns,
    data: data?.vendor_admins || [],
    getRowId: (admin) => admin.id,
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
        <Heading level="h1">Vendor Admins</Heading>
      </div>

      <DataTable instance={table}>
        <DataTable.Toolbar>
          <div className="flex items-center justify-between">
            <Text>
              {data?.count || 0} admin{(data?.count || 0) === 1 ? "" : "s"}
            </Text>
            <DataTable.Search placeholder="Search vendor admins..." />
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </div>
  )
}
