"use client"

import { MagnifyingGlass, XMark } from "@medusajs/icons"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? ""

  const searchProducts = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim() || searchQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/store/products/search?q=${encodeURIComponent(searchQuery)}&limit=5`
        )
        if (response.ok) {
          const data = await response.json()
          setResults(data.products || [])
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchProducts(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, searchProducts])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const path = countryCode
      ? `/${countryCode}/search?q=${encodeURIComponent(trimmed)}`
      : `/search?q=${encodeURIComponent(trimmed)}`
    router.push(path)
    setIsOpen(false)
    setQuery("")
  }

  const handleResultClick = () => {
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon-circle"
        aria-label="Search products"
      >
        <MagnifyingGlass className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-[90vw] max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center border-b border-grey-10">
                <MagnifyingGlass
                  className="w-5 h-5 ml-5 text-grey-50"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for mattresses, bedding..."
                  className="flex-1 h-14 px-4 text-base text-grey-90 placeholder:text-grey-50 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mr-4 p-1 rounded-full hover:bg-surface transition-colors"
                >
                  <XMark className="w-5 h-5 text-grey-50" />
                </button>
              </div>
            </form>

            {/* Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading && (
                <div className="p-8 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-brand-dark border-t-transparent rounded-full mx-auto" />
                </div>
              )}

              {!isLoading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-grey-50">
                    No results found for &quot;{query}&quot;
                  </p>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  {results.map((product) => (
                    <LocalizedClientLink
                      key={product.id}
                      href={`/products/${product.handle}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface transition-colors"
                    >
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-surface flex-shrink-0">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-grey-50">
                            <MagnifyingGlass className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-grey-90 truncate">
                          {product.title}
                        </p>
                      </div>
                    </LocalizedClientLink>
                  ))}

                  <div className="p-3 border-t border-grey-10">
                    <LocalizedClientLink
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={handleResultClick}
                      className="block text-center text-sm font-medium text-brand-dark hover:underline"
                    >
                      View all results for &quot;{query}&quot;
                    </LocalizedClientLink>
                  </div>
                </div>
              )}

              {!isLoading && query.length < 2 && (
                <div className="p-8 text-center">
                  <p className="text-sm text-grey-50">
                    Start typing to search...
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
