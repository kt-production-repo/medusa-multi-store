import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="py-6 content-container"
      data-testid="category-container"
    >
      <ScrollReveal>
        <div className="mb-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-grey-50 mb-4">
            <LocalizedClientLink href="/" className="hover:text-brand-dark transition-colors">
              Home
            </LocalizedClientLink>
            {parents &&
              parents.reverse().map((parent) => (
                <span key={parent.id} className="flex items-center gap-2">
                  <span>/</span>
                  <LocalizedClientLink
                    className="hover:text-brand-dark transition-colors"
                    href={`/categories/${parent.handle}`}
                  >
                    {parent.name}
                  </LocalizedClientLink>
                </span>
              ))}
            <span>/</span>
            <span className="text-grey-90 font-medium">{category.name}</span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey-90 mb-4"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="text-lg text-grey-50 max-w-2xl">
              {category.description}
            </p>
          )}
        </div>
      </ScrollReveal>

      {/* Subcategories */}
      {category.category_children && category.category_children.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {category.category_children?.map((c) => (
              <LocalizedClientLink
                key={c.id}
                href={`/categories/${c.handle}`}
                className="px-4 py-2 rounded-full border border-grey-20 text-sm font-medium text-grey-70 hover:border-brand-dark hover:text-brand-dark transition-colors"
              >
                {c.name}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <RefinementList sortBy={sort} data-testid="sort-by-container" />
        <div className="w-full">
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
