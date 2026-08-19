import { Metadata } from "next"

import { retrieveVendor } from "@lib/data/vendor"
import { redirect } from "next/navigation"
import VendorLoginTemplate from "@modules/vendor/templates/login-template"

export const metadata: Metadata = {
  title: "Vendor sign in",
  description: "Sign in to your vendor dashboard.",
}

export default async function VendorLoginPage() {
  const vendor = await retrieveVendor().catch(() => null)

  if (vendor) {
    redirect("/vendor/dashboard")
  }

  return <VendorLoginTemplate />
}