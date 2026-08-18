import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import ScrollReveal from "@modules/common/components/scroll-reveal"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-8 py-12">
            <div>{customer && <AccountNav customer={customer} />}</div>
            <div className="flex-1">{children}</div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-grey-10 py-12 gap-8">
            <div>
              <h3 className="text-xl font-bold text-grey-90 mb-2">
                Got questions?
              </h3>
              <span className="text-sm text-grey-50">
                You can find frequently asked questions and answers on our
                customer service page.
              </span>
            </div>
            <div>
              <UnderlineLink href="/customer-service">
                Customer Service
              </UnderlineLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default AccountLayout
