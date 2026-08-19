"use client"

import { vendorRegister } from "@lib/data/vendor"
import { VENDOR_LOGIN_VIEW } from "@modules/vendor/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: VENDOR_LOGIN_VIEW) => void
}

const VendorRegister = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(vendorRegister, null)

  return (
    <div className="w-full" data-testid="vendor-register-page">
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Store name"
            name="name"
            type="text"
            title="Enter your store name."
            required
          />
          <Input
            label="Handle"
            name="handle"
            type="text"
            title="URL-friendly store handle."
          />
          <Input
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>
        <ErrorMessage
          error={message}
          data-testid="vendor-register-error-message"
        />
        <SubmitButton
          data-testid="vendor-register-button"
          className="w-full mt-6"
        >
          Create store
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Already registered?{" "}
        <button
          onClick={() => setCurrentView(VENDOR_LOGIN_VIEW.SIGN_IN)}
          className="underline"
          data-testid="vendor-sign-in-button"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default VendorRegister