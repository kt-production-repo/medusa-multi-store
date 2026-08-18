import { Suspense } from "react"
import { Metadata } from "next"

import SearchBar from "@modules/search/components/search-bar"
import SearchResults, {
  SearchResultsSkeleton,
} from "@modules/search/components/search-results"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export const metadata: Metadata = {
  title: "Search",
  description: "Search products in the store.",
}

type Params = {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function SearchPage(props: Params) {
  const { countryCode } = await props.params
  const { q, page } = await props.searchParams

  const query = q ?? ""
  const pageNumber = page ? parseInt(page) : 1

  return (
    <div className="py-6 content-container">
      <ScrollReveal>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey-90 mb-6"
            data-testid="search-page-title"
          >
            Search Products
          </h1>
          <p className="text-lg text-grey-50 mb-8">
            Find the perfect mattress, bedding, or accessory for your best sleep.
          </p>
          <SearchBar initialQuery={query} />
        </div>
      </ScrollReveal>

      {query ? (
        <Suspense
          key={`${query}-${pageNumber}`}
          fallback={<SearchResultsSkeleton />}
        >
          <SearchResults
            q={query}
            page={pageNumber}
            countryCode={countryCode}
          />
        </Suspense>
      ) : (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-lg text-grey-50">
            Enter a search term above to find products.
          </p>
        </div>
      )}
    </div>
  )
}
