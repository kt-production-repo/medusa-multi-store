"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SearchBar({
  initialQuery = "",
  className,
}: {
  initialQuery?: string
  className?: string
}) {
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) ?? ""

  const [query, setQuery] = useState(initialQuery)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const path = countryCode
      ? `/${countryCode}/search?q=${encodeURIComponent(trimmed)}&page=1`
      : `/search?q=${encodeURIComponent(trimmed)}&page=1`
    router.replace(path)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full max-w-xl mx-auto ${className}`}
      data-testid="search-bar"
    >
      <div className="relative w-full">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-50">
          <MagnifyingGlass className="w-5 h-5" />
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setQuery("")
          }}
          placeholder="Search for mattresses, bedding..."
          className="w-full h-14 pl-12 pr-6 bg-white border-2 border-grey-20 rounded-full text-base text-grey-90 placeholder:text-grey-50 focus:outline-none focus:border-brand-dark focus:ring-4 focus:ring-brand-dark/10 transition-all duration-300"
          aria-label="Search products"
        />
      </div>
    </form>
  )
}
