"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion } from "./regions"

export const searchProducts = async ({
  q,
  countryCode,
  page = 1,
  limit = 12,
}: {
  q: string
  countryCode: string
  page?: number
  limit?: number
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
}> => {
  if (!q) {
    return { response: { products: [], count: 0 }, nextPage: null }
  }

  const region = await getRegion(countryCode)
  if (!region) {
    return { response: { products: [], count: 0 }, nextPage: null }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const offset = (page - 1) * limit

  const searchResponse = await sdk.client
    .fetch<{
      hits: { id: string; title?: string; handle?: string }[]
      estimatedTotalHits: number
    }>(`/store/products/search`, {
      method: "POST",
      body: { q, limit, offset },
      headers,
      cache: "no-store",
    })
    .catch(() => ({ hits: [], estimatedTotalHits: 0 }))

  const productIds = Array.from(
    new Set(searchResponse.hits.map((hit) => hit.id))
  )

  if (productIds.length === 0) {
    return {
      response: {
        products: [],
        count: searchResponse.estimatedTotalHits ?? 0,
      },
      nextPage: null,
    }
  }

  const products = await sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>(`/store/products`, {
      method: "GET",
      query: {
        id: productIds,
        region_id: region.id,
        limit,
        offset: 0,
        fields:
          "*variants.calculated_price,*variants.inventory_quantity,*variants.images,+metadata,+tags,",
      },
      headers,
      next: {
        ...(await getCacheOptions("products")),
      },
      cache: "force-cache",
    })
    .then(({ products }) => products)
    .catch(() => [])

  const count = searchResponse.estimatedTotalHits ?? 0
  const nextPage = count > offset + products.length ? page + 1 : null

  return {
    response: { products, count },
    nextPage,
  }
}
