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
  Spinner,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { sdk } from "../../lib/client"
import type { Vendor } from "../../types"

const columnHelper = createDataTableColumnHelper<Vendor>()

interface VendorsResponse {
  vendors: Vendor[]
  count: number
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
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-4 p-6">
      <div className="flex items-center justify-between">
        <Heading level="h1">Vendors</Heading>
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
    </div>
  )
}
