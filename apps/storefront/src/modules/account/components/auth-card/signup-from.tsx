"use client"

import { Eye, EyeSlash } from "@medusajs/icons"
import { useRouter } from "next/navigation"
import * as React from "react"

import { loginWithCredentials, signup } from "@lib/data/auth"
import { Button } from "@modules/common/components/ui/button"

export interface SignupFormProps {
  title?: string
  emailPlaceholder?: string
  passwordPlaceholder?: string
  forgotLabel?: string
  submitLabel?: string
  registerPrompt?: string
  registerLabel?: string
  className?: string
  onForgot?: () => void
  onRegister?: () => void
}

export function SignupForm({
  title = "Create Account",
  emailPlaceholder = "E-mail",
  passwordPlaceholder = "Password",
  forgotLabel = "Forgot your password??",
  submitLabel = "Sign Up",
  registerPrompt = "Don't have an account?",
  registerLabel = "Create Account",
  className,
  onForgot,
  onRegister,
}: SignupFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
    const [first_name, setFirstName] = React.useState("")
    const [last_name, setLastName] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  // Runs the signup mutation against our backend route POST /store/auth/signup.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await signup({ email, password, first_name, last_name })
      // The server action returns a string only when something failed.
      if (typeof result === "string") {
        setError(result)
        return
      }
      router.push("/account")
    })
  }

  const inputClass =
    "w-full rounded-md bg-neutral-800/70 border border-neutral-700 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"

  return (
    <div
      className={
        "w-full max-w-lg rounded-2xl border border-blue-900/60 bg-neutral-950 px-8 py-10 text-center " +
        (className ?? "")
      }
    >
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="first_name"
          className={inputClass}
          placeholder="First Name"
          value={first_name}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="last_name"
          className={inputClass}
          placeholder="Last Name"
          value={last_name}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          className={inputClass}
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={inputClass + " pr-12"}
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </button>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <Button
            type="submit"
            variant="legoBlue"
            shape="lego"
            size="lg"
            disabled={isPending}
          >
            {isPending ? "Signing in…" : submitLabel}
          </Button>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={onForgot}
            className="text-sm font-semibold text-amber-300 hover:text-amber-200"
          >
            {forgotLabel}
          </button>
        </div>
      </form>

      <hr className="my-7 border-neutral-700" />

      <p className="mb-4 font-bold text-white">{registerPrompt}</p>
      <Button
        type="button"
        variant="legoGold"
        shape="lego"
        size="lg"
        onClick={onRegister}
      >
        {registerLabel}
      </Button>
    </div>
  )
}

export default SignupForm