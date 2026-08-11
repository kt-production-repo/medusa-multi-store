export interface VendorAdmin {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  created_at: string
  updated_at: string
}

export interface VendorProduct {
  id: string
  title: string
  thumbnail?: string | null
  status?: string
}

export interface VendorOrder {
  id: string
  display_id?: string
  status: string
  total?: number
  currency_code?: string
  created_at: string
}

export interface Vendor {
  id: string
  name: string
  handle: string
  logo?: string | null
  admins: VendorAdmin[]
  products: VendorProduct[]
  orders: VendorOrder[]
  created_at: string
  updated_at: string
}

export interface VendorAdminListItem {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  created_at: string
  vendor: {
    id: string
    name: string
    handle: string
  }
}
