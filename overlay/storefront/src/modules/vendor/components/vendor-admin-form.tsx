"use client"

import { addVendorAdmin } from "@lib/data/vendor"
import { useActionState } from "react"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import ErrorMessage from "@modules/checkout/components/error-message"

const VendorAdminForm = () => {
  const [message, formAction] = useActionState(addVendorAdmin, null)

  const isError = message && typeof message === "object" && !message.success
  const isSuccess = message && typeof message === "object" && message.success

  return (
    <div className="flex flex-col gap-4 rounded border border-ui-border-base p-4">
      <h2 className="text-large-semi text-ui-fg-base">Invite an admin</h2>
      <form
        action={formAction}
        className="flex flex-col gap-y-2 w-full max-w-xl"
        data-testid="vendor-admin-form"
      >
        <Input
          label="Email"
          name="email"
          type="email"
          title="Enter a valid email address."
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <Input label="First name" name="first_name" type="text" />
          <Input label="Last name" name="last_name" type="text" />
        </div>
        <ErrorMessage
          error={isError ? (message as { error: string }).error : null}
          data-testid="vendor-admin-error"
        />
        {isSuccess && (
          <span className="text-small-regular text-ui-fg-success">
            Admin invited.
          </span>
        )}
        <SubmitButton data-testid="vendor-admin-submit" className="w-full mt-4">
          Invite admin
        </SubmitButton>
      </form>
    </div>
  )
}

export default VendorAdminForm