import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default async function ProductHighlights() {
  const region = await getRegion("us")
  if (!region) return null

  const { collections } = await listCollections({ fields: "id, handle, title" })
  if (!collections?.length) return null

  const highlights = collections.slice(0, 2).map((col, i) => ({
    collection: col,
    variant: i === 0 ? "dark" : ("light" as const),
  }))

  return (
    <section className="py-14 lg:py-32 bg-white">
      <div className="content-container">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey-90 mb-12 text-center">
            Perfect sleep, two ways
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map(({ collection, variant }, index) => (
            <ScrollReveal key={collection.id} delay={index * 100}>
              <LocalizedClientLink
                href={`/collections/${collection.handle}`}
                className={`block rounded-[40px] p-8 md:p-12 lg:p-16 min-h-[500px] lg:min-h-[700px] relative overflow-hidden group transition-all duration-300 ${
                  variant === "dark"
                    ? "bg-brand-dark text-white"
                    : "bg-brand-lighter text-brand-dark"
                }`}
              >
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {collection.title}
                </h3>
                <p className={`text-lg mb-8 max-w-md ${
                  variant === "dark" ? "text-white/70" : "text-brand-dark/70"
                }`}>
                  Discover our premium collection designed for ultimate comfort.
                </p>
                <span className={`inline-flex items-center gap-2 font-bold transition-all duration-300 group-hover:gap-4 ${
                  variant === "dark" ? "text-white" : "text-brand-dark"
                }`}>
                  Explore
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
                {/* Decorative circle */}
                <div className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full opacity-20 ${
                  variant === "dark" ? "bg-white" : "bg-brand"
                }`} />
              </LocalizedClientLink>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
