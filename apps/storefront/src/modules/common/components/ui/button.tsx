import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@lib/util/cn"

import styles from "./button.module.css"

// shadcn-style button built on class-variance-authority. Adds a `lego` shape
// (castle/LEGO top, see button.module.css) and blue/gold color themes to match
// the login design.
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-neutral-900 text-white hover:bg-neutral-800",
        legoBlue: "bg-blue-600 text-white hover:bg-blue-700",
        legoGold: "bg-amber-400 text-amber-950 hover:bg-amber-300",
      },
      shape: {
        normal: "rounded-md",
        lego: styles.lego,
      },
      size: {
        default: "h-11 px-7 pt-4 pb-2.5",
        sm: "h-9 px-4 pt-3 pb-2 text-xs",
        lg: "h-12 px-9 pt-5 pb-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "normal",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, shape, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, shape, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"

export default Button
