import { Suspense } from "react"
import { Metadata } from "next"

import SearchBar from "@modules/search/components/search-bar"
import SearchResults, {
  SearchResultsSkeleton,
} from "@modules/search/components/search-results"

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
    <div className="content-container py-6">
      <div className="mb-8 text-2xl-semi" data-testid="search-page-title">
        <h1>Search products</h1>
        <div className="mt-4">
          <SearchBar initialQuery={query} />
        </div>
      </div>

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
        <p className="text-small-regular text-ui-fg-subtle">
          Enter a search term above to find products.
        </p>
      )}
    </div>
  )
}
