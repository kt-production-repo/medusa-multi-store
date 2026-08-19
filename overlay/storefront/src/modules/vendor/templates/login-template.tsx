"use client"

import { useState } from "react"
import VendorLogin from "../components/vendor-login"
import VendorRegister from "../components/vendor-register"

export enum VENDOR_LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const VendorLoginTemplate = () => {
  const [currentView, setCurrentView] = useState<VENDOR_LOGIN_VIEW>(
    VENDOR_LOGIN_VIEW.SIGN_IN
  )

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-ui-bg-base px-8 py-8">
      <div className="max-w-sm w-full flex flex-col items-center">
        <h1 className="text-2xl-semi uppercase mb-2 text-ui-fg-base">
          Vendor Portal
        </h1>
        <p className="text-center text-base-regular text-ui-fg-muted mb-8">
          Manage your storefront products and orders.
        </p>
        {currentView === VENDOR_LOGIN_VIEW.SIGN_IN ? (
          <VendorLogin setCurrentView={setCurrentView} />
        ) : (
          <VendorRegister setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default VendorLoginTemplate