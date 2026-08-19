"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeCartId,
} from "./cookies"

type CompleteVendorResponse = {
  type: "order" | "cart"
  order?: any
  cart?: any
}

/**
 * Places an order for a cart through the marketplace split-checkout route.
 * Multi-vendor carts produce one parent order plus one child order per
 * vendor; single-vendor carts are linked to the vendor directly. If the
 * vendor completion route does not return an order for any reason, falls
 * back to the stock `/complete` route.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was not completed, otherwise redirects.
 */
export async function placeVendorOrder(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    throw new Error("No existing cart found when placing an order")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  let cartRes: CompleteVendorResponse | undefined

  try {
    cartRes = await sdk.client.fetch<CompleteVendorResponse>(
      `/store/carts/${id}/complete-vendor`,
      {
        method: "POST",
        headers,
      }
    )
  } catch (e) {
    cartRes = undefined
  }

  if (cartRes?.type !== "order") {
    // No vendor-linked items in the cart (or the split route failed):
    // fall back to the stock completion so checkout never breaks.
    const fallbackRes = await sdk.store.cart
      .complete(id, {}, headers)
      .then(async (res) => {
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
        return res
      })
      .catch(medusaError)

    cartRes = fallbackRes
  }

  if (cartRes?.type === "order") {
    const countryCode =
      cartRes.order.shipping_address?.country_code?.toLowerCase()

    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    redirect(`/${countryCode}/order/${cartRes.order.id}/confirmed`)
  }

  return cartRes.cart
}