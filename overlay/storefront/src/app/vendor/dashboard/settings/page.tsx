import { retrieveVendor } from "@lib/data/vendor"
import VendorSettingsForm from "@modules/vendor/components/vendor-settings-form"
import VendorAdminForm from "@modules/vendor/components/vendor-admin-form"

export default async function VendorSettingsPage() {
  const vendor = await retrieveVendor()

  if (!vendor) {
    return null
  }

  return (
    <div className="flex flex-col gap-8" data-testid="vendor-settings-page">
      <h1 className="text-2xl-semi text-ui-fg-base">Settings</h1>
      <VendorSettingsForm vendor={vendor} />
      <VendorAdminForm />
    </div>
  )
}