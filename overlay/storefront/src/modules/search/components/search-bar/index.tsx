"use client"

import { MagnifyingGlass } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
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
      className={clx(
        "relative flex items-center w-full max-w-lg mx-auto",
        className
      )}
      data-testid="search-bar"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQuery("")
        }}
        placeholder="Search products..."
        className="w-full h-10 pl-10 pr-4 bg-ui-bg-field border rounded-md focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base text-small-regular text-ui-fg-base placeholder:text-ui-fg-subtle"
        aria-label="Search products"
      />
      <button
        type="submit"
        className="absolute left-3 text-ui-fg-subtle hover:text-ui-fg-base focus:outline-none"
        aria-label="Submit search"
      >
        <MagnifyingGlass size={18} />
      </button>
    </form>
  )
}
