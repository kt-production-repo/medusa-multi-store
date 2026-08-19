import { Metadata } from "next"

import { retrieveVendor } from "@lib/data/vendor"
import { redirect } from "next/navigation"
import VendorDashboardLayout from "@modules/vendor/templates/dashboard-layout"

export const metadata: Metadata = {
  title: "Vendor dashboard",
  description: "Manage your products and orders.",
}

export default async function VendorDashboardPageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const vendor = await retrieveVendor().catch(() => null)

  if (!vendor) {
    redirect("/vendor/login")
  }

  return <VendorDashboardLayout vendor={vendor}>{children}</VendorDashboardLayout>
}