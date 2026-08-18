"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  const baseClasses = "btn-primary w-full"
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-outline",
    transparent: "!bg-transparent !text-grey-70 hover:!bg-surface",
    danger: "!bg-rose-600 hover:!bg-rose-700 text-white",
  }

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${baseClasses} ${variantClasses[variant || "primary"]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
      data-testid={dataTestId}
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}
