"use client"

import { updateVendor, VendorProfile } from "@lib/data/vendor"
import { useActionState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"

const VendorSettingsForm = ({ vendor }: { vendor: VendorProfile }) => {
  const [message, formAction] = useActionState(updateVendor, null)

  const isError = message && typeof message === "object" && !message.success
  const isSuccess = message && typeof message === "object" && message.success

  return (
    <div className="flex flex-col gap-4 rounded border border-ui-border-base p-4">
      <h2 className="text-large-semi text-ui-fg-base">Store profile</h2>
      <form
        action={formAction}
        className="flex flex-col gap-y-2 w-full max-w-xl"
        data-testid="vendor-settings-form"
      >
        <Input
          label="Store name"
          name="name"
          type="text"
          defaultValue={vendor.name}
        />
        <Input
          label="Handle"
          name="handle"
          type="text"
          defaultValue={vendor.handle}
        />
        <Input
          label="Logo URL"
          name="logo"
          type="url"
          defaultValue={vendor.logo ?? ""}
        />
        <ErrorMessage
          error={isError ? (message as { error: string }).error : null}
          data-testid="vendor-settings-error"
        />
        {isSuccess && (
          <span className="text-small-regular text-ui-fg-success">
            Settings updated.
          </span>
        )}
        <SubmitButton
          data-testid="vendor-settings-submit"
          className="w-full mt-4"
        >
          Save
        </SubmitButton>
      </form>
    </div>
  )
}

export default VendorSettingsForm