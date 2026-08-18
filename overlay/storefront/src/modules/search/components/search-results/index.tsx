import { Suspense } from "react"

import { searchProducts } from "@lib/data/search"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

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
      <ScrollReveal>
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
            <svg
              className="w-8 h-8 text-grey-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-grey-90 mb-2">
            No products found for &quot;{q}&quot;
          </h3>
          <p className="text-grey-50 mb-6">
            Try searching for something else, or browse our collections.
          </p>
          <LocalizedClientLink
            href="/store"
            className="btn-primary inline-flex"
          >
            Browse All Products
          </LocalizedClientLink>
        </div>
      </ScrollReveal>
    )
  }

  const totalPages = Math.max(
    Math.ceil((count || products.length) / PRODUCT_LIMIT),
    1
  )

  return (
    <div>
      <ScrollReveal>
        <div className="mb-8">
          <p className="text-sm text-grey-50">
            {count || products.length} results for &quot;{q}&quot;
          </p>
        </div>
      </ScrollReveal>

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
        <div className="mt-12">
          <Pagination
            data-testid="search-pagination"
            page={page ?? 1}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  )
}

export function SearchResultsSkeleton() {
  return <SkeletonProductGrid />
}
