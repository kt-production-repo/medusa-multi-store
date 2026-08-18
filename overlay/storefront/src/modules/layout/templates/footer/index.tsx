import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-brand-dark text-white pt-12 lg:pt-24 pb-24">
      <div className="content-container flex flex-col lg:flex-row gap-12 lg:gap-0 justify-between">
        {/* Left column: Logo + Newsletter */}
        <div className="lg:w-2/5 flex flex-col">
          <LocalizedClientLink
            href="/"
            className="text-2xl font-bold tracking-tight text-white mb-10"
          >
            Medusa Store
          </LocalizedClientLink>

          {/* Newsletter form */}
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white/70">
              Subscribe to our newsletter for updates and exclusive offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 max-w-[350px] h-[52px] px-6 rounded-full bg-white/10 border-none text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <button
                type="submit"
                className="btn-primary btn-sm h-[52px] px-6"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Right column: Link columns */}
        <div className="lg:w-3/5 flex flex-col md:flex-row gap-12 md:justify-between">
          {/* Categories */}
          {productCategories && productCategories?.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider">
                Categories
              </h4>
              <ul className="flex flex-col gap-2" data-testid="footer-categories">
                {productCategories?.slice(0, 6).map((c) => {
                  if (c.parent_category) {
                    return null
                  }

                  const children =
                    c.category_children?.map((child) => ({
                      name: child.name,
                      handle: child.handle,
                      id: child.id,
                    })) || null

                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-sm text-white/80 hover:text-white transition-colors duration-300 nav-link !inline"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                      {children && (
                        <ul className="flex flex-col ml-0 mt-1 gap-1">
                          {children.map((child) => (
                            <li key={child.id}>
                              <LocalizedClientLink
                                className="text-sm text-white/60 hover:text-white transition-colors duration-300 nav-link !inline"
                                href={`/categories/${child.handle}`}
                                data-testid="category-link"
                              >
                                {child.name}
                              </LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Collections */}
          {collections && collections.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider">
                Collections
              </h4>
              <ul className="flex flex-col gap-2">
                {collections?.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-sm text-white/80 hover:text-white transition-colors duration-300 nav-link !inline"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider">
              Support
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300 nav-link !inline"
                  href="/account"
                >
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300 nav-link !inline"
                  href="/store"
                >
                  Store
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="https://docs.medusajs.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-white/80 hover:text-white transition-colors duration-300 nav-link !inline"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment methods row */}
      <div className="content-container mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-white/50">
              Payment Methods
            </span>
            <div className="flex flex-wrap gap-3">
              {["Visa", "Mastercard", "Amex", "Apple Pay", "Google Pay"].map(
                (method) => (
                  <span
                    key={method}
                    className="px-3 py-1.5 text-xs font-medium text-white/70 bg-white/5 rounded-full border border-white/10"
                  >
                    {method}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 md:text-right">
            <span className="text-sm text-white/50">
              © {new Date().getFullYear()} Medusa Store. All rights reserved.
            </span>
            <MedusaCTA />
          </div>
        </div>
      </div>

      {/* Brand tagline */}
      <div className="content-container mt-16">
        <h2 className="text-4xl lg:text-5xl font-bold text-white/10">
          Hey it was nice to matt you
        </h2>
      </div>
    </footer>
  )
}
