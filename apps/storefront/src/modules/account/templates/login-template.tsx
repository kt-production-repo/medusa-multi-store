"use client"

import { useState } from "react"

import { LoginForm } from "@modules/account/components/auth-card/login-form"
import { SignupForm } from "@modules/account/components/auth-card/signup-from"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(LOGIN_VIEW.SIGN_IN)

  return (
    <div className="w-full flex justify-center px-8 py-8">
      {currentView === LOGIN_VIEW.SIGN_IN ? (
        <LoginForm onRegister={() => setCurrentView(LOGIN_VIEW.REGISTER)} />
      ) : (
        <SignupForm onRegister={() => setCurrentView(LOGIN_VIEW.SIGN_IN)} />
      )}
    </div>
  )
}

export default LoginTemplate
