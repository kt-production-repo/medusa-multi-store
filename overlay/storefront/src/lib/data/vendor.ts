"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  removeAuthToken,
  setAuthToken,
} from "./cookies"

export type VendorProfile = {
  id: string
  name: string
  handle?: string
  logo?: string | null
  created_at?: string
  stats?: {
    product_count: number
    order_count: number
  }
}

export type VendorProduct = {
  id: string
  title?: string
  subtitle?: string | null
  description?: string | null
  handle?: string
  thumbnail?: string | null
  status?: string
  variants?: {
    id: string
    title?: string
    sku?: string | null
    prices?: {
      id?: string
      amount?: number
      currency_code?: string
    }[]
  }[]
}

export type VendorOrder = {
  id: string
  display_id?: number
  status?: string
  fulfillment_status?: string
  payment_status?: string
  total?: number
  currency_code?: string
  created_at?: string
  items?: {
    id: string
    title?: string
    quantity?: number
  }[]
  fulfillments?: {
    id: string
    status?: string
  }[]
}

type VendorFetchOptions = {
  method?: string
  query?: Record<string, unknown>
  body?: Record<string, any>
}

const vendorFetch = async <T>(path: string, options: VendorFetchOptions = {}): Promise<T> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client.fetch<T>(path, {
    method: options.method ?? "GET",
    query: options.query,
    body: options.body,
    headers,
  })
}

export async function vendorLogin(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("vendor", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
      })
  } catch (error: any) {
    return error.toString()
  }

  redirect("/vendor/dashboard")
}

