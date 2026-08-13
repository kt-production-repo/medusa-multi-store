import { Suspense } from "react"

import { searchProducts } from "@lib/data/search"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

const PRODUCT_LIMIT = 12

export default async function SearchResults({
  q,
  page = 1,
  countryCode,
}: {
  q: string
  page?: number
  countryCode: string
}) {
  const region = await getRegion(countryCode)
  if (!region) return null

  const {
    response: { products, count },
    nextPage,
  } = await searchProducts({ q, countryCode, page, limit: PRODUCT_LIMIT })

  if (products.length === 0) {
    return (
      <p
        className="text-small-regular text-ui-fg-subtle"
        data-testid="no-search-results"
      >
        No products found for "{q}".
      </p>
    )
  }

  const totalPages = Math.max(
    Math.ceil((count || products.length) / PRODUCT_LIMIT),
    1
  )

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="search-results-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <ProductPreview product={p} region={region} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="search-pagination"
          page={page ?? 1}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export function SearchResultsSkeleton() {
  return <SkeletonProductGrid />
}
