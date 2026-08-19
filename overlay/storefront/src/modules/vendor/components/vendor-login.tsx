"use client"

import { vendorLogin } from "@lib/data/vendor"
import { VENDOR_LOGIN_VIEW } from "@modules/vendor/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: VENDOR_LOGIN_VIEW) => void
}

const VendorLogin = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(vendorLogin, null)

  return (
    <div className="w-full" data-testid="vendor-login-page">
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
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
            autoComplete="current-password"
            required
          />
        </div>
        <ErrorMessage error={message} data-testid="vendor-login-error-message" />
        <SubmitButton data-testid="vendor-sign-in-button" className="w-full mt-6">
          Sign in
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        New vendor?{" "}
        <button
          onClick={() => setCurrentView(VENDOR_LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="vendor-register-button"
        >
          Create your store
        </button>
        .
      </span>
    </div>
  )
}

export default VendorLogin