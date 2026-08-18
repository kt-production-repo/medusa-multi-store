"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  isScrolled: boolean
}

const SideMenu = ({
  regions,
  locales,
  currentLocale,
  isScrolled,
}: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              {/* Hamburger button */}
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className={clx(
                    "icon-circle cursor-pointer transition-all duration-300",
                    isScrolled
                      ? ""
                      : "!border-white/40 !text-white"
                  )}
                >
                  <div className="relative w-3.5 h-2.5 flex flex-col justify-between">
                    <span
                      className={clx(
                        "w-full h-[1px] transition-all duration-300",
                        isScrolled ? "bg-grey-90" : "bg-white",
                        open && "rotate-45 translate-y-[5px]"
                      )}
                    />
                    <span
                      className={clx(
                        "w-full h-[1px] transition-all duration-300",
                        isScrolled ? "bg-grey-90" : "bg-white",
                        open && "opacity-0"
                      )}
                    />
                    <span
                      className={clx(
                        "w-full h-[1px] transition-all duration-300",
                        isScrolled ? "bg-grey-90" : "bg-white",
                        open && "-rotate-45 -translate-y-[5px]"
                      )}
                    />
                  </div>
                </Popover.Button>
              </div>

              {/* Backdrop */}
              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/40 pointer-events-auto transition-opacity duration-300"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              {/* Slide-in panel from right */}
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <PopoverPanel
                  className={clx(
                    "fixed top-0 right-0 z-[51]",
                    "w-full sm:w-[380px] h-screen",
                    "bg-white shadow-2xl",
                    "flex flex-col",
                    "overflow-y-auto"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                    <span className="text-lg font-bold text-grey-90">Menu</span>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="icon-circle cursor-pointer"
                    >
                      <XMark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Navigation links */}
                  <div className="flex-1 px-6 py-6">
                    <ul className="flex flex-col">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name} className="border-b border-border">
                          <LocalizedClientLink
                            href={href}
                            className="flex items-center justify-between py-4 text-lg font-bold text-grey-90 hover:text-brand transition-colors duration-300"
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                          >
                            {name}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer with selectors */}
                  <div className="px-6 pb-8 pt-4 border-t border-border">
                    <div className="flex flex-col gap-4">
                      {!!locales?.length && (
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-300 text-grey-50",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-300 text-grey-50",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
