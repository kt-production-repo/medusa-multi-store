import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="py-6 content-container">
      <ScrollReveal>
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-grey-50 mb-4">
            <LocalizedClientLink href="/" className="hover:text-brand-dark transition-colors">
              Home
            </LocalizedClientLink>
            <span>/</span>
            <LocalizedClientLink href="/store" className="hover:text-brand-dark transition-colors">
              Store
            </LocalizedClientLink>
            <span>/</span>
            <span className="text-grey-90 font-medium">{collection.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey-90 mb-4">
            {collection.title}
          </h1>

          {/* Description */}
          {typeof collection.metadata?.description === "string" && (
            <p className="text-lg text-grey-50 max-w-2xl">
              {collection.metadata.description}
            </p>
          )}
        </div>
      </ScrollReveal>

      {/* Products */}
      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <RefinementList sortBy={sort} />
        <div className="w-full">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={collection.products?.length}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
