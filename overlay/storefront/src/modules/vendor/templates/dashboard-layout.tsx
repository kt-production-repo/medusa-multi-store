import Link from "next/link"
import { vendorLogout } from "@lib/data/vendor"
import { VendorProfile } from "@lib/data/vendor"

type DashboardLayoutProps = {
  vendor: VendorProfile
  children: React.ReactNode
}

const TABS = [
  { href: "/vendor/dashboard", label: "Overview", exact: true },
  { href: "/vendor/dashboard/products", label: "Products" },
  { href: "/vendor/dashboard/orders", label: "Orders" },
  { href: "/vendor/dashboard/settings", label: "Settings" },
]

const DashboardLayout = ({ vendor, children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-ui-bg-base">
      <header className="border-b border-ui-border-base bg-ui-bg-subtle">
        <div className="content-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl-semi text-ui-fg-base">{vendor.name}</span>
            <span className="text-small-regular text-ui-fg-muted">
              Vendor dashboard
            </span>
          </div>
          <form action={vendorLogout}>
            <button
              type="submit"
              className="text-small-regular text-ui-fg-base underline"
              data-testid="vendor-logout-button"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <nav className="border-b border-ui-border-base">
        <div className="content-container flex gap-8 py-3">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="text-small-regular text-ui-fg-base uppercase hover:underline"
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="content-container py-8">{children}</main>
    </div>
  )
}

export default DashboardLayout