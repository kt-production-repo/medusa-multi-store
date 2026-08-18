import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ScrollReveal from "@modules/common/components/scroll-reveal"

export default async function CategoryGrid() {
  const categories = await listCategories()
  if (!categories?.length) return null

  const mainCategories = categories
    .filter((c) => !c.parent_category)
    .slice(0, 4)

  if (mainCategories.length < 2) return null

  return (
    <section className="py-14 lg:py-32 bg-white">
      <div className="content-container">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-grey-90 mb-12">
            Make your bedroom complete
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-7 h-[50rem] md:h-[60rem] lg:h-[40rem]">
          {/* Large item - spans 2 cols and 2 rows on desktop */}
          <ScrollReveal className="col-span-2 row-span-2 lg:col-span-2 lg:row-span-2">
            <LocalizedClientLink
              href={`/categories/${mainCategories[0].handle}`}
              className="block h-full rounded-3xl lg:rounded-[40px] overflow-hidden bg-brand-lighter group"
            >
              <div className="h-full flex flex-col justify-end p-6 lg:p-12 relative">
                <h3 className="text-2xl lg:text-3xl font-bold text-brand-dark mb-2">
                  {mainCategories[0].name}
                </h3>
                <span className="text-brand-dark/70 font-medium nav-link !inline">
                  Shop Collection
                </span>
                {/* Decorative gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent" />
              </div>
            </LocalizedClientLink>
          </ScrollReveal>

          {/* Other items */}
          {mainCategories.slice(1, 4).map((category, index) => (
            <ScrollReveal key={category.id} delay={(index + 1) * 100}>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="block h-full rounded-3xl lg:rounded-[40px] overflow-hidden bg-surface group"
              >
                <div className="h-full flex flex-col justify-end p-6 lg:p-8 relative">
                  <h3 className="text-lg lg:text-xl font-bold text-grey-90 mb-2">
                    {category.name}
                  </h3>
                  <span className="text-grey-50 text-sm font-medium nav-link !inline">
                    Shop Now
                  </span>
                </div>
              </LocalizedClientLink>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
