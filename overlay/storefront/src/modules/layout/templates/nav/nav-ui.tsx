"use client"

import { useEffect, useState } from "react"
import { ShoppingBag, MagnifyingGlass } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { StoreRegion } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type NavUIProps = {
  regions: StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export default function NavUI({ regions, locales, currentLocale }: NavUIProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header
        className={`relative h-20 mx-auto duration-300 transition-all ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="content-container flex items-center justify-between w-full h-full">
          {/* Left: Mobile hamburger + Desktop search */}
          <div className="flex-1 basis-0 h-full flex items-center gap-4">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={currentLocale}
              isScrolled={isScrolled}
            />
          </div>

          {/* Center: Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                isScrolled ? "text-grey-90" : "text-white"
              }`}
              data-testid="nav-store-link"
            >
              Medusa Store
            </LocalizedClientLink>
          </div>

          {/* Right: Search, Account, Cart */}
          <div className="flex items-center gap-3 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-3 h-full">
              <LocalizedClientLink
                className={`icon-circle ${isScrolled ? "" : "!border-white/40 !text-white"}`}
                href="/search"
                data-testid="nav-search-link"
              >
                <MagnifyingGlass className="w-4 h-4" />
              </LocalizedClientLink>
              <LocalizedClientLink
                className={`nav-link text-sm font-medium ${
                  isScrolled ? "text-grey-70" : "text-white"
                }`}
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <div className={`${isScrolled ? "" : "[&>*]:!border-white/40 [&>*]:!text-white"}`}>
              <CartButton isScrolled={isScrolled} />
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
