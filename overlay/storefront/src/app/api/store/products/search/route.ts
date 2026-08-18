import { NextRequest, NextResponse } from "next/server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get("q")
  const limit = searchParams.get("limit") || "5"

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  try {
    const headers = {
      ...(await getAuthHeaders()),
    }

    const searchResponse = await sdk.client
      .fetch<{
        hits: { id: string; title?: string; handle?: string }[]
        estimatedTotalHits: number
      }>(`/store/products/search`, {
        method: "POST",
        body: { q, limit: parseInt(limit), offset: 0 },
        headers,
        cache: "no-store",
      })
      .catch(() => ({ hits: [], estimatedTotalHits: 0 }))

    const productIds = Array.from(
      new Set(searchResponse.hits.map((hit) => hit.id))
    )

    if (productIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const products = await sdk.client
      .fetch<{ products: any[] }>(`/store/products`, {
        method: "GET",
        query: {
          id: productIds,
          limit: parseInt(limit),
          offset: 0,
          fields: "*variants.calculated_price,*variants.images",
        },
        headers,
        cache: "force-cache",
      })
      .then(({ products }) => products)
      .catch(() => [])

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ products: [] })
  }
}