export async function vendorRegister(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const handle = formData.get("handle") as string
  const first_name = formData.get("first_name") as string
  const last_name = formData.get("last_name") as string

  try {
    const token = await sdk.auth.register("vendor", "emailpass", {
      email,
      password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { vendor } = await sdk.client.fetch<{ vendor: VendorProfile }>("/vendors", {
      method: "POST",
      headers,
      body: {
        name,
        handle,
        admin: {
          email,
          first_name,
          last_name,
        },
      },
    })

    const loginToken = await sdk.auth.login("vendor", "emailpass", {
      email,
      password,
    })

    await setAuthToken(loginToken as string)

    return vendor
  } catch (error: any) {
    return error.toString()
  }

  redirect("/vendor/dashboard")
}

export async function vendorLogout() {
  await sdk.auth.logout()

  await removeAuthToken()

  redirect("/vendor/login")
}

export const retrieveVendor = async (): Promise<VendorProfile | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  try {
    const { vendor } = await vendorFetch<{ vendor: VendorProfile }>("/vendors/me")
    return vendor
  } catch {
    return null
  }
}

export async function updateVendor(_currentState: unknown, formData: FormData) {
  const body: Record<string, unknown> = {}

  const name = formData.get("name")
  if (name) body.name = name

  const handle = formData.get("handle")
  if (handle) body.handle = handle

  const logo = formData.get("logo")
  if (logo !== null) body.logo = logo

  try {
    const { vendor } = await vendorFetch<{ vendor: VendorProfile }>("/vendors/me", {
      method: "POST",
      body,
    })

    const vendorCacheTag = await getCacheTag("vendors")
    revalidateTag(vendorCacheTag)

    return { success: true, error: null, vendor }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function addVendorAdmin(_currentState: unknown, formData: FormData) {
  const body = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
  }

  try {
    const { vendor_admin } = await vendorFetch<{ vendor_admin: { id: string } }>("/vendors/admins", {
      method: "POST",
      body,
    })

    return { success: true, error: null, vendor_admin }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export const listVendorProducts = async (): Promise<VendorProduct[]> => {
  try {
    const { products } = await vendorFetch<{ products: VendorProduct[] }>("/vendors/products", {
      query: {
        fields: "*variants",
      },
    })
    return products
  } catch (error) {
    return []
  }
}

export async function createVendorProduct(_currentState: unknown, formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const thumbnail = formData.get("thumbnail") as string
  const handle = formData.get("handle") as string
  const variant_title = formData.get("variant_title") as string
  const price = formData.get("price") as string
  const currency_code = formData.get("currency_code") as string
  const stocked_quantity = formData.get("stocked_quantity") as string

  const body: Record<string, unknown> = {
    title,
    handle,
    description,
    thumbnail,
    variants: [
      {
        title: variant_title,
        prices: [
          {
            amount: Number(price),
            currency_code,
          },
        ],
        stocked_quantity: Number(stocked_quantity || 100),
      },
    ],
  }

  try {
    const { product } = await vendorFetch<{ product: VendorProduct }>("/vendors/products", {
      method: "POST",
      body,
    })

    const vendorCacheTag = await getCacheTag("vendors")
    revalidateTag(vendorCacheTag)
    const productsCacheTag = await getCacheTag("products")
    revalidateTag(productsCacheTag)

    return { success: true, error: null, product }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function updateVendorProduct(_currentState: unknown, formData: FormData) {
  const id = formData.get("product_id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const thumbnail = formData.get("thumbnail") as string
  const handle = formData.get("handle") as string
  const status = formData.get("status") as string
  const price = formData.get("price") as string
  const currency_code = formData.get("currency_code") as string

  const body: Record<string, unknown> = {
    title,
    description,
    thumbnail,
    handle,
    status,
  }

  if (price && currency_code) {
    body.variants = [
      {
        id: formData.get("variant_id") as string,
        prices: [
          {
            amount: Number(price),
            currency_code,
          },
        ],
      },
    ]
  }

  try {
    const { product } = await vendorFetch<{ product: VendorProduct }>(`/vendors/products/${id}`, {
      method: "POST",
      body,
    })

    const productsCacheTag = await getCacheTag("products")
    revalidateTag(productsCacheTag)

    return { success: true, error: null, product }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function deleteVendorProduct(productId: string) {
  try {
    await vendorFetch(`/vendors/products/${productId}`, {
      method: "DELETE",
    })

    const productsCacheTag = await getCacheTag("products")
    revalidateTag(productsCacheTag)

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export const listVendorOrders = async (): Promise<VendorOrder[]> => {
  try {
    const { orders } = await vendorFetch<{ orders: VendorOrder[] }>("/vendors/orders")
    return orders
  } catch (error) {
    return []
  }
}

export async function fulfillVendorOrder(_currentState: unknown, formData: FormData) {
  const orderId = formData.get("order_id") as string
  const itemIds = formData.getAll("item_id") as string[]

  const body = {
    items: itemIds.map((id) => ({ id, quantity: 1 })),
  }

  try {
    const { fulfillment } = await vendorFetch<{ fulfillment: { id: string } }>(
      `/vendors/orders/${orderId}/fulfill`,
      {
        method: "POST",
        body,
      }
    )

    const ordersCacheTag = await getCacheTag("orders")
    revalidateTag(ordersCacheTag)

    return { success: true, error: null, fulfillment }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}

export async function shipVendorOrder(_currentState: unknown, formData: FormData) {
  const orderId = formData.get("order_id") as string
  const fulfillmentId = formData.get("fulfillment_id") as string
  const itemIds = formData.getAll("item_id") as string[]
  const tracking_number = formData.get("tracking_number") as string
  const tracking_url = formData.get("tracking_url") as string

  const body: Record<string, unknown> = {
    fulfillment_id: fulfillmentId,
    items: itemIds.map((id) => ({ id, quantity: 1 })),
  }

  if (tracking_number) {
    body.labels = [
      {
        tracking_number,
        tracking_url: tracking_url || "https://example.com/tracking",
        label_url: tracking_url || "https://example.com/label",
      },
    ]
  }

  try {
    const { fulfillment } = await vendorFetch<{ fulfillment: { id: string } }>(
      `/vendors/orders/${orderId}/ship`,
      {
        method: "POST",
        body,
      }
    )

    const ordersCacheTag = await getCacheTag("orders")
    revalidateTag(ordersCacheTag)

    return { success: true, error: null, fulfillment }
  } catch (error: any) {
    return { success: false, error: error.toString() }
  }
}